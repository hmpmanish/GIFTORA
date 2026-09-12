import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ message: "Order ID required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order || order.userId !== (session.user as any).id) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Update order status to PROCESSING (meaning payment is done and it's being packed)
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "PROCESSING" },
    });

    // Update payment status to COMPLETED
    if (order.payment) {
      await prisma.payment.update({
        where: { id: order.payment.id },
        data: { 
          status: "COMPLETED",
          transactionId: `MOCK_TXN_${Date.now()}`
        },
      });
    }

    return NextResponse.json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.error("Custom verify error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
