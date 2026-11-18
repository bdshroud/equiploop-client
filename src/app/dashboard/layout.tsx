"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Bookmark,
  User,
  PlusCircle,
  Layers,
  ShieldCheck,
  Users,
  LogOut,
  Building,
  Heart,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // @ts-ignore
  const role = session?.user?.role || "Customer";

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-amber border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-[calc(100vh-4rem-12rem)] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Please sign in to access your EquipLoop dashboard.
        </p>
        <Link href="/login">
          <Button className="bg-amber text-graphite hover:bg-amber/90 font-bold">
            Sign In Now
          </Button>
        </Link>
      </div>
    );
  }

  // Exact Assignment Role-Based Navigation
  const customerNav = [
    { label: "My Rentals", href: "/dashboard/rentals", icon: CalendarCheck },
    { label: "Favorites", href: "/dashboard/favorites", icon: Heart },
    { label: "Profile", href: "/dashboard/profile", icon: User },
  ];

  const ownerNav = [
    { label: "Fleet Overview", href: "/dashboard/owner", icon: LayoutDashboard },
    { label: "My Equipment", href: "/dashboard/owner/equipment", icon: Layers },
    { label: "Add Equipment", href: "/dashboard/owner/equipment/new", icon: PlusCircle },
    { label: "My Equipment Rental", href: "/dashboard/owner/bookings", icon: CalendarCheck },
    { label: "Profile", href: "/dashboard/profile", icon: User },
  ];

  const adminNav = [
    { label: "Platform Overview", href: "/dashboard/admin", icon: ShieldCheck },
    { label: "All Users", href: "/dashboard/admin/users", icon: Users },
    { label: "All Equipment", href: "/dashboard/admin/equipment", icon: Layers },
    { label: "All Bookings", href: "/dashboard/admin/bookings", icon: CalendarCheck },
    { label: "Profile", href: "/dashboard/profile", icon: User },
  ];

  let currentNav = customerNav;
  if (role === "Owner") currentNav = ownerNav;
  if (role === "Admin") currentNav = adminNav;

  return (
    <div className="min-h-screen bg-background transition-colors flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-border bg-card p-4 sm:p-6 shrink-0 flex flex-col justify-between">
        <div className="space-y-6">
          {/* User info header */}
          <div className="pb-4 border-b border-border space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Signed in as
            </span>
            <h3 className="font-bold text-sm text-foreground truncate">{session.user.name}</h3>
            <div className="flex items-center gap-2 pt-1">
              <Badge variant="amber" className="text-[10px] px-2 py-0">
                {role} Portal
              </Badge>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {currentNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-amber text-graphite shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Switch Role Banner (if customer wanting to become owner) */}
          {role === "Customer" && (
            <div className="p-4 rounded-xl bg-amber/10 border border-amber/20 space-y-2">
              <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-amber" />
                <span>Own Equipment?</span>
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                List machinery with EquipLoop and start earning daily rental payouts.
              </p>
              <Link href="/dashboard/owner/equipment/new" className="block pt-1">
                <Button size="sm" variant="outline" className="w-full text-xs font-bold border-amber/40 hover:bg-amber hover:text-graphite">
                  List Your First Machine
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Bottom sign out */}
        <div className="pt-6 border-t border-border mt-6">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Dashboard Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
