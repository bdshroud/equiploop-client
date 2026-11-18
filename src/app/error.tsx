"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[EquipLoop Runtime Error]:", error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-4rem-12rem)] flex flex-col items-center justify-center p-6 text-center">
      <div className="h-14 w-14 rounded-2xl bg-destructive/15 text-destructive flex items-center justify-center mb-4">
        <AlertCircle className="h-8 w-8" />
      </div>

      <h1 className="text-2xl font-black text-foreground tracking-tight">
        Unexpected Operational Glitch
      </h1>
      <p className="text-xs text-muted-foreground max-w-md mx-auto mt-2 mb-6">
        An error occurred while loading this page. Our logistics desk has logged the incident.
      </p>

      <div className="flex items-center gap-3">
        <Button
          onClick={() => reset()}
          size="sm"
          className="bg-amber text-graphite hover:bg-amber/90 font-bold text-xs gap-1.5"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Try Again</span>
        </Button>

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
