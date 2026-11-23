import { Search, CalendarCheck, CreditCard, Truck } from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Find Your Machinery",
    desc: "Search by equipment class, manufacturer, lift capacity, and job-site location.",
    icon: Search,
  },
  {
    step: "02",
    title: "Select Rental Dates",
    desc: "Choose project start and end dates with real-time fleet availability checking.",
    icon: CalendarCheck,
  },
  {
    step: "03",
    title: "Stripe Escrow Checkout",
    desc: "Pay securely with credit card. Funds are held in escrow until dispatch is verified.",
    icon: CreditCard,
  },
  {
    step: "04",
    title: "Delivery or Pickup",
    desc: "Receive job-site flatbed delivery or pick up directly from verified equipment yards.",
    icon: Truck,
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-16 sm:py-20 bg-background transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-text mb-1.5">
            Operational Workflow
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            How EquipLoop Works
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Engineered for general contractors, event producers, and trades. Zero back-and-forth phone tags.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="relative flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-card shadow-xs group hover:border-amber/50 hover:shadow-md transition-all duration-300"
              >
                {/* Step Number Badge */}
                <div className="absolute -top-3.5 px-2.5 py-0.5 rounded-full bg-graphite dark:bg-amber text-amber dark:text-graphite text-xs font-black shadow-xs">
                  STEP {s.step}
                </div>

                {/* Icon */}
                <div className="mt-3 h-14 w-14 rounded-2xl bg-amber/15 text-amber-text flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-7 w-7" />
                </div>

                {/* Title */}
                <h3 className="font-bold text-base text-foreground mb-2">
                  {s.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
