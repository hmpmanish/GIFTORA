import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { Package, Eye, ChevronRight, User, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Orders | GIFTORA",
};

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/orders");
  }

  const orders = await prisma.order.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: "desc" },
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
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED": return "bg-green-100 text-green-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      case "SHIPPED": return "bg-blue-100 text-blue-800";
      case "OUT_FOR_DELIVERY": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 flex flex-col gap-2">
              <Link href="/profile">
                <Button variant="ghost" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </Button>
              </Link>
              <Link href="/orders">
                <Button variant="default" className="w-full justify-start">
                  <Package className="mr-2 h-4 w-4" />
                  My Orders
                </Button>
              </Link>
              <Link href="/profile/addresses">
                <Button variant="ghost" className="w-full justify-start">
                  <MapPin className="mr-2 h-4 w-4" />
                  My Addresses
                </Button>
              </Link>
              <Link href="/wishlist">
                <Button variant="ghost" className="w-full justify-start">
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <h1 className="text-2xl font-bold tracking-tight mb-6">Order History</h1>

          {orders.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-lg font-medium">No Orders Found</h3>
                <p className="text-muted-foreground mt-2">You haven't placed any orders yet.</p>
                <Link href="/shop">
                  <Button className="mt-6">Start Shopping</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <div className="bg-muted/50 px-6 py-4 border-b flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order Placed</p>
                      <p className="font-medium">{format(order.createdAt, "dd MMM yyyy")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="font-medium">₹{order.total.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Order #</p>
                      <p className="font-medium">{order.orderNumber}</p>
                    </div>
                    <div>
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          View Details <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <Badge className={getStatusColor(order.status)} variant="outline">
                        {order.status.replace(/_/g, " ")}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {order.items.length} {order.items.length === 1 ? "Item" : "Items"}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div className="h-16 w-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
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
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-foreground truncate">{item.product.name}</h4>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-sm font-medium">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
