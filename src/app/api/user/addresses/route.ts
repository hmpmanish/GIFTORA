import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  mobile: z.string().min(10, "Valid mobile number is required"),
  houseFlat: z.string().min(1, "House/Flat number is required"),
  street: z.string().min(1, "Street is required"),
  landmark: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Valid pincode is required"),
  isDefault: z.boolean().optional().default(false),
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: (session.user as any).id },
      orderBy: [
        { isDefault: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Fetch addresses error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = addressSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Validation error", errors: result.error.flatten() },
        { status: 422 }
      );
    }

    const userId = (session.user as any).id;
    
    // If setting as default, unset other defaults
    if (result.data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    } else {
      // If no addresses exist, make this one default automatically
      const count = await prisma.address.count({ where: { userId } });
      if (count === 0) {
        result.data.isDefault = true;
      }
    }

    const address = await prisma.address.create({
      data: {
        ...result.data,
        userId,
      },
    });

    return NextResponse.json({ message: "Address created", address }, { status: 201 });
  } catch (error) {
    console.error("Create address error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
