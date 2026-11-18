"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, CalendarCheck, ShieldCheck, ArrowRight, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const bookingId = searchParams.get("bookingId");

  const [verified, setVerified] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function confirmPayment() {
      if (!sessionId) {
        setLoading(false);
        return;
      }
      try {
        await fetchApi(`/payments/verify-session/${sessionId}?bookingId=${bookingId || ""}`);
        setVerified(true);
        toast.success("Payment verified and recorded successfully!");
      } catch (err) {
        console.warn("Payment verification notice:", err);
      } finally {
        setLoading(false);
      }
    }
    confirmPayment();
  }, [sessionId, bookingId]);

  return (
    <div className="min-h-[calc(100vh-4rem-12rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <Card className="w-full max-w-lg p-6 sm:p-8 rounded-3xl border-border bg-card shadow-2xl text-center space-y-6">
        <div className="h-16 w-16 rounded-2xl bg-emerald-500/15 text-emerald-500 mx-auto flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Escrow Transaction Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Rental Booking Confirmed!
          </h1>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Your Stripe payment has been confirmed and placed into escrow. The equipment owner has received your dispatch reservation.
          </p>
        </div>

        {/* Transaction Summary Card */}
        <div className="p-4 rounded-xl bg-muted/50 border border-border/80 text-left text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Booking Reference:</span>
            <span className="font-mono font-bold text-foreground truncate max-w-[200px]">
              {bookingId || "EL-CONFIRMED"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment Status:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              Paid in Full (Stripe Escrow)
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Deposit Hold:</span>
            <span className="font-semibold text-foreground">
              Secured (Refundable upon inspection)
            </span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard/rentals" className="w-full sm:w-auto">
            <Button size="lg" className="w-full bg-amber text-graphite hover:bg-amber/90 font-bold text-xs gap-1.5 shadow-md">
              <CalendarCheck className="h-4 w-4" />
              <span>View Rental Invoices</span>
            </Button>
          </Link>

          <Link href="/equipment" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full font-semibold text-xs gap-1.5">
              <span>Browse More Equipment</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <React.Suspense fallback={<div className="p-12 text-center text-xs text-muted-foreground">Verifying payment with Stripe...</div>}>
      <PaymentSuccessContent />
    </React.Suspense>
  );
}
