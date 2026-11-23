import Link from "next/link";
import { Wrench, Home, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-4rem-12rem)] flex flex-col items-center justify-center p-6 text-center">
      <div className="h-16 w-16 rounded-2xl bg-amber-surface text-amber-text border border-amber-surface-border flex items-center justify-center mb-4">
        <Wrench className="h-8 w-8" />
      </div>

      <span className="text-4xl font-black text-amber-text">404</span>
      <h1 className="text-2xl font-black text-foreground tracking-tight mt-1">
        Equipment Page Not Found
      </h1>
      <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-2 mb-6 leading-relaxed">
        The machinery listing or route you requested might have been decommissioned or moved to another category.
      </p>

      <div className="flex items-center gap-3">
        <Link href="/equipment">
          <Button size="sm" className="bg-amber text-graphite hover:bg-amber/90 font-bold text-xs gap-1.5">
            <Search className="h-3.5 w-3.5" />
            <span>Search Fleet Catalog</span>
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" size="sm" className="font-semibold text-xs gap-1.5">
            <Home className="h-3.5 w-3.5" />
            <span>Return Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
