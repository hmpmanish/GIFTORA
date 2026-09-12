"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, CreditCard, Lock } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";

export default function PaymentGatewayPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!orderId || !amount) {
      router.push("/shop");
    }
  }, [orderId, amount, router]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate bank processing delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      const res = await fetch("/api/payments/custom-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/order-success?orderId=${orderId}`);
        }, 1500);
      } else {
        alert("Payment failed on the server.");
        setLoading(false);
      }
    } catch (error) {
      alert("Network error.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <AnimatedSection direction="up" className="bg-white p-12 rounded-[2rem] shadow-2xl flex flex-col items-center text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h1>
          <p className="text-slate-500 mb-6">Redirecting you to the order success page...</p>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full animate-[progress_1.5s_ease-in-out_forwards]"></div>
          </div>
        </AnimatedSection>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-20 p-4">
      <div className="mb-8 flex items-center gap-2 text-slate-800">
        <Lock className="w-6 h-6" />
        <span className="text-xl font-bold tracking-widest uppercase">Secure Checkout</span>
      </div>

      <AnimatedSection direction="up" className="w-full max-w-md">
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
          <div className="bg-slate-900 text-white p-8 flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider">Amount to Pay</p>
              <p className="text-3xl font-bold">₹{amount?.toLocaleString()}</p>
            </div>
            <CreditCard className="w-12 h-12 text-slate-700" />
          </div>

          <form onSubmit={handlePayment} className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-slate-500">Card Number</Label>
                <Input 
                  placeholder="0000 0000 0000 0000" 
                  className="h-12 text-lg tracking-widest font-mono"
                  required
                  maxLength={19}
                  defaultValue="4111 1111 1111 1111"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-slate-500">Expiry (MM/YY)</Label>
                  <Input 
                    placeholder="12/26" 
                    className="h-12 text-lg text-center font-mono"
                    required
                    maxLength={5}
                    defaultValue="12/28"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-slate-500">CVV</Label>
                  <Input 
                    placeholder="123" 
                    type="password"
                    className="h-12 text-lg text-center font-mono"
                    required
                    maxLength={3}
                    defaultValue="123"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-slate-500">Cardholder Name</Label>
                <Input 
                  placeholder="John Doe" 
                  className="h-12 uppercase"
                  required
                  defaultValue="MOCK USER"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-bold uppercase tracking-widest rounded-full transition-all"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : (
                `Pay ₹${amount}`
              )}
            </Button>
            
            <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4" /> This is a secure mock payment gateway for testing.
            </p>
          </form>
        </div>
      </AnimatedSection>
    </div>
  );
}
