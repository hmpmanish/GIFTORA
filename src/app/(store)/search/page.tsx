import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { Search, SlidersHorizontal } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Search Products | GIFTORA",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  
  const q = typeof resolvedParams.q === "string" ? resolvedParams.q : "";
  const category = typeof resolvedParams.category === "string" ? resolvedParams.category : "";
  const minPrice = typeof resolvedParams.minPrice === "string" ? parseFloat(resolvedParams.minPrice) : undefined;
  const maxPrice = typeof resolvedParams.maxPrice === "string" ? parseFloat(resolvedParams.maxPrice) : undefined;
  const sort = typeof resolvedParams.sort === "string" ? resolvedParams.sort : "newest";
  const page = typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page, 10) : 1;
  const limit = typeof resolvedParams.limit === "string" ? parseInt(resolvedParams.limit, 10) : 12;

  const skip = (page - 1) * limit;

  const whereClause: any = {
    isActive: true,
  };

  if (q) {
    whereClause.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { sku: { contains: q, mode: "insensitive" } },
      { tags: { has: q } },
      { category: { name: { contains: q, mode: "insensitive" } } },
    ];
  }

  if (category) {
    whereClause.category = { slug: category };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    whereClause.price = {};
    if (minPrice !== undefined) whereClause.price.gte = minPrice;
    if (maxPrice !== undefined) whereClause.price.lte = maxPrice;
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "popular") {
    orderBy = { isBestseller: "desc" };
  } else if (sort === "price-low") {
    orderBy = { price: "asc" };
  } else if (sort === "price-high") {
    orderBy = { price: "desc" };
  } else if (sort === "rating") {
    orderBy = { isFeatured: "desc" }; // Simplified as we don't have a ratings field yet
  }

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      include: { images: true, category: true },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Search className="h-6 w-6" /> 
            {q ? `Search: "${q}"` : category ? `Category: ${category}` : "All Products"}
          </h1>
          <p className="text-muted-foreground mt-2">
            Showing {Math.min(skip + 1, totalCount)} - {Math.min(skip + products.length, totalCount)} of {totalCount} results
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" className="md:hidden">
            <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
          </Button>
          <div className="hidden md:flex gap-2">
            {/* We could add sort dropdown here in client component */}
            <span className="text-sm text-muted-foreground self-center mr-2">Sort by:</span>
            <Link href={`/search?${new URLSearchParams({ ...resolvedParams as Record<string, string>, sort: 'newest' }).toString()}`}>
              <Button variant={sort === 'newest' ? 'default' : 'outline'} size="sm">Newest</Button>
            </Link>
            <Link href={`/search?${new URLSearchParams({ ...resolvedParams as Record<string, string>, sort: 'price-low' }).toString()}`}>
              <Button variant={sort === 'price-low' ? 'default' : 'outline'} size="sm">Price: Low to High</Button>
            </Link>
            <Link href={`/search?${new URLSearchParams({ ...resolvedParams as Record<string, string>, sort: 'price-high' }).toString()}`}>
              <Button variant={sort === 'price-high' ? 'default' : 'outline'} size="sm">Price: High to Low</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.slug}`}>
            <Card className="h-full overflow-hidden hover:shadow-lg transition-all border group">
              <div className="aspect-square relative bg-slate-100 overflow-hidden">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    🎁
                  </div>
                )}
                {product.isNewArrival && (
                  <Badge className="absolute top-2 left-2 z-10 bg-blue-500 hover:bg-blue-600">New</Badge>
                )}
                {product.isBestseller && (
                  <Badge className="absolute top-2 left-2 z-10 bg-amber-500 hover:bg-amber-600">Bestseller</Badge>
                )}
              </div>
              <CardContent className="p-4 flex flex-col h-[140px]">
                <div className="text-xs text-muted-foreground mb-1">{product.category?.name}</div>
                <h3 className="font-medium text-base line-clamp-2 mb-2 flex-grow">{product.name}</h3>
                <div className="flex items-center gap-2 mt-auto">
                  <span className="font-bold">₹{product.price.toLocaleString()}</span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="text-xs text-muted-foreground line-through">
                      ₹{product.compareAtPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <div className="py-24 text-center max-w-md mx-auto">
          <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-6">We couldn't find anything matching your search criteria. Try adjusting your filters or search query.</p>
          <Link href="/search">
            <Button>Clear All Filters</Button>
          </Link>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          {page > 1 && (
            <Link href={`/search?${new URLSearchParams({ ...resolvedParams as Record<string, string>, page: (page - 1).toString() }).toString()}`}>
              <Button variant="outline">Previous</Button>
            </Link>
          )}
          
          <span className="text-sm font-medium">Page {page} of {totalPages}</span>
          
          {page < totalPages && (
            <Link href={`/search?${new URLSearchParams({ ...resolvedParams as Record<string, string>, page: (page + 1).toString() }).toString()}`}>
              <Button variant="outline">Next</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
