import { FiSearch } from "react-icons/fi";
import type { FormEvent, ReactNode } from "react";

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search...",
  right,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  right?: ReactNode;
}) {
  const handle = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };
  return (
    <form onSubmit={handle} className="group relative flex items-center gap-2 rounded-2xl border border-border bg-card/80 px-4 py-3 shadow-card-soft backdrop-blur transition-all focus-within:border-primary focus-within:shadow-elegant">
      <FiSearch className="h-5 w-5 shrink-0 text-muted-foreground group-focus-within:text-primary" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
      {right}
    </form>
  );
}