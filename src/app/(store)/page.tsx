import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, ShieldCheck, Star, Headset, CheckCircle2, Building2 } from "lucide-react";
import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const FALLBACK_CATEGORY_IMAGE = "https://images.unsplash.com/photo-1572901111663-dcf7b80a256a?q=80&w=800&auto=format&fit=crop";
const FALLBACK_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=800&auto=format&fit=crop";
const HERO_IMAGE = "https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=2000&auto=format&fit=crop";

export default async function HomePage() {
  let categories: any[] = [];
  let featuredProducts: any[] = [];
  let newArrivals: any[] = [];

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
    ]);
    categories = data[0];
    featuredProducts = data[1];
    newArrivals = data[2];
  } catch (err: any) {
    console.error("Database error on homepage:", err);
  }

  const ProductGrid = ({ products, title, link, subtitle }: any) => {
    if (!products || products.length === 0) return null;

    return (
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">{title}</h2>
              {subtitle && <p className="text-slate-600 text-lg">{subtitle}</p>}
            </div>
            {link && (
              <Link href={link} className="mt-6 md:mt-0 group flex items-center text-primary font-semibold hover:text-accent transition-colors">
                Explore Collection <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product: any) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="group block">
                <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col group-hover:-translate-y-1">
                  <div className="aspect-[4/5] relative bg-slate-100 overflow-hidden">
                    {product.isNewArrival && (
                      <Badge className="absolute top-4 left-4 z-10 bg-accent hover:bg-accent/90 text-white font-medium px-2.5 py-0.5 shadow-md">
                        New
                      </Badge>
                    )}
                    <img
                      src={product.images?.[0]?.url || FALLBACK_PRODUCT_IMAGE}
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-1">{product.name}</h3>
                    <span className="text-sm text-slate-500 mb-4">{product.category?.name || "Premium Gift"}</span>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="font-bold text-xl text-primary">
                        ₹{product.price.toLocaleString()}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors text-slate-400">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
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
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Stunning Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={HERO_IMAGE} 
            alt="Premium Gifting Experience" 
            className="w-full h-full object-cover object-center"
          />
          {/* Professional Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-forwards">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-blue-50 text-sm font-medium mb-8 backdrop-blur-md shadow-lg">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>India's Most Trusted Gifting Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1] drop-shadow-md">
              Premium Gifting. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-accent">Redefined.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-xl leading-relaxed drop-shadow-sm">
              Elevate your corporate and personal relationships with our curated selection of high-end, reliable, and exquisitely packaged gifts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-semibold bg-accent hover:bg-blue-700 text-white rounded-lg transition-all shadow-xl hover:shadow-accent/50 hover:-translate-y-0.5">
                <Link href="/shop">
                  Explore Catalog
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base font-semibold border-white/30 text-white hover:bg-white/10 hover:text-white rounded-lg transition-all backdrop-blur-sm">
                <Link href="/contact">
                  Corporate Inquiry
                </Link>
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-6 text-sm text-slate-300 font-medium">
              <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm"><CheckCircle2 className="w-4 h-4 text-blue-400"/> 100% Quality Guarantee</div>
              <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm"><CheckCircle2 className="w-4 h-4 text-blue-400"/> Secure Delivery</div>
            </div>
          </div>
          <div className="hidden md:block"></div>
        </div>
      </section>

      {/* Trusted Brands / Partners Banner */}
      <section className="py-12 bg-white border-b border-slate-200 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">Trusted by leading enterprises</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Minimalist corporate logos (using icons and text as placeholders for a high-end look) */}
            <div className="flex items-center gap-2 text-2xl font-bold text-slate-800"><Building2 className="w-8 h-8" /> <span>Apex Corp</span></div>
            <div className="flex items-center gap-2 text-2xl font-bold text-slate-800"><span>Nexus Global</span></div>
            <div className="flex items-center gap-2 text-2xl font-bold text-slate-800"><span>Vertex Partners</span></div>
            <div className="flex items-center gap-2 text-2xl font-bold text-slate-800"><span>Omni Group</span></div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: "Secure Transactions", desc: "Enterprise-grade 256-bit encryption" },
              { icon: Package, title: "Reliable Fulfillment", desc: "Tracked, insured, and timely shipping" },
              { icon: Star, title: "Premium Curation", desc: "Rigorous multi-point quality control" },
              { icon: Headset, title: "Dedicated Support", desc: "24/7 dedicated client assistance" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                  <item.icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-24 bg-white relative">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">Curated Solutions</h2>
              <p className="text-lg text-slate-600 max-w-2xl">Discover tailored gifting categories designed to meet the highest professional standards.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.slice(0, 3).map((category, index) => (
                <Link key={category.id} href={`/shop?category=${category.slug}`} className="group block">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 shadow-md group-hover:shadow-2xl transition-all duration-500">
                    <img 
                      src={FALLBACK_CATEGORY_IMAGE} 
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out opacity-80 group-hover:opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10"></div>
                    <div className="absolute inset-0 z-20 flex flex-col justify-end p-8">
                      <h3 className="text-3xl font-bold text-white mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">{category.name}</h3>
                      <div className="flex items-center text-blue-300 font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        Explore Category <ArrowRight className="ml-2 w-4 h-4" />
                      </div>
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
        subtitle="Our most sought-after premium items."
        link="/shop"
      />

      {/* Corporate Philosophy */}
      <section className="py-32 bg-primary text-white text-center px-4 relative overflow-hidden">
        {/* Subtle background image */}
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMAGE} alt="Background" className="w-full h-full object-cover opacity-10 grayscale" />
          <div className="absolute inset-0 bg-primary/90"></div>
        </div>
        <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">
          <div className="p-4 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10 mb-8">
            <ShieldCheck className="w-12 h-12 text-blue-400" />
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 drop-shadow-md">
            "Trust is built on consistency. <br className="hidden md:block"/>We deliver excellence with every package."
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-400 to-accent rounded-full mb-8"></div>
          <span className="uppercase tracking-[0.3em] text-sm text-slate-300 font-bold">The Giftora Standard</span>
        </div>
      </section>

      {/* New Arrivals */}
      <div className="bg-white">
        <ProductGrid 
          products={newArrivals} 
          title="Latest Additions" 
          subtitle="New premium inventory just arrived."
          link="/shop?sort=newest"
        />
      </div>
    </div>
  );
}
