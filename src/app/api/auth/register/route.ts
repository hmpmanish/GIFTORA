import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import prisma from "@/lib/prisma";

function generateReferralCode(name: string) {
  const prefix = name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, "USR");
  const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${suffix}`;
}

export async function POST(req: Request) {
  try {
    const { name, email, password, ref } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    let referredById = null;
    if (ref) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode: ref },
      });
      if (referrer) {
        referredById = referrer.id;
        // Increment referrer's count
        await prisma.user.update({
          where: { id: referrer.id },
          data: { referralCount: { increment: 1 } }
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newReferralCode = generateReferralCode(name);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "CUSTOMER",
        referralCode: newReferralCode,
        referredById,
      },
    });

    return Response.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
