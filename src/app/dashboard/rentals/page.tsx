"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CalendarCheck,
  CreditCard,
  CheckCircle2,
  XCircle,
  ExternalLink,
  MessageSquare,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";
import { apiErrorMessage, fetchApi } from "@/lib/api";
import { EquipmentImage } from "@/components/equipment/EquipmentImage";
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
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState(0);

  const loadBookings = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchApi<{
        success: boolean;
        data: Booking[];
        pagination?: { total: number; page: number; limit: number; totalPages: number };
      }>(`/bookings/my-bookings?page=${page}&limit=5`);

      if (res.data) {
        setBookings(res.data);
      }
      if (res.pagination) {
        setTotalPages(res.pagination.totalPages || 1);
        setTotalCount(res.pagination.total || 0);
      }
    } catch (err) {
      console.warn("Could not load bookings:", apiErrorMessage(err));
      toast.error(apiErrorMessage(err, "Could not load your rentals"));
    } finally {
      setLoading(false);
    }
  }, [page]);

  React.useEffect(() => {
    loadBookings();
  }, [loadBookings]);

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
    } catch (err) {
      toast.error(apiErrorMessage(err, "Payment initiation failed"));
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
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to cancel booking"));
    }
  };

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "Pending":
        return <Badge variant="secondary" className="bg-amber/15 text-amber-text border-amber/30 text-[10px]">Pending</Badge>;
      case "Confirmed":
        return <Badge variant="info" className="text-[10px]">Confirmed</Badge>;
      case "Active":
        return <Badge variant="success" className="text-[10px]">Active on Site</Badge>;
      case "Completed":
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/30 text-[10px]">Completed</Badge>;
      case "Cancelled":
        return <Badge variant="destructive" className="text-[10px]">Cancelled</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px]">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-amber-text mb-1">
          Customer Rental Ledger
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          My Rentals
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Review dispatch statuses, manage Stripe payments, and track equipment rental dates in tabular ledger format.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card">
          <div className="h-12 w-12 rounded-full bg-amber/15 text-amber-text mx-auto flex items-center justify-center mb-3">
            <CalendarCheck className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg text-foreground">No Rental Bookings Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-6">
            You haven&apos;t reserved any equipment yet. Explore our verified commercial fleet to find the machinery you need.
          </p>
          <Link href="/equipment">
            <Button size="sm" className="bg-amber text-graphite hover:bg-amber/90 font-bold">
              Browse Available Equipment
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
                  <th className="py-3 px-4">Rental Start Date</th>
                  <th className="py-3 px-4">Rental End Date</th>
                  <th className="py-3 px-4">Booking Date</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Payment Status</th>
                  <th className="py-3 px-4">Booking Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-muted/30 transition-colors">
                    {/* Equipment Name */}
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      <Link href={`/equipment/${b.equipmentId}`} className="hover:text-amber-text-text transition-colors flex items-center gap-2">
                        <EquipmentImage src={b.equipmentImage || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=100&q=80"} alt={b.equipmentTitle} width={48} height={36} className="h-9 w-12 rounded object-cover border border-border shrink-0" />
                        <span className="line-clamp-1 max-w-[200px]">{b.equipmentTitle}</span>
                      </Link>
                    </td>

                    {/* Rental Start Date */}
                    <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                      {formatDate(b.startDate)}
                    </td>

                    {/* Rental End Date */}
                    <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                      {formatDate(b.endDate)}
                    </td>

                    {/* Booking Date */}
                    <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                      {formatDate(b.createdAt)}
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-4 font-bold text-foreground whitespace-nowrap">
                      {formatCurrency(b.totalAmount)}
                    </td>

                    {/* Payment Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge
                        variant={b.paymentStatus === "Paid" ? "success" : "amber"}
                        className="text-[10px]"
                      >
                        {b.paymentStatus === "Paid" ? "Paid (Escrow)" : "Unpaid"}
                      </Badge>
                    </td>

                    {/* Booking Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(b.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.paymentStatus === "Unpaid" && b.status !== "Cancelled" && (
                          <Button
                            size="sm"
                            disabled={payingId === b._id}
                            onClick={() => handlePayNow(b._id)}
                            className="bg-amber text-graphite hover:bg-amber/90 font-bold text-[11px] h-7 px-2.5 gap-1"
                          >
                            <CreditCard className="h-3 w-3" />
                            <span>{payingId === b._id ? "..." : "Pay"}</span>
                          </Button>
                        )}

                        {b.status === "Pending" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCancel(b._id)}
                            className="text-[11px] h-7 px-2 text-destructive hover:bg-destructive/10"
                          >
                            Cancel
                          </Button>
                        )}

                        {b.status === "Completed" && (
                          <Link href={`/equipment/${b.equipmentId}`}>
                            <Button size="sm" variant="outline" className="text-[11px] h-7 px-2 gap-1">
                              <MessageSquare className="h-3 w-3 text-amber-text" />
                              <span>Review</span>
                            </Button>
                          </Link>
                        )}

                        <Link href={`/equipment/${b.equipmentId}`}>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls for Booking History per Optional Requirement */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-border flex items-center justify-between bg-card text-xs">
              <span className="text-muted-foreground">
                Showing page <strong className="text-foreground">{page}</strong> of <strong className="text-foreground">{totalPages}</strong> ({totalCount} total bookings)
              </span>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-8 text-xs font-semibold"
                >
                  Previous
                </Button>

                {[...Array(totalPages)].map((_, i) => {
                  const pNum = i + 1;
                  return (
                    <Button
                      key={pNum}
                      variant={page === pNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(pNum)}
                      className={`h-8 w-8 p-0 text-xs font-bold ${
                        page === pNum ? "bg-amber text-graphite hover:bg-amber/90" : ""
                      }`}
                    >
                      {pNum}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="h-8 text-xs font-semibold"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
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
