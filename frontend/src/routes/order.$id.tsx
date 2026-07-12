import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FiArrowLeft } from "react-icons/fi";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { LoadingPage } from "@/components/common/Loading";
import { ErrorState } from "@/components/common/EmptyState";
import { orderApi } from "@/services/api";
import { formatCurrency, formatDate, statusClass } from "@/lib/format";
import { useAuth } from "@/context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface OrderDetail {
  id: number;
  status: string;
  total_amount: number;
  created_at: string;
  items: OrderItem[];
}

const STATUSES = [
  "PLACED",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "PICKED_UP",
];

export const Route = createFileRoute("/order/$id")({
  component: OrderDetailPage,
});

function OrderDetailPage() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const { isAdmin } = useAuth();

  const order = useQuery<OrderDetail>({
    queryKey: ["order", id],
    queryFn: () => orderApi.get(id),
  });

  const updateStatus = useMutation({
    mutationFn: (status: string) => orderApi.updateStatus(id, status),

    onSuccess: () => {
      toast.success("Order status updated");
      qc.invalidateQueries({ queryKey: ["order", id] });
      qc.invalidateQueries({ queryKey: ["orders"] });
    },

    onError: () => {
      toast.error("Failed to update status");
    },
  });

  if (order.isPending) {
    return (
      <AppShell>
        <LoadingPage />
      </AppShell>
    );
  }

  if (order.isError || !order.data) {
    return (
      <AppShell>
        <ErrorState onRetry={() => order.refetch()} />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-10">

        <Link
          to="/orders"
          className="mb-6 inline-flex items-center gap-2 text-primary"
        >
          <FiArrowLeft />
          Back to Orders
        </Link>

        <div className="rounded-2xl border bg-card p-6 shadow-card-soft">

          <div className="flex items-center justify-between">

            <div>
              <h1 className="font-display text-3xl font-bold">
                Order #{order.data.id}
              </h1>

              <p className="mt-2 text-muted-foreground">
                {formatDate(order.data.created_at)}
              </p>
            </div>

            <span
              className={`rounded-full border px-3 py-1 text-sm font-semibold ${statusClass(
                order.data.status
              )}`}
            >
              {order.data.status}
            </span>

          </div>

          {isAdmin && (
            <div className="mt-6">

              <p className="mb-2 font-semibold">
                Update Status
              </p>

              <Select
                value={order.data.status}
                onValueChange={(value) => updateStatus.mutate(value)}
              >
                <SelectTrigger className="w-60">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {STATUSES.map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                    >
                      {status.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </div>
          )}

        </div>

        <div className="mt-8 rounded-2xl border bg-card p-6 shadow-card-soft">

          <h2 className="mb-4 font-display text-2xl font-bold">
            Order Items
          </h2>

          <div className="space-y-4">

            {order.data.items.map((item) => (

              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-3"
              >
                <div>
                  <h3 className="font-semibold">
                    {item.name}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Qty : {item.quantity}
                  </p>
                </div>

                <div className="font-bold">
                  {formatCurrency(item.price * item.quantity)}
                </div>

              </div>

            ))}

          </div>

          <div className="mt-6 flex justify-between border-t pt-4">

            <span className="text-lg font-semibold">
              Total
            </span>

            <span className="text-xl font-bold text-primary">
              {formatCurrency(order.data.total_amount)}
            </span>

          </div>

        </div>

      </div>
    </AppShell>
  );
}