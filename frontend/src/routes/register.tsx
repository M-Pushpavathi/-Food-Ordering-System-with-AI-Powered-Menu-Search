import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { FiUser, FiMail, FiLock, FiUserPlus } from "react-icons/fi";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/services/api";
import { Spinner } from "@/components/common/Loading";

export const Route = createFileRoute("/register")({ component: RegisterPage });

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authApi.register({ ...form, role: "CUSTOMER" });
      const token = data.token ?? data.access_token;
      if (token) {
        const role = (data.role ?? "CUSTOMER").toString().toUpperCase();
        login({ token, role, name: data.name ?? form.name });
        toast.success("Account created — welcome!");
        navigate({ to: "/home" });
      } else {
        toast.success("Account created. Please sign in.");
        navigate({ to: "/login" });
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
        ?? (err as Error).message
        ?? "Registration failed";
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
              <FiUserPlus className="h-5 w-5" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-bold">Create your account</h1>
            <p className="mt-1 text-sm text-muted-foreground">Join Saffron.ai and start ordering</p>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField id="name" label="Full name" icon={<FiUser />} value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <FormField id="email" label="Email" type="email" icon={<FiMail />} value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <FormField id="password" label="Password" type="password" icon={<FiLock />} value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? <Spinner className="h-4 w-4" /> : <FiUserPlus />} Create account
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </AppShell>
  );
}

function FormField({ id, label, icon, value, onChange, type = "text" }: { id: string; label: string; icon: React.ReactNode; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
        <Input id={id} type={type} required value={value} onChange={(e) => onChange(e.target.value)} className="pl-9" />
      </div>
    </div>
  );
}