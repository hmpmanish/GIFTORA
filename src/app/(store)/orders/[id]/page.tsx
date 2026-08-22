import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { Package, Truck, CheckCircle2, ChevronLeft, CreditCard, MapPin, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Order Details | GIFTORA",
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/orders");
  }
  
  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  const order = await prisma.order.findUnique({
    where: { 
      id: orderId,
      userId: (session.user as any).id, // Security: Ensure user can only view their own orders
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: {
                where: { isPrimary: true },
                take: 1,
              },
            },
          },
        },
      },
      payment: true,
      address: true,
      shipments: true,
    },
  });

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-muted-foreground mb-8">The order you are looking for does not exist or you do not have permission to view it.</p>
        <Link href="/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED": return "bg-green-100 text-green-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      case "SHIPPED": return "bg-blue-100 text-blue-800";
      case "OUT_FOR_DELIVERY": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const timelineSteps = [
    { status: "ORDER_PLACED", label: "Order Placed" },
    { status: "CONFIRMED", label: "Confirmed" },
    { status: "PROCESSING", label: "Processing" },
    { status: "SHIPPED", label: "Shipped" },
    { status: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
    { status: "DELIVERED", label: "Delivered" },
  ];

  const currentStatusIndex = timelineSteps.findIndex(s => s.status === order.status);
  
  // Handle statuses that aren't directly in the normal flow (like cancelled, returned)
  const isCancelled = order.status === "CANCELLED";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/orders" className="text-sm text-muted-foreground hover:text-primary flex items-center w-fit">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Orders
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Order #{order.orderNumber}</h1>
          <p className="text-muted-foreground text-sm mt-1">Placed on {format(order.createdAt, "dd MMM yyyy, h:mm a")}</p>
        </div>
        <div className="flex gap-2">
          {order.shipments && order.shipments.length > 0 && order.shipments[0].trackingId && (
            <Link href={`/track-order?id=${order.orderNumber}`}>
              <Button variant="outline">
                <Truck className="mr-2 h-4 w-4" /> Track Order
              </Button>
            </Link>
          )}
          <Badge className={getStatusColor(order.status)} variant="outline">
            {order.status.replace(/_/g, " ")}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Timeline / Progress */}
          {!isCancelled && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Progress Bar Background */}
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 z-0 hidden sm:block"></div>
                  
                  {/* Active Progress Bar */}
                  <div 
                    className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 hidden sm:block transition-all"
                    style={{ width: `${(Math.max(0, currentStatusIndex) / (timelineSteps.length - 1)) * 100}%` }}
                  ></div>

                  <div className="flex flex-col sm:flex-row justify-between relative z-10 gap-6 sm:gap-0">
                    {timelineSteps.map((step, index) => {
                      const isCompleted = currentStatusIndex >= index;
                      const isCurrent = currentStatusIndex === index;
                      
                      return (
                        <div key={step.status} className="flex sm:flex-col items-center gap-4 sm:gap-2">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          }`}>
                            {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <div className="h-3 w-3 rounded-full bg-current opacity-50" />}
                          </div>
                          <span className={`text-sm font-medium ${isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Items in your order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="h-20 w-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                    {item.product.images[0] ? (
                      <img 
                        src={item.product.images[0].url} 
                        alt={item.product.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground">
                        <Package className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-medium text-foreground line-clamp-2">
                        <Link href={`/products/${item.product.slug}`} className="hover:underline">
                          {item.product.name}
                        </Link>
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-medium">
                      ₹{item.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Receipt className="h-5 w-5" /> Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.shipping === 0 ? "Free" : `₹${order.shipping.toFixed(2)}`}</span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>₹{order.tax.toFixed(2)}</span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
                  <span>-₹{order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5" /> Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method</span>
                <span className="font-medium">{order.payment?.method || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={order.payment?.status === "SUCCESS" ? "default" : "secondary"}>
                  {order.payment?.status || "PENDING"}
                </Badge>
              </div>
              {order.payment?.transactionId && (
                <div className="flex flex-col mt-2 pt-2 border-t">
                  <span className="text-muted-foreground text-xs mb-1">Transaction ID</span>
                  <span className="font-mono text-xs break-all">{order.payment.transactionId}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1 text-muted-foreground">
              <p className="font-medium text-foreground">{order.address.fullName}</p>
              <p>{order.address.houseFlat}, {order.address.street}</p>
              {order.address.landmark && <p>{order.address.landmark}</p>}
              <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
              <p className="pt-2 flex items-center gap-2">
                <span className="font-medium">Phone:</span> {order.address.mobile}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
