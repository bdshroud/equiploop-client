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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // User role inference
  // @ts-ignore
  const userRole = session?.user?.role || "Customer";
  const user = session?.user;

  const handleSignOut = async () => {
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

        {/* Right Section Actions */}
        <div className="flex items-center gap-2.5">
          {/* List Equipment Action for Owners or general visitors */}
          <Link
            href={userRole === "Owner" ? "/dashboard/owner/equipment/new" : "/equipment"}
            className="hidden sm:inline-flex"
          >
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-amber/40 hover:border-amber hover:bg-amber/10 text-xs font-semibold"
            >
              <PlusCircle className="h-3.5 w-3.5 text-amber" />
              <span>{userRole === "Owner" ? "List Equipment" : "Rent Equipment"}</span>
            </Button>
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Account / Auth buttons */}
          {isPending ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full p-0.5 focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2 transition-transform hover:opacity-90"
                >
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                    <AvatarFallback className="bg-graphite text-white text-xs font-bold">
                      {user?.name ? user.name.slice(0, 2).toUpperCase() : "EL"}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-1.5">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user?.email}
                    </p>
                    <div className="pt-1">
                      <Badge variant="amber" className="text-[10px] px-1.5 py-0 h-4">
                        {userRole}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Role Specific Quick Links */}
                {userRole === "Admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/admin" className="flex items-center gap-2 cursor-pointer font-medium text-amber">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Admin Console</span>
                    </Link>
                  </DropdownMenuItem>
                )}

                {userRole === "Owner" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/owner" className="flex items-center gap-2 cursor-pointer">
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Owner Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/owner/equipment" className="flex items-center gap-2 cursor-pointer">
                        <Layers className="h-4 w-4" />
                        <span>My Equipment Fleet</span>
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

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card px-4 pt-2 pb-4 space-y-2 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === link.href
                  ? "bg-amber/15 text-amber font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {session?.user && (
            <Link
              href={getDashboardHome()}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-semibold text-amber hover:bg-amber/15"
            >
              Go to Dashboard ({userRole})
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
