import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  FiDollarSign,
  FiShoppingCart,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";

import { AppShell } from "@/components/layout/AppShell";
import { dashboardApi } from "@/services/api";
import { LoadingPage } from "@/components/common/Loading";
import { ErrorState } from "@/components/common/EmptyState";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin-dashboard")({
  component: AdminDashboard,
});

interface Summary {
  total_orders: number;
  total_revenue: number;
  placed: number;
  confirmed: number;
  preparing: number;
  ready: number;
  picked_up: number;
}

function AdminDashboard() {
  const summary = useQuery<Summary>({
    queryKey: ["dashboard-summary"],
    queryFn: dashboardApi.summary,
  });

  if (summary.isPending)
    return (
      <AppShell>
        <LoadingPage />
      </AppShell>
    );

  if (summary.isError)
    return (
      <AppShell>
        <ErrorState onRetry={() => summary.refetch()} />
      </AppShell>
    );

  const data = summary.data!;

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-10">

        <h1 className="text-4xl font-bold mb-8">
          Admin Dashboard
        </h1>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <Card
            title="Revenue"
            value={formatCurrency(data.total_revenue)}
            icon={<FiDollarSign size={30} />}
          />

          <Card
            title="Orders"
            value={data.total_orders}
            icon={<FiShoppingCart size={30} />}
          />

          <Card
            title="Preparing"
            value={data.preparing}
            icon={<FiClock size={30} />}
          />

          <Card
            title="Completed"
            value={data.picked_up}
            icon={<FiCheckCircle size={30} />}
          />

        </div>

        <div className="grid gap-4 mt-10 md:grid-cols-2">

          <Button asChild size="lg">
            <Link to="/admin/orders">
              Manage Orders
            </Link>
          </Button>

          <Button asChild size="lg" variant="outline">
            <Link to="/admin/menu">
              Manage Menu
            </Link>
          </Button>

        </div>

      </div>
    </AppShell>
  );
}

function Card({
  title,
  value,
  icon,
}: {
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-card-soft">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            {value}
          </h2>

        </div>

        {icon}

      </div>

    </div>
  );
}