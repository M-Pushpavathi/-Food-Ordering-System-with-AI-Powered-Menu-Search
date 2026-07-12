import { Link } from "@tanstack/react-router";
import { FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";

export interface MenuItem {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  is_veg?: boolean;
}

export function MenuCard({ item, onAdd }: { item: MenuItem; onAdd?: (item: MenuItem) => void }) {
  return (
    <article className="hover-lift group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card-soft">
      <Link to="/menu/$id" params={{ id: String(item.id) }} className="relative block aspect-[4/3] overflow-hidden bg-muted">
        {item.image ? (
          <img
             src={`http://localhost:5000${item.image}`}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="grid h-full place-items-center text-4xl">🍽️</div>
        )}
        {item.is_veg !== undefined && (
          <span className={`absolute left-3 top-3 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${item.is_veg ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-700" : "border-red-500/40 bg-red-500/15 text-red-600"}`}>
            {item.is_veg ? "Veg" : "Non-Veg"}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        {item.category && (
          <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">
            {item.category}
          </div>
        )}
        <h3 className="mt-1 font-display text-lg font-semibold leading-tight">
          <Link to="/menu/$id" params={{ id: String(item.id) }} className="hover:text-primary">
            {item.name}
          </Link>
        </h3>
        {item.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="font-display text-xl font-bold text-foreground">{formatCurrency(item.price)}</span>
          {onAdd && (
            <Button size="sm" onClick={() => onAdd(item)} className="gap-1">
              <FiPlus /> Add
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}