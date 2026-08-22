"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Search, Heart, User, ShoppingBag, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold tracking-tight text-primary">
              GIFTORA
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/shop" className="text-sm font-medium hover:text-primary transition-colors">Shop</Link>
            <Link href="/category/birthday-gifts" className="text-sm font-medium hover:text-primary transition-colors">Birthday</Link>
            <Link href="/category/anniversary-gifts" className="text-sm font-medium hover:text-primary transition-colors">Anniversary</Link>
            <Link href="/category/personalized-gifts" className="text-sm font-medium hover:text-primary transition-colors">Personalized</Link>
            <Link href="/track-order" className="text-sm font-medium hover:text-primary transition-colors">Track Order</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
              <Search className="h-5 w-5" />
            </Button>
            <Link href="/wishlist">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            {session ? (
              <Link href="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
