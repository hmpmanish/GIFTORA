"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, getTotal } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center"><ShoppingBag className="h-8 w-8 animate-pulse text-gray-300" /></div>;
  }

  const subtotal = getTotal();
  const shipping = subtotal > 999 ? 0 : 50;
  const total = subtotal + (subtotal > 0 ? shipping : 0);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center max-w-md min-h-[70vh] flex flex-col justify-center items-center">
        <ShoppingBag className="h-16 w-16 mb-8 text-gray-300" strokeWidth={1} />
        <h1 className="text-3xl font-heading mb-4 uppercase tracking-widest">Your cart is empty</h1>
        <p className="text-gray-500 font-light mb-12">
          Looks like you haven't added anything to your cart yet. Let's find some amazing gifts.
        </p>
        <Link href="/shop" className="w-full">
          <Button size="lg" className="w-full h-14 rounded-none text-sm tracking-[0.2em] uppercase font-medium bg-black text-white hover:bg-gray-900 transition-colors">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[80vh]">
      <h1 className="text-3xl font-heading uppercase tracking-widest mb-12 border-b pb-4">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-6 pb-8 border-b">
              <div className="w-32 h-40 bg-stone-100 shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs uppercase text-gray-400">No Image</div>
                )}
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-heading text-lg uppercase tracking-wider mb-2">{item.name}</h3>
                    <p className="text-sm font-light text-gray-600">₹{item.price.toLocaleString()}</p>
                  </div>
                  <button onClick={() => removeItem(item.productId)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="h-5 w-5" strokeWidth={1.5} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-auto pt-4">
                  <div className="flex items-center border border-gray-200">
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-12 text-center text-sm font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="font-medium tracking-wide">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="bg-stone-50 p-8 sticky top-24">
            <h2 className="font-heading uppercase tracking-widest text-lg border-b border-gray-200 pb-4 mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm font-light">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({items.length} items)</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>
                  {shipping === 0 ? <span className="text-green-600">Complimentary</span> : `₹${shipping}`}
                </span>
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                <span className="font-heading uppercase tracking-widest">Total</span>
                <span className="text-lg font-medium">₹{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <Link href="/checkout" className="block">
                <Button className="w-full h-14 rounded-none text-sm tracking-[0.2em] uppercase font-medium bg-black text-white hover:bg-gray-900 transition-colors">
                  Checkout <ArrowRight className="ml-3 h-4 w-4" strokeWidth={1.5} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
