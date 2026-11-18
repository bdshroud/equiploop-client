import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, ShieldCheck, ArrowRight, DollarSign } from "lucide-react";

export function OwnerCTASection() {
  return (
    <section className="py-16 sm:py-20 bg-graphite text-white relative overflow-hidden transition-colors border-t border-border/20">
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-amber/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber/20 text-amber text-xs font-semibold uppercase tracking-wider mb-4">
              <DollarSign className="h-3.5 w-3.5" />
              <span>For Machinery & Tool Fleet Owners</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white">
              Have idle machines sitting in your yard?
            </h2>

            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              EquipLoop connects your fleet with verified commercial contractors, event producers, and trades. Set your daily rates, enforce security deposits, and receive guaranteed Stripe payouts.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <ShieldCheck className="h-4 w-4 text-amber" />
                <span>Zero listing fees</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <ShieldCheck className="h-4 w-4 text-amber" />
                <span>Automated damage deposit holds</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0 justify-center">
            <Link href="/dashboard/owner/equipment/new" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-amber text-graphite hover:bg-amber/90 font-bold gap-2 px-8"
              >
                <PlusCircle className="h-5 w-5" />
                <span>List Equipment Now</span>
              </Button>
            </Link>

            <Link href="/about" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 font-semibold gap-2"
              >
                <span>Owner FAQ</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
