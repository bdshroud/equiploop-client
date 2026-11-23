"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Layers,
  CalendarCheck,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  PieChart as PieIcon,
  AlertCircle,
  CheckCircle2,
  Clock,
  BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
import { formatCurrency } from "@/lib/utils";
import { apiErrorMessage, fetchApi } from "@/lib/api";

interface AdminAnalyticsData {
  totalUsers: number;
  totalEquipment: number;
  totalBookings: number;
  pendingApprovals: number;
  pendingEquipment?: number;
  pendingBookings?: number;
  completedRentals: number;
  totalRevenue: number;
  totalPlatformFee: number;
  categoryDistribution: Array<{ name: string; value: number }>;
  statusCounts: Array<{ status: string; count: number }>;
  revenueTrend: Array<{ month: string; revenue: number; bookings: number }>;
  monthlyBookingStats?: Array<{ month: string; revenue: number; bookings: number }>;
}

export default function AdminOverviewPage() {
  const [data, setData] = React.useState<AdminAnalyticsData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [chartMetric, setChartMetric] = React.useState<"revenue" | "bookings">("revenue");

  React.useEffect(() => {
    async function loadAdminAnalytics() {
      try {
        const res = await fetchApi<{ success: boolean; data: AdminAnalyticsData }>("/analytics/admin");
        if (res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.warn("Admin analytics error:", apiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    loadAdminAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  const metrics = [
    {
      label: "Platform Users",
      value: data?.totalUsers || 0,
      icon: Users,
      desc: "Contractors, Owners & Admins",
    },
    {
      label: "Total Equipment",
      value: data?.totalEquipment || 0,
      icon: Layers,
      desc: "Active commercial fleet",
    },
    {
      label: "Total Bookings",
      value: data?.totalBookings || 0,
      icon: CalendarCheck,
      desc: "All-time reservations",
    },
    {
      label: "Pending Approvals",
      value: data?.pendingApprovals || 0,
      icon: AlertCircle,
      desc: `${data?.pendingEquipment ?? 0} equipment, ${data?.pendingBookings ?? 0} bookings`,
    },
    {
      label: "Completed Rentals",
      value: data?.completedRentals || 0,
      icon: CheckCircle2,
      desc: "Successfully closed rentals",
    },
    {
      label: "Gross Platform Revenue",
      value: formatCurrency(data?.totalRevenue || 0),
      icon: DollarSign,
      desc: `Platform fees: ${formatCurrency(data?.totalPlatformFee || 0)}`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-text mb-1 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Platform Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Admin Master Console
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Global equipment moderation, user role permissions, transaction escrow, and operational analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/admin/equipment">
            <Button size="sm" variant="outline" className="text-xs font-semibold">
              Moderate Equipment
            </Button>
          </Link>
          <Link href="/dashboard/admin/users">
            <Button size="sm" className="bg-amber text-graphite hover:bg-amber/90 font-bold text-xs">
              Manage Users
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row: 6 KPI Cards covering all challenge requirements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.label} className="p-5 rounded-2xl border-border bg-card shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">{m.label}</span>
                <div className="h-8 w-8 rounded-lg bg-amber/15 text-amber-text flex items-center justify-center">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-foreground">{m.value}</span>
                <p className="text-[11px] text-muted-foreground mt-0.5">{m.desc}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recharts Revenue & Monthly Booking Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 rounded-2xl border-border bg-card shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-base font-bold text-foreground">
                {chartMetric === "revenue" ? "Monthly Revenue Statistics (USD)" : "Monthly Booking Statistics"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {chartMetric === "revenue"
                  ? "Gross platform transaction volume over the last 6 months"
                  : "Platform rental reservation volume over the last 6 months"}
              </p>
            </div>
            <div className="flex items-center gap-1.5 p-1 rounded-lg border border-border bg-muted/40">
              <button
                type="button"
                onClick={() => setChartMetric("revenue")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  chartMetric === "revenue"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Revenue ($)
              </button>
              <button
                type="button"
                onClick={() => setChartMetric("bookings")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  chartMetric === "bookings"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly Bookings
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartMetric === "revenue" ? (
                <AreaChart data={data?.revenueTrend || []}>
                  <defs>
                    <linearGradient id="adminRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E9A44C" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#E9A44C" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
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
                    formatter={(val?: number | string | ReadonlyArray<number | string>) => [`$${val ?? 0}`, "Gross Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#E9A44C"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#adminRevenue)"
                  />
                </AreaChart>
              ) : (
                <BarChart data={data?.monthlyBookingStats || data?.revenueTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "0.5rem",
                      fontSize: "12px",
                    }}
                    formatter={(val?: number | string | ReadonlyArray<number | string>) => [`${val ?? 0} bookings`, "Total Bookings"]}
                  />
                  <Bar dataKey="bookings" fill="#E9A44C" radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Breakdown */}
        <Card className="p-6 rounded-2xl border-border bg-card shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-foreground">Fleet by Category</h2>
            <Badge variant="secondary" className="text-xs">Distribution</Badge>
          </div>

          <div className="space-y-3 pt-2">
            {data?.categoryDistribution && data.categoryDistribution.length > 0 ? (
              data.categoryDistribution.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground truncate max-w-[140px]">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber rounded-full"
                        style={{ width: `${Math.min(100, cat.value * 20)}%` }}
                      />
                    </div>
                    <span className="font-bold text-foreground w-6 text-right">{cat.value}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground italic">No category data recorded yet.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
