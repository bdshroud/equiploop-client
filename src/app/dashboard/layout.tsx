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
  Menu,
  Wrench,
  ChevronRight,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { clearCachedJwtToken } from "@/lib/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const role = session?.user?.role || "Customer";

  const handleSignOut = async () => {
    clearCachedJwtToken();
    await signOut();
    router.push("/");
  };

  // Zero Reload-Redirect Bug: Wait for session resolution before deciding
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-4 border-amber border-t-transparent animate-spin" />
          <span className="text-xs font-semibold text-muted-foreground">
            Verifying EquipLoop session...
          </span>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-[calc(100vh-4rem-12rem)] flex flex-col items-center justify-center p-6 text-center">
        <div className="h-14 w-14 rounded-2xl bg-amber/15 text-amber flex items-center justify-center mb-4">
          <Wrench className="h-7 w-7" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-foreground">Sign In Required</h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          Please sign in to access your EquipLoop commercial equipment dashboard.
        </p>
        <Link href={`/login?redirect=${encodeURIComponent(pathname)}`}>
          <Button className="bg-amber text-graphite hover:bg-amber/90 font-bold">
            Sign In Now
          </Button>
        </Link>
      </div>
    );
  }

  // Exact Role-Based Navigation
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
    { label: "All Rentals", href: "/dashboard/admin/rentals", icon: CalendarCheck },
    { label: "Profile", href: "/dashboard/profile", icon: User },
  ];

  let currentNav = customerNav;
  if (role === "Owner") currentNav = ownerNav;
  if (role === "Admin") currentNav = adminNav;

  const NavContent = (
    <div className="h-full flex flex-col justify-between">
      <div className="space-y-6">
        {/* User info banner */}
        <div className="pb-4 border-b border-border space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Signed in as
          </span>
          <h3 className="font-bold text-sm text-foreground truncate">{session.user.name}</h3>
          <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
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
                onClick={() => setMobileOpen(false)}
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

        {/* Upsell for Customer to become Owner */}
        {role === "Customer" && (
          <div className="p-4 rounded-xl bg-amber/10 border border-amber/20 space-y-2">
            <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5 text-amber" />
              <span>Own Equipment?</span>
            </h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              List machinery with EquipLoop and start earning daily rental payouts.
            </p>
            <Link href="/dashboard/owner/equipment/new" onClick={() => setMobileOpen(false)} className="block pt-1">
              <Button size="sm" variant="outline" className="w-full text-xs font-bold border-amber/40 hover:bg-amber hover:text-graphite">
                List Machinery
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Bottom sign out button */}
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
    </div>
  );

  return (
    <div className="min-h-screen bg-background transition-colors flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-border bg-card p-6 shrink-0 flex-col justify-between">
        {NavContent}
      </aside>

      {/* Main Content Area with Header */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Dashboard Top Header with Theme Toggle */}
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Sheet Drawer */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open dashboard menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-6">
                <SheetHeader className="text-left pb-4 border-b border-border mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-graphite dark:bg-amber text-amber dark:text-graphite">
                      <Wrench className="h-4 w-4" />
                    </div>
                    <SheetTitle className="text-base font-black">
                      Equip<span className="text-amber">Loop</span>
                    </SheetTitle>
                  </div>
                </SheetHeader>
                {NavContent}
              </SheetContent>
            </Sheet>

            {/* Breadcrumb / Title Display */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground font-medium">Dashboard</span>
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
              <span className="font-bold text-foreground capitalize">
                {pathname.split("/").filter(Boolean).pop()?.replace(/-/g, " ") || "Overview"}
              </span>
            </div>
          </div>

          {/* Right Header Actions: Theme Toggle & User Info */}
          <div className="flex items-center gap-3">
            {/* Mandatory Theme Toggle in Dashboard Header */}
            <ThemeToggle />

            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src={session.user.image || ""} />
                <AvatarFallback className="bg-graphite text-amber font-bold text-xs">
                  {session.user.name ? session.user.name.slice(0, 2).toUpperCase() : "EL"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline-block text-xs font-semibold text-foreground truncate max-w-[120px]">
                {session.user.name}
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
