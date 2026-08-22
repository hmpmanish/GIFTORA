"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/store/cart";
import { useEffect, useState as useReactState } from "react";

const addressSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit mobile number required"),
  houseFlat: z.string().min(1, "House/Flat number is required"),
  street: z.string().min(3, "Street info is required"),
  landmark: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Valid 6-digit pincode required"),
  upiUtr: z.string().optional(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");
  const [loading, setLoading] = useState(false);
  const { items: cartItems, getTotal, clearCart } = useCart();
  const [mounted, setMounted] = useReactState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: session?.user?.name || "",
      mobile: "",
      houseFlat: "",
      street: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  const subtotal = getTotal();
  const total = subtotal > 0 ? subtotal + 50 : 0; // Mock shipping

  const onSubmit = async (data: AddressFormValues) => {
    if (status !== "authenticated") {
      router.push("/login?callbackUrl=/checkout");
      return;
    }
    
    setLoading(true);
    try {
      // 1. Create order on server
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: data, paymentMethod, upiUtr: data.upiUtr, items: cartItems }),
      });

      if (!res.ok) {
        throw new Error("Failed to create order");
      }

      const orderData = await res.json();

      if (paymentMethod === "COD" || paymentMethod === "UPI") {
        clearCart();
        router.push(`/order-success?orderId=${orderData.orderId}`);
        return;
      }

      if (paymentMethod === "RAZORPAY") {
        // Initialize Razorpay
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "test_key", // Will be exposed to client
          amount: orderData.amount,
          currency: "INR",
          name: "GIFTORA",
          description: "Gift Purchase",
          order_id: orderData.razorpayOrderId,
          handler: async function (response: any) {
            // Verify payment on server
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData.orderId,
              }),
            });

            if (verifyRes.ok) {
              clearCart();
              router.push(`/order-success?orderId=${orderData.orderId}`);
            } else {
              alert("Payment verification failed. If money was deducted, it will be refunded.");
            }
          },
          prefill: {
            name: data.fullName,
            email: session?.user?.email || "",
            contact: data.mobile,
          },
          theme: {
            color: "#f59e0b", // Amber-500
          },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
        
        razorpay.on('payment.failed', function (response: any){
          alert("Payment failed");
        });
      }
    } catch (error) {
      alert("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Add items to your cart before proceeding to checkout.</p>
        <Button onClick={() => router.push("/shop")} size="lg">Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[80vh]">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <h1 className="text-3xl font-heading uppercase tracking-widest mb-12 border-b pb-4">Checkout</h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-gray-200 p-8">
            <h2 className="font-heading uppercase tracking-widest text-lg mb-6">Delivery Address</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-gray-500">Full Name</Label>
                  <Input {...form.register("fullName")} className="rounded-none h-12" />
                  {form.formState.errors.fullName && <p className="text-xs text-red-500">{form.formState.errors.fullName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-gray-500">Mobile Number</Label>
                  <Input {...form.register("mobile")} className="rounded-none h-12" />
                  {form.formState.errors.mobile && <p className="text-xs text-red-500">{form.formState.errors.mobile.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-gray-500">House / Flat No.</Label>
                <Input {...form.register("houseFlat")} className="rounded-none h-12" />
                {form.formState.errors.houseFlat && <p className="text-xs text-red-500">{form.formState.errors.houseFlat.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-gray-500">Street / Area</Label>
                <Input {...form.register("street")} className="rounded-none h-12" />
                {form.formState.errors.street && <p className="text-xs text-red-500">{form.formState.errors.street.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-gray-500">Landmark (Optional)</Label>
                <Input {...form.register("landmark")} className="rounded-none h-12" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-gray-500">City</Label>
                  <Input {...form.register("city")} className="rounded-none h-12" />
                  {form.formState.errors.city && <p className="text-xs text-red-500">{form.formState.errors.city.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-gray-500">State</Label>
                  <Input {...form.register("state")} className="rounded-none h-12" />
                  {form.formState.errors.state && <p className="text-xs text-red-500">{form.formState.errors.state.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-gray-500">Pincode</Label>
                  <Input {...form.register("pincode")} className="rounded-none h-12" />
                  {form.formState.errors.pincode && <p className="text-xs text-red-500">{form.formState.errors.pincode.message}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-8">
            <h2 className="font-heading uppercase tracking-widest text-lg mb-6">Payment Method</h2>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
              <div className={`flex items-center space-x-4 border p-4 transition-colors ${paymentMethod === "RAZORPAY" ? 'border-black bg-stone-50' : 'border-gray-200'}`}>
                <RadioGroupItem value="RAZORPAY" id="r1" />
                <Label htmlFor="r1" className="flex-1 text-sm tracking-wide cursor-pointer uppercase">Online Payment (Cards/NetBanking)</Label>
              </div>
              <div className={`flex items-center space-x-4 border p-4 transition-colors ${paymentMethod === "UPI" ? 'border-black bg-stone-50' : 'border-gray-200'}`}>
                <RadioGroupItem value="UPI" id="r2" />
                <Label htmlFor="r2" className="flex-1 text-sm tracking-wide cursor-pointer uppercase">Direct UPI</Label>
              </div>
              <div className={`flex items-center space-x-4 border p-4 transition-colors ${paymentMethod === "COD" ? 'border-black bg-stone-50' : 'border-gray-200'}`}>
                <RadioGroupItem value="COD" id="r3" />
                <Label htmlFor="r3" className="flex-1 text-sm tracking-wide cursor-pointer uppercase">Cash on Delivery (COD)</Label>
              </div>
            </RadioGroup>
            
            {paymentMethod === "UPI" && (
              <div className="mt-6 p-6 bg-stone-100 border border-stone-200 flex flex-col items-center text-center">
                <p className="text-sm font-light text-gray-600 mb-4">Scan QR or pay to UPI ID:</p>
                <div className="bg-white p-2 border border-gray-200 mb-4 inline-block">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=hmpmanish@ptyes&pn=GIFTORA&am=${total}&cu=INR`} 
                    alt="UPI QR Code" 
                    className="w-40 h-40"
                  />
                </div>
                <p className="text-xl font-heading tracking-wider mb-6 font-semibold select-all">hmpmanish@ptyes</p>
                
                <div className="w-full text-left space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-gray-500">12-Digit UTR / Reference No *</Label>
                  <Input 
                    placeholder="e.g. 312345678901" 
                    className="rounded-none h-12 bg-white text-center tracking-widest"
                    maxLength={12}
                    value={(form as any).getValues('upiUtr') || ''}
                    onChange={(e) => {
                      (form as any).setValue('upiUtr', e.target.value.replace(/\D/g, ''));
                    }}
                    required={paymentMethod === "UPI"}
                  />
                  <p className="text-xs text-gray-500 font-light mt-2">After paying, enter the 12-digit transaction reference number to confirm your order.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-stone-50 p-8 sticky top-24">
            <h2 className="font-heading uppercase tracking-widest text-lg border-b border-gray-200 pb-4 mb-6">Order Summary</h2>
            <div className="space-y-4 text-sm font-light mb-8">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>₹50</span>
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                <span className="font-heading uppercase tracking-widest">Total</span>
                <span className="text-lg font-medium">₹{total.toLocaleString()}</span>
              </div>
            </div>

            <Button type="submit" className="w-full h-14 rounded-none text-sm tracking-[0.2em] uppercase font-medium bg-black text-white hover:bg-gray-900 transition-colors" disabled={loading}>
              {loading ? "Processing..." : paymentMethod === "COD" ? "Place Order" : paymentMethod === "UPI" ? "Confirm Payment" : "Proceed to Pay"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
