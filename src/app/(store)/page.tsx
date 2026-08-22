import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, ShieldCheck, Star, Headset } from "lucide-react";
import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let categories: any[] = [];
  let featuredProducts: any[] = [];
  let newArrivals: any[] = [];
  let bestsellers: any[] = [];

  try {
    const data = await Promise.all([
      prisma.category.findMany({ take: 4 }),
      prisma.product.findMany({
        where: { isActive: true },
        take: 4,
        orderBy: { price: "desc" },
        include: { images: true, category: true },
      }),
      prisma.product.findMany({
        where: { isActive: true },
        take: 4,
        orderBy: { createdAt: "desc" },
        include: { images: true, category: true },
      }),
      prisma.product.findMany({
        where: { isActive: true },
        take: 4,
        orderBy: { price: "asc" },
        include: { images: true, category: true },
      }),
    ]);
    categories = data[0];
    featuredProducts = data[1];
    newArrivals = data[2];
    bestsellers = data[3];
  } catch (err: any) {
    console.error("Database error on homepage:", err);
    // If DB fails, we still render the page but with empty data
    // We'll also inject a small debug script to alert the error in the browser console
  }

  const ProductGrid = ({ products, title, link }: any) => {
    if (!products || products.length === 0) return null;

    return (
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-heading font-normal tracking-tight text-slate-900 mb-6 uppercase">{title}</h2>
            <div className="w-16 h-[1px] bg-black mb-6"></div>
            {link && (
              <Link href={link} className="text-sm uppercase tracking-widest hover:text-gray-500 transition-colors">
                View Collection
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {products.map((product: any) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="group block">
                <div className="aspect-[3/4] relative overflow-hidden bg-stone-100 mb-6">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm uppercase tracking-widest text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-heading text-lg font-normal mb-2 tracking-wide uppercase">{product.name}</h3>
                  <div className="text-sm tracking-widest text-gray-600">
                    ₹{product.price.toLocaleString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#faf9f6]">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Subtle background texture or gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-200/50 to-[#faf9f6] z-0" />
        
        <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center">
          <span className="uppercase tracking-[0.3em] text-xs font-semibold mb-6 text-gray-500">The Art of Gifting</span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-normal tracking-tight text-slate-900 mb-8 max-w-4xl leading-tight">
            Gifts That Make <br/><span className="italic font-light">Moments Last.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Curated, premium presents for every special occasion. Discover our exclusive collection of luxury gifts tailored for those you love.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/shop">
              <Button size="lg" className="w-full sm:w-auto text-sm tracking-widest uppercase px-12 py-6 rounded-none bg-black hover:bg-gray-800 text-white transition-all">
                Shop The Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-heading tracking-widest uppercase mb-4">Curated For You</h2>
              <div className="w-12 h-[1px] bg-black mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.slice(0, 3).map((category, index) => (
                <Link key={category.id} href={`/shop?category=${category.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                    {/* Placeholder for category images if none exist */}
                    <div className="absolute inset-0 bg-stone-200 group-hover:scale-105 transition-transform duration-700 ease-in-out">
                       {/* You can replace this with actual category images later */}
                    </div>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                      <h3 className="font-heading text-3xl font-normal tracking-wider uppercase mb-4">{category.name}</h3>
                      <span className="text-sm uppercase tracking-widest border-b border-white pb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                        Explore
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <ProductGrid 
        products={featuredProducts} 
        title="Signature Collection" 
        link="/shop"
      />

      {/* Brand Philosophy */}
      <section className="py-32 bg-stone-900 text-white text-center px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <Star className="w-8 h-8 mb-8 text-stone-400" />
          <h2 className="text-4xl md:text-5xl font-heading font-light leading-snug mb-8">
            "A gift is more than an object. It is a memory materialized, a bond strengthened, a moment made eternal."
          </h2>
          <span className="uppercase tracking-[0.2em] text-sm text-stone-400">Our Philosophy</span>
        </div>
      </section>

      {/* New Arrivals */}
      <div className="bg-[#faf9f6]">
        <ProductGrid 
          products={newArrivals} 
          title="Just Arrived" 
          link="/shop?sort=newest"
        />
      </div>

      {/* Trust Badges */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="pt-8 md:pt-0 px-4">
              <Package className="w-8 h-8 mx-auto mb-6 text-gray-400" strokeWidth={1} />
              <h3 className="font-heading uppercase tracking-wider mb-2">Complimentary Shipping</h3>
              <p className="text-sm text-gray-500 font-light">On all orders across India</p>
            </div>
            <div className="pt-8 md:pt-0 px-4">
              <ShieldCheck className="w-8 h-8 mx-auto mb-6 text-gray-400" strokeWidth={1} />
              <h3 className="font-heading uppercase tracking-wider mb-2">Secure Transactions</h3>
              <p className="text-sm text-gray-500 font-light">100% safe & encrypted</p>
            </div>
            <div className="pt-8 md:pt-0 px-4">
              <Star className="w-8 h-8 mx-auto mb-6 text-gray-400" strokeWidth={1} />
              <h3 className="font-heading uppercase tracking-wider mb-2">Artisan Quality</h3>
              <p className="text-sm text-gray-500 font-light">Curated premium selection</p>
            </div>
            <div className="pt-8 md:pt-0 px-4">
              <Headset className="w-8 h-8 mx-auto mb-6 text-gray-400" strokeWidth={1} />
              <h3 className="font-heading uppercase tracking-wider mb-2">Bespoke Support</h3>
              <p className="text-sm text-gray-500 font-light">We are here to assist you</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
