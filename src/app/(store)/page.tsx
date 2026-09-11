import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Package, ShieldCheck, Star, Headset, Heart, Smile } from "lucide-react";
import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ThreeDCard } from "@/components/ui/3d-card";

export const dynamic = "force-dynamic";

const FALLBACK_CATEGORY_IMAGE = "https://images.unsplash.com/photo-1572901111663-dcf7b80a256a?q=80&w=800&auto=format&fit=crop";
const FALLBACK_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=800&auto=format&fit=crop";
const HERO_IMAGE = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2000&auto=format&fit=crop"; // Bright friendly gift image

export default async function HomePage() {
  let categories: any[] = [];
  let featuredProducts: any[] = [];
  let newArrivals: any[] = [];
  let banners: any[] = [];

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
      prisma.banner.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);
    categories = data[0];
    featuredProducts = data[1];
    newArrivals = data[2];
    banners = data[3];
  } catch (err: any) {
    console.error("Database error on homepage:", err);
  }

  const ProductGrid = ({ products, title, link, subtitle, delayOffset = 0 }: any) => {
    if (!products || products.length === 0) return null;

    return (
      <section className="py-24 bg-slate-50/50 dark:bg-slate-900/20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection direction="up" delay={0.1}>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                  {title}
                </h2>
                {subtitle && <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">{subtitle}</p>}
              </div>
              {link && (
                <Link href={link} className="mt-6 md:mt-0 group flex items-center text-primary font-bold hover:text-primary/80 transition-colors bg-white dark:bg-slate-800 px-6 py-3 rounded-full soft-shadow hover:shadow-lg hover:-translate-y-1">
                  View All <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product: any, idx: number) => (
              <AnimatedSection key={product.id} direction="up" delay={0.1 * (idx + 1) + delayOffset}>
                <ThreeDCard className="h-full">
                  <Link href={`/products/${product.slug}`} className="group block h-full">
                    <div className="bg-white dark:bg-slate-800 rounded-[2rem] overflow-hidden border-2 border-transparent hover:border-primary/20 soft-shadow hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)] transition-all duration-300 h-full flex flex-col">
                      <div className="aspect-square relative bg-slate-100 dark:bg-slate-900 overflow-hidden m-3 rounded-[1.5rem]">
                        {product.isNewArrival && (
                          <Badge className="absolute top-3 left-3 z-10 bg-accent text-white font-bold px-3 py-1 shadow-md rounded-full border-none">
                            New
                          </Badge>
                        )}
                        <img
                          src={product.images?.[0]?.url || FALLBACK_PRODUCT_IMAGE}
                          alt={product.name}
                          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                        />
                      </div>
                      <div className="p-6 pt-3 flex flex-col flex-grow">
                        <span className="text-xs font-bold text-accent uppercase tracking-wider mb-2">{product.category?.name || "Gift"}</span>
                        <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-4 line-clamp-2 group-hover:text-primary transition-colors">{product.name}</h3>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="font-extrabold text-2xl text-slate-900 dark:text-white">
                            ₹{product.price.toLocaleString()}
                          </div>
                          <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-slate-700 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300 text-primary">
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </ThreeDCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const displayBanner = banners.length > 0 ? banners[0] : null;
  const currentHeroImage = displayBanner?.imageUrl || HERO_IMAGE;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      
      {/* Playful Animated Hero Section */}
      <AnimatedHero 
        bannerTitle={displayBanner?.title}
        bannerLink={displayBanner?.link}
        heroImage={currentHeroImage}
      />

      {/* Trust Badges - Friendly Design */}
      <section className="py-20 bg-white dark:bg-slate-900 relative z-20 -mt-10 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: "100% Safe", desc: "Secure payments always", color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
              { icon: Package, title: "Fast Delivery", desc: "Arrives right on time", color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
              { icon: Star, title: "Top Quality", desc: "Hand-picked for you", color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30" },
              { icon: Smile, title: "Happy Support", desc: "We're here to help", color: "text-rose-500", bg: "bg-rose-100 dark:bg-rose-900/30" }
            ].map((item, i) => (
              <AnimatedSection key={i} direction="scale" delay={0.1 * (i + 1)}>
                <ThreeDCard>
                  <div className="flex flex-col items-center text-center p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:-translate-y-2 group cursor-default">
                    <div className={`w-20 h-20 rounded-[1.5rem] ${item.bg} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                      <item.icon className={`w-10 h-10 ${item.color}`} />
                    </div>
                    <h3 className="font-extrabold text-xl text-slate-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">{item.desc}</p>
                  </div>
                </ThreeDCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <ProductGrid 
        products={featuredProducts} 
        title="Our Favorites" 
        subtitle="Gifts that always bring a smile."
        link="/shop"
      />

      {/* Categories Section - Friendly Bubbles */}
      {categories.length > 0 && (
        <section className="py-24 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection direction="up" className="flex flex-col items-center text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">Find the perfect category</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">Whatever the occasion, we've got you covered.</p>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {categories.slice(0, 3).map((category, index) => (
                <AnimatedSection key={category.id} direction="up" delay={0.1 * (index + 1)}>
                  <Link href={`/category/${category.slug}`} className="group block text-center">
                    <div className="relative aspect-square rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 mb-6 mx-auto w-[80%] max-w-[300px] border-8 border-white dark:border-slate-800 soft-shadow group-hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] transition-all duration-500 group-hover:-translate-y-4">
                      <img 
                        src={FALLBACK_CATEGORY_IMAGE} 
                        alt={category.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                      />
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">{category.name}</h3>
                    <div className="inline-flex items-center text-accent font-bold">
                      Explore <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Friendly Philosophy Banner */}
      <section className="py-24 bg-primary text-white text-center px-4 m-4 md:m-8 rounded-[3rem] relative overflow-hidden soft-shadow interactive">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)]"></div>
        <AnimatedSection direction="up" className="max-w-3xl mx-auto flex flex-col items-center relative z-10">
          <div className="p-6 bg-white/20 rounded-[2rem] mb-8 backdrop-blur-sm rotate-3 hover:rotate-0 transition-transform">
            <Heart className="w-16 h-16 text-white fill-white/50" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-8 text-balance">
            "More than just a gift. <br/> A moment of pure joy."
          </h2>
          <span className="bg-white text-primary px-6 py-2 rounded-full font-bold text-sm uppercase tracking-widest soft-shadow">Our Promise</span>
        </AnimatedSection>
      </section>

      {/* New Arrivals */}
      <div className="bg-white dark:bg-slate-900">
        <ProductGrid 
          products={newArrivals} 
          title="Just Landed" 
          subtitle="Fresh new gifts waiting to be discovered."
          link="/shop?sort=newest"
          delayOffset={0.2}
        />
      </div>
    </div>
  );
}
