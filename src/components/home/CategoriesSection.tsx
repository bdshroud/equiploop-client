"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Tractor,
  HardHat,
  Wrench,
  Boxes,
  Trees,
  Zap,
  Speaker,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const CATEGORIES = [
  {
    name: "Heavy Machinery",
    slug: "Heavy Machinery",
    desc: "Excavators, skid steers & backhoes",
    icon: Tractor,
    count: "42+ Units",
    image: "https://images.unsplash.com/photo-1579847188804-ecba0e2ea330?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Construction",
    slug: "Construction",
    desc: "Mixers, compactors & scaffolding",
    icon: HardHat,
    count: "68+ Units",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Power Tools",
    slug: "Power Tools",
    desc: "Rotary hammers, miter & demolition saws",
    icon: Wrench,
    count: "120+ Units",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Material Handling",
    slug: "Material Handling",
    desc: "Scissor lifts, pallet jacks & hoists",
    icon: Boxes,
    count: "35+ Units",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Landscaping & Gardening",
    slug: "Landscaping & Gardening",
    desc: "Stump grinders, aerators & wood chippers",
    icon: Trees,
    count: "29+ Units",
    image: "https://images.unsplash.com/photo-1558904541-efa8c4a08931?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Generators & Power",
    slug: "Generators & Power",
    desc: "Inverter & diesel generators, distro panels",
    icon: Zap,
    count: "40+ Units",
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Audio/Visual & Event Tech",
    slug: "Audio/Visual & Event Tech",
    desc: "Line arrays, staging & stage lasers",
    icon: Speaker,
    count: "31+ Units",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Cleaning & Restoration",
    slug: "Cleaning & Restoration",
    desc: "Commercial pressure washers & scrubbers",
    icon: Sparkles,
    count: "24+ Units",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
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
              Explore by Equipment Class
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              High-performance machinery ready for immediate job-site delivery or local dispatch.
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

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Link
                  href={`/equipment?category=${encodeURIComponent(cat.slug)}`}
                  className="group relative block h-44 rounded-xl overflow-hidden border border-border bg-card shadow-xs hover:shadow-lg transition-all duration-300"
                >
                  {/* Background Image with Dark Overlay */}
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-graphite/95 via-graphite/60 to-transparent transition-opacity group-hover:opacity-90" />

                  {/* Content Overlay */}
                  <div className="relative h-full flex flex-col justify-between p-4 z-10 text-white">
                    <div className="flex items-center justify-between">
                      <div className="h-9 w-9 rounded-lg bg-amber/20 backdrop-blur-xs text-amber flex items-center justify-center border border-amber/30 transition-transform group-hover:scale-110">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-xs text-white">
                        {cat.count}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-base leading-tight text-white group-hover:text-amber transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
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
