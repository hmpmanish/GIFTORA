"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart";

export function AddToCartButton({ product, inStock }: { product: any, inStock: boolean }) {
  const [loading, setLoading] = useState<"cart" | "buy" | null>(null);
  const router = useRouter();
  const { addItem } = useCart();

  const handleAction = async (action: "cart" | "buy") => {
    setLoading(action);
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      stock: product.inventory?.stock || 0,
      image: product.images?.[0]?.url
    });
    
    // Slight delay for UI feedback
    setTimeout(() => {
      setLoading(null);
      if (action === "buy") {
        router.push("/cart"); // Usually goes to checkout, but cart is safe for now
      }
    }, 500);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <Button
        className="w-full h-14 rounded-none text-sm tracking-[0.2em] uppercase font-medium bg-white text-black border border-black hover:bg-gray-50 transition-colors"
        disabled={!inStock || loading !== null}
        onClick={() => handleAction("cart")}
      >
        <ShoppingBag className="mr-3 h-4 w-4" strokeWidth={1.5} />
        {loading === "cart" ? "Adding..." : inStock ? "Add to Cart" : "Out of Stock"}
      </Button>
      
      <Button
        className="w-full h-14 rounded-none text-sm tracking-[0.2em] uppercase font-medium bg-black text-white hover:bg-gray-900 transition-colors"
        disabled={!inStock || loading !== null}
        onClick={() => handleAction("buy")}
      >
        <CreditCard className="mr-3 h-4 w-4" strokeWidth={1.5} />
        {loading === "buy" ? "Processing..." : "Buy It Now"}
      </Button>
    </div>
  );
}
