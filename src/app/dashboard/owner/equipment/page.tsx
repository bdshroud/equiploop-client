"use client";

import * as React from "react";
import Link from "next/link";
import {
  Layers,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  ExternalLink,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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

  const toggleAvailability = async (item: EquipmentItem) => {
    try {
      const updated = !item.availability;
      await fetchApi(`/equipment/${item._id}`, {
        method: "PUT",
        body: JSON.stringify({ availability: updated }),
      });
      setItems((prev) =>
        prev.map((i) => (i._id === item._id ? { ...i, availability: updated } : i))
      );
      toast.success(`Machine marked as ${updated ? "Available" : "Unavailable"}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update availability");
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
    item.title.toLowerCase().includes(search.toLowerCase()) ||
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
            My Equipment Fleet
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage listing status, edit machine specs, toggle job-site availability, and monitor pricing.
          </p>
        </div>

        <Link href="/dashboard/owner/equipment/new">
          <Button size="sm" className="bg-amber text-graphite hover:bg-amber/90 font-bold gap-1.5 shadow-sm">
            <PlusCircle className="h-4 w-4" />
            <span>List New Machine</span>
          </Button>
        </Link>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Filter by title or equipment class..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 text-xs"
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card">
          <div className="h-12 w-12 rounded-full bg-amber/15 text-amber mx-auto flex items-center justify-center mb-3">
            <Layers className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg text-foreground">No Fleet Machines Listed</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-6">
            You haven&apos;t added any machinery to your fleet yet. Start listing excavators, lifts, generators, or tools today.
          </p>
          <Link href="/dashboard/owner/equipment/new">
            <Button size="sm" className="bg-amber text-graphite hover:bg-amber/90 font-bold">
              Add Your First Equipment Listing
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <Card key={item._id} className="p-4 sm:p-5 rounded-2xl border-border bg-card shadow-xs hover:border-amber/40 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-20 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
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
                      <Badge variant={item.status === "Approved" ? "success" : "secondary"} className="text-[10px]">
                        {item.status}
                      </Badge>
                      <Badge variant={item.availability ? "amber" : "destructive"} className="text-[10px]">
                        {item.availability ? "Available" : "Unavailable / Booked"}
                      </Badge>
                    </div>

                    <h3 className="font-bold text-base text-foreground leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-muted-foreground mt-0.5">
                      Daily Rate: <strong className="text-foreground">{formatCurrency(item.pricePerDay)}</strong> • Deposit: {formatCurrency(item.securityDeposit || 0)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-border">
                  <Link href={`/equipment/${item._id}`} target="_blank">
                    <Button variant="ghost" size="sm" className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground">
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      View
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAvailability(item)}
                    className="h-8 px-2.5 text-xs font-semibold"
                  >
                    {item.availability ? "Set Booked" : "Set Available"}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item._id)}
                    className="h-8 px-2 text-destructive hover:bg-destructive/10"
                    title="Delete Machine"
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
