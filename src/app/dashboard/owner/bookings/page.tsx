"use client";

import * as React from "react";
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Truck,
  Phone,
  Mail,
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
  requiredQuantity?: number;
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

  const getStatusBadge = (status: OwnerBooking["status"]) => {
    switch (status) {
      case "Pending":
        return <Badge variant="secondary" className="bg-amber/15 text-amber border-amber/30 text-[10px]">Pending</Badge>;
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
        <div className="text-xs font-bold uppercase tracking-wider text-amber mb-1">
          Owner Fleet Management
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          My Equipment Rental
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Review all equipment rentals for your machines in tabular format.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card">
          <div className="h-12 w-12 rounded-full bg-amber/15 text-amber mx-auto flex items-center justify-center mb-3">
            <CalendarCheck className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg text-foreground">No Equipment Rentals Yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
            When contractors book your equipment, rental duration, quantity, and payment statuses will display here.
          </p>
        </div>
      ) : (
        /* Table Format per Assignment Specification */
        <Card className="rounded-2xl border-border bg-card shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground font-semibold border-b border-border uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Customer Information</th>
                  <th className="py-3 px-4">Equipment Information</th>
                  <th className="py-3 px-4">Rental Duration</th>
                  <th className="py-3 px-4">Required Quantity</th>
                  <th className="py-3 px-4">Booking Amount</th>
                  <th className="py-3 px-4">Payment Status</th>
                  <th className="py-3 px-4">Booking Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-muted/30 transition-colors">
                    {/* Customer Information */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="font-bold text-foreground">{b.customerName}</div>
                        <div className="text-[11px] text-muted-foreground">{b.customerEmail}</div>
                        {b.customerPhone && (
                          <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3 text-amber" />
                            <span>{b.customerPhone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Equipment Information */}
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      <span className="line-clamp-1 max-w-[180px]">{b.equipmentTitle}</span>
                      <span className="text-[10px] font-normal text-muted-foreground block">
                        Handover: {b.deliveryOption}
                      </span>
                    </td>

                    {/* Rental Duration */}
                    <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                      <div>{formatDate(b.startDate)} to {formatDate(b.endDate)}</div>
                      <div className="text-[10px] font-semibold text-foreground">({b.totalDays} day{b.totalDays > 1 ? "s" : ""})</div>
                    </td>

                    {/* Required Quantity */}
                    <td className="py-3.5 px-4 font-semibold text-foreground whitespace-nowrap">
                      {b.requiredQuantity || 1} unit(s)
                    </td>

                    {/* Booking Amount */}
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

                    {/* Actions: Approve, Reject, Dispatched, Complete */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.status === "Pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStatus(b._id, "Confirmed")}
                              className="bg-emerald-600 text-white hover:bg-emerald-700 text-[11px] h-7 px-2 font-semibold"
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(b._id, "Cancelled")}
                              className="text-[11px] h-7 px-2 text-destructive hover:bg-destructive/10 font-semibold"
                            >
                              Reject
                            </Button>
                          </>
                        )}

                        {b.status === "Confirmed" && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(b._id, "Active")}
                            className="bg-amber text-graphite hover:bg-amber/90 text-[11px] h-7 px-2 font-bold"
                          >
                            Dispatch
                          </Button>
                        )}

                        {b.status === "Active" && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(b._id, "Completed")}
                            className="bg-purple-600 text-white hover:bg-purple-700 text-[11px] h-7 px-2 font-semibold"
                          >
                            Mark Returned
                          </Button>
                        )}
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
