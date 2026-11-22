"use client";

import * as React from "react";
import Link from "next/link";
import {
  Layers,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";
import { EquipmentItem } from "@/components/equipment/EquipmentCard";

export default function OwnerEquipmentListPage() {
  const { data: session } = useSession();
  const [items, setItems] = React.useState<EquipmentItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");

  // Edit equipment dialog state
  const [editingItem, setEditingItem] = React.useState<EquipmentItem | null>(null);
  const [editTitle, setEditTitle] = React.useState("");
  const [editPrice, setEditPrice] = React.useState<number>(0);
  const [editQuantity, setEditQuantity] = React.useState<number>(1);
  const [editCategory, setEditCategory] = React.useState("");
  const [updating, setUpdating] = React.useState(false);

  const loadOwnerEquipment = React.useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetchApi<{
        success: boolean;
        data: EquipmentItem[];
      }>(`/equipment?ownerId=${session.user.id}`);

      if (res.data) {
        setItems(res.data);
      }
    } catch (err: any) {
      console.warn("Failed to load owner fleet:", err.message);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  React.useEffect(() => {
    loadOwnerEquipment();
  }, [loadOwnerEquipment]);

  const openUpdateModal = (item: EquipmentItem) => {
    setEditingItem(item);
    setEditTitle(item.title || item.equipmentName || "");
    setEditPrice(item.rentalPrice || item.pricePerDay || 0);
    setEditQuantity(item.availableQuantity !== undefined ? item.availableQuantity : 1);
    setEditCategory(item.category || "");
  };

  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      setUpdating(true);
      await fetchApi(`/equipment/${editingItem._id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: editTitle.trim(),
          equipmentName: editTitle.trim(),
          rentalPrice: Number(editPrice),
          pricePerDay: Number(editPrice),
          availableQuantity: Number(editQuantity),
          category: editCategory,
        }),
      });
      toast.success("Equipment updated successfully");
      setEditingItem(null);
      loadOwnerEquipment();
    } catch (err: any) {
      toast.error(err.message || "Failed to update equipment");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this equipment listing?")) return;

    try {
      await fetchApi(`/equipment/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((i) => i._id !== id));
      toast.success("Equipment listing deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete equipment");
    }
  };

  const filteredItems = items.filter((item) =>
    (item.title || item.equipmentName || "").toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber mb-1">
            Machine Fleet Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            My Equipment
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Displaying all equipment added by your account in tabular format.
          </p>
        </div>

        <Link href="/dashboard/owner/equipment/new">
          <Button size="sm" className="bg-amber text-graphite hover:bg-amber/90 font-bold gap-1.5 shadow-sm text-xs">
            <PlusCircle className="h-4 w-4" />
            <span>Add Equipment</span>
          </Button>
        </Link>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Filter by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 text-xs"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card">
          <div className="h-12 w-12 rounded-full bg-amber/15 text-amber mx-auto flex items-center justify-center mb-3">
            <Layers className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg text-foreground">No Equipment Listed Yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-6">
            You haven&apos;t added any machinery to your fleet yet. Start listing excavators, cameras, vehicles, or tools.
          </p>
          <Link href="/dashboard/owner/equipment/new">
            <Button size="sm" className="bg-amber text-graphite hover:bg-amber/90 font-bold">
              Add Your First Equipment
            </Button>
          </Link>
        </div>
      ) : (
        /* Table Format per Assignment Specification */
        <Card className="rounded-2xl border-border bg-card shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground font-semibold border-b border-border uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Equipment Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Rental Price</th>
                  <th className="py-3 px-4">Available Quantity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-muted/30 transition-colors">
                    {/* Equipment Name */}
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.images?.[0] || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=100&q=80"}
                          alt={item.title}
                          className="h-9 w-12 rounded object-cover border border-border shrink-0"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=100&q=80";
                          }}
                        />
                        <span className="line-clamp-1 max-w-[220px]">
                          {item.equipmentName || item.title}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                      <Badge variant="secondary" className="text-[10px]">
                        {item.category}
                      </Badge>
                    </td>

                    {/* Rental Price */}
                    <td className="py-3.5 px-4 font-bold text-foreground whitespace-nowrap">
                      {formatCurrency(item.rentalPrice || item.pricePerDay || 0)} / {item.rentalType?.toLowerCase() || "day"}
                    </td>

                    {/* Available Quantity */}
                    <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                      <span className="font-semibold text-foreground">
                        {item.availableQuantity !== undefined ? item.availableQuantity : 1}
                      </span> unit(s)
                    </td>

                    {/* Status (default pending) */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge
                        variant={item.status === "Approved" ? "success" : item.status === "Rejected" ? "destructive" : "secondary"}
                        className="text-[10px]"
                      >
                        {item.status || "Pending"}
                      </Badge>
                    </td>

                    {/* Actions: Update, Delete, View Details */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/equipment/${item._id}`} target="_blank">
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground">
                            <Eye className="h-3 w-3 mr-1" />
                            <span>View</span>
                          </Button>
                        </Link>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openUpdateModal(item)}
                          className="h-7 px-2 text-[11px] font-semibold"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          <span>Update</span>
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(item._id)}
                          className="h-7 px-2 text-[11px] text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          <span>Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Update Equipment Dialog Modal */}
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Edit className="h-4 w-4 text-amber" />
                <span>Update Equipment Listing</span>
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSaveUpdate} className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">Equipment Title</label>
                <Input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Rental Price ($/day)</label>
                  <Input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    required
                    min="1"
                    className="text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Available Units</label>
                  <Input
                    type="number"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(Number(e.target.value))}
                    required
                    min="0"
                    className="text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs"
                >
                  <option value="Construction Equipment">Construction Equipment</option>
                  <option value="Photography Equipment">Photography Equipment</option>
                  <option value="Vehicles & Transportation">Vehicles & Transportation</option>
                  <option value="Agriculture Equipment">Agriculture Equipment</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Event Equipment">Event Equipment</option>
                </select>
              </div>

              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingItem(null)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={updating}
                  className="bg-amber text-graphite hover:bg-amber/90 font-bold text-xs"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
