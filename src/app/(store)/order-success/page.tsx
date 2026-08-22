import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage({ searchParams }: { searchParams: { orderId?: string } }) {
  const orderId = searchParams.orderId;

  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <CheckCircle className="h-24 w-24 text-green-500 mb-6" />
      <h1 className="text-4xl font-bold mb-4">Order Placed Successfully!</h1>
      <p className="text-lg text-muted-foreground mb-2">
        Thank you for shopping with GIFTORA.
      </p>
      {orderId && (
        <p className="text-muted-foreground mb-8">
          Your order reference ID is <span className="font-mono font-medium text-foreground">{orderId}</span>
        </p>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <Link href={`/track-order${orderId ? `?id=${orderId}` : ''}`}>
          <Button size="lg" className="w-full sm:w-auto">Track Order</Button>
        </Link>
        <Link href="/shop">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
