"use client";

import * as React from "react";
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Truck,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

interface OwnerBooking {
  _id: string;
  equipmentId: string;
  equipmentTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
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

export default function OwnerBookingsPage() {
  const [bookings, setBookings] = React.useState<OwnerBooking[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadBookings = React.useCallback(async () => {
    try {
      const res = await fetchApi<{ success: boolean; data: OwnerBooking[] }>("/bookings/owner-bookings");
      if (res.data) {
        setBookings(res.data);
      }
    } catch (err: any) {
      console.warn("Could not load owner bookings:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await fetchApi(`/bookings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast.success(`Booking status updated to "${status}"`);
      loadBookings();
    } catch (err: any) {
      toast.error(err.message || "Failed to update booking status");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-amber mb-1">
          Contractor Inquiries & Dispatch
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Rental Booking Requests
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Review contractor job-site requests, approve reservations, verify Stripe escrow, and manage handover.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card">
          <div className="h-12 w-12 rounded-full bg-amber/15 text-amber mx-auto flex items-center justify-center mb-3">
            <CalendarCheck className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg text-foreground">No Rental Inquiries Yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
            As contractors book your listed machinery, their dispatch requests and dates will appear here for review.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <Card key={b._id} className="p-5 rounded-2xl border-border bg-card shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/60">
                <div>
                  <h3 className="font-bold text-base text-foreground leading-snug">
                    {b.equipmentTitle}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>
                      Dates: <strong className="text-foreground">{formatDate(b.startDate)}</strong> to{" "}
                      <strong className="text-foreground">{formatDate(b.endDate)}</strong> ({b.totalDays} day{b.totalDays > 1 ? "s" : ""})
                    </span>
                    <span>•</span>
                    <span>Total: <strong className="text-foreground">{formatCurrency(b.totalAmount)}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={b.status === "Confirmed" ? "info" : b.status === "Active" ? "success" : "outline"} className="text-xs">
                    {b.status}
                  </Badge>
                  <Badge variant={b.paymentStatus === "Paid" ? "success" : "amber"} className="text-xs">
                    {b.paymentStatus === "Paid" ? "Escrow Funded (Stripe)" : "Unpaid"}
                  </Badge>
                </div>
              </div>

              {/* Contractor & Dispatch Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">Contractor:</span>
                  <span>{b.customerName}</span>
                </div>
                {b.customerPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-amber" />
                    <span>{b.customerPhone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Truck className="h-3.5 w-3.5 text-amber" />
                  <span>{b.deliveryOption} {b.deliveryAddress ? `(${b.deliveryAddress})` : ""}</span>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-2 flex items-center gap-2 flex-wrap justify-end">
                {b.status === "Pending" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(b._id, "Confirmed")}
                      className="bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold h-8"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      Approve Booking
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(b._id, "Cancelled")}
                      className="text-xs text-destructive hover:bg-destructive/10 font-semibold h-8"
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1" />
                      Reject
                    </Button>
                  </>
                )}

                {b.status === "Confirmed" && (
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus(b._id, "Active")}
                    className="bg-amber text-graphite hover:bg-amber/90 text-xs font-bold h-8"
                  >
                    <Truck className="h-3.5 w-3.5 mr-1" />
                    Mark Dispatched / On Site
                  </Button>
                )}

                {b.status === "Active" && (
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus(b._id, "Completed")}
                    className="bg-purple-600 text-white hover:bg-purple-700 text-xs font-semibold h-8"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    Mark Returned / Completed
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
