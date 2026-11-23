"use client";

import Link from "next/link";
import { Wrench, Mail, Phone, MapPin, Shield, Clock, Award } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card text-card-foreground transition-colors">
      {/* Platform Value Proposition Highlights */}
      <div className="border-b border-border/60 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="h-12 w-12 rounded-xl bg-amber/15 text-amber-text flex items-center justify-center shrink-0">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground">Verified & Insured Equipment</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Every listing undergoes comprehensive mechanical checks</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="h-12 w-12 rounded-xl bg-amber/15 text-amber-text flex items-center justify-center shrink-0">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground">Flexible Rental Terms</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Rent by the day, week, or project phase with fast dispatch</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="h-12 w-12 rounded-xl bg-amber/15 text-amber-text flex items-center justify-center shrink-0">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground">Secure Stripe Escrow</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Guaranteed payouts and damage deposit security protection</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-graphite dark:bg-amber text-amber dark:text-graphite shadow-xs">
                <Wrench className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-foreground">
                Equip<span className="text-amber-text">Loop</span>
              </span>
            </Link>
            <p className="text-sm font-medium text-amber-text">
              Rent smarter. Work better.
            </p>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              EquipLoop is the premier commercial equipment rental marketplace connecting construction firms, industrial contractors, event coordinators, and tradespeople with verified machinery owners.
            </p>

            {/* Social Icons including the modern X icon */}
            <div className="flex items-center gap-3 pt-2">
              {/* Modern X (Twitter) SVG Icon */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-amber transition-colors"
                aria-label="Follow EquipLoop on X"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-amber transition-colors"
                aria-label="Connect on LinkedIn"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-amber transition-colors"
                aria-label="EquipLoop GitHub"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h5 className="font-semibold text-sm text-foreground tracking-wide mb-3">Popular Equipment</h5>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/equipment?category=Heavy Machinery" className="hover:text-amber-text-text transition-colors">Heavy Machinery</Link></li>
              <li><Link href="/equipment?category=Construction" className="hover:text-amber-text-text transition-colors">Construction & Concrete</Link></li>
              <li><Link href="/equipment?category=Power Tools" className="hover:text-amber-text-text transition-colors">Industrial Power Tools</Link></li>
              <li><Link href="/equipment?category=Material Handling" className="hover:text-amber-text-text transition-colors">Scissor & Boom Lifts</Link></li>
              <li><Link href="/equipment?category=Generators & Power" className="hover:text-amber-text-text transition-colors">Generators & Power</Link></li>
              <li><Link href="/equipment?category=Audio/Visual & Event Tech" className="hover:text-amber-text-text transition-colors">Audio/Visual Systems</Link></li>
            </ul>
          </div>

          {/* Marketplace Navigation */}
          <div>
            <h5 className="font-semibold text-sm text-foreground tracking-wide mb-3">Platform</h5>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/equipment" className="hover:text-amber-text-text transition-colors">All Equipment</Link></li>
              <li><Link href="/categories" className="hover:text-amber-text-text transition-colors">Category Catalog</Link></li>
              <li><Link href="/how-it-works" className="hover:text-amber-text-text transition-colors">How EquipLoop Works</Link></li>
              <li><Link href="/about" className="hover:text-amber-text-text transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-amber-text-text transition-colors">Contact Support</Link></li>
              <li><Link href="/dashboard/owner" className="hover:text-amber-text-text transition-colors">Owner Fleet Portal</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h5 className="font-semibold text-sm text-foreground tracking-wide mb-3">Direct Support</h5>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-amber-text shrink-0" />
                <span>Austin, TX — North America HQ</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-amber-text shrink-0" />
                <a href="mailto:support@equiploop.com" className="hover:text-amber-text-text transition-colors">
                  support@equiploop.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-amber-text shrink-0" />
                <span>+1 (800) 412-LOOP</span>
              </li>
              <li className="pt-2 text-[11px] text-muted-foreground/80">
                Mon - Fri: 6:00 AM - 8:00 PM CST
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Legal */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 EquipLoop Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-amber-text-text transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-amber-text-text transition-colors">Privacy Policy</Link>
            <Link href="/cookies" className="hover:text-amber-text-text transition-colors">Cookie Preferences</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
