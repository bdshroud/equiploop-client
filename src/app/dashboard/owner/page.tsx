"use client";

import * as React from "react";
import Link from "next/link";
import {
  Layers,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  PlusCircle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";
import { apiErrorMessage, fetchApi } from "@/lib/api";
import { toast } from "sonner";

interface OwnerAnalyticsData {
  totalEquipment: number;
  activeRentals: number;
  pendingRequests: number;
  totalEarnings: number;
  monthlyData: Array<{ month: string; earnings: number; bookings: number }>;
  recentBookings: Array<{
    _id: string;
    equipmentTitle: string;
    customerName: string;
    startDate: string;
    endDate: string;
    totalAmount: number;
    status: string;
    paymentStatus: string;
  }>;
}

export default function OwnerOverviewPage() {
  const [data, setData] = React.useState<OwnerAnalyticsData | null>(null);
  const [loading, setLoading] = React.useState(true);

  const loadAnalytics = React.useCallback(async () => {
    try {
      const res = await fetchApi<{ success: boolean; data: OwnerAnalyticsData }>("/analytics/owner");
      if (res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.warn("Owner analytics error:", apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const handleStatusChange = async (bookingId: string, status: string) => {
    try {
      await fetchApi(`/bookings/${bookingId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast.success(`Booking status changed to "${status}"`);
      loadAnalytics();
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to update status"));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    );
  }

  const stats = [
    {
      label: "Fleet Equipment Listed",
      value: data?.totalEquipment || 0,
      icon: Layers,
      desc: "Total machines under management",
    },
    {
      label: "Active On-Site Rentals",
      value: data?.activeRentals || 0,
      icon: Clock,
      desc: "Currently deployed on job sites",
    },
    {
      label: "Pending Inquiries",
      value: data?.pendingRequests || 0,
      icon: CalendarCheck,
      desc: "Awaiting your confirmation",
    },
    {
      label: "Total Gross Earnings",
      value: formatCurrency(data?.totalEarnings || 0),
      icon: DollarSign,
      desc: "Processed via Stripe Escrow",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header and Quick Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber mb-1">
            Fleet Operations & Yield
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Fleet Owner Dashboard
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Monitor rental requests, machine deployment, and monthly revenue performance.
          </p>
        </div>

        <Link href="/dashboard/owner/equipment/new">
          <Button size="sm" className="bg-amber text-graphite hover:bg-amber/90 font-bold gap-1.5 shadow-sm">
            <PlusCircle className="h-4 w-4" />
            <span>List New Machine</span>
          </Button>
        </Link>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-5 rounded-2xl border-border bg-card shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">{s.label}</span>
                <div className="h-8 w-8 rounded-lg bg-amber/15 text-amber flex items-center justify-center">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-foreground">{s.value}</span>
                <p className="text-[11px] text-muted-foreground mt-0.5">{s.desc}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Monthly Earnings Chart */}
      <Card className="p-6 rounded-2xl border-border bg-card shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-foreground">Monthly Fleet Revenue</h2>
            <p className="text-xs text-muted-foreground">
              Rental earnings breakdown over the past 6 months
            </p>
          </div>
          <Badge variant="amber" className="text-xs">
            Yield Tracking
          </Badge>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.monthlyData || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: "12px",
                }}
                formatter={(val?: number | string | ReadonlyArray<number | string>) => [`$${val ?? 0}`, "Earnings"]}
              />
              <Bar dataKey="earnings" fill="#E9A44C" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Bookings & Actions */}
      <Card className="p-6 rounded-2xl border-border bg-card shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-foreground">Recent Rental Inquiries</h2>
            <p className="text-xs text-muted-foreground">
              Manage contractor booking requests and verify dispatch
            </p>
          </div>
          <Link href="/dashboard/owner/bookings" className="text-xs font-bold text-amber hover:underline">
            View All Inquiries →
          </Link>
        </div>

        {data?.recentBookings && data.recentBookings.length > 0 ? (
          <div className="divide-y divide-border/60">
            {data.recentBookings.map((b) => (
              <div key={b._id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-sm text-foreground">{b.equipmentTitle}</h4>
                  <p className="text-xs text-muted-foreground">
                    Contractor: <strong>{b.customerName}</strong> • Dates: {formatDate(b.startDate)} to {formatDate(b.endDate)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-bold text-sm text-foreground block">
                      {formatCurrency(b.totalAmount)}
                    </span>
                    <Badge variant={b.status === "Confirmed" ? "info" : "outline"} className="text-[10px]">
                      {b.status}
                    </Badge>
                  </div>

                  {b.status === "Pending" && (
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(b._id, "Confirmed")}
                        className="bg-emerald-600 text-white hover:bg-emerald-700 text-xs h-7 px-2.5"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(b._id, "Cancelled")}
                        className="text-destructive hover:bg-destructive/10 text-xs h-7 px-2.5"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic py-4">
            No rental requests yet. Ensure your equipment listings have competitive pricing and complete specifications.
          </p>
        )}
      </Card>
    </div>
  );
}
