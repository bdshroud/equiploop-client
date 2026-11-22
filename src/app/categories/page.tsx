"use client";

import Link from "next/link";
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
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  {
    name: "Heavy Machinery",
    slug: "Heavy Machinery",
    desc: "Commercial earthmoving excavators, skid steers, backhoes, and wheeled loaders.",
    icon: Tractor,
    units: "42+ Units",
    image: "https://images.unsplash.com/photo-1579847188804-ecba0e2ea330?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Construction",
    slug: "Construction",
    desc: "Vibratory plate compactors, concrete mixers, power trowels, and modular scaffolding.",
    icon: HardHat,
    units: "68+ Units",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Power Tools",
    slug: "Power Tools",
    desc: "Precision miter saws, rotary demolition hammers, core drills, and cordless impact drivers.",
    icon: Wrench,
    units: "120+ Units",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Material Handling",
    slug: "Material Handling",
    desc: "Electric scissor lifts, rough-terrain boom lifts, hydraulic pallet jacks, and hoists.",
    icon: Boxes,
    units: "35+ Units",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Landscaping & Gardening",
    slug: "Landscaping & Gardening",
    desc: "Tracked stump grinders, commercial wood chippers, turf aerators, and heavy trenchers.",
    icon: Trees,
    units: "29+ Units",
    image: "https://images.unsplash.com/photo-1557429287-b2e26467fc2b?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Generators & Power",
    slug: "Generators & Power",
    desc: "Inverter generators, silent diesel job-site power units, and distribution breakout panels.",
    icon: Zap,
    units: "40+ Units",
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Audio/Visual & Event Tech",
    slug: "Audio/Visual & Event Tech",
    desc: "Column array speakers, digital mixers, high-lumen laser projectors, and truss lighting.",
    icon: Speaker,
    units: "31+ Units",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Cleaning & Restoration",
    slug: "Cleaning & Restoration",
    desc: "4,000 PSI industrial gas pressure washers, floor scrubbers, and industrial dehumidifiers.",
    icon: Sparkles,
    units: "24+ Units",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
  },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-amber mb-1">
            Commercial Machinery Catalog
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            Equipment Categories
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Explore commercial-grade machines maintained to OEM specs across all major trades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.name}
                href={`/equipment?category=${encodeURIComponent(c.slug)}`}
                className="group relative rounded-2xl overflow-hidden border border-border bg-card shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-72"
              >
                <div className="relative h-40 w-full overflow-hidden bg-muted">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5 h-8 w-8 rounded-lg bg-graphite/80 backdrop-blur-xs text-amber flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-graphite/80 backdrop-blur-xs text-white">
                    {c.units}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base text-foreground group-hover:text-amber transition-colors">
                      {c.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {c.desc}
                    </p>
                  </div>

                  <span className="text-xs font-bold text-amber flex items-center gap-1 group-hover:underline pt-2">
                    <span>Browse inventory</span>
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
