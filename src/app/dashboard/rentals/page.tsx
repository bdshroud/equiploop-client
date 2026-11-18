"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CalendarCheck,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Wrench,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

interface Booking {
  _id: string;
  equipmentId: string;
  equipmentTitle: string;
  equipmentImage: string;
  equipmentCategory: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalAmount: number;
  status: "Pending" | "Confirmed" | "Active" | "Completed" | "Cancelled";
  paymentStatus: "Unpaid" | "Paid" | "Refunded";
  deliveryOption: string;
  deliveryAddress?: string;
  createdAt: string;
}

function CustomerRentalsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentQuery = searchParams.get("payment");
  const sessionId = searchParams.get("session_id");
  const bookingIdQuery = searchParams.get("bookingId");

  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [payingId, setPayingId] = React.useState<string | null>(null);

  const loadBookings = React.useCallback(async () => {
    try {
      const res = await fetchApi<{ success: boolean; data: Booking[] }>("/bookings/my-bookings");
      if (res.data) {
        setBookings(res.data);
      }
    } catch (err: any) {
      console.warn("Could not load bookings:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle Stripe callback verification
  React.useEffect(() => {
    if (paymentQuery && (paymentQuery === "success" || paymentQuery === "mock_success") && sessionId) {
      async function verify() {
        try {
          await fetchApi(`/payments/verify-session/${sessionId}?bookingId=${bookingIdQuery || ""}`);
          toast.success("Payment confirmed! Your rental booking is now Confirmed.");
          loadBookings();
        } catch (err) {
          console.warn("Verification error:", err);
        }
      }
      verify();
    } else if (paymentQuery === "cancelled") {
      toast.info("Stripe checkout was cancelled. You can complete payment anytime.");
    }
    loadBookings();
  }, [paymentQuery, sessionId, bookingIdQuery, loadBookings]);

  const handlePayNow = async (bookingId: string) => {
    try {
      setPayingId(bookingId);
      const res = await fetchApi<{ success: boolean; url: string }>(
        "/payments/create-checkout-session",
        {
          method: "POST",
          body: JSON.stringify({ bookingId }),
        }
      );

      if (res.url) {
        window.location.href = res.url;
      } else {
        toast.error("Could not generate checkout session");
      }
    } catch (err: any) {
      toast.error(err.message || "Payment initiation failed");
    } finally {
      setPayingId(null);
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this pending booking?")) return;

    try {
      await fetchApi(`/bookings/${bookingId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "Cancelled" }),
      });
      toast.success("Booking request cancelled");
      loadBookings();
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel booking");
    }
  };

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "Pending":
        return <Badge variant="secondary" className="bg-amber/15 text-amber border-amber/30">Pending Approval</Badge>;
      case "Confirmed":
        return <Badge variant="info">Confirmed & Ready</Badge>;
      case "Active":
        return <Badge variant="success">Active on Site</Badge>;
      case "Completed":
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/30">Completed</Badge>;
      case "Cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-amber mb-1">
          Rental History & Bookings
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          My Equipment Bookings
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Review dispatch statuses, access digital rental invoices, and complete Stripe payments.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card">
          <div className="h-12 w-12 rounded-full bg-amber/15 text-amber mx-auto flex items-center justify-center mb-3">
            <CalendarCheck className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg text-foreground">No Bookings Yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-6">
            You haven&apos;t reserved any commercial equipment yet. Browse our verified fleet to find the machinery you need.
          </p>
          <Link href="/equipment">
            <Button size="sm" className="bg-amber text-graphite hover:bg-amber/90 font-bold">
              Browse Available Equipment
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <Card key={b._id} className="p-5 rounded-2xl overflow-hidden shadow-xs hover:border-amber/40 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Equipment Info */}
                <div className="flex items-start gap-4">
                  <div className="h-18 w-24 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                    <img
                      src={b.equipmentImage || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80"}
                      alt={b.equipmentTitle}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {b.equipmentCategory}
                      </span>
                      {getStatusBadge(b.status)}
                      {b.paymentStatus === "Paid" ? (
                        <Badge variant="success" className="text-[10px]">
                          Paid in Full
                        </Badge>
                      ) : (
                        <Badge variant="amber" className="text-[10px]">
                          Payment Due
                        </Badge>
                      )}
                    </div>

                    <Link href={`/equipment/${b.equipmentId}`} className="hover:text-amber transition-colors">
                      <h3 className="font-bold text-base text-foreground leading-tight">
                        {b.equipmentTitle}
                      </h3>
                    </Link>

                    <div className="text-xs text-muted-foreground flex items-center gap-3 pt-0.5">
                      <span>
                        Dates: <strong className="text-foreground">{formatDate(b.startDate)}</strong> to{" "}
                        <strong className="text-foreground">{formatDate(b.endDate)}</strong> ({b.totalDays} day{b.totalDays > 1 ? "s" : ""})
                      </span>
                      <span>•</span>
                      <span>Delivery: {b.deliveryOption}</span>
                    </div>
                  </div>
                </div>

                {/* Pricing and Action Buttons */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-border gap-2 shrink-0">
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-muted-foreground block">Total Amount</span>
                    <span className="text-lg font-black text-foreground">
                      {formatCurrency(b.totalAmount)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Pay Now Button if Unpaid */}
                    {b.paymentStatus === "Unpaid" && b.status !== "Cancelled" && (
                      <Button
                        size="sm"
                        disabled={payingId === b._id}
                        onClick={() => handlePayNow(b._id)}
                        className="bg-amber text-graphite hover:bg-amber/90 font-bold text-xs gap-1.5 shadow-sm"
                      >
                        <CreditCard className="h-3.5 w-3.5" />
                        <span>{payingId === b._id ? "Loading..." : "Pay with Stripe"}</span>
                      </Button>
                    )}

                    {/* Cancel button if pending */}
                    {b.status === "Pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancel(b._id)}
                        className="text-xs text-destructive hover:bg-destructive/10 font-semibold"
                      >
                        Cancel
                      </Button>
                    )}

                    {/* Review Button if Completed */}
                    {b.status === "Completed" && (
                      <Link href={`/equipment/${b.equipmentId}`}>
                        <Button size="sm" variant="outline" className="text-xs font-semibold gap-1">
                          <MessageSquare className="h-3.5 w-3.5 text-amber" />
                          <span>Review</span>
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CustomerRentalsPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading rental bookings...</div>}>
      <CustomerRentalsContent />
    </React.Suspense>
  );
}
