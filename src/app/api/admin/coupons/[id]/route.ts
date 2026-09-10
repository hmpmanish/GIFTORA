import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "STAFF")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const coupon = await prisma.coupon.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!coupon) {
      return NextResponse.json({ message: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ coupon });
  } catch (error) {
    console.error("Error fetching coupon:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "STAFF")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { 
      code, discountType, discountValue, minOrderAmount, 
      maxDiscount, startDate, expiryDate, usageLimit, perUserLimit, isActive 
    } = body;

    const resolvedParams = await params;
    const coupon = await prisma.coupon.update({
      where: { id: resolvedParams.id },
      data: {
        code: code?.toUpperCase(),
        discountType,
        discountValue,
        minOrderAmount: minOrderAmount || null,
        maxDiscount: maxDiscount || null,
        startDate: startDate ? new Date(startDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        usageLimit: usageLimit || null,
        perUserLimit: perUserLimit || null,
        isActive,
      },
    });

    return NextResponse.json({ coupon });
  } catch (error) {
    console.error("Error updating coupon:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "STAFF")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    await prisma.coupon.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
