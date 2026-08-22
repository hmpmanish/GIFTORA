import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Customers | Admin Dashboard",
};

export default async function AdminCustomersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/admin/login");
  }

  const customers = await prisma.user.findMany({
    where: {
      role: "CUSTOMER"
    },
    include: {
      _count: {
        select: { orders: true }
      },
      orders: {
        select: { total: true },
      }
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
          <CardDescription>
            Manage your store's registered customers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No customers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer) => {
                    const totalSpent = customer.orders.reduce((sum, order) => sum + order.total, 0);
                    
                    return (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name || "N/A"}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.phone || "N/A"}</TableCell>
                        <TableCell>{format(customer.createdAt, "dd MMM yyyy")}</TableCell>
                        <TableCell className="text-right">{customer._count.orders}</TableCell>
                        <TableCell className="text-right">₹{totalSpent.toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={customer.emailVerified ? "default" : "secondary"}>
                            {customer.emailVerified ? "Verified" : "Unverified"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
