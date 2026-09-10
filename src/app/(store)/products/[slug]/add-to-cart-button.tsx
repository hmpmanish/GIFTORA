"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart";

export function AddToCartButton({ product, inStock }: { product: any, inStock: boolean }) {
  const [loading, setLoading] = useState<"cart" | "buy" | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(product.sizes?.[0] || null);
  const [selectedColor, setSelectedColor] = useState<string | null>(product.colors?.[0] || null);
  
  const router = useRouter();
  const { addItem } = useCart();

  const sizes = product.sizes || [];
  const colors = product.colors || [];

  const handleAction = async (action: "cart" | "buy") => {
    if (sizes.length > 0 && !selectedSize) {
      alert("Please select a size");
      return;
    }
    if (colors.length > 0 && !selectedColor) {
      alert("Please select a color");
      return;
    }

    setLoading(action);
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      stock: product.inventory?.stock || 0,
      image: product.images?.[0]?.url,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
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
    <div className="flex flex-col gap-6 w-full">
      {/* Variants Selection */}
      {(sizes.length > 0 || colors.length > 0) && (
        <div className="space-y-4">
          {sizes.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Size</span>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-sm border transition-colors ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-slate-200 hover:border-black bg-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {colors.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Color</span>
              <div className="flex flex-wrap gap-2">
                {colors.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 text-sm border transition-colors ${
                      selectedColor === color
                        ? "border-black bg-black text-white"
                        : "border-slate-200 hover:border-black bg-white"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col gap-4">
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
    </div>
  );
}
