"use client";

import * as React from "react";
import Link from "next/link";
import { Bookmark, Search } from "lucide-react";
import { EquipmentCard, EquipmentItem } from "@/components/equipment/EquipmentCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiErrorMessage, fetchApi } from "@/lib/api";
import { toast } from "sonner";

export default function WishlistPage() {
  const [items, setItems] = React.useState<EquipmentItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadWishlist = React.useCallback(async () => {
    try {
      const res = await fetchApi<{ success: boolean; data: EquipmentItem[] }>("/users/wishlist");
      if (res.data) {
        setItems(res.data);
      }
    } catch (err) {
      console.warn("Failed to load wishlist:", apiErrorMessage(err));
      toast.error(apiErrorMessage(err, "Failed to load wishlist"));
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const handleWishlistToggle = (id: string, isSaved: boolean) => {
    if (!isSaved) {
      setItems((prev) => prev.filter((i) => i._id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-amber-text mb-1">
          Saved Fleet Equipment
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          My Equipment Wishlist
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Quickly access machinery you book frequently or want to reserve for future project phases.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card">
          <div className="h-12 w-12 rounded-full bg-amber/15 text-amber-text mx-auto flex items-center justify-center mb-3">
            <Bookmark className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg text-foreground">Your Wishlist is Empty</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-6">
            Click the heart icon on any equipment listing to bookmark it for quick access later.
          </p>
          <Link href="/equipment">
            <Button size="sm" className="bg-amber text-graphite hover:bg-amber/90 font-bold">
              Browse Available Fleet
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <EquipmentCard
              key={item._id}
              item={item}
              isWishlisted={true}
              onWishlistToggle={handleWishlistToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
