"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ArrowRight, Sparkles, CheckCircle2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroBanner() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    if (selectedCategory && selectedCategory !== "All") params.set("category", selectedCategory);
    router.push(`/equipment?${params.toString()}`);
  };

  const quickPills = [
    "Mini Excavators",
    "Scissor Lifts",
    "Plate Compactors",
    "Generators",
    "Miter Saws",
  ];

  return (
    <div className="relative overflow-hidden bg-graphite text-white py-16 sm:py-24 lg:py-28 border-b border-border/20">
      {/* Background Subtle Gradient & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e9a44c_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-amber/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber/15 border border-amber/30 text-amber text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Commercial-Grade Equipment Marketplace</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white"
          >
            Rent Smarter. <br className="hidden sm:inline" />
            <span className="text-amber">Work Better.</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Instantly reserve excavators, scissor lifts, compaction equipment, power tools, and generators from verified fleet owners. Zero delays, upfront pricing, guaranteed dispatch.
          </motion.p>

          {/* Search Form Card */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 p-2 sm:p-2.5 rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/20 shadow-2xl flex flex-col sm:flex-row items-center gap-2 text-left"
          >
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search machinery, brand, or model (e.g. Caterpillar)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative w-full sm:w-52 border-t sm:border-t-0 sm:border-l border-white/15 px-2 flex items-center">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-3 pl-2 pr-8 bg-transparent text-sm text-white focus:outline-none cursor-pointer appearance-none"
                style={{ backgroundColor: "transparent" }}
              >
                <option value="All" className="bg-[#1e2430] text-white">All Categories</option>
                <option value="Heavy Machinery" className="bg-[#1e2430] text-white">Heavy Machinery</option>
                <option value="Construction" className="bg-[#1e2430] text-white">Construction</option>
                <option value="Power Tools" className="bg-[#1e2430] text-white">Power Tools</option>
                <option value="Material Handling" className="bg-[#1e2430] text-white">Material Handling</option>
                <option value="Landscaping & Gardening" className="bg-[#1e2430] text-white">Landscaping</option>
                <option value="Generators & Power" className="bg-[#1e2430] text-white">Generators & Power</option>
                <option value="Audio/Visual & Event Tech" className="bg-[#1e2430] text-white">Audio/Visual</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none" />
            </div>

            {/* Search Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto font-bold bg-amber text-graphite hover:bg-amber/90 gap-2 px-6 shrink-0"
            >
              <span>Search Fleet</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.form>

          {/* Quick Search Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-4 flex items-center justify-center gap-2 flex-wrap text-xs text-slate-400"
          >
            <span className="font-semibold text-slate-300">Popular:</span>
            {quickPills.map((pill) => (
              <button
                key={pill}
                type="button"
                onClick={() => router.push(`/equipment?search=${encodeURIComponent(pill)}`)}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 hover:text-amber transition-colors border border-white/10"
              >
                {pill}
              </button>
            ))}
          </motion.div>

          {/* Guarantee Badges Row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-amber shrink-0" />
              <span>Certified Machine Checks</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-amber shrink-0" />
              <span>Verified Fleet Owners</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-amber shrink-0" />
              <span>Stripe Escrow Security</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-amber shrink-0" />
              <span>Job-Site Delivery Available</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
