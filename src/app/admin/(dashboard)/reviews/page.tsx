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
import { Star } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Reviews | Admin Dashboard",
};

export default async function AdminReviewsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/admin/login");
  }

  const reviews = await prisma.review.findMany({
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
          <CardDescription>
            Moderate product reviews.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No reviews found.
                    </TableCell>
                  </TableRow>
                ) : (
                  reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {review.product.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{review.user.name || "Anonymous"}</span>
                          <span className="text-xs text-muted-foreground">{review.user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-amber-500">
                          {review.rating} <Star className="h-3 w-3 ml-1 fill-current" />
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {review.comment || <span className="text-muted-foreground italic">No comment</span>}
                      </TableCell>
                      <TableCell>{format(review.createdAt, "dd MMM yyyy")}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={
                          review.status === "APPROVED" ? "default" :
                          review.status === "REJECTED" ? "destructive" : "secondary"
                        }>
                          {review.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
