import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Gift, Heart, Star, ShoppingCart, Package } from "lucide-react";
import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, featuredProducts, newArrivals, bestsellers] = await Promise.all([
    prisma.category.findMany({
      take: 4,
    }),
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: 4,
      include: { images: true, category: true },
    }),
    prisma.product.findMany({
      where: { isActive: true, isNewArrival: true },
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { images: true, category: true },
    }),
    prisma.product.findMany({
      where: { isActive: true, isBestseller: true },
      take: 4,
      include: { images: true, category: true },
    }),
  ]);

  const ProductGrid = ({ products, title, subtitle, link }: any) => {
    if (!products || products.length === 0) return null;

    return (
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">{title}</h2>
              <p className="text-slate-600">{subtitle}</p>
            </div>
            {link && (
              <Link href={link} className="hidden sm:flex items-center text-primary font-medium hover:underline">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((product: any) => (
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
                  <CardContent className="p-4 flex flex-col">
                    <div className="text-xs text-muted-foreground mb-1">{product.category?.name}</div>
                    <h3 className="font-medium text-base line-clamp-2 mb-2 flex-grow">{product.name}</h3>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">₹{product.price.toLocaleString()}</span>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <span className="text-xs text-muted-foreground line-through">
                            ₹{product.compareAtPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-amber-50 py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6">
                Find a Gift They'll <span className="text-primary">Never Forget.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-8">
                Thoughtful gifts for birthdays, anniversaries, friendships and every special moment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/shop">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                    Shop Gifts
                  </Button>
                </Link>
                <Link href="/search">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 bg-white/50">
                    Explore Collections
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="aspect-square bg-white rounded-full absolute -right-20 -top-20 w-[600px] h-[600px] opacity-50 blur-3xl" />
              <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-200 to-amber-200 flex flex-col items-center justify-center">
                   <Gift className="w-48 h-48 text-white opacity-80" />
                   <h2 className="text-3xl font-bold text-white mt-4 tracking-wider">GIFTORA</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Shop by Category</h2>
                <p className="text-slate-600">Find the perfect gift for every occasion.</p>
              </div>
              <Link href="/shop" className="hidden sm:flex items-center text-primary font-medium hover:underline">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {categories.map((category, index) => {
                const icons = [Gift, Heart, Star, Package];
                const colors = ["bg-pink-100 text-pink-600", "bg-red-100 text-red-600", "bg-rose-100 text-rose-600", "bg-amber-100 text-amber-600"];
                const Icon = icons[index % icons.length];
                const color = colors[index % colors.length];

                return (
                  <Link key={category.id} href={`/shop?category=${category.slug}`}>
                    <Card className="group cursor-pointer hover:shadow-lg transition-all border-0 bg-slate-50 overflow-hidden">
                      <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                        <div className={`p-4 rounded-full ${color} group-hover:scale-110 transition-transform`}>
                          <Icon className="h-8 w-8" />
                        </div>
                        <h3 className="font-semibold text-lg">{category.name}</h3>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <ProductGrid 
        products={featuredProducts} 
        title="Featured Gifts" 
        subtitle="Handpicked items just for you" 
        link="/shop"
      />

      {/* New Arrivals */}
      <div className="bg-slate-50">
        <ProductGrid 
          products={newArrivals} 
          title="New Arrivals" 
          subtitle="Check out our latest additions" 
          link="/shop?sort=newest"
        />
      </div>

      {/* Best Sellers */}
      <ProductGrid 
        products={bestsellers} 
        title="Best Sellers" 
        subtitle="Our most loved gifts" 
        link="/shop?sort=popular"
      />

      {/* Trust Badges */}
      <section className="py-16 bg-slate-50 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                🚚
              </div>
              <h3 className="font-semibold">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground">All over India</p>
            </div>
            <div>
              <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                💳
              </div>
              <h3 className="font-semibold">Secure Payment</h3>
              <p className="text-sm text-muted-foreground">100% safe & secure</p>
            </div>
            <div>
              <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                ⭐
              </div>
              <h3 className="font-semibold">Premium Quality</h3>
              <p className="text-sm text-muted-foreground">Curated gifts</p>
            </div>
            <div>
              <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                🎧
              </div>
              <h3 className="font-semibold">Customer Support</h3>
              <p className="text-sm text-muted-foreground">We're here to help</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
