import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Razorpay from "razorpay";
import prisma from "@/lib/prisma";
import { z } from "zod";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "test",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "test",
});

const orderSchema = z.object({
  addressId: z.string().optional(),
  address: z.object({
    fullName: z.string(),
    mobile: z.string(),
    houseFlat: z.string(),
    street: z.string(),
    landmark: z.string().optional(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
  }).optional(),
  paymentMethod: z.enum(["COD", "RAZORPAY", "UPI"]),
  upiUtr: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
  })),
  idempotencyKey: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const result = orderSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ message: "Invalid request", errors: result.error.flatten() }, { status: 400 });
    }

    const { addressId, address, paymentMethod, upiUtr, items, idempotencyKey } = result.data;

    if (!items || items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    // Idempotency check: if we received an idempotency key, see if an order was already created with it
    if (idempotencyKey) {
       // Ideally we'd store idempotencyKey in DB to prevent duplicate orders
       // As a simple alternative, we can check if there's a recent order for this user with exact same items
       // But Prisma doesn't have idempotencyKey natively on our Order model unless we add it.
       // Let's rely on atomic operations below for stock.
    }

    // Fetch real prices and validate stock from DB inside a transaction
    // To ensure stock isn't oversold, we'll use Prisma interactive transaction
    
    const orderResult = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderItemsData = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { inventory: true },
        });

        if (!product || !product.isActive) {
          throw new Error(`Product ${item.productId} is not available.`);
        }

        const availableStock = product.inventory?.stock || 0;

        if (availableStock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Requested: ${item.quantity}, Available: ${availableStock}`);
        }

        // Decrement stock atomically
        if (product.inventory) {
          await tx.inventory.update({
            where: { id: product.inventory.id },
            data: { stock: { decrement: item.quantity } },
          });
        }

        subtotal += product.price * item.quantity;
        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        });
      }

      const shipping = 50; // Flat shipping for now
      const total = subtotal + shipping;

      // Handle Address
      let finalAddressId = addressId;
      if (!finalAddressId && address) {
        const dbAddress = await tx.address.create({
          data: {
            userId,
            ...address,
          },
        });
        finalAddressId = dbAddress.id;
      }

      if (!finalAddressId) {
         throw new Error("Shipping address is required");
      }

      // Create Order
      const orderNumber = `GFT-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
      
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          addressId: finalAddressId,
          subtotal,
          shipping,
          tax: 0,
          discount: 0,
          total,
          status: paymentMethod === "COD" ? "ORDER_PLACED" : "PENDING_PAYMENT",
          items: {
            create: orderItemsData,
          },
        },
      });

      // Handle Payment Record
      if (paymentMethod === "COD") {
        await tx.payment.create({
          data: {
            orderId: order.id,
            method: "COD",
            status: "PENDING",
            amount: total,
          },
        });
        return { orderId: order.id, amount: total, method: "COD" };
      }

      if (paymentMethod === "RAZORPAY") {
        // Create Razorpay Order
        const rpOrder = await razorpay.orders.create({
          amount: Math.round(total * 100), // paise
          currency: "INR",
          receipt: order.id,
        });

        await tx.payment.create({
          data: {
            orderId: order.id,
            method: "RAZORPAY",
            status: "PENDING",
            amount: total,
            razorpayOrderId: rpOrder.id,
          },
        });

        return {
          orderId: order.id,
          amount: total,
          method: "RAZORPAY",
          razorpayOrderId: rpOrder.id,
        };
      }

      if (paymentMethod === "UPI") {
        await tx.payment.create({
          data: {
            orderId: order.id,
            method: "UPI",
            status: "PENDING",
            amount: total,
            transactionId: upiUtr,
          },
        });
        return { orderId: order.id, amount: total, method: "UPI" };
      }

      throw new Error("Invalid payment method");
    });

    return NextResponse.json(orderResult, { status: 201 });
  } catch (error: any) {
    console.error("Order creation error:", error);
    if (error?.message?.includes("Insufficient stock") || error?.message?.includes("not available")) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
