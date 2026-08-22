"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Search, Heart, User, ShoppingBag, Menu } from "lucide-react";
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
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm border-b border-gray-200 py-2 shadow-sm' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left Nav */}
          <nav className="hidden md:flex space-x-6 flex-1">
            <Link href="/shop" className="text-xs tracking-[0.2em] uppercase font-medium hover:text-gray-500 transition-colors">Shop</Link>
            <Link href="/category/birthday-gifts" className="text-xs tracking-[0.2em] uppercase font-medium hover:text-gray-500 transition-colors">Birthday</Link>
            <Link href="/category/anniversary-gifts" className="text-xs tracking-[0.2em] uppercase font-medium hover:text-gray-500 transition-colors">Anniversary</Link>
          </nav>

          {/* Center Logo */}
          <div className="flex-1 flex justify-center">
            <Link href="/" className="text-3xl md:text-4xl font-heading tracking-widest text-slate-900">
              GIFTORA
            </Link>
          </div>
          
          {/* Right Icons */}
          <div className="flex items-center justify-end space-x-2 flex-1">
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex hover:bg-transparent hover:text-gray-500">
              <Search className="h-4 w-4" strokeWidth={1.5} />
            </Button>
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="hover:bg-transparent hover:text-gray-500">
                <Heart className="h-4 w-4" strokeWidth={1.5} />
              </Button>
            </Link>
            {session ? (
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="hover:bg-transparent hover:text-gray-500">
                  <User className="h-4 w-4" strokeWidth={1.5} />
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon" className="hover:bg-transparent hover:text-gray-500">
                  <User className="h-4 w-4" strokeWidth={1.5} />
                </Button>
              </Link>
            )}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative hover:bg-transparent hover:text-gray-500">
                <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
                <span className="absolute top-[8px] right-[8px] h-1.5 w-1.5 rounded-full bg-slate-900" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden hover:bg-transparent">
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
