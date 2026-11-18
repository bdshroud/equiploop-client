"use client";

import * as React from "react";
import {
  CalendarCheck,
  Search,
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

interface AdminBookingItem {
  _id: string;
  equipmentId: string;
  equipmentTitle: string;
  customerName: string;
  customerEmail: string;
  ownerName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalAmount: number;
  status: "Pending" | "Confirmed" | "Active" | "Completed" | "Cancelled";
  paymentStatus: "Unpaid" | "Paid" | "Refunded";
  deliveryOption: string;
  createdAt: string;
}

export default function AdminBookingsAuditPage() {
  const [bookings, setBookings] = React.useState<AdminBookingItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState("All");

  const loadAllBookings = React.useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "All") params.set("status", statusFilter);

      const res = await fetchApi<{ success: boolean; data: AdminBookingItem[] }>(
        `/bookings/admin/all?${params.toString()}`
      );
      if (res.data) {
        setBookings(res.data);
      }
    } catch (err: any) {
      console.warn("Failed to load platform bookings:", err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  React.useEffect(() => {
    loadAllBookings();
  }, [loadAllBookings]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await fetchApi(`/bookings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast.success(`Booking status changed to "${status}"`);
      loadAllBookings();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-amber mb-1 flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Audit & Transaction Ledger</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          All Platform Rental Bookings
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Complete ledger of rental reservations, escrow payments, machine dispatch, and dispute audits.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-card border border-border flex items-center justify-between gap-3 shadow-xs">
        <span className="text-xs font-semibold text-foreground">Filter by Status:</span>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 px-3 rounded-md border border-input bg-background text-xs font-medium focus:outline-none focus:ring-1 focus:ring-amber"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Active">Active on Site</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="p-10 text-center rounded-2xl border border-dashed border-border bg-card">
          <CalendarCheck className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-semibold">No platform bookings found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <Card key={b._id} className="p-4 rounded-xl border-border bg-card shadow-xs hover:border-amber/40 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm text-foreground">{b.equipmentTitle}</h3>
                    <Badge variant={b.status === "Confirmed" ? "info" : b.status === "Active" ? "success" : "outline"} className="text-[10px]">
                      {b.status}
                    </Badge>
                    <Badge variant={b.paymentStatus === "Paid" ? "success" : "amber"} className="text-[10px]">
                      {b.paymentStatus}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Contractor: <strong>{b.customerName}</strong> ({b.customerEmail}) • Owner: <strong>{b.ownerName}</strong>
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Dates: {formatDate(b.startDate)} to {formatDate(b.endDate)} ({b.totalDays} days) • Handover: {b.deliveryOption}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-border justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="font-extrabold text-sm text-foreground block">
                      {formatCurrency(b.totalAmount)}
                    </span>
                    <span className="text-[10px] text-muted-foreground">Escrow Amount</span>
                  </div>

                  <select
                    value={b.status}
                    onChange={(e) => handleUpdateStatus(b._id, e.target.value)}
                    className="h-8 px-2 rounded-md border border-input bg-background text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
