"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/profile";
  const ref = searchParams.get("ref");
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, ref }),
      });

      if (res.ok) {
        // Redirect to login after successful registration
        router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}&registered=true`);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to register");
      }
    } catch (err) {
      setError("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <ShieldCheck className="w-8 h-8 text-accent" />
          <span className="text-3xl font-bold tracking-tight text-primary">GIFTORA</span>
        </Link>
        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Or{" "}
          <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-medium text-accent hover:text-blue-700">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            <div>
              <Label htmlFor="name">Full Name</Label>
              <div className="mt-1">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                />
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full h-11 bg-primary text-white hover:bg-slate-800" disabled={loading}>
                {loading ? "Creating account..." : "Register"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
