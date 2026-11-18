export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-12 sm:py-16 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-3xl font-black text-foreground">Terms of Service</h1>
          <p className="text-xs text-muted-foreground mt-1">Last revised: November 2026</p>
        </div>

        <div className="space-y-6 text-xs text-muted-foreground leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-foreground">1. Marketplace Platform Agreement</h2>
            <p>
              EquipLoop provides a commercial equipment rental platform connecting verified machinery owners with contractors and individual renters. By accessing or using EquipLoop, you agree to comply with these terms, local safety standards, and applicable commercial vehicle laws.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-foreground">2. Security Deposits & Escrow</h2>
            <p>
              Renters acknowledge that refundable security deposits are authorized and placed into escrow via Stripe at the time of booking. Deposits are released following return inspection and confirmation of machine condition.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-foreground">3. Machine Care & Operational Safety</h2>
            <p>
              Renters agree to operate machinery only within certified manufacturer parameters and ensure that only qualified personnel operate equipment. Any damages incurred beyond normal wear and tear remain the financial responsibility of the renter.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
