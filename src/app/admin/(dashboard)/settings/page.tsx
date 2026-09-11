import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Settings | Admin Dashboard",
};

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "STAFF")) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Settings</CardTitle>
          <CardDescription>
            Configuration options for your store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center text-muted-foreground">
            <h3 className="text-lg font-medium mb-2">Settings module is under construction</h3>
            <p>Check back later for updates.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
