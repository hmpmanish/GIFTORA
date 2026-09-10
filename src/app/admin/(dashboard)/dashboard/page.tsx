export const dynamic = "force-dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";
import prisma from "@/lib/prisma";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";

export default async function AdminDashboard() {
  const [userCount, orderCount, productCount, revenueAggregate, recentOrders, topProducts] = await Promise.all([
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.count(),
    prisma.product.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { notIn: ["CANCELLED", "REFUNDED", "RETURNED", "PENDING_PAYMENT"] } }
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } }
    }),
    prisma.product.findMany({
      take: 5,
      orderBy: { rating: "desc" }, // or whatever metric makes sense
      select: { id: true, name: true, price: true, rating: true, images: { take: 1, where: { isPrimary: true } } }
    })
  ]);

  const totalRevenue = revenueAggregate._sum.total || 0;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{orderCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent orders.</p>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-sm">{order.user?.name || "Guest"}</p>
                      <p className="text-xs text-muted-foreground">{order.user?.email || "No email"}</p>
                      <p className="text-xs text-muted-foreground">{format(order.createdAt, "MMM d, yyyy")}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{order.total.toLocaleString()}</p>
                      <Badge variant="outline" className="text-[10px] mt-1">{order.status}</Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 border-t pt-4">
              <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline">
                View all orders
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No products available.</p>
              ) : (
                topProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 border-b pb-2 last:border-0 last:pb-0">
                    <div className="h-12 w-12 bg-muted rounded-md overflow-hidden shrink-0">
                      {product.images[0] ? (
                        <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">No img</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">Rating: {product.rating.toFixed(1)} ⭐</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-medium text-sm">₹{product.price}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 border-t pt-4">
              <Link href="/admin/products" className="text-sm text-blue-600 hover:underline">
                View all products
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
