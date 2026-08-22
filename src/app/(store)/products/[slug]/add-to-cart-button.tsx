"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart";

export function AddToCartButton({ product, inStock }: { product: any, inStock: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addItem } = useCart();

  const handleAddToCart = async () => {
    setLoading(true);
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      stock: product.inventory?.stock || 0,
      image: product.images?.[0]?.url
    });
    setLoading(false);
    router.push("/cart");
  };

  return (
    <Button
      className="flex-1 h-12 rounded-xl text-lg font-medium"
      size="lg"
      disabled={!inStock || loading}
      onClick={handleAddToCart}
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      {loading ? "Adding..." : inStock ? "Add to Cart" : "Out of Stock"}
    </Button>
  );
}
