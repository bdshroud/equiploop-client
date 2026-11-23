"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, MapPin, ShieldCheck, Heart, ArrowUpRight, Lock } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EquipmentImage } from "@/components/equipment/EquipmentImage";
import { formatCurrency } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import { apiErrorMessage, fetchApi } from "@/lib/api";
import { toast } from "sonner";
import type { EquipmentItem } from "@/types";

export type { EquipmentItem };

interface EquipmentCardProps {
  item: EquipmentItem;
  isWishlisted?: boolean;
  onWishlistToggle?: (id: string, isSaved: boolean) => void;
  requireAuthForDetails?: boolean;
}

export function EquipmentCard({
  item,
  isWishlisted = false,
  onWishlistToggle,
  requireAuthForDetails = false,
}: EquipmentCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [saved, setSaved] = React.useState(isWishlisted);
  const [loadingSave, setLoadingSave] = React.useState(false);

  const displayTitle = item.title || item.equipmentName || "Commercial Machinery";
  const displayPrice = item.pricePerDay || item.rentalPrice || 0;
  const displayRentalType = item.rentalType || "Day";

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast.info("Please sign in to access equipment details and rental booking");
      router.push(`/login?redirect=/equipment/${item._id}`);
    } else {
      router.push(`/equipment/${item._id}`);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      toast.error("Please sign in to save equipment to your favorites");
      return;
    }

    try {
      setLoadingSave(true);
      const res = await fetchApi<{ success: boolean; isSaved: boolean; message: string }>(
        `/users/wishlist/${item._id}`,
        { method: "POST" }
      );
      setSaved(res.isSaved);
      if (res.isSaved) {
        toast.success("Saved to your favorites");
      } else {
        toast.info("Removed from your favorites");
      }
      onWishlistToggle?.(item._id, res.isSaved);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to update favorites"));
    } finally {
      setLoadingSave(false);
    }
  };

  const displayImage =
    item.images && item.images.length > 0
      ? item.images[0]
      : "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80";

  return (
    <Card className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-all duration-300 border-border hover:border-amber/50 bg-card">
      {/* Uniform Aspect Ratio Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <EquipmentImage
          src={displayImage}
          alt={displayTitle}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 33vw"
          priority={item.isFeatured === true}
          fill
        />

        {/* Top Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
          <Badge
            variant="secondary"
            className="text-[11px] font-semibold bg-graphite/90 text-white backdrop-blur-xs border-none"
          >
            {item.category}
          </Badge>
          {item.isFeatured && (
            <Badge
              variant="default"
              className="text-[11px] font-semibold bg-amber text-graphite shadow-xs border-none"
            >
              Featured
            </Badge>
          )}
        </div>

        {/* Wishlist / Favorite Heart Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          disabled={loadingSave}
          aria-label={saved ? "Remove from favorites" : "Add to favorites"}
          className={`absolute top-2.5 right-2.5 h-8 w-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
            saved
              ? "bg-red-500 text-white shadow-md scale-105"
              : "bg-black/40 text-white hover:bg-black/60 hover:scale-110"
          }`}
        >
          <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
        </button>

        {/* Availability Strip */}
        <div className="absolute bottom-2 left-2.5">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              item.availability
                ? "bg-emerald-500/90 text-white"
                : "bg-amber-600/90 text-white"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            {item.availability ? "Available Now" : "Currently Booked"}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <CardContent className="flex-1 flex flex-col p-4 sm:p-5">
        {/* Rating and Location Header */}
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground mb-2">
          <div className="flex items-center gap-1 font-semibold text-foreground">
            <Star className="h-3.5 w-3.5 fill-amber text-amber-text" />
            <span>{(item.rating || 5.0).toFixed(1)}</span>
            <span className="text-muted-foreground font-normal">
              ({item.totalReviews || 0})
            </span>
          </div>

          <div className="flex items-center gap-1 truncate">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="truncate">
              {item.location?.city ? `${item.location.city}, ${item.location.state}` : "National Fleet"}
            </span>
          </div>
        </div>

        {/* Title (clicking checks auth if required) */}
        <button
          type="button"
          onClick={handleDetailsClick}
          className="text-left group-hover:text-amber-text transition-colors"
        >
          <h3 className="font-bold text-base leading-snug line-clamp-2 text-foreground">
            {displayTitle}
          </h3>
        </button>

        {/* Short description */}
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">
          {item.description}
        </p>

        {/* Condition & Available Quantity pill */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] px-2 py-0.5 rounded bg-muted font-medium text-foreground">
            Condition: {item.condition || "Excellent"}
          </span>
          {item.availableQuantity !== undefined && (
            <span className="text-[11px] text-muted-foreground">
              Qty: <strong>{item.availableQuantity}</strong>
            </span>
          )}
        </div>
      </CardContent>

      {/* Card Footer with Price and View Details CTA */}
      <CardFooter className="p-4 sm:p-5 pt-0 mt-auto flex items-center justify-between border-t border-border/50 pt-3">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg sm:text-xl font-extrabold text-foreground">
              {formatCurrency(displayPrice)}
            </span>
            <span className="text-xs text-muted-foreground font-medium">/ {displayRentalType.toLowerCase()}</span>
          </div>
          {item.securityDeposit ? (
            <p className="text-[10px] text-muted-foreground">
              +{formatCurrency(item.securityDeposit)} deposit
            </p>
          ) : null}
        </div>

        <Button
          onClick={handleDetailsClick}
          size="sm"
          className="font-semibold text-xs gap-1 group/btn bg-amber text-graphite hover:bg-amber/90"
        >
          <span>View Details</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
