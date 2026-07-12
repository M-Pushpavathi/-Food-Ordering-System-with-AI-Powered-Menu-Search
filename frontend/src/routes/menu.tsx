import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { MenuCard, type MenuItem } from "@/components/food/MenuCard";
import { CategoryCard, type Category } from "@/components/food/CategoryCard";
import { SearchBar } from "@/components/common/SearchBar";
import { LoadingCards } from "@/components/common/Loading";
import { EmptyState, ErrorState } from "@/components/common/EmptyState";
import { categoryApi, menuApi, cartApi } from "@/services/api";
import { FiFilter } from "react-icons/fi";

export const Route = createFileRoute("/menu")({ component: MenuPage });

function MenuPage() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string | number | null>(null);

  const cats = useQuery<Category[]>({ queryKey: ["categories"], queryFn: () => categoryApi.list() });
  const menu = useQuery<MenuItem[]>({ queryKey: ["menu"], queryFn: () => menuApi.list() });

  const filtered = useMemo(() => {
    const list = menu.data ?? [];
    return list.filter((m) => {
      const matchesQuery = !query || m.name.toLowerCase().includes(query.toLowerCase()) || m.description?.toLowerCase().includes(query.toLowerCase());
      const matchesCat = !activeCat || String((m as unknown as { category_id?: string | number }).category_id ?? m.category ?? "") === String(activeCat);
      return matchesQuery && matchesCat;
    });
  }, [menu.data, query, activeCat]);

  const addToCart = async (item: MenuItem) => {
    try {
      await cartApi.add({ menu_id: item.id, quantity: 1 });
      toast.success(`${item.name} added to cart`);
    } catch {
      toast.error("Could not add to cart");
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Menu</span>
          <h1 className="mt-1 font-display text-4xl font-bold sm:text-5xl">Every dish, every craving.</h1>
        </div>
        <SearchBar value={query} onChange={setQuery} placeholder="Search dishes, cuisines, ingredients..." />

        <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-2">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <FiFilter /> Categories
            </div>
            <button
              onClick={() => setActiveCat(null)}
              className={`hover-lift w-full rounded-2xl border p-4 text-left shadow-card-soft transition-all ${!activeCat ? "border-primary bg-primary/5" : "border-border bg-card"}`}
            >
              <div className="font-display font-semibold">All dishes</div>
              <div className="text-xs text-muted-foreground">Browse everything</div>
            </button>
            {cats.data?.map((c) => (
              <CategoryCard key={c.id} category={c} active={activeCat === c.id} onClick={() => setActiveCat(c.id)} />
            ))}
          </aside>

          <div>
            {menu.isPending ? <LoadingCards count={6} /> : menu.isError ? <ErrorState onRetry={() => menu.refetch()} /> : filtered.length ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((m) => <MenuCard key={m.id} item={m} onAdd={addToCart} />)}
              </div>
            ) : (
              <EmptyState title="No dishes match" description="Try a different search or category." />
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}