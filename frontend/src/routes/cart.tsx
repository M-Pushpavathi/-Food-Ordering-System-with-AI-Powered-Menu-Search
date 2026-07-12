import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from "react-icons/fi";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { LoadingPage } from "@/components/common/Loading";
import { EmptyState, ErrorState } from "@/components/common/EmptyState";
import { cartApi, orderApi } from "@/services/api";
import { formatCurrency } from "@/lib/format";

interface CartItem {
  id: string | number;
  menu_id?: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  const cart = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartApi.list(),
  });

  const updateQty = useMutation({
    mutationFn: ({ id, quantity }: { id: string | number; quantity: number }) =>
      cartApi.update(id, { quantity }),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
    },

    onError: () => {
      toast.error("Failed to update quantity");
    },
  });

  const remove = useMutation({
    mutationFn: (id: string | number) => cartApi.remove(id),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Removed from cart");
    },

    onError: () => {
      toast.error("Failed to remove item");
    },
  });

 const placeOrder = useMutation({
  mutationFn: () => orderApi.create({}),

  onSuccess: () => {
    // Refresh cart and orders
    qc.invalidateQueries({ queryKey: ["cart"] });
    qc.invalidateQueries({ queryKey: ["orders"] });

    toast.success("Order placed successfully!");

    // Go directly to My Orders page
    navigate({
      to: "/orders",
    });
  },

  onError: () => {
    toast.error("Could not place order");
  },
});
  // Backend returns { items, total }
  const items = cart.data?.items ?? [];

  const subtotal =
    cart.data?.total ??
    items.reduce(
      (sum: number, item: CartItem) =>
        sum + Number(item.price) * Number(item.quantity),
      0
    );

  const delivery = items.length > 0 ? 40 : 0;

  const total = subtotal + delivery;

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold">
          Your Cart
        </h1>

        <p className="mt-1 text-muted-foreground">
          Review your order before checkout.
        </p>

        {cart.isPending ? (
          <LoadingPage />
        ) : cart.isError ? (
          <ErrorState onRetry={() => cart.refetch()} />
        ) : !items.length ? (
          <div className="mt-10">
            <EmptyState
              icon={<FiShoppingBag />}
              title="Your cart is empty"
              description="Browse our menu and add some delicious dishes."
              action={
                <Button asChild>
                  <Link to="/menu">
                    Explore Menu
                  </Link>
                </Button>
              }
            />
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
            <ul className="space-y-4">
              {items.map((it: CartItem) => (
                <li
                  key={it.id}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-card-soft"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                    {it.image ? (
                      <img
                        src={it.image}
                        alt={it.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-2xl">
                        🍽️
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate font-display text-lg font-semibold">
                      {it.name}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(it.price)} each
                    </div>
                  </div>

                  <div className="flex items-center rounded-full border border-border">
                    <button
                      disabled={
                        updateQty.isPending ||
                        it.quantity <= 1
                      }
                      onClick={() =>
                        updateQty.mutate({
                          id: it.id,
                          quantity: it.quantity - 1,
                        })
                      }
                      className="grid h-9 w-9 place-items-center hover:text-primary disabled:opacity-50"
                    >
                      <FiMinus />
                    </button>

                    <span className="w-8 text-center text-sm font-semibold">
                      {it.quantity}
                    </span>

                    <button
                      disabled={updateQty.isPending}
                      onClick={() =>
                        updateQty.mutate({
                          id: it.id,
                          quantity: it.quantity + 1,
                        })
                      }
                      className="grid h-9 w-9 place-items-center hover:text-primary disabled:opacity-50"
                    >
                      <FiPlus />
                    </button>
                  </div>

                  <div className="w-24 shrink-0 text-right font-display font-semibold">
                    {formatCurrency(
                      Number(it.price) * Number(it.quantity)
                    )}
                  </div>

                  <button
                    disabled={remove.isPending}
                    onClick={() => remove.mutate(it.id)}
                    className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                  >
                    <FiTrash2 />
                  </button>
                </li>
              ))}
            </ul>

            <aside className="sticky top-24 h-fit rounded-2xl border border-border bg-card p-6 shadow-card-soft">
              <h2 className="font-display text-xl font-semibold">
                Order Summary
              </h2>

              <dl className="mt-4 space-y-2 text-sm">
                <Row
                  label="Subtotal"
                  value={formatCurrency(subtotal)}
                />

                <Row
                  label="Delivery"
                  value={formatCurrency(delivery)}
                />

                <div className="my-3 border-t border-border" />

                <Row
                  label={
                    <span className="text-base font-semibold">
                      Total
                    </span>
                  }
                  value={
                    <span className="font-display text-lg font-bold text-primary">
                      {formatCurrency(total)}
                    </span>
                  }
                />
              </dl>

              <Button
                className="mt-6 w-full"
                size="lg"
                disabled={
                  placeOrder.isPending ||
                  !items.length
                }
                onClick={() => placeOrder.mutate()}
              >
                {placeOrder.isPending
                  ? "Placing Order..."
                  : "Place Order"}
              </Button>
            </aside>
          </div>
        )}
      </div>
    </AppShell>
  );
}
function Row({
  label,
  value,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}