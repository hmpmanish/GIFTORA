"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Minus, Plus, ArrowRight } from "lucide-react";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]); // To be populated from context/API

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 50;
  const total = subtotal + (subtotal > 0 ? shipping : 0);

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">
          Looks like you haven't added anything to your cart yet. Let's find some amazing gifts!
        </p>
        <Link href="/shop">
          <Button size="lg" className="w-full">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 flex gap-4">
                <div className="w-24 h-24 bg-slate-100 rounded-md shrink-0">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-md" />
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">₹{item.price.toLocaleString()}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-red-500 shrink-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border rounded-md">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none">
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-12 text-center text-sm font-medium">{item.quantity}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <span className="font-semibold ml-auto">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-6">
              <h2 className="font-bold text-xl border-b pb-4">Order Summary</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({cartItems.length} items)</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? <span className="text-green-600">Free</span> : `₹${shipping}`}
                  </span>
                </div>
                <div className="pt-3 border-t flex justify-between items-center">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-xl">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex gap-2">
                  <Input placeholder="Coupon code" />
                  <Button variant="outline">Apply</Button>
                </div>
              </div>

              <Link href="/checkout">
                <Button className="w-full h-12 text-lg" size="lg">
                  Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
