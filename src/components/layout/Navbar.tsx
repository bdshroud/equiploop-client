"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Wrench,
  Search,
  User,
  LogOut,
  LayoutDashboard,
  Bookmark,
  PlusCircle,
  ShieldCheck,
  Menu,
  X,
  Layers,
  ChevronDown,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { clearCachedJwtToken } from "@/lib/api";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [sheetOpen, setSheetOpen] = React.useState(false);

  // User role inference
  const userRole = session?.user?.role || "Customer";
  const user = session?.user;

  const handleSignOut = async () => {
    clearCachedJwtToken();
    await signOut();
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { label: "Browse Equipment", href: "/equipment" },
    { label: "Categories", href: "/categories" },
    { label: "How It Works", href: "/how-it-works" },
  ];

  const getDashboardHome = () => {
    if (userRole === "Admin") return "/dashboard/admin";
    if (userRole === "Owner") return "/dashboard/owner";
    return "/dashboard/rentals";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-graphite dark:bg-amber text-amber dark:text-graphite shadow-xs transition-transform group-hover:scale-105">
              <Wrench className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-foreground flex items-center gap-1">
                Equip<span className="text-amber">Loop</span>
              </span>
              <span className="hidden sm:inline-block -mt-1 text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
                Commercial Rentals
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "text-amber font-semibold bg-amber/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-3">
          {/* Light / Dark Mode Toggle */}
          <ThemeToggle />

          {/* User Auth Controls */}
          {isPending ? (
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative flex items-center gap-2.5 rounded-full p-1 pl-2 hover:bg-muted focus-visible:ring-1 focus-visible:ring-amber"
                >
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                    <AvatarFallback className="bg-graphite text-amber font-bold text-xs">
                      {user.name ? user.name.slice(0, 2).toUpperCase() : "EL"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-xs font-semibold leading-none text-foreground truncate max-w-[120px]">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium capitalize mt-0.5">
                      {userRole}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden lg:inline-block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 space-y-1">
                <DropdownMenuLabel className="font-normal px-2 py-1.5">
                  <div className="flex flex-col space-y-1">
                    <p className="text-xs font-bold leading-none text-foreground">{user.name}</p>
                    <p className="text-[11px] leading-none text-muted-foreground truncate">{user.email}</p>
                    <div className="pt-1">
                      <Badge variant="amber" className="text-[10px] px-1.5 py-0">
                        {userRole} Portal
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Role Specific Shortcuts */}
                {userRole === "Admin" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/admin" className="flex items-center gap-2 cursor-pointer font-medium text-amber">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Admin Console</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/admin/equipment" className="flex items-center gap-2 cursor-pointer">
                        <Layers className="h-4 w-4" />
                        <span>Equipment Queue</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                {userRole === "Owner" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/owner" className="flex items-center gap-2 cursor-pointer font-medium text-amber">
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Fleet Overview</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/owner/equipment/new" className="flex items-center gap-2 cursor-pointer">
                        <PlusCircle className="h-4 w-4" />
                        <span>List Machinery</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                {/* Common Customer / User Links */}
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/rentals" className="flex items-center gap-2 cursor-pointer">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>My Bookings</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/dashboard/wishlist" className="flex items-center gap-2 cursor-pointer">
                    <Bookmark className="h-4 w-4" />
                    <span>Saved Wishlist</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    <span>Account Profile</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-semibold text-xs sm:text-sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="font-semibold text-xs sm:text-sm bg-primary text-primary-foreground hover:bg-primary/90">
                  Register
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Navigation Sheet Drawer */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[360px] p-6 flex flex-col justify-between">
              <div>
                <SheetHeader className="text-left pb-4 border-b border-border">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-graphite dark:bg-amber text-amber dark:text-graphite">
                      <Wrench className="h-4 w-4" />
                    </div>
                    <SheetTitle className="text-lg font-black tracking-tight">
                      Equip<span className="text-amber">Loop</span>
                    </SheetTitle>
                  </div>
                </SheetHeader>

                <nav className="mt-6 flex flex-col space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSheetOpen(false)}
                      className={`block px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                        pathname === link.href
                          ? "bg-amber/15 text-amber"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}

                  {user && (
                    <div className="pt-4 mt-2 border-t border-border space-y-2">
                      <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        User Portal ({userRole})
                      </div>
                      <Link
                        href={getDashboardHome()}
                        onClick={() => setSheetOpen(false)}
                        className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-amber hover:bg-amber/10"
                      >
                        Dashboard Overview
                      </Link>
                      <Link
                        href="/dashboard/rentals"
                        onClick={() => setSheetOpen(false)}
                        className="block px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted"
                      >
                        My Bookings
                      </Link>
                      <Link
                        href="/dashboard/wishlist"
                        onClick={() => setSheetOpen(false)}
                        className="block px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted"
                      >
                        Saved Wishlist
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setSheetOpen(false)}
                        className="block px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted"
                      >
                        Account Profile
                      </Link>
                    </div>
                  )}
                </nav>
              </div>

              {/* Bottom Actions in Mobile Sheet */}
              <div className="pt-6 border-t border-border">
                {user ? (
                  <Button
                    variant="outline"
                    className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
                    onClick={() => {
                      setSheetOpen(false);
                      handleSignOut();
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href="/login" onClick={() => setSheetOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setSheetOpen(false)}>
                      <Button className="w-full bg-primary text-primary-foreground">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
