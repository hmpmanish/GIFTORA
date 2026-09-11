"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";

export default function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [discountType, setDiscountType] = useState("PERCENTAGE");
  const [coupon, setCoupon] = useState<any>(null);

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const res = await fetch(`/api/admin/coupons/${id}`);
        if (res.ok) {
          const data = await res.json();
          setCoupon(data.coupon);
          setIsActive(data.coupon.isActive);
          setDiscountType(data.coupon.discountType);
        } else {
          router.push("/admin/coupons");
        }
      } catch (error) {
        console.error(error);
        router.push("/admin/coupons");
      } finally {
        setFetching(false);
      }
    };
    fetchCoupon();
  }, [id, router]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      code: formData.get("code") as string,
      discountType,
      discountValue: Number(formData.get("discountValue")),
      minOrderAmount: formData.get("minOrderAmount") ? Number(formData.get("minOrderAmount")) : null,
      maxDiscount: formData.get("maxDiscount") ? Number(formData.get("maxDiscount")) : null,
      startDate: formData.get("startDate") as string || null,
      expiryDate: formData.get("expiryDate") as string || null,
      usageLimit: formData.get("usageLimit") ? Number(formData.get("usageLimit")) : null,
      perUserLimit: formData.get("perUserLimit") ? Number(formData.get("perUserLimit")) : null,
      isActive,
    };

    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/admin/coupons");
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to update coupon");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().slice(0, 16);
  };

  if (fetching) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/coupons">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Coupon</h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code</Label>
                <Input id="code" name="code" defaultValue={coupon?.code} required placeholder="SUMMER50" className="uppercase" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type</Label>
                <Select value={discountType} onValueChange={(val) => setDiscountType(val as string)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                    <SelectItem value="FIXED">Fixed Amount (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountValue">Discount Value</Label>
                <Input id="discountValue" name="discountValue" defaultValue={coupon?.discountValue} type="number" step="0.01" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxDiscount">Maximum Discount (₹)</Label>
                <Input id="maxDiscount" name="maxDiscount" defaultValue={coupon?.maxDiscount || ""} type="number" step="0.01" placeholder="Optional" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minOrderAmount">Minimum Order Amount (₹)</Label>
              <Input id="minOrderAmount" name="minOrderAmount" defaultValue={coupon?.minOrderAmount || ""} type="number" step="0.01" placeholder="Optional" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Limits & Validity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" name="startDate" defaultValue={formatDateForInput(coupon?.startDate)} type="datetime-local" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input id="expiryDate" name="expiryDate" defaultValue={formatDateForInput(coupon?.expiryDate)} type="datetime-local" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="usageLimit">Total Usage Limit</Label>
                <Input id="usageLimit" name="usageLimit" defaultValue={coupon?.usageLimit || ""} type="number" placeholder="Optional" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="perUserLimit">Per User Limit</Label>
                <Input id="perUserLimit" name="perUserLimit" defaultValue={coupon?.perUserLimit || ""} type="number" placeholder="Optional" />
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-4">
              <Checkbox 
                id="isActive" 
                checked={isActive} 
                onCheckedChange={(checked) => setIsActive(checked as boolean)} 
              />
              <Label htmlFor="isActive" className="cursor-pointer">Active</Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/admin/coupons">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
