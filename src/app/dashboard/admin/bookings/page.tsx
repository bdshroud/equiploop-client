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
  Mail,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";
import { apiErrorMessage, fetchApi } from "@/lib/api";
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
    } catch (err) {
      console.warn("Failed to load platform bookings:", apiErrorMessage(err));
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
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to update status"));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-amber-text mb-1 flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Audit & Transaction Ledger</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          All Bookings (Manage Bookings)
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
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="p-10 text-center rounded-2xl border border-dashed border-border bg-card">
          <CalendarCheck className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-semibold">No platform bookings found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/60 text-muted-foreground border-b border-border uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Customer Information</th>
                <th className="py-3.5 px-4">Owner Information</th>
                <th className="py-3.5 px-4">Equipment Name</th>
                <th className="py-3.5 px-4">Rental Duration</th>
                <th className="py-3.5 px-4">Booking Amount</th>
                <th className="py-3.5 px-4">Payment Status</th>
                <th className="py-3.5 px-4 text-right">Booking Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-muted/30 transition-colors">
                  {/* Customer Information */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-foreground">{b.customerName}</div>
                    <span className="text-[10px] text-muted-foreground font-mono block">
                      {b.customerEmail}
                    </span>
                  </td>

                  {/* Owner Information */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-foreground">{b.ownerName || "Fleet Owner"}</div>
                    <span className="text-[10px] text-muted-foreground block">
                      Depot Dispatch
                    </span>
                  </td>

                  {/* Equipment Name */}
                  <td className="py-3.5 px-4 font-bold text-foreground">
                    <span className="line-clamp-1">{b.equipmentTitle}</span>
                    <span className="text-[10px] text-muted-foreground font-normal block">
                      {b.deliveryOption}
                    </span>
                  </td>

                  {/* Rental Duration */}
                  <td className="py-3.5 px-4 text-muted-foreground">
                    <div className="font-medium text-foreground">
                      {b.totalDays} {b.totalDays === 1 ? "day" : "days"}
                    </div>
                    <span className="text-[10px] text-muted-foreground block">
                      {formatDate(b.startDate)} → {formatDate(b.endDate)}
                    </span>
                  </td>

                  {/* Booking Amount */}
                  <td className="py-3.5 px-4 font-extrabold text-foreground">
                    {formatCurrency(b.totalAmount)}
                  </td>

                  {/* Payment Status */}
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={b.paymentStatus === "Paid" ? "success" : "amber"}
                      className="text-[10px] font-bold"
                    >
                      {b.paymentStatus}
                    </Badge>
                  </td>

                  {/* Booking Status / Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
