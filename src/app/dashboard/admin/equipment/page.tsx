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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";
import { EquipmentItem } from "@/components/equipment/EquipmentCard";

export default function AdminEquipmentModerationPage() {
  const [items, setItems] = React.useState<EquipmentItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [search, setSearch] = React.useState("");

  const loadEquipment = React.useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (statusFilter !== "All") params.set("status", statusFilter);

      const res = await fetchApi<{ success: boolean; data: EquipmentItem[] }>(`/equipment?${params.toString()}`);
      if (res.data) {
        setItems(res.data);
      }
    } catch (err: any) {
      console.warn("Failed to load moderation queue:", err.message);
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
    } catch (err: any) {
      toast.error(err.message || "Failed to update equipment status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this listing?")) return;
    try {
      await fetchApi(`/equipment/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((i) => i._id !== id));
      toast.success("Equipment listing deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete equipment");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-amber mb-1 flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Safety & Quality Control</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Equipment Moderation Queue
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Review, approve, or reject equipment listings submitted by fleet owners across the platform.
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
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="p-10 text-center rounded-2xl border border-dashed border-border bg-card">
          <Layers className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-semibold">No equipment found matching criteria.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item._id} className="p-4 rounded-xl border-border bg-card shadow-xs hover:border-amber/40 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-16 w-20 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
                    <img
                      src={item.images?.[0] || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80"}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {item.category}
                      </span>
                      <Badge
                        variant={item.status === "Approved" ? "success" : item.status === "Pending" ? "secondary" : "destructive"}
                        className="text-[10px]"
                      >
                        {item.status}
                      </Badge>
                      <span className="text-xs font-bold text-foreground">
                        {formatCurrency(item.pricePerDay)} / day
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-foreground">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      Owner: {item.ownerName || "Fleet Owner"} • Location: {item.location?.city || "Depot"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-border justify-end">
                  <Link href={`/equipment/${item._id}`} target="_blank">
                    <Button variant="ghost" size="sm" className="h-8 px-2.5 text-xs">
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      View
                    </Button>
                  </Link>

                  {item.status !== "Approved" && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(item._id, "Approved")}
                      className="bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold h-8"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      Approve
                    </Button>
                  )}

                  {item.status !== "Rejected" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(item._id, "Rejected")}
                      className="text-xs text-destructive hover:bg-destructive/10 font-semibold h-8"
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1" />
                      Reject
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item._id)}
                    className="h-8 px-2 text-destructive hover:bg-destructive/10"
                    title="Delete permanently"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
