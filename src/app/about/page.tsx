import Link from "next/link";
import { Wrench, ShieldCheck, Award, Users, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background py-12 sm:py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-amber mb-1.5">
            About EquipLoop
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
            Rent smarter. Work better.
          </h1>
          <p className="text-base text-muted-foreground mt-4 leading-relaxed">
            EquipLoop is North America&apos;s leading commercial-grade equipment rental marketplace. We connect construction companies, industrial contractors, event coordinators, and tradespeople with vetted machinery owners.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-card border border-border shadow-xs space-y-3">
            <div className="h-12 w-12 rounded-xl bg-amber/15 text-amber flex items-center justify-center font-bold">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-foreground">Verified Asset Quality</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We eliminate the uncertainty of equipment rental. Every machine listed undergoes inspection checks and hour-meter verification.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-card border border-border shadow-xs space-y-3">
            <div className="h-12 w-12 rounded-xl bg-amber/15 text-amber flex items-center justify-center font-bold">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-foreground">Secure Escrow Protection</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Powered by Stripe, our escrow system protects both renters and owners against unauthorized cancellations and machine damage.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-card border border-border shadow-xs space-y-3">
            <div className="h-12 w-12 rounded-xl bg-amber/15 text-amber flex items-center justify-center font-bold">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-foreground">Frictionless Dispatch</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Digital reservation calendars, automated invoices, and flexible job-site flatbed transport eliminate traditional depot friction.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="p-10 rounded-3xl bg-graphite text-white text-center max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold">Ready to modernize your equipment workflow?</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Join thousands of site foremen and fleet operators renting and monetizing equipment on EquipLoop today.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link href="/equipment">
              <Button className="bg-amber text-graphite hover:bg-amber/90 font-bold text-xs">
                Browse Equipment Catalog
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 text-xs">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
