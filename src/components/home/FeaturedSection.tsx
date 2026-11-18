"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { EquipmentCard, EquipmentItem } from "@/components/equipment/EquipmentCard";
import { fetchApi } from "@/lib/api";

const FALLBACK_FEATURED: EquipmentItem[] = [
  {
    _id: "feat_1",
    title: "Caterpillar 305.5E2 Mini Hydraulic Excavator",
    category: "Heavy Machinery",
    description: "Compact hydraulic excavator engineered for tight radius earthmoving, trenching, and utility works.",
    images: ["https://images.unsplash.com/photo-1579847188804-ecba0e2ea330?auto=format&fit=crop&w=800&q=80"],
    pricePerDay: 350,
    securityDeposit: 500,
    condition: "Excellent",
    location: { city: "Austin", state: "TX" },
    availability: true,
    status: "Approved",
    isFeatured: true,
    rating: 4.9,
    totalReviews: 14,
  },
  {
    _id: "feat_2",
    title: "Bobcat S650 Skid-Steer Loader",
    category: "Heavy Machinery",
    description: "High-lift vertical path loader designed for heavy lifting, grading, site clearance, and agricultural duty.",
    images: ["https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"],
    pricePerDay: 280,
    securityDeposit: 400,
    condition: "Excellent",
    location: { city: "Houston", state: "TX" },
    availability: true,
    status: "Approved",
    isFeatured: true,
    rating: 4.8,
    totalReviews: 9,
  },
  {
    _id: "feat_3",
    title: "Genie GS-1930 Electric Scissor Lift",
    category: "Material Handling",
    description: "Quiet, zero-emission electric scissor lift capable of passing through standard single doorways.",
    images: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"],
    pricePerDay: 145,
    securityDeposit: 250,
    condition: "Excellent",
    location: { city: "Dallas", state: "TX" },
    availability: true,
    status: "Approved",
    isFeatured: true,
    rating: 5.0,
    totalReviews: 8,
  },
  {
    _id: "feat_4",
    title: "Honda EU7000iS Inverter Generator 7000W Fuel Injected",
    category: "Generators & Power",
    description: "Super quiet fuel-injected portable inverter generator providing clean, stable power for sensitive equipment.",
    images: ["https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80"],
    pricePerDay: 95,
    securityDeposit: 150,
    condition: "Excellent",
    location: { city: "Dallas", state: "TX" },
    availability: true,
    status: "Approved",
    isFeatured: true,
    rating: 5.0,
    totalReviews: 15,
  },
];

export function FeaturedSection() {
  const [items, setItems] = React.useState<EquipmentItem[]>(FALLBACK_FEATURED);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetchApi<{ success: boolean; data: EquipmentItem[] }>("/equipment/featured");
        if (res.data && res.data.length > 0) {
          setItems(res.data);
        }
      } catch (err) {
        // Keeps fallback items if server not yet started
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <section className="py-16 sm:py-20 bg-muted/40 border-y border-border/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber mb-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Handpicked Machinery</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Featured Fleet Inventory
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Commercial-grade equipment maintained to strict OEM specifications and ready for instant booking.
            </p>
          </div>

          <Link
            href="/equipment"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber hover:underline group"
          >
            <span>Explore all equipment</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Featured Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <EquipmentCard key={item._id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
