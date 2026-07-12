import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/services/api";
import { Spinner } from "@/components/common/Loading";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({ role: (s.role as string) || "" }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { role: roleHint } = useSearch({ from: "/login" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authApi.login({ email, password });
      const token = data.token ?? data.access_token;
      const role = (data.role ?? data.user?.role ?? "CUSTOMER").toString().toUpperCase();
      const name = data.name ?? data.user?.name ?? email.split("@")[0];
      if (!token) throw new Error("Invalid response from server");
      login({ token, role, name });
      toast.success(`Welcome back, ${name}!`);
      navigate({ to: role === "ADMIN" ? "/dashboard" : "/home" });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
        ?? (err as Error).message
        ?? "Login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-md place-items-center px-4 py-16">
        <div className="w-full animate-scale-in rounded-3xl border border-border bg-card p-8 shadow-elegant">
          <div className="mb-6 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl gradient-primary text-primary-foreground">
              <FiLogIn className="h-5 w-5" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-bold">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {roleHint === "admin" ? "Sign in to your admin dashboard" : "Sign in to continue ordering"}
            </p>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <FiMail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-9" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-9" />
              </div>
            </div>
            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? <Spinner className="h-4 w-4" /> : <FiLogIn />} Sign in
            </Button>
          </form>
          {roleHint !== "admin" && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              New here?{" "}
              <Link to="/register" className="font-semibold text-primary hover:underline">
                Create an account
              </Link>
            </p>
          )}
        </div>
      </div>
    </AppShell>
  );
}