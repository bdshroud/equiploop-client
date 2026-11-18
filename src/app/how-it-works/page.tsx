import Link from "next/link";
import {
  Search,
  CalendarCheck,
  CreditCard,
  Truck,
  ShieldCheck,
  Building,
  DollarSign,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
  const renterSteps = [
    {
      num: "01",
      title: "Discover Commercial Inventory",
      desc: "Filter by machine class, operating weight, brand (Caterpillar, Bobcat, Genie), and job-site location.",
      icon: Search,
    },
    {
      num: "02",
      title: "Reserve Project Dates",
      desc: "Select single-day, weekly, or multi-month dates with guaranteed fleet reservation.",
      icon: CalendarCheck,
    },
    {
      num: "03",
      title: "Secure Stripe Escrow Payment",
      desc: "Transparent rates without hidden depot fees. Damage deposit is secured and released upon return.",
      icon: CreditCard,
    },
    {
      num: "04",
      title: "Flatbed Delivery or Yard Pickup",
      desc: "Choose direct job-site flatbed transport or drive your trailer to the designated equipment yard.",
      icon: Truck,
    },
  ];

  const ownerSteps = [
    {
      num: "01",
      title: "List Machinery in Minutes",
      desc: "Upload photos, set daily rates, list specifications, and specify damage deposit amounts.",
      icon: Building,
    },
    {
      num: "02",
      title: "Review Contractor Requests",
      desc: "Inspect incoming project inquiries and approve contractors with verified identity.",
      icon: ShieldCheck,
    },
    {
      num: "03",
      title: "Handover & Machine Check-in",
      desc: "Complete digital handover with pre-rental condition photos and hour-meter readings.",
      icon: CheckCircle2,
    },
    {
      num: "04",
      title: "Guaranteed Stripe Payouts",
      desc: "Receive rental proceeds directly to your bank account with zero payment friction.",
      icon: DollarSign,
    },
  ];

  const faqs = [
    {
      q: "How does the security deposit work?",
      a: "When you book equipment, the refundable security deposit is authorized via Stripe. Once the machinery is returned in inspected condition at the conclusion of your rental, the hold is released automatically.",
    },
    {
      q: "Can I get equipment delivered directly to a job site?",
      a: "Yes! During checkout, select 'Site Delivery' and input your project location. The fleet owner will arrange flatbed or tilt-tray dispatch to your designated address.",
    },
    {
      q: "What happens if a machine encounters mechanical failure?",
      a: "All EquipLoop machines are maintained to OEM standards. In the rare event of mechanical failure during normal operation, the fleet owner provides an on-site technician or equivalent swap-out within hours.",
    },
    {
      q: "Are equipment owners verified before listing?",
      a: "Yes. Every machinery owner undergoes commercial business verification, insurance validation, and asset ownership vetting before listings are approved on the public catalog.",
    },
  ];

  return (
    <div className="min-h-screen bg-background py-12 sm:py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-amber mb-1.5">
            Operational Blueprint
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            How EquipLoop Works
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            The frictionless equipment rental marketplace engineered for builders, contractors, and fleet operators.
          </p>
        </div>

        {/* For Renters Section */}
        <div className="space-y-6">
          <div className="border-b border-border pb-3">
            <h2 className="text-xl font-bold text-foreground">For Contractors & Renters</h2>
            <p className="text-xs text-muted-foreground">From machine search to job-site operation in four simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {renterSteps.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.num} className="p-6 rounded-2xl border border-border bg-card shadow-xs relative">
                  <span className="text-3xl font-black text-amber/40 block mb-2">{s.num}</span>
                  <div className="h-10 w-10 rounded-xl bg-amber/15 text-amber flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-base text-foreground mb-1">{s.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* For Owners Section */}
        <div className="space-y-6">
          <div className="border-b border-border pb-3">
            <h2 className="text-xl font-bold text-foreground">For Fleet & Equipment Owners</h2>
            <p className="text-xs text-muted-foreground">Turn idle yard machinery into predictable monthly commercial revenue.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ownerSteps.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.num} className="p-6 rounded-2xl border border-border bg-card shadow-xs relative">
                  <span className="text-3xl font-black text-amber/40 block mb-2">{s.num}</span>
                  <div className="h-10 w-10 rounded-xl bg-amber/15 text-amber flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-base text-foreground mb-1">{s.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="pt-8 border-t border-border">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="h-10 w-10 rounded-full bg-amber/15 text-amber mx-auto flex items-center justify-center mb-2">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Common questions about payments, security deposits, and handover logistics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-border bg-card shadow-xs">
                <h3 className="font-bold text-sm text-foreground mb-2">{faq.q}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
