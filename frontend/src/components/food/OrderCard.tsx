import { Link } from "@tanstack/react-router";
import { formatCurrency, formatDate, statusClass } from "@/lib/format";
import { FiArrowRight } from "react-icons/fi";

export interface Order {
  id: string | number;
  status: string;
  total?: number;
  total_amount?: number;
  created_at?: string;
  items?: Array<{ name?: string; quantity?: number }>;
  customer_name?: string;
}

export function OrderCard({ order }: { order: Order }) {
  const total = order.total ?? order.total_amount ?? 0;
  return (
    <Link
      to="/order/$id"
      params={{ id: String(order.id) }}
      className="hover-lift block rounded-2xl border border-border bg-card p-5 shadow-card-soft"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Order #{order.id}
          </div>
          <div className="mt-1 font-display text-lg font-semibold">
            {formatCurrency(total)}
          </div>
          {order.customer_name && (
            <div className="text-xs text-muted-foreground">{order.customer_name}</div>
          )}
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(order.status)}`}>
          {(order.status || "PENDING").replace(/_/g, " ")}
        </span>
      </div>
      <div className="mt-3 text-sm text-muted-foreground">
        {order.items?.length
          ? `${order.items.length} item${order.items.length > 1 ? "s" : ""} · ${order.items
              .slice(0, 2)
              .map((i) => i.name)
              .filter(Boolean)
              .join(", ")}${order.items.length > 2 ? "…" : ""}`
          : "—"}
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatDate(order.created_at)}</span>
        <span className="inline-flex items-center gap-1 font-medium text-primary">
          View <FiArrowRight />
        </span>
      </div>
    </Link>
  );
}