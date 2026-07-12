import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { FiUser, FiMail, FiShield, FiLogOut } from "react-icons/fi";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-elegant">
          <div className="flex items-center gap-5">
            <div className="grid h-20 w-20 place-items-center rounded-2xl gradient-primary text-3xl font-bold text-primary-foreground">
              {user.name.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold">{user.name}</h1>
              <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-0.5 text-xs font-semibold text-primary">
                <FiShield /> {user.role}
              </span>
            </div>
          </div>

          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            <InfoRow icon={<FiUser />} label="Name" value={user.name} />
            <InfoRow icon={<FiShield />} label="Role" value={user.role} />
            <InfoRow icon={<FiMail />} label="Session" value="Active" />
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to={user.role === "ADMIN" ? "/dashboard" : "/home"}>
                {user.role === "ADMIN" ? "Go to Dashboard" : "Go to Home"}
              </Link>
            </Button>
            <Button variant="destructive" className="gap-2" onClick={() => { logout(); navigate({ to: "/" }); }}>
              <FiLogOut /> Logout
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background/50 p-4">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </div>
      <div className="mt-1 font-display text-lg font-semibold">{value}</div>
    </div>
  );
}