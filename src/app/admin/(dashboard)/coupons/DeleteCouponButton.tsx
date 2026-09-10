"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DeleteCouponButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to delete coupon");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="icon" 
      className="text-red-500 hover:text-red-600"
      onClick={handleDelete}
      disabled={loading}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
