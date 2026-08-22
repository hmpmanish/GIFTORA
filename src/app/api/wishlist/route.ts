import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: (session.user as any).id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ items: wishlist?.items || [] });
  } catch (error) {
    console.error("Wishlist GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    const userId = (session.user as any).id;

    // Verify product exists and is active
    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true },
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found or inactive" }, { status: 404 });
    }

    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId },
      });
    }

    // Check if already in wishlist
    const existingItem = await prisma.wishlistItem.findFirst({
      where: {
        wishlistId: wishlist.id,
        productId,
      },
    });

    if (existingItem) {
      return NextResponse.json({ message: "Product already in wishlist" }, { status: 409 });
    }

    const newItem = await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId,
      },
      include: {
        product: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
      },
    });

    return NextResponse.json({ message: "Added to wishlist", item: newItem }, { status: 201 });
  } catch (error) {
    console.error("Wishlist POST error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const productId = url.searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    const userId = (session.user as any).id;

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) {
      return NextResponse.json({ message: "Wishlist not found" }, { status: 404 });
    }

    const deletedItem = await prisma.wishlistItem.deleteMany({
      where: {
        wishlistId: wishlist.id,
        productId,
      },
    });

    if (deletedItem.count === 0) {
      return NextResponse.json({ message: "Item not in wishlist" }, { status: 404 });
    }

    return NextResponse.json({ message: "Removed from wishlist" });
  } catch (error) {
    console.error("Wishlist DELETE error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
