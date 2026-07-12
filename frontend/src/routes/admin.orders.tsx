import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { OrderCard, type Order } from "@/components/food/OrderCard";
import { LoadingCards } from "@/components/common/Loading";
import { EmptyState, ErrorState } from "@/components/common/EmptyState";
import { orderApi } from "@/services/api";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dashboardApi } from "@/services/api";
const TABS = ["ALL", "PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"] as const;

export const Route = createFileRoute("/admin/orders")({ component: OrderManagement });

function OrderManagement() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("ALL");
 const orders = useQuery<Order[]>({
  queryKey: ["dashboard-orders"],
  queryFn: () => dashboardApi.orders(),
});
  const filtered = useMemo(() => (orders.data ?? []).filter((o) => tab === "ALL" || (o.status || "").toUpperCase() === tab), [orders.data, tab]);

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">Admin</span>
        <h1 className="mt-1 font-display text-4xl font-bold">Orders</h1>

        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="mt-8">
          <TabsList className="flex flex-wrap">
            {TABS.map((t) => <TabsTrigger key={t} value={t}>{t.replace(/_/g, " ")}</TabsTrigger>)}
          </TabsList>
        </Tabs>

        <div className="mt-6">
          {orders.isPending ? <LoadingCards count={6} /> : orders.isError ? <ErrorState onRetry={() => orders.refetch()} /> : filtered.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((o) => <OrderCard key={o.id} order={o} />)}
            </div>
          ) : <EmptyState title="No orders in this status" />}
        </div>
      </div>
    </AppShell>
  );
}