import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-[70vh] flex-col items-center justify-center space-y-6 px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-7xl font-extrabold text-slate-200">404</h1>
        <h2 className="text-2xl font-bold tracking-tight">Gift Not Found</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps you just mistyped the URL.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link href="/">
          <Button size="lg" className="w-full sm:w-auto">
            Return Home
          </Button>
        </Link>
        <Link href="/shop">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            <Search className="mr-2 h-4 w-4" />
            Browse Shop
          </Button>
        </Link>
      </div>
    </div>
  );
}
