"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
        body: JSON.stringify({ address: data, paymentMethod, items: cartItems }),
      });

      if (!res.ok) {
        throw new Error("Failed to create order");
      }

      const orderData = await res.json();

      if (paymentMethod === "COD") {
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input {...form.register("fullName")} />
                  {form.formState.errors.fullName && <p className="text-xs text-red-500">{form.formState.errors.fullName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Mobile Number</Label>
                  <Input {...form.register("mobile")} />
                  {form.formState.errors.mobile && <p className="text-xs text-red-500">{form.formState.errors.mobile.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label>House / Flat No.</Label>
                <Input {...form.register("houseFlat")} />
                {form.formState.errors.houseFlat && <p className="text-xs text-red-500">{form.formState.errors.houseFlat.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Street / Area</Label>
                <Input {...form.register("street")} />
                {form.formState.errors.street && <p className="text-xs text-red-500">{form.formState.errors.street.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Landmark (Optional)</Label>
                <Input {...form.register("landmark")} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input {...form.register("city")} />
                  {form.formState.errors.city && <p className="text-xs text-red-500">{form.formState.errors.city.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input {...form.register("state")} />
                  {form.formState.errors.state && <p className="text-xs text-red-500">{form.formState.errors.state.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Pincode</Label>
                  <Input {...form.register("pincode")} />
                  {form.formState.errors.pincode && <p className="text-xs text-red-500">{form.formState.errors.pincode.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 border p-4 rounded-md mb-2">
                  <RadioGroupItem value="RAZORPAY" id="r1" />
                  <Label htmlFor="r1" className="flex-1 font-medium cursor-pointer">Pay Online (UPI, Cards, NetBanking)</Label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-md">
                  <RadioGroupItem value="COD" id="r2" />
                  <Label htmlFor="r2" className="flex-1 font-medium cursor-pointer">Cash on Delivery (COD)</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">₹50</span>
                </div>
                <div className="pt-3 border-t flex justify-between items-center">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-xl">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-lg" size="lg" disabled={loading}>
                {loading ? "Processing..." : paymentMethod === "COD" ? "Place Order" : "Proceed to Pay"}
              </Button>
              {paymentMethod === "RAZORPAY" && (
                <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
              )}
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
