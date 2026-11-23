"use client";

import * as React from "react";
import Link from "next/link";
import { Bookmark, Eye, Trash2, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { apiErrorMessage, fetchApi } from "@/lib/api";
import { toast } from "sonner";
import { EquipmentItem } from "@/components/equipment/EquipmentCard";
import { EquipmentImage } from "@/components/equipment/EquipmentImage";

export default function FavoritesPage() {
  const [items, setItems] = React.useState<EquipmentItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadFavorites = React.useCallback(async () => {
    try {
      const res = await fetchApi<{ success: boolean; data: EquipmentItem[] }>("/users/favorites");
      if (res.data) {
        setItems(res.data);
      }
    } catch (err) {
      console.warn("Failed to load favorites:", apiErrorMessage(err));
      toast.error(apiErrorMessage(err, "Failed to load favorites"));
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleRemoveFavorite = async (id: string) => {
    try {
      await fetchApi(`/users/favorites/${id}`, { method: "POST" });
      setItems((prev) => prev.filter((i) => i._id !== id));
      toast.info("Removed from your favorites list");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to remove favorite"));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-amber-text mb-1">
          Saved Favorites Ledger
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Favorites
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Review bookmarked equipment in tabular format with quick access to rental booking and removal.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card">
          <div className="h-12 w-12 rounded-full bg-amber/15 text-amber-text mx-auto flex items-center justify-center mb-3">
            <Bookmark className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg text-foreground">No Favorite Equipment Saved</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-6">
            Click the heart icon on any equipment card to save machinery to your favorites table.
          </p>
          <Link href="/equipment">
            <Button size="sm" className="bg-amber text-graphite hover:bg-amber/90 font-bold">
              Browse Available Fleet
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
                  <th className="py-3 px-4">Equipment Image</th>
                  <th className="py-3 px-4">Equipment Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Rental Price</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <EquipmentImage src={item.images?.[0] || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=100&q=80"} alt={item.title} width={56} height={40} className="h-10 w-14 rounded-lg object-cover border border-border" />
                    </td>
                    <td className="py-3 px-4 font-bold text-foreground">
                      <Link href={`/equipment/${item._id}`} className="hover:text-amber-text-text transition-colors">
                        {item.title}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      <Badge variant="secondary" className="text-[10px]">
                        {item.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-bold text-foreground whitespace-nowrap">
                      {formatCurrency(item.pricePerDay || item.rentalPrice || 0)} / day
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/equipment/${item._id}`}>
                          <Button size="sm" variant="outline" className="text-[11px] h-7 px-2.5 gap-1 font-semibold">
                            <Eye className="h-3 w-3" />
                            <span>View Details</span>
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveFavorite(item._id)}
                          className="text-[11px] h-7 px-2 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          <span>Remove</span>
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
    </div>
  );
}
