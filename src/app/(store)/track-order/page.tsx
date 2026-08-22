"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Package, Truck, CheckCircle } from "lucide-react";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;

    setLoading(true);
    setError("");
    setOrderData(null);

    try {
      // In a real app, we would fetch from API
      // e.g., const res = await fetch(`/api/orders/track?id=${orderId}`)
      
      // Simulating API call for UI
      setTimeout(() => {
        if (orderId.startsWith("GFT")) {
          setOrderData({
            orderNumber: orderId,
            status: "SHIPPED",
            date: new Date().toLocaleDateString(),
            trackingId: "AWB123456789",
            courier: "Delhivery",
            estimatedDelivery: "24 Aug 2026",
            history: [
              { status: "ORDER_PLACED", date: "22 Aug 2026, 10:00 AM", done: true },
              { status: "PROCESSING", date: "22 Aug 2026, 11:30 AM", done: true },
              { status: "SHIPPED", date: "22 Aug 2026, 05:00 PM", done: true },
              { status: "OUT_FOR_DELIVERY", date: "", done: false },
              { status: "DELIVERED", date: "", done: false },
            ]
          });
        } else {
          setError("Invalid Order ID. Please check and try again.");
        }
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl min-h-[70vh]">
      <h1 className="text-3xl font-bold mb-8 text-center">Track Your Order</h1>

      <Card className="mb-10">
        <CardContent className="p-6">
          <form onSubmit={handleTrack} className="flex gap-4">
            <Input 
              placeholder="Enter Order ID (e.g. GFT-2026-123456)" 
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !orderId}>
              {loading ? "Tracking..." : <><Search className="h-4 w-4 mr-2" /> Track</>}
            </Button>
          </form>
          {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
        </CardContent>
      </Card>

      {orderData && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Order #{orderData.orderNumber}</span>
                <span className="text-sm font-normal text-muted-foreground">Placed on {orderData.date}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between mb-8 p-4 bg-slate-50 rounded-lg border">
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                  <p className="font-semibold text-lg">{orderData.estimatedDelivery}</p>
                </div>
                {orderData.trackingId ? (
                  <div className="mt-4 md:mt-0">
                    <p className="text-sm text-muted-foreground">Courier & Tracking ID</p>
                    <p className="font-semibold">{orderData.courier} - {orderData.trackingId}</p>
                  </div>
                ) : (
                  <div className="mt-4 md:mt-0 flex items-center text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded">
                    Tracking will become available after your order is shipped.
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="relative pl-8 space-y-8 before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {orderData.history.map((step: any, index: number) => {
                  const Icon = step.status === "ORDER_PLACED" ? Package : 
                               step.status === "DELIVERED" ? CheckCircle : Truck;
                  
                  return (
                    <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow ${
                        step.done ? 'bg-primary text-white' : 'bg-slate-200 text-slate-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      
                      <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg shadow-sm border ${
                        step.done ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100 opacity-60'
                      }`}>
                        <h3 className="font-bold text-slate-900">{step.status.replace(/_/g, " ")}</h3>
                        {step.date && <p className="text-sm text-muted-foreground">{step.date}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
