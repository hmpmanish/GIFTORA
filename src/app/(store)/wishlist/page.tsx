"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Trash2, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/store/wishlist";
import { useCart } from "@/store/cart";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, loading, fetchWishlist, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/wishlist");
    } else if (status === "authenticated") {
      fetchWishlist();
    }
  }, [status, fetchWishlist, router]);

  const handleMoveToCart = (item: any) => {
    addItem({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.images[0]?.url || "",
      quantity: 1,
      stock: item.product.stock,
    });
    removeFromWishlist(item.productId);
    // Optional: add a toast notification here
  };

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-muted rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-muted rounded mb-2"></div>
          <div className="h-4 w-24 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Your Wishlist is Empty</h1>
        <p className="text-muted-foreground mb-8">
          Save items you love here and buy them later when you're ready.
        </p>
        <Link href="/shop">
          <Button size="lg" className="w-full">
            Explore Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight mb-8">My Wishlist ({items.length})</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.id} className="group flex flex-col bg-card border rounded-xl overflow-hidden hover:shadow-md transition-all">
            <div className="relative aspect-square bg-muted">
              {item.product.images[0] ? (
                <img 
                  src={item.product.images[0].url} 
                  alt={item.product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}
              <button 
                onClick={() => removeFromWishlist(item.productId)}
                className="absolute top-3 right-3 h-8 w-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-background transition-colors"
                title="Remove from Wishlist"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            
            <div className="p-4 flex flex-col flex-grow">
              <Link href={`/products/${item.product.slug}`} className="hover:underline line-clamp-1 mb-1">
                <h3 className="font-medium text-foreground">{item.product.name}</h3>
              </Link>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-semibold text-lg">₹{item.product.price}</span>
                {item.product.mrp > item.product.price && (
                  <span className="text-sm text-muted-foreground line-through">₹{item.product.mrp}</span>
                )}
              </div>
              
              <div className="mt-auto">
                <Button 
                  className="w-full" 
                  disabled={item.product.stock <= 0}
                  onClick={() => handleMoveToCart(item)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {item.product.stock > 0 ? "Move to Cart" : "Out of Stock"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
