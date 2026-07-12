import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FiPackage } from "react-icons/fi";
import { AppShell } from "@/components/layout/AppShell";
import { OrderCard, type Order } from "@/components/food/OrderCard";
import { LoadingCards } from "@/components/common/Loading";
import { EmptyState, ErrorState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { orderApi } from "@/services/api";

export const Route = createFileRoute("/orders")({ component: OrdersPage });

function OrdersPage() {
  const orders = useQuery<Order[]>({ queryKey: ["orders"], queryFn: () => orderApi.list() });

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold">My Orders</h1>
        <p className="mt-1 text-muted-foreground">Track your recent and past orders.</p>

        <div className="mt-8">
          {orders.isPending ? <LoadingCards count={3} /> : orders.isError ? <ErrorState onRetry={() => orders.refetch()} /> : orders.data?.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {orders.data.map((o) => <OrderCard key={o.id} order={o} />)}
            </div>
          ) : (
            <EmptyState
              icon={<FiPackage />}
              title="No orders yet"
              description="When you place an order it'll show up here."
              action={<Button asChild><Link to="/menu">Start ordering</Link></Button>}
            />
          )}
        </div>
      </div>
    </AppShell>
  );
}