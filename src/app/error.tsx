"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // We can log the error to an error reporting service here
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="flex h-[70vh] flex-col items-center justify-center space-y-6 px-4 text-center">
      <div className="rounded-full bg-red-100 p-4">
        <AlertCircle className="h-10 w-10 text-red-600" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Oops! Something went wrong.</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          We encountered an unexpected issue while loading this page. Our team has been notified.
        </p>
      </div>
      <div className="flex gap-4">
        <Button onClick={() => reset()} size="lg">
          Try again
        </Button>
        <Button variant="outline" onClick={() => window.location.href = '/'} size="lg">
          Return Home
        </Button>
      </div>
    </div>
  );
}
