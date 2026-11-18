import { ShieldCheck, Zap, DollarSign, Wrench, Clock, Users } from "lucide-react";

export function WhyChooseSection() {
  const perks = [
    {
      title: "Commercial Grade Reliability",
      desc: "Every listed machine undergoes pre-rental safety, hydraulic, and hour-meter inspection before dispatch.",
      icon: Wrench,
    },
    {
      title: "Zero Capex Depreciation",
      desc: "Avoid hundreds of thousands of dollars in machinery loans and maintenance overhead by renting on-demand.",
      icon: DollarSign,
    },
    {
      title: "Instant Digital Booking",
      desc: "No paper lease forms or waiting on dispatch quotes. Check live dates and book in under two minutes.",
      icon: Zap,
    },
    {
      title: "Stripe Escrow & Payout Protection",
      desc: "Bank-grade payments with automated damage deposit holds and prompt owner disbursements.",
      icon: ShieldCheck,
    },
    {
      title: "24/7 Dedicated Job-Site Support",
      desc: "Dedicated logistics coordinators on standby to assist with delivery scheduling, swap-outs, or extensions.",
      icon: Clock,
    },
    {
      title: "Fleet Owner Network",
      desc: "Connect directly with certified commercial plant operators, equipment dealers, and specialized tool sheds.",
      icon: Users,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-muted/30 border-y border-border/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-bold uppercase tracking-wider text-amber mb-1.5">
            The EquipLoop Advantage
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Built for Serious Contractors & Fleet Owners
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            The modern standard for equipment rentals. Transparent terms, proven machinery, zero downtime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {perks.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="p-6 rounded-2xl bg-card border border-border hover:border-amber/40 transition-colors shadow-xs"
              >
                <div className="h-10 w-10 rounded-xl bg-amber/15 text-amber flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-foreground mb-1.5">
                  {p.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
