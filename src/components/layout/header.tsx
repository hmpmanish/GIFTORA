"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Search, Heart, User, ShoppingBag, Menu, ShieldCheck } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const getItemCount = useCart((state) => state.getItemCount);
  const cartCount = getItemCount();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm' : 'bg-white border-b border-transparent py-4'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left Nav */}
          <nav className="hidden md:flex space-x-8 flex-1">
            <Link href="/shop" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">Solutions</Link>
            <Link href="/category/corporate" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">Corporate</Link>
            <Link href="/category/personal" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">Personal</Link>
          </nav>

          {/* Center Logo */}
          <div className="flex-1 flex justify-center items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-accent hidden sm:block" />
            <Link href="/" className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
              GIFTORA
            </Link>
          </div>
          
          {/* Right Icons */}
          <div className="flex items-center justify-end space-x-2 flex-1">
            <Link href="/search" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "hidden sm:inline-flex text-slate-500 hover:text-primary hover:bg-slate-100 rounded-full transition-colors")}>
              <Search className="h-5 w-5" />
            </Link>
            <Link href="/wishlist" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "text-slate-500 hover:text-primary hover:bg-slate-100 rounded-full transition-colors")}>
              <Heart className="h-5 w-5" />
            </Link>
            {session ? (
              <Link href="/profile" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "text-slate-500 hover:text-primary hover:bg-slate-100 rounded-full transition-colors")}>
                <User className="h-5 w-5" />
              </Link>
            ) : (
              <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "text-slate-500 hover:text-primary hover:bg-slate-100 rounded-full transition-colors")}>
                <User className="h-5 w-5" />
              </Link>
            )}
            <Link href="/cart" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative text-slate-500 hover:text-primary hover:bg-slate-100 rounded-full transition-colors")}>
              <ShoppingBag className="h-5 w-5" />
              {mounted && cartCount > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center h-4 w-4 rounded-full bg-accent text-[10px] font-bold text-white ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <Sheet>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden text-slate-500 hover:bg-slate-100 rounded-lg" />}>
                <Menu className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-accent" /> GIFTORA
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  <Link href="/shop" className="text-lg font-semibold hover:text-primary transition-colors">Solutions</Link>
                  <Link href="/category/corporate" className="text-lg font-semibold hover:text-primary transition-colors">Corporate</Link>
                  <Link href="/category/personal" className="text-lg font-semibold hover:text-primary transition-colors">Personal</Link>
                  <Link href="/search" className="text-lg font-semibold hover:text-primary transition-colors flex items-center gap-2">
                    <Search className="w-5 h-5" /> Search
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
