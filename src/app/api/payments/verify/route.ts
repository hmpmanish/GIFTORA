import { NextResponse } from "next/server";

import crypto from "crypto";

import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET || "test";
    
    // Verify signature
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpay_signature) {
      // Signature mismatch
      await prisma.payment.updateMany({
        where: { orderId, razorpayOrderId: razorpay_order_id },
        data: { status: "FAILED" },
      });
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    }

    // Payment is successful
    await prisma.$transaction([
      prisma.payment.updateMany({
        where: { orderId, razorpayOrderId: razorpay_order_id },
        data: { 
          status: "SUCCESS",
          transactionId: razorpay_payment_id,
        },
      }),
      prisma.order.update({
        where: { id: orderId },
        data: { status: "PAYMENT_CONFIRMED" },
      })
    ]);

    return NextResponse.json({ message: "Payment verified successfully" }, { status: 200 });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
