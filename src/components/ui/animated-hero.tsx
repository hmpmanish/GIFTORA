"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Heart, Sparkles } from "lucide-react";

interface AnimatedHeroProps {
  bannerTitle?: string;
  bannerLink?: string;
  heroImage: string;
}

export function AnimatedHero({ bannerTitle, bannerLink, heroImage }: AnimatedHeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background pt-20">
      {/* Playful Background blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl z-0 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-accent/10 blur-3xl z-0 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center h-full">
        <div className="text-left pt-10 md:pt-0">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 text-primary font-bold mb-8 soft-shadow border border-slate-100 dark:border-slate-700"
          >
            <Sparkles className="w-5 h-5 text-accent" />
            <span>Gifting made joyful!</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]"
          >
            {bannerTitle ? (
              <span>{bannerTitle}</span>
            ) : (
              <>
                Find the <br/>
                <span className="text-primary relative inline-block">
                  perfect gift
                  <motion.svg className="absolute w-full h-4 -bottom-1 left-0 text-accent opacity-50" viewBox="0 0 100 20" preserveAspectRatio="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8, duration: 1 }}>
                    <path d="M0,10 Q50,20 100,10" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                  </motion.svg>
                </span> <br/>
                every time.
              </>
            )}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-xl leading-relaxed"
          >
            Bring a smile to their face with our hand-picked, delightful gifts. Beautifully packaged and delivered with love.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link 
              href={bannerLink || "/shop"} 
              className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto h-14 px-8 text-lg font-bold bg-primary hover:bg-primary/90 text-white rounded-full transition-all soft-shadow hover:shadow-primary/30 hover:-translate-y-1")}
            >
              {bannerLink ? "Grab the Offer" : "Shop Now"}
            </Link>
            <Link 
              href="/categories"
              className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full sm:w-auto h-14 px-8 text-lg font-bold border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full transition-all soft-shadow hover:-translate-y-1")}
            >
              Explore Categories
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-12 flex flex-wrap items-center gap-6 text-sm text-slate-500 font-bold"
          >
            <div className="flex items-center gap-2"><Heart className="w-5 h-5 text-red-400 fill-red-400"/> Loved by 10,000+</div>
            <div className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-accent"/> Free Joyful Packaging</div>
          </motion.div>
        </div>

        {/* Playful Image Reveal */}
        <div className="hidden md:block relative h-[600px] w-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 70, damping: 15, delay: 0.2 }}
            className="absolute inset-0 z-10 rounded-[3rem] overflow-hidden soft-shadow border-4 border-white dark:border-slate-800"
          >
            <img src={heroImage} alt="Joyful Gifts" className="w-full h-full object-cover" />
          </motion.div>
          {/* Decorative element behind image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, rotate: 15 }}
            animate={{ opacity: 1, scale: 1, rotate: 6 }}
            transition={{ type: "spring", stiffness: 60, damping: 12, delay: 0.4 }}
            className="absolute inset-0 bg-accent rounded-[3rem] -z-0 translate-x-6 translate-y-6"
          ></motion.div>
        </div>
      </div>
    </section>
  );
}
