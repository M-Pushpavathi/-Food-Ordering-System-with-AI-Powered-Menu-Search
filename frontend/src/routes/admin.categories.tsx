import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { LoadingPage } from "@/components/common/Loading";
import { EmptyState, ErrorState } from "@/components/common/EmptyState";
import { categoryApi } from "@/services/api";
import type { Category } from "@/components/food/CategoryCard";

export const Route = createFileRoute("/admin/categories")({ component: CategoryManagement });

const empty = { name: "", description: "", image: "" };

function CategoryManagement() {
  const qc = useQueryClient();
  const cats = useQuery<Category[]>({ queryKey: ["categories"], queryFn: () => categoryApi.list() });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(empty);

  const save = useMutation({
    mutationFn: () => editing ? categoryApi.update(editing.id, form) : categoryApi.create(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["categories"] }); toast.success("Saved"); setOpen(false); },
    onError: () => toast.error("Save failed"),
  });
 const remove = useMutation({
  mutationFn: (id: string | number) => categoryApi.remove(id),

  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ["categories"] });
    toast.success("Category deleted successfully");
  },

  onError: (error: any) => {
    toast.error(
      error?.response?.data?.message ||
      "Cannot delete category because it contains menu items."
    );
  },
});

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (c: Category) => { setEditing(c); setForm({ name: c.name, description: c.description ?? "", image: c.image ?? "" }); setOpen(true); };

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Admin</span>
            <h1 className="mt-1 font-display text-4xl font-bold">Categories</h1>
          </div>
          <Button onClick={openCreate} className="gap-2"><FiPlus /> New category</Button>
        </div>

        <div className="mt-8">
          {cats.isPending ? <LoadingPage /> : cats.isError ? <ErrorState onRetry={() => cats.refetch()} /> : cats.data?.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cats.data.map((c) => (
                <div key={c.id} className="hover-lift rounded-2xl border border-border bg-card p-5 shadow-card-soft">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-display text-lg font-semibold">{c.name}</div>
                      <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">{c.description || "—"}</div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(c)}><FiEdit2 /></Button>
                      <Button size="icon" variant="ghost" onClick={() => { if (confirm(`Delete ${c.name}?`)) remove.mutate(c.id); }} className="text-destructive"><FiTrash2 /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : <EmptyState title="No categories yet" action={<Button onClick={openCreate}>Create first</Button>} />}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit category" : "New category"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Image URL</Label><Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => save.mutate()} disabled={save.isPending}>{save.isPending ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}