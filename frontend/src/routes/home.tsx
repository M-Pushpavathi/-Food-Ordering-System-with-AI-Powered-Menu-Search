import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FiArrowRight, FiSearch, FiShoppingBag } from "react-icons/fi";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { MenuCard, type MenuItem } from "@/components/food/MenuCard";
import { CategoryCard, type Category } from "@/components/food/CategoryCard";
import { LoadingCards, Spinner } from "@/components/common/Loading";
import { EmptyState, ErrorState } from "@/components/common/EmptyState";
import { categoryApi, menuApi, cartApi } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export const Route = createFileRoute("/home")({ component: CustomerHome });

function CustomerHome() {
  const { user } = useAuth();
  const cats = useQuery<Category[]>({ queryKey: ["categories"], queryFn: () => categoryApi.list() });
  const menu = useQuery<MenuItem[]>({ queryKey: ["menu"], queryFn: () => menuApi.list() });

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
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl gradient-primary p-8 text-primary-foreground shadow-elegant sm:p-12">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest opacity-80">Welcome back</div>
              <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">{user?.name || "Foodie"} 👋</h1>
              <p className="mt-2 max-w-lg text-primary-foreground/85">What are you craving today? Try our AI to find dishes matching your mood.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="secondary" className="gap-2 bg-white text-primary hover:bg-white/90">
                <Link to="/ai-search"><FiSearch /> AI Search</Link>
              </Button>
              <Button asChild variant="outline" className="gap-2 border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <Link to="/cart"><FiShoppingBag /> View Cart</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHead title="Browse categories" cta={<Link to="/menu" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">See all <FiArrowRight /></Link>} />
        <div className="mt-6">
          {cats.isPending ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />)}</div>
          ) : cats.isError ? <ErrorState onRetry={() => cats.refetch()} /> : cats.data?.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {cats.data.slice(0, 8).map((c) => <CategoryCard key={c.id} category={c} />)}
            </div>
          ) : <EmptyState title="No categories yet" />}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <SectionHead title="Popular right now" cta={<Link to="/menu" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">Full menu <FiArrowRight /></Link>} />
        <div className="mt-6">
          {menu.isPending ? <LoadingCards count={6} /> : menu.isError ? <ErrorState onRetry={() => menu.refetch()} /> : menu.data?.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {menu.data.slice(0, 6).map((m) => <MenuCard key={m.id} item={m} onAdd={addToCart} />)}
            </div>
          ) : (
            <EmptyState title="Menu is empty" description="Check back soon for delicious dishes." />
          )}
          {menu.isFetching && !menu.isPending && <div className="mt-4 flex justify-center"><Spinner className="text-primary" /></div>}
        </div>
      </section>
    </AppShell>
  );
}

function SectionHead({ title, cta }: { title: string; cta?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
      {cta}
    </div>
  );
}