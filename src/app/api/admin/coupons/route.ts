import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
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

    if (!code || !discountType || discountValue === undefined) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const existingCoupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (existingCoupon) {
      return NextResponse.json({ message: "Coupon code already exists" }, { status: 409 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        discountValue,
        minOrderAmount: minOrderAmount || null,
        maxDiscount: maxDiscount || null,
        startDate: startDate ? new Date(startDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        usageLimit: usageLimit || null,
        perUserLimit: perUserLimit || null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ coupon }, { status: 201 });
  } catch (error) {
    console.error("Error creating coupon:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
