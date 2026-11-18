"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  HardHat,
  Camera,
  Truck,
  Tractor,
  Cpu,
  Speaker,
  Wrench,
  Boxes,
  ArrowRight,
} from "lucide-react";

const CATEGORIES = [
  {
    name: "Construction Equipment",
    slug: "Construction Equipment",
    desc: "Hydraulic excavators, compactors, concrete mixers & lifts",
    icon: HardHat,
    count: "48+ Units",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Photography Equipment",
    slug: "Photography Equipment",
    desc: "Cinema cameras, prime lenses, gimbal rigs & studio lighting",
    icon: Camera,
    count: "36+ Units",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Vehicles & Transportation",
    slug: "Vehicles & Transportation",
    desc: "Commercial flatbed dump trucks, equipment trailers & vans",
    icon: Truck,
    count: "28+ Units",
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Agriculture Equipment",
    slug: "Agriculture Equipment",
    desc: "4WD utility tractors, rotary cutters, tillers & seeders",
    icon: Tractor,
    count: "24+ Units",
    image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Electronics",
    slug: "Electronics",
    desc: "Thermal imaging cameras, spectrum analyzers & testers",
    icon: Cpu,
    count: "30+ Units",
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Event Equipment",
    slug: "Event Equipment",
    desc: "Powered column PA arrays, digital mixers & laser projectors",
    icon: Speaker,
    count: "42+ Units",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
  },
];

export function CategoriesSection() {
  return (
    <section className="py-16 sm:py-20 bg-background transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber mb-1.5">
              Equipment Categories
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Explore Popular Categories
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              High-performance machinery and professional gear ready for immediate job-site dispatch or local pickup.
            </p>
          </div>

          <Link
            href="/equipment"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber hover:underline group"
          >
            <span>View all inventory</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Categories Grid with Framer Motion */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
              >
                <Link
                  href={`/equipment?category=${encodeURIComponent(cat.slug)}`}
                  className="group relative block h-52 rounded-2xl overflow-hidden border border-border bg-card shadow-xs hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-graphite/95 via-graphite/60 to-transparent transition-opacity group-hover:opacity-90" />

                  <div className="relative h-full flex flex-col justify-between p-5 z-10 text-white">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-xl bg-amber/20 backdrop-blur-xs text-amber flex items-center justify-center border border-amber/30 transition-transform group-hover:scale-110">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-xs text-white">
                        {cat.count}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg leading-tight text-white group-hover:text-amber transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-1 mt-1">
                        {cat.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
