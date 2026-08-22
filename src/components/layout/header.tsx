"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Search, Heart, User, ShoppingBag, Menu, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function Header() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
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
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex text-slate-500 hover:text-primary hover:bg-slate-100 rounded-full transition-colors">
              <Search className="h-5 w-5" />
            </Button>
            <Button asChild variant="ghost" size="icon" className="text-slate-500 hover:text-primary hover:bg-slate-100 rounded-full transition-colors">
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>
            {session ? (
              <Button asChild variant="ghost" size="icon" className="text-slate-500 hover:text-primary hover:bg-slate-100 rounded-full transition-colors">
                <Link href="/profile">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <Button asChild variant="ghost" size="icon" className="text-slate-500 hover:text-primary hover:bg-slate-100 rounded-full transition-colors">
                <Link href="/login">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            )}
            <Button asChild variant="ghost" size="icon" className="relative text-slate-500 hover:text-primary hover:bg-slate-100 rounded-full transition-colors">
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent ring-2 ring-white" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden text-slate-500 hover:bg-slate-100 rounded-lg">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
