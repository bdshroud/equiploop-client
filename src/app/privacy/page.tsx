export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-12 sm:py-16 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-3xl font-black text-foreground">Privacy Policy</h1>
          <p className="text-xs text-muted-foreground mt-1">Last revised: November 2026</p>
        </div>

        <div className="space-y-6 text-xs text-muted-foreground leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-foreground">1. Data We Collect</h2>
            <p>
              EquipLoop collects user contact information (name, email, phone number, dispatch address) and rental transaction records to facilitate commercial machinery bookings and identity verification.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-foreground">2. Payment Security</h2>
            <p>
              All payment credentials, credit card details, and payout banking routing information are processed directly by Stripe under PCI-DSS Level 1 compliance. EquipLoop never stores sensitive card numbers on its servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-foreground">3. Information Sharing</h2>
            <p>
              Your contact details and job-site delivery information are shared exclusively with the verified equipment owner fulfilling your specific rental booking for logistics coordination.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
