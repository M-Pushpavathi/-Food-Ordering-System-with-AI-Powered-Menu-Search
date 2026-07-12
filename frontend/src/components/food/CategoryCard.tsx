export interface Category {
  id: string | number;
  name: string;
  description?: string;
  image?: string;
  count?: number;
}

export function CategoryCard({ category, onClick, active }: { category: Category; onClick?: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`hover-lift group flex w-full items-center gap-4 rounded-2xl border p-4 text-left shadow-card-soft transition-all ${active ? "border-primary bg-primary/5" : "border-border bg-card"}`}
    >
      <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-primary/10 text-2xl">
        {category.image ? (
          <img src={category.image} alt={category.name} className="h-full w-full object-cover" />
        ) : (
          <span>🍴</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate font-display text-base font-semibold">{category.name}</div>
        {category.description && (
          <div className="truncate text-xs text-muted-foreground">{category.description}</div>
        )}
      </div>
      {category.count !== undefined && (
        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {category.count}
        </span>
      )}
    </button>
  );
}