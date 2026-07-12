import type { ReactNode } from "react";

export function DashboardCard({
  label,
  value,
  icon,
  hint,
  accent = "primary",
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  hint?: string;
  accent?: "primary" | "accent" | "amber" | "emerald";
}) {
  const accentMap = {
    primary: "from-primary/20 to-primary-glow/10 text-primary",
    accent: "from-accent/20 to-accent/5 text-accent",
    amber: "from-amber-500/20 to-amber-500/5 text-amber-600",
    emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-600",
  } as const;
  return (
    <div className="hover-lift rounded-2xl border border-border bg-card p-6 shadow-card-soft">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          <div className="mt-2 font-display text-3xl font-bold">{value}</div>
          {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
        </div>
        {icon && (
          <div className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br text-xl ${accentMap[accent]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}