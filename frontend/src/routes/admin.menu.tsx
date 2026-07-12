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

import { formatCurrency } from "@/lib/format";
import type { MenuItem } from "@/components/food/MenuCard";
import { menuApi, categoryApi } from "@/services/api";
export const Route = createFileRoute("/admin/menu")({ component: MenuManagement });

const empty = {
  name: "",
  description: "",
  price: 0,
  image: "",
  category_id: "",
  is_vegetarian: false,
  is_spicy: false,
};

function MenuManagement() {
  const qc = useQueryClient();
  const items = useQuery<MenuItem[]>({
  queryKey: ["menu"],
  queryFn: () => menuApi.list(),
});
 const categories = useQuery({
  queryKey: ["categories"],
  queryFn: () => categoryApi.list(),
});
  const [open, setOpen] = useState(false);
const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<typeof empty>(empty);

 const save = useMutation({
  mutationFn: () => {
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      image_url: form.image,
      category_id: Number(form.category_id),
      is_vegetarian: form.is_vegetarian,
      is_spicy: form.is_spicy,
      available: true,
    };

    console.log(payload);

    return editing
      ? menuApi.update(editing.id, payload)
      : menuApi.create(payload);
  },

  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ["menu"] });
    toast.success(editing ? "Item updated" : "Item created");
    setOpen(false);
    setForm(empty);
    setEditing(null);
  },

  onError: (err: any) => {
    console.log(err.response?.data);
    toast.error("Save failed");
  },
});
  const remove = useMutation({
    mutationFn: (id: string | number) => menuApi.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["menu"] }); toast.success("Item deleted"); },
    onError: () => toast.error("Delete failed"),
  });

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (i: any) => {
  setEditing(i);

  setForm({
    name: i.name,
    description: i.description ?? "",
    price: i.price,
    image: i.image ?? "",
    category_id: String(i.category_id ?? ""),
    is_vegetarian: i.is_veg ?? false,
    is_spicy: i.is_spicy ?? false,
  });

  setOpen(true);
};
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Admin</span>
            <h1 className="mt-1 font-display text-4xl font-bold">Menu Management</h1>
          </div>
          <Button onClick={openCreate} className="gap-2"><FiPlus /> Add dish</Button>
        </div>

        <div className="mt-8">
          {items.isPending ? <LoadingPage /> : items.isError ? <ErrorState onRetry={() => items.refetch()} /> : items.data?.length ? (
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card-soft">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-4">Item</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.data.map((it) => (
                    <tr key={it.id} className="hover:bg-muted/30">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                            {it.image && <img src={it.image} alt={it.name} className="h-full w-full object-cover" />}
                          </div>
                          <div>
                            <div className="font-semibold">{it.name}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1">{it.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{it.category ?? "—"}</td>
                      <td className="p-4 font-display font-semibold">{formatCurrency(it.price)}</td>
                      <td className="p-4 text-right">
                        <div className="inline-flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEdit(it)} className="gap-1"><FiEdit2 /> Edit</Button>
                          <Button size="sm" variant="destructive" onClick={() => { if (confirm(`Delete ${it.name}?`)) remove.mutate(it.id); }} className="gap-1"><FiTrash2 /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <EmptyState title="No dishes yet" action={<Button onClick={openCreate}>Add first dish</Button>} />}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit dish" : "Add dish"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Field label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Description"><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Price (₹)"><Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></Field>
<Field label="Category">
  <select
    className="w-full rounded-md border p-2"
    value={form.category_id}
    onChange={(e) =>
      setForm({
        ...form,
        category_id: e.target.value,
      })
    }
  >
    <option value="">Select Category</option>

    {categories.data?.map((cat: any) => (
      <option key={cat.id} value={cat.id}>
        {cat.name}
      </option>
    ))}
  </select>
</Field>
            </div>
            <Field label="Image URL"><Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." /></Field>
            <div className="flex gap-6">

<label className="flex items-center gap-2">
<input
type="checkbox"
checked={form.is_vegetarian}
onChange={(e)=>
setForm({
...form,
is_vegetarian:e.target.checked
})
}
/>
Veg
</label>

<label className="flex items-center gap-2">
<input
type="checkbox"
checked={form.is_spicy}
onChange={(e)=>
setForm({
...form,
is_spicy:e.target.checked
})
}
/>
Spicy
</label>

</div>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}