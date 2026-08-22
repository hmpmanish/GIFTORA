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
    const { name, slug, sku, categoryId, shortDescription, description, price, compareAtPrice, costPrice, stock } = body;

    if (!name || !slug || !sku || !categoryId || !price) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Check if slug or SKU already exists
    const existingProduct = await prisma.product.findFirst({
      where: { OR: [{ slug }, { sku }] }
    });

    if (existingProduct) {
      return NextResponse.json({ message: "Product with this slug or SKU already exists" }, { status: 409 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        sku,
        categoryId,
        shortDescription,
        description,
        price,
        compareAtPrice: compareAtPrice || null,
        costPrice: costPrice || null,
        inventory: {
          create: {
            stock: stock || 0
          }
        }
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
