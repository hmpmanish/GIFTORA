import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required").optional(),
  mobile: z.string().min(10, "Valid mobile number is required").optional(),
  houseFlat: z.string().min(1, "House/Flat number is required").optional(),
  street: z.string().min(1, "Street is required").optional(),
  landmark: z.string().optional(),
  city: z.string().min(1, "City is required").optional(),
  state: z.string().min(1, "State is required").optional(),
  pincode: z.string().min(6, "Valid pincode is required").optional(),
  isDefault: z.boolean().optional(),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const resolvedParams = await params;
    const id = resolvedParams.id;

    // Verify ownership
    const existingAddress = await prisma.address.findUnique({
      where: { id },
    });

    if (!existingAddress || existingAddress.userId !== userId) {
      return NextResponse.json({ message: "Not found or unauthorized" }, { status: 404 });
    }

    const body = await req.json();
    const result = addressSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Validation error", errors: result.error.flatten() },
        { status: 422 }
      );
    }

    // If setting as default, unset other defaults
    if (result.data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: result.data,
    });

    return NextResponse.json({ message: "Address updated", address: updatedAddress });
  } catch (error) {
    console.error("Update address error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const resolvedParams = await params;
    const id = resolvedParams.id;

    // Verify ownership
    const existingAddress = await prisma.address.findUnique({
      where: { id },
    });

    if (!existingAddress || existingAddress.userId !== userId) {
      return NextResponse.json({ message: "Not found or unauthorized" }, { status: 404 });
    }

    await prisma.address.delete({
      where: { id },
    });

    // If we deleted the default address, make the most recently created one default
    if (existingAddress.isDefault) {
      const remainingAddress = await prisma.address.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
      
      if (remainingAddress) {
        await prisma.address.update({
          where: { id: remainingAddress.id },
          data: { isDefault: true }
        });
      }
    }

    return NextResponse.json({ message: "Address deleted" });
  } catch (error) {
    console.error("Delete address error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
