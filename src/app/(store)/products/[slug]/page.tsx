export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Truck, ShieldCheck, Undo2 } from "lucide-react";
import Link from "next/link";
import { AddToCartButton } from "./add-to-cart-button";

import prisma from "@/lib/prisma";

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      images: true,
      category: true,
      inventory: true,
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  const stock = product.inventory?.stock ?? 0;
  const inStock = stock > 0;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <nav className="flex text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-primary">Shop</Link>
          <span className="mx-2">/</span>
          <Link href={`/category/${product.category.slug}`} className="hover:text-primary">
            {product.category.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden relative">
            {product.images?.[0] ? (
              <img
                src={product.images[0].url}
                alt={product.images[0].alt || product.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">🎁</div>
            )}
            {product.isBestseller && (
              <Badge className="absolute top-4 left-4 z-10 bg-amber-500">Bestseller</Badge>
            )}
          </div>
          {/* Thumbnail gallery would go here */}
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-1 font-medium">{product.rating.toFixed(1)}</span>
                <span className="ml-1 text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">SKU: {product.sku}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-slate-900">₹{product.price.toLocaleString()}</span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <>
                  <span className="text-xl text-muted-foreground line-through mb-1">
                    ₹{product.compareAtPrice.toLocaleString()}
                  </span>
                  <span className="text-green-600 font-medium mb-1">
                    {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Inclusive of all taxes</p>
          </div>

          <p className="text-slate-600 leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          <div className="space-y-4 pt-6 border-t">
            <div className="flex items-center gap-2">
              {inStock ? (
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">In Stock</Badge>
              ) : (
                <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">Out of Stock</Badge>
              )}
            </div>

            <div className="flex gap-4">
              <AddToCartButton product={product} inStock={inStock} />
              <Button variant="outline" size="icon" className="w-12 h-12 shrink-0 rounded-xl">
                <Star className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-full">
                <Truck className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Free Delivery</p>
                <p className="text-xs text-muted-foreground">On orders above ₹999</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-full">
                <Undo2 className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Easy Returns</p>
                <p className="text-xs text-muted-foreground">7 days return policy</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:col-span-2">
              <div className="p-2 bg-slate-100 rounded-full">
                <ShieldCheck className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Secure Payment</p>
                <p className="text-xs text-muted-foreground">100% secure checkout via Razorpay</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 pt-10 border-t">
        <h2 className="text-2xl font-bold mb-6">Product Description</h2>
        <div className="prose max-w-none text-slate-600">
          {product.description}
        </div>
      </div>
    </div>
  );
}
