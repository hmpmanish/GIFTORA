export const dynamic = "force-dynamic";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import prisma from "@/lib/prisma";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; sort?: string };
}) {
  const query = searchParams.q || "";
  const category = searchParams.category || "";
  
  const whereClause: any = {
    isActive: true,
  };

  if (query) {
    whereClause.name = { contains: query, mode: "insensitive" };
  }

  if (category) {
    whereClause.category = { slug: category };
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      images: true,
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {category ? `Category: ${category}` : "All Gifts"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {products.length} {products.length === 1 ? "product" : "products"} found
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.slug}`}>
            <Card className="h-full overflow-hidden hover:shadow-lg transition-all border group">
              <div className="aspect-square relative bg-slate-100 overflow-hidden">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0].url}
                    alt={product.images[0].alt || product.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    🎁
                  </div>
                )}
                {product.isNewArrival && (
                  <Badge className="absolute top-2 left-2 z-10 bg-blue-500">New</Badge>
                )}
                {product.isBestseller && (
                  <Badge className="absolute top-2 left-2 z-10 bg-amber-500">Bestseller</Badge>
                )}
              </div>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-1">{product.category.name}</div>
                <h3 className="font-semibold text-lg line-clamp-1 mb-2">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">₹{product.price.toLocaleString()}</span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{product.compareAtPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {products.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
