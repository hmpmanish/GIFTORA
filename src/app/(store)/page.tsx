import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, ShieldCheck, Star, Headset, CheckCircle2 } from "lucide-react";
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
  }

  const ProductGrid = ({ products, title, link, subtitle }: any) => {
    if (!products || products.length === 0) return null;

    return (
      <section className="py-24 bg-slate-50">
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
                <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                  <div className="aspect-[4/5] relative bg-slate-100 overflow-hidden">
                    {product.isNewArrival && (
                      <Badge className="absolute top-4 left-4 z-10 bg-accent hover:bg-accent/90 text-white font-medium px-2.5 py-0.5">
                        New
                      </Badge>
                    )}
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-in-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">
                        No Image Available
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-1">{product.name}</h3>
                    {product.category && (
                      <span className="text-sm text-slate-500 mb-4">{product.category.name}</span>
                    )}
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
      <section className="relative min-h-[90vh] flex items-center justify-center bg-primary overflow-hidden">
        {/* Abstract Corporate Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/20 to-transparent"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent rounded-full blur-[120px] opacity-30"></div>
          <div className="absolute top-20 right-20 w-72 h-72 bg-blue-400 rounded-full blur-[100px] opacity-20"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-blue-100 text-sm font-medium mb-8 backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>India's Most Trusted Gifting Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
              Premium Gifting. <br/>
              <span className="text-accent">Redefined.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl leading-relaxed">
              Elevate your corporate and personal relationships with our curated selection of high-end, reliable, and exquisitely packaged gifts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-semibold bg-accent hover:bg-accent/90 text-white rounded-lg transition-all shadow-lg shadow-accent/25">
                  Explore Catalog
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base font-semibold border-white/30 text-white hover:bg-white/10 rounded-lg transition-all backdrop-blur-sm">
                  Corporate Inquiry
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-8 text-sm text-slate-400 font-medium">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-accent"/> 100% Quality Guarantee</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-accent"/> Secure Delivery</div>
            </div>
          </div>
          
          <div className="hidden md:block relative">
            {/* Minimalist Dashboard/Gift representation */}
            <div className="relative w-full aspect-square rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-md shadow-2xl p-8 flex flex-col justify-center items-center">
              <div className="w-3/4 h-3/4 bg-white/5 rounded-xl border border-white/10 relative overflow-hidden flex items-center justify-center shadow-inner">
                <Package className="w-32 h-32 text-accent/80" strokeWidth={1} />
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-xl border border-white/20 backdrop-blur-xl flex items-center justify-center shadow-xl">
                 <Star className="w-12 h-12 text-yellow-400" fill="currentColor" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: "Secure Transactions", desc: "Enterprise-grade encryption" },
              { icon: Package, title: "Reliable Fulfillment", desc: "Tracked & insured shipping" },
              { icon: Star, title: "Premium Curation", desc: "Rigorous quality control" },
              { icon: Headset, title: "Dedicated Support", desc: "24/7 client assistance" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-start p-6 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">Curated Solutions</h2>
              <p className="text-lg text-slate-600 max-w-2xl">Discover tailored gifting categories designed to meet the highest professional standards.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.slice(0, 3).map((category, index) => (
                <Link key={category.id} href={`/shop?category=${category.slug}`} className="group block">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm group-hover:shadow-lg transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent z-10"></div>
                    <div className="absolute inset-0 bg-slate-200 group-hover:scale-105 transition-transform duration-700 ease-in-out">
                       {/* Placeholder for category image */}
                    </div>
                    <div className="absolute inset-0 z-20 flex flex-col justify-end p-8">
                      <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                      <div className="flex items-center text-blue-200 font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        View Category <ArrowRight className="ml-2 w-4 h-4" />
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
      <section className="py-24 bg-primary text-white text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">
          <ShieldCheck className="w-12 h-12 mb-8 text-accent" />
          <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-8">
            "Trust is built on consistency. We deliver excellence with every package."
          </h2>
          <div className="w-20 h-1 bg-accent rounded-full mb-8"></div>
          <span className="uppercase tracking-widest text-sm text-slate-300 font-semibold">The Giftora Standard</span>
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
