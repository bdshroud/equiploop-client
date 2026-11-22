"use client";

import * as React from "react";
import Link from "next/link";
import {
  Layers,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  ShieldCheck,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { apiErrorMessage, fetchApi } from "@/lib/api";
import { toast } from "sonner";
import { EquipmentItem } from "@/components/equipment/EquipmentCard";

export default function AdminEquipmentModerationPage() {
  const [items, setItems] = React.useState<EquipmentItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [search, setSearch] = React.useState("");

  // Update modal state
  const [editingItem, setEditingItem] = React.useState<EquipmentItem | null>(null);
  const [updatePrice, setUpdatePrice] = React.useState<number>(0);
  const [updateQuantity, setUpdateQuantity] = React.useState<number>(1);
  const [updateStatus, setUpdateStatus] = React.useState<string>("Approved");
  const [updating, setUpdating] = React.useState(false);

  const loadEquipment = React.useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (statusFilter !== "All") params.set("status", statusFilter);

      const res = await fetchApi<{ success: boolean; data: EquipmentItem[] }>(`/equipment?${params.toString()}`);
      if (res.data) {
        setItems(res.data);
      }
    } catch (err) {
      console.warn("Failed to load moderation queue:", apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  React.useEffect(() => {
    loadEquipment();
  }, [loadEquipment]);

  const handleUpdateStatus = async (id: string, status: "Approved" | "Pending" | "Rejected") => {
    try {
      await fetchApi(`/equipment/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast.success(`Equipment status set to "${status}"`);
      loadEquipment();
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to update equipment status"));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this listing?")) return;
    try {
      await fetchApi(`/equipment/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((i) => i._id !== id));
      toast.success("Equipment listing deleted");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to delete equipment"));
    }
  };

  const openUpdateModal = (item: EquipmentItem) => {
    setEditingItem(item);
    setUpdatePrice(item.pricePerDay);
    setUpdateQuantity(item.availableQuantity || 1);
    setUpdateStatus(item.status || "Approved");
  };

  const handleSaveUpdate = async () => {
    if (!editingItem) return;
    setUpdating(true);
    try {
      await fetchApi(`/equipment/${editingItem._id}`, {
        method: "PUT",
        body: JSON.stringify({
          pricePerDay: Number(updatePrice),
          availableQuantity: Number(updateQuantity),
          status: updateStatus,
        }),
      });
      toast.success("Equipment updated successfully");
      setEditingItem(null);
      loadEquipment();
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to update equipment"));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-amber mb-1 flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Fleet Oversight</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          All Equipment (Manage Equipment)
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Review machinery listings, approve new additions, update listing specs, or remove compliance violations.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search machinery by title, category, or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-muted-foreground hidden sm:inline">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 rounded-md border border-input bg-background text-xs font-medium focus:outline-none focus:ring-1 focus:ring-amber w-full sm:w-auto"
          >
            <option value="All">All Statuses</option>
            <option value="Approved">Approved Only</option>
            <option value="Pending">Pending Review</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="p-10 text-center rounded-2xl border border-dashed border-border bg-card">
          <Layers className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-semibold">No equipment found matching criteria.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/60 text-muted-foreground border-b border-border uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Equipment Image</th>
                <th className="py-3.5 px-4">Equipment Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Rental Price</th>
                <th className="py-3.5 px-4">Owner</th>
                <th className="py-3.5 px-4">Available Quantity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item) => (
                <tr key={item._id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="h-12 w-16 rounded-md overflow-hidden bg-muted border border-border shrink-0">
                      <img
                        src={item.images?.[0] || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80"}
                        alt={item.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80";
                        }}
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-foreground">
                    <Link
                      href={`/equipment/${item._id}`}
                      target="_blank"
                      className="hover:text-amber transition-colors line-clamp-1"
                    >
                      {item.title}
                    </Link>
                    <span className="text-[10px] text-muted-foreground font-normal block">
                      {item.brand ? `${item.brand} • ` : ""}{item.location?.city || "Depot"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-muted-foreground font-medium">{item.category}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-foreground">
                    {formatCurrency(item.pricePerDay)}
                    <span className="text-[10px] text-muted-foreground font-normal block">
                      /{item.rentalType?.toLowerCase() || "day"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">
                    {item.ownerName || "Fleet Owner"}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-foreground">
                    {item.availableQuantity ?? 1} units
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        item.status === "Approved"
                          ? "success"
                          : item.status === "Pending"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-[10px] font-bold"
                    >
                      {item.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 flex-nowrap">
                      {/* Approve */}
                      {item.status !== "Approved" && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(item._id, "Approved")}
                          className="bg-emerald-600 text-white hover:bg-emerald-700 text-[11px] font-semibold h-7 px-2"
                          title="Approve Equipment"
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                      )}

                      {/* Reject */}
                      {item.status !== "Rejected" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(item._id, "Rejected")}
                          className="text-[11px] text-destructive hover:bg-destructive/10 font-semibold h-7 px-2 border-destructive/30"
                          title="Reject Equipment"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      )}

                      {/* Update */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openUpdateModal(item)}
                        className="text-[11px] font-semibold h-7 px-2 hover:border-amber hover:text-amber"
                        title="Update Listing"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Update
                      </Button>

                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item._id)}
                        className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                        title="Delete Equipment"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit/Update Dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="text-base font-black">
              Update Equipment: {editingItem?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 text-xs">
            <div>
              <label className="font-semibold block mb-1">Rental Price (USD / day)</label>
              <Input
                type="number"
                min={1}
                value={updatePrice}
                onChange={(e) => setUpdatePrice(Number(e.target.value))}
                className="text-xs h-9"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Available Quantity</label>
              <Input
                type="number"
                min={0}
                value={updateQuantity}
                onChange={(e) => setUpdateQuantity(Number(e.target.value))}
                className="text-xs h-9"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Moderation Status</label>
              <select
                value={updateStatus}
                onChange={(e) => setUpdateStatus(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs font-medium focus:outline-none focus:ring-1 focus:ring-amber"
              >
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingItem(null)}
              className="text-xs h-8"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveUpdate}
              disabled={updating}
              className="bg-amber text-graphite hover:bg-amber/90 font-bold text-xs h-8"
            >
              {updating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
