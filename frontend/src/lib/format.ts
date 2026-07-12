export function formatCurrency(value: number | string | undefined | null): string {
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (n == null || Number.isNaN(n)) return "₹0";
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export function formatDate(value: string | Date | undefined | null): string {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
  CONFIRMED: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
  PREPARING: "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30",
  OUT_FOR_DELIVERY: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
  DELIVERED: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  CANCELLED: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30",
};

export function statusClass(status?: string) {
  const key = (status || "PENDING").toUpperCase();
  return STATUS_COLORS[key] ?? "bg-muted text-muted-foreground border-border";
}