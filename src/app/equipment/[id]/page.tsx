"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Star,
  MapPin,
  ShieldCheck,
  Calendar,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  Share2,
  Heart,
  ArrowLeft,
  ChevronRight,
  User,
  Wrench,
  DollarSign,
  Layers,
  FileText,
  Boxes,
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

interface EquipmentDetail extends EquipmentItem {
  specifications: Record<string, string>;
  rentalTerms?: string;
  ownerEmail?: string;
  reviews?: Array<{
    _id: string;
    customerName: string;
    rating: number;
    comment: string;
    createdAt: string;
  }>;
}

function EquipmentDetailContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: session, isPending: sessionLoading } = useSession();

  const [item, setItem] = React.useState<EquipmentDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [favLoading, setFavLoading] = React.useState(false);

  // Booking Form State (Modal / Sticky Widget)
  const [todayStr, setTodayStr] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [requiredQuantity, setRequiredQuantity] = React.useState(1);
  const [deliveryOption, setDeliveryOption] = React.useState<"Pickup" | "Delivery">("Pickup");
  const [deliveryAddress, setDeliveryAddress] = React.useState("");
  const [customerPhone, setCustomerPhone] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [bookingLoading, setBookingLoading] = React.useState(false);

  // Review Form State
  const [reviewRating, setReviewRating] = React.useState(5);
  const [reviewComment, setReviewComment] = React.useState("");
  const [reviewLoading, setReviewLoading] = React.useState(false);

  React.useEffect(() => {
    setTodayStr(new Date().toISOString().split("T")[0]);

    async function loadItem() {
      setLoading(true);
      try {
        const res = await fetchApi<{ success: boolean; data: EquipmentDetail }>(`/equipment/${id}`);
        if (res.data) {
          setItem(res.data);
        }
      } catch (err: any) {
        toast.error("Equipment not found or failed to load");
      } finally {
        setLoading(false);
      }
    }

    async function checkFavorite() {
      if (!session?.user) return;
      try {
        const favRes = await fetchApi<{ success: boolean; data: EquipmentItem[] }>("/users/favorites");
        if (favRes.data && Array.isArray(favRes.data)) {
          const found = favRes.data.some((f) => f._id === id);
          setIsFavorite(found);
        }
      } catch (err) {
        // Ignored
      }
    }

    if (id) {
      loadItem();
      checkFavorite();
    }
  }, [id, session?.user]);

  // Private route check per assignment requirement: redirect to login if session checked and no user
  React.useEffect(() => {
    if (!sessionLoading && !session?.user) {
      toast.info("Please sign in to access equipment details and rental booking");
      router.replace(`/login?redirect=/equipment/${id}`);
    }
  }, [sessionLoading, session, router, id]);

  // Calculations for booking duration and quantity
  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return 1;
    const diff = Math.abs(end.getTime() - start.getTime());
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const totalDays = calculateDays();
  const dailyRate = item?.rentalPrice || item?.pricePerDay || 0;
  const quantity = Math.max(1, requiredQuantity);
  const rentalFee = dailyRate * totalDays * quantity;
  const securityDeposit = (item?.securityDeposit || 0) * quantity;
  const serviceFee = Math.round(rentalFee * 0.05) || 10;
  const totalAmount = rentalFee + securityDeposit + serviceFee;

  const handleToggleFavorite = async () => {
    if (!session?.user) {
      toast.info("Please sign in to add this equipment to your favorites");
      router.push(`/login?redirect=/equipment/${id}`);
      return;
    }

    try {
      setFavLoading(true);
      const res = await fetchApi<{ success: boolean; isSaved: boolean }>(`/users/favorites/${id}`, {
        method: "POST",
      });
      setIsFavorite(res.isSaved);
      if (res.isSaved) {
        toast.success("Added to your favorites list");
      } else {
        toast.info("Removed from your favorites list");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update favorites");
    } finally {
      setFavLoading(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error("Please sign in or create an account to book equipment");
      router.push(`/login?redirect=/equipment/${id}`);
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Please select valid rental start and end dates");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Start date cannot be after end date");
      return;
    }

    const availableQty = item?.availableQuantity !== undefined ? item.availableQuantity : 1;
    if (quantity > availableQty) {
      toast.error(`Only ${availableQty} unit(s) are currently available.`);
      return;
    }

    try {
      setBookingLoading(true);
      const res = await fetchApi<{
        success: boolean;
        message: string;
        data: { _id: string };
      }>("/bookings", {
        method: "POST",
        body: JSON.stringify({
          equipmentId: id,
          startDate,
          endDate,
          requiredQuantity: quantity,
          deliveryOption,
          deliveryAddress: deliveryOption === "Delivery" ? deliveryAddress : "",
          customerPhone,
          notes,
        }),
      });

      toast.success("Booking request created! Redirecting to Stripe Checkout...");
      const bookingId = res.data._id;

      // Initiate Stripe Checkout session
      const checkoutRes = await fetchApi<{
        success: boolean;
        url: string;
      }>("/payments/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({ bookingId }),
      });

      if (checkoutRes.url) {
        window.location.href = checkoutRes.url;
      } else {
        router.push("/dashboard/rentals");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to initiate booking");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error("Please sign in to submit a review");
      return;
    }
    if (!reviewComment.trim()) {
      toast.error("Please provide review feedback");
      return;
    }

    try {
      setReviewLoading(true);
      await fetchApi("/reviews", {
        method: "POST",
        body: JSON.stringify({
          equipmentId: id,
          rating: reviewRating,
          comment: reviewComment.trim(),
        }),
      });

      toast.success("Review published successfully!");
      setReviewComment("");
      const updated = await fetchApi<{ success: boolean; data: EquipmentDetail }>(`/equipment/${id}`);
      setItem(updated.data);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-96 lg:col-span-2 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Equipment Listing Not Found</h2>
        <p className="text-sm text-muted-foreground mt-2 mb-6">
          The requested machine might have been retired or unlisted.
        </p>
        <Link href="/equipment">
          <Button>Back to Fleet Catalog</Button>
        </Link>
      </div>
    );
  }

  const images = item.images && item.images.length > 0 ? item.images : [
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
  ];

  const displayTitle = item.equipmentName || item.title;
  const rentalType = item.rentalType || "Daily";
  const availableQty = item.availableQuantity !== undefined ? item.availableQuantity : 1;

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link & Category Path */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
          <Link href="/equipment" className="hover:text-amber transition-colors flex items-center gap-1 font-medium">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Equipment</span>
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/equipment?category=${encodeURIComponent(item.category)}`} className="hover:text-amber transition-colors">
            {item.category}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold truncate max-w-xs">{displayTitle}</span>
        </div>

        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="secondary" className="font-semibold bg-graphite text-white">
                {item.category}
              </Badge>
              <Badge variant="amber" className="font-semibold">
                Rental Type: {rentalType}
              </Badge>
              <Badge variant="outline" className="font-semibold">
                Condition: {item.condition || "Excellent"}
              </Badge>
              <Badge variant="secondary" className="font-semibold">
                Available Qty: {availableQty}
              </Badge>
              {item.availability && availableQty > 0 ? (
                <Badge variant="success" className="font-semibold">
                  In Stock & Ready for Dispatch
                </Badge>
              ) : (
                <Badge variant="destructive" className="font-semibold">
                  Currently Rented Out
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight">
              {displayTitle}
            </h1>

            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
              <div className="flex items-center gap-1 text-foreground font-semibold">
                <Star className="h-4 w-4 fill-amber text-amber" />
                <span>{(item.rating || 5.0).toFixed(1)}</span>
                <span className="text-muted-foreground font-normal">({item.totalReviews || 0} reviews)</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{item.location?.city ? `${item.location.city}, ${item.location.state}` : "Equipment Yard"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Add to Favorites Button */}
            <Button
              variant="outline"
              size="sm"
              disabled={favLoading}
              onClick={handleToggleFavorite}
              className={`gap-1.5 text-xs font-semibold ${
                isFavorite ? "border-red-500 text-red-500 bg-red-50 dark:bg-red-950/20" : ""
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
              <span>{isFavorite ? "In Favorites" : "Add to Favorites"}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-semibold"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Listing link copied!");
              }}
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share</span>
            </Button>
          </div>
        </div>

        {/* Main Grid: Gallery & Details (Left) + Booking Widget (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 Cols on lg): Gallery, Description, Specs, Rental Terms, Owner, Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="space-y-3">
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-border bg-muted shadow-sm">
                <img
                  src={images[activeImageIndex]}
                  alt={displayTitle}
                  className="h-full w-full object-cover"
                />
              </div>

              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImageIndex(i)}
                      className={`relative h-18 w-24 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        activeImageIndex === i ? "border-amber ring-2 ring-amber/30" : "border-border opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <Card className="p-6 rounded-2xl">
              <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <Wrench className="h-5 w-5 text-amber" />
                <span>Equipment Overview & Purpose</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            </Card>

            {/* Rental Terms and Conditions */}
            <Card className="p-6 rounded-2xl border-amber/30 bg-amber/5">
              <h2 className="text-base font-bold text-foreground mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber" />
                <span>Rental Terms & Conditions</span>
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.rentalTerms ||
                  "Refundable damage deposit required. Certified and qualified operator only. Equipment must be returned in clean condition with equivalent fuel/charge levels."}
              </p>
            </Card>

            {/* Specifications */}
            <Card className="p-6 rounded-2xl">
              <h2 className="text-lg font-bold text-foreground mb-4">
                OEM Technical Specifications
              </h2>
              {item.specifications && Object.keys(item.specifications).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(item.specifications).map(([key, val]) => (
                    <div
                      key={key}
                      className="p-3 rounded-xl bg-muted/50 border border-border/60 flex items-center justify-between text-xs"
                    >
                      <span className="font-medium text-muted-foreground">{key}</span>
                      <span className="font-bold text-foreground">{val}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Standard commercial configuration.</p>
              )}
            </Card>

            {/* Owner Profile Card */}
            <Card className="p-6 rounded-2xl">
              <h2 className="text-lg font-bold text-foreground mb-4">
                Verified Equipment Owner Information
              </h2>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-graphite dark:bg-amber text-amber dark:text-graphite flex items-center justify-center font-bold text-lg">
                    {item.ownerName ? item.ownerName.slice(0, 2).toUpperCase() : "FL"}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-foreground flex items-center gap-1.5">
                      <span>{item.ownerName || "Commercial Fleet Yard"}</span>
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Verified Fleet Owner • Fast Dispatch Response • Escrow Protected
                    </p>
                  </div>
                </div>

                <Badge variant="amber" className="text-xs">
                  Identity Verified
                </Badge>
              </div>
            </Card>

            {/* Reviews Section */}
            <Card className="p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Customer Reviews ({item.reviews?.length || 0})
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Verified feedback from contractors who previously rented this machine.
                  </p>
                </div>

                <div className="flex items-center gap-1 text-sm font-bold text-amber bg-amber/10 px-3 py-1.5 rounded-lg">
                  <Star className="h-4 w-4 fill-amber" />
                  <span>{(item.rating || 5.0).toFixed(1)} / 5.0</span>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {item.reviews && item.reviews.length > 0 ? (
                  item.reviews.map((rev) => (
                    <div key={rev._id} className="p-4 rounded-xl bg-muted/40 border border-border/60">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-graphite text-white flex items-center justify-center text-xs font-bold">
                            {rev.customerName?.slice(0, 1) || "U"}
                          </div>
                          <span className="font-semibold text-xs text-foreground">
                            {rev.customerName}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber text-amber" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    No reviews yet. Be the first contractor to rent and review this equipment!
                  </p>
                )}
              </div>

              {/* Add a Review Form */}
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="font-bold text-sm text-foreground mb-3">Leave a Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Rating</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="h-9 px-3 rounded-md border border-input bg-background text-xs"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 - Exceptional Machine)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 - Great Condition)</option>
                      <option value={3}>⭐⭐⭐ (3 - Acceptable)</option>
                      <option value={2}>⭐⭐ (2 - Below Standard)</option>
                      <option value={1}>⭐ (1 - Unusable)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Feedback</label>
                    <textarea
                      rows={3}
                      placeholder="Share your job-site experience with this equipment..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full p-2.5 rounded-md border border-input bg-background text-xs focus:outline-none focus:ring-1 focus:ring-amber"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="sm"
                    disabled={reviewLoading}
                    className="font-semibold text-xs bg-amber text-graphite hover:bg-amber/90"
                  >
                    {reviewLoading ? "Submitting..." : "Post Review"}
                  </Button>
                </form>
              </div>
            </Card>
          </div>

          {/* Right Column: Booking Modal / Sticky Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-2xl border border-border bg-card p-6 shadow-xl space-y-6">
              {/* Price Header */}
              <div className="flex items-baseline justify-between pb-4 border-b border-border">
                <div>
                  <span className="text-3xl font-extrabold text-foreground">
                    {formatCurrency(dailyRate)}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium"> / {rentalType.toLowerCase()}</span>
                </div>
                <Badge variant="amber" className="font-bold text-xs">
                  Instant Book
                </Badge>
              </div>

              {/* Booking Form with Required Fields */}
              <form onSubmit={handleBooking} className="space-y-4">
                {/* Dates */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Rental Start Date *
                    </label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={todayStr}
                      required
                      className="text-xs bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Rental End Date *
                    </label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || todayStr}
                      required
                      className="text-xs bg-background"
                    />
                  </div>
                </div>

                {/* Required Quantity */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-foreground">
                      Required Quantity *
                    </label>
                    <span className="text-[11px] text-muted-foreground">
                      In Stock: {availableQty}
                    </span>
                  </div>
                  <Input
                    type="number"
                    min="1"
                    max={availableQty}
                    value={requiredQuantity}
                    onChange={(e) => setRequiredQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    required
                    className="text-xs bg-background"
                  />
                </div>

                {/* Contact Number */}
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Contact Number *
                  </label>
                  <Input
                    type="tel"
                    placeholder="e.g. (512) 555-0199"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    className="text-xs bg-background"
                  />
                </div>

                {/* Delivery Option */}
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Delivery Option
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryOption("Pickup")}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        deliveryOption === "Pickup"
                          ? "border-amber bg-amber/15 text-amber"
                          : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      <span>Yard Pickup</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryOption("Delivery")}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        deliveryOption === "Delivery"
                          ? "border-amber bg-amber/15 text-amber"
                          : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Truck className="h-3.5 w-3.5" />
                      <span>Site Delivery</span>
                    </button>
                  </div>
                </div>

                {/* Delivery Address */}
                {deliveryOption === "Delivery" && (
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Delivery Address *
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. 1024 Construction Way, Site Lot 4B"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      required
                      className="text-xs bg-background"
                    />
                  </div>
                )}

                {/* Additional Notes */}
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Special dispatch instructions, gate codes, operator details..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2.5 rounded-md border border-input bg-background text-xs focus:outline-none focus:ring-1 focus:ring-amber"
                  />
                </div>

                {/* Pricing Breakdown Card */}
                <div className="p-4 rounded-xl bg-muted/50 border border-border/80 space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>
                      {formatCurrency(dailyRate)} × {totalDays} {rentalType.toLowerCase()}(s) × {quantity} unit(s)
                    </span>
                    <span className="font-semibold text-foreground">{formatCurrency(rentalFee)}</span>
                  </div>

                  <div className="flex justify-between text-muted-foreground">
                    <span>Refundable Deposit ({quantity} × {formatCurrency(item.securityDeposit || 0)})</span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(securityDeposit)}
                    </span>
                  </div>

                  <div className="flex justify-between text-muted-foreground">
                    <span>Platform Insurance & Escrow Fee</span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(serviceFee)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-border flex justify-between text-sm font-extrabold text-foreground">
                    <span>Total Rental Amount</span>
                    <span className="text-amber">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>

                {/* Book Equipment CTA */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={bookingLoading || !item.availability || availableQty === 0}
                  className="w-full font-bold bg-amber text-graphite hover:bg-amber/90 gap-2 shadow-md"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  <span>
                    {bookingLoading
                      ? "Contacting Stripe Gateway..."
                      : item.availability && availableQty > 0
                      ? `Book Equipment • ${formatCurrency(totalAmount)}`
                      : "Currently Unavailable"}
                  </span>
                </Button>

                <p className="text-[11px] text-center text-muted-foreground">
                  🔒 Handled securely with Stripe Checkout. Escrow funds protected.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EquipmentDetailPage() {
  return (
    <React.Suspense fallback={<div className="p-12 text-center text-xs text-muted-foreground">Loading equipment details...</div>}>
      <EquipmentDetailContent />
    </React.Suspense>
  );
}
