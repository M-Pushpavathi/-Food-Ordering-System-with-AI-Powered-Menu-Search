import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { FiArrowLeft, FiMinus, FiPlus, FiShoppingCart } from "react-icons/fi";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { LoadingPage } from "@/components/common/Loading";
import { ErrorState } from "@/components/common/EmptyState";
import { menuApi, cartApi } from "@/services/api";
import { formatCurrency } from "@/lib/format";
import type { MenuItem } from "@/components/food/MenuCard";

export const Route = createFileRoute("/menu/$id")({ component: MenuDetail });

function MenuDetail() {
  const { id } = Route.useParams();
  const [qty, setQty] = useState(1);
  const item = useQuery<MenuItem>({ queryKey: ["menu", id], queryFn: () => menuApi.get(id) });

  const addToCart = async () => {
    if (!item.data) return;
    try {
      await cartApi.add({ menu_id: item.data.id, quantity: qty });
      toast.success(`${qty} × ${item.data.name} added to cart`);
    } catch {
      toast.error("Could not add to cart");
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/menu" className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary">
          <FiArrowLeft /> Back to menu
        </Link>
        {item.isPending ? <LoadingPage /> : item.isError || !item.data ? <ErrorState onRetry={() => item.refetch()} /> : (
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="overflow-hidden rounded-3xl bg-muted shadow-elegant">
              {item.data.image ? (
                <img src={item.data.image} alt={item.data.name} className="aspect-square w-full object-cover" />
              ) : <div className="aspect-square grid place-items-center text-6xl">🍽️</div>}
            </div>
            <div className="flex flex-col">
              {item.data.category && <div className="text-xs font-semibold uppercase tracking-widest text-primary">{item.data.category}</div>}
              <h1 className="mt-2 font-display text-4xl font-bold">{item.data.name}</h1>
              <p className="mt-4 text-muted-foreground">{item.data.description || "A carefully crafted dish from our chef."}</p>
              <div className="mt-6 font-display text-4xl font-bold text-primary">{formatCurrency(item.data.price)}</div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="flex items-center rounded-full border border-border bg-card">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-10 w-10 place-items-center hover:text-primary"><FiMinus /></button>
                  <span className="w-10 text-center font-semibold">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="grid h-10 w-10 place-items-center hover:text-primary"><FiPlus /></button>
                </div>
                <Button size="lg" className="gap-2" onClick={addToCart}>
                  <FiShoppingCart /> Add to cart · {formatCurrency(item.data.price * qty)}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}