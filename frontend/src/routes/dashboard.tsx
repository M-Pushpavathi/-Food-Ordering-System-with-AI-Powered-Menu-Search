import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FiDollarSign, FiShoppingBag, FiTrendingUp, FiClock, FiStar } from "react-icons/fi";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardCard } from "@/components/food/DashboardCard";
import { OrderCard, type Order } from "@/components/food/OrderCard";
import { LoadingCards } from "@/components/common/Loading";
import { EmptyState, ErrorState } from "@/components/common/EmptyState";
import { dashboardApi } from "@/services/api";
import { formatCurrency } from "@/lib/format";

interface Summary {
  revenue?: number;
  today_orders?: number;
  total_orders?: number;
  pending?: number;
  orders_by_status?: Record<string, number>;
  popular_items?: Array<{ id?: string | number; name: string; count?: number; orders?: number }>;
}

export const Route = createFileRoute("/dashboard")({ component: AdminDashboard });

function AdminDashboard() {
  const summary = useQuery<Summary>({ queryKey: ["dashboard-summary"], queryFn: () => dashboardApi.summary() });
  const recent = useQuery<Order[]>({ queryKey: ["dashboard-orders"], queryFn: () => dashboardApi.orders() });

  const s = summary.data ?? {};
  const byStatus = s.orders_by_status ?? {};

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Admin</span>
          <h1 className="mt-1 font-display text-4xl font-bold">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Live overview of your restaurant operations.</p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard label="Revenue" value={formatCurrency(s.revenue ?? 0)} icon={<FiDollarSign />} hint="All time" />
          <DashboardCard label="Today's Orders" value={s.today_orders ?? 0} icon={<FiShoppingBag />} accent="accent" />
          <DashboardCard label="Total Orders" value={s.total_orders ?? 0} icon={<FiTrendingUp />} accent="emerald" />
          <DashboardCard label="Pending" value={s.pending ?? byStatus.PENDING ?? 0} icon={<FiClock />} accent="amber" />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <section>
            <h2 className="font-display text-2xl font-semibold">Recent Orders</h2>
            <div className="mt-4">
              {recent.isPending ? <LoadingCards count={3} /> : recent.isError ? <ErrorState onRetry={() => recent.refetch()} /> : recent.data?.length ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {recent.data.slice(0, 6).map((o) => <OrderCard key={o.id} order={o} />)}
                </div>
              ) : <EmptyState title="No orders yet" />}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card-soft">
              <h3 className="font-display text-lg font-semibold">Orders by Status</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {Object.keys(byStatus).length ? Object.entries(byStatus).map(([k, v]) => (
                  <li key={k} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{k.replace(/_/g, " ")}</span>
                    <span className="font-semibold">{v}</span>
                  </li>
                )) : <li className="text-sm text-muted-foreground">No data</li>}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card-soft">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
                <FiStar className="text-primary" /> Popular Items
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                {s.popular_items?.length ? s.popular_items.slice(0, 5).map((p, i) => (
                  <li key={p.id ?? i} className="flex items-center justify-between">
                    <span>{p.name}</span>
                    <span className="text-muted-foreground">{p.count ?? p.orders ?? 0} orders</span>
                  </li>
                )) : <li className="text-sm text-muted-foreground">No data</li>}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}