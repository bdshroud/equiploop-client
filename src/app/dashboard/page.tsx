"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function DashboardIndexPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  React.useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    const role = session.user.role || "Customer";

    if (role === "Admin") {
      router.replace("/dashboard/admin");
    } else if (role === "Owner") {
      router.replace("/dashboard/owner");
    } else {
      router.replace("/dashboard/rentals");
    }
  }, [session, isPending, router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-4 border-amber border-t-transparent animate-spin" />
        <span className="text-xs font-semibold text-muted-foreground">
          Routing to your portal...
        </span>
      </div>
    </div>
  );
}
