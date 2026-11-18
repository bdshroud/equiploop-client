"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Filter,
  SlidersHorizontal,
  LayoutGrid,
  List,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
} from "lucide-react";
import { EquipmentCard, EquipmentItem } from "@/components/equipment/EquipmentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchApi } from "@/lib/api";

const CATEGORIES = [
  "All",
  "Heavy Machinery",
  "Construction",
  "Power Tools",
  "Material Handling",
  "Landscaping & Gardening",
  "Generators & Power",
  "Audio/Visual & Event Tech",
  "Cleaning & Restoration",
];

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Highest Rated", value: "rating-desc" },
  { label: "Most Popular", value: "popular" },
];

function EquipmentBrowseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state sync
  const querySearch = searchParams.get("search") || "";
  const queryCategory = searchParams.get("category") || "All";
  const queryMinPrice = searchParams.get("minPrice") || "";
  const queryMaxPrice = searchParams.get("maxPrice") || "";
  const querySort = searchParams.get("sort") || "newest";
  const queryAvailability = searchParams.get("availability") || "";

  // Component state
  const [items, setItems] = React.useState<EquipmentItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [search, setSearch] = React.useState(querySearch);
  const [category, setCategory] = React.useState(queryCategory);
  const [minPrice, setMinPrice] = React.useState(queryMinPrice);
  const [maxPrice, setMaxPrice] = React.useState(queryMaxPrice);
  const [sort, setSort] = React.useState(querySort);
  const [availability, setAvailability] = React.useState(queryAvailability);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState(0);
  const [showFiltersMobile, setShowFiltersMobile] = React.useState(false);

  // Sync state if URL searchParams change
  React.useEffect(() => {
    setSearch(querySearch);
    setCategory(queryCategory);
    setSort(querySort);
  }, [querySearch, queryCategory, querySort]);

  // Load items from API
  const loadEquipment = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (category && category !== "All") params.set("category", category);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (sort) params.set("sort", sort);
      if (availability) params.set("availability", availability);
      params.set("page", page.toString());
      params.set("limit", "12");

      const res = await fetchApi<{
        success: boolean;
        data: EquipmentItem[];
        pagination: { total: number; page: number; limit: number; totalPages: number };
      }>(`/equipment?${params.toString()}`);

      if (res.data) {
        setItems(res.data);
        setTotalCount(res.pagination.total);
        setTotalPages(res.pagination.totalPages);
      }
    } catch (err) {
      console.warn("Error loading equipment catalog:", err);
    } finally {
      setLoading(false);
    }
  }, [search, category, minPrice, maxPrice, sort, availability, page]);

  React.useEffect(() => {
    loadEquipment();
  }, [loadEquipment]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (category && category !== "All") params.set("category", category);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sort) params.set("sort", sort);
    if (availability) params.set("availability", availability);
    router.push(`/equipment?${params.toString()}`);
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setAvailability("");
    setPage(1);
    router.push("/equipment");
  };

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber mb-1">
            Commercial Fleet Catalog
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            Browse All Equipment
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Showing {totalCount} verified machines available for job-site dispatch or local pickup.
          </p>
        </div>

        {/* Top Control Bar: Search & View Toggle */}
        <div className="p-4 rounded-xl bg-card border border-border shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search form */}
          <form onSubmit={handleFilterSubmit} className="relative flex-1 w-full flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search machine title, specs, or brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background text-sm"
              />
            </div>
            <Button type="submit" size="sm" className="bg-amber text-graphite hover:bg-amber/90 font-bold shrink-0">
              Search
            </Button>
          </form>

          {/* Controls: Sort, Filter Toggle, View Switch */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            {/* Sort Select */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground hidden sm:inline">Sort:</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="h-9 px-3 rounded-md border border-input bg-background text-xs font-medium focus:outline-none focus:ring-1 focus:ring-amber"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden gap-1.5 text-xs"
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Filters</span>
            </Button>

            {/* Grid / List View Toggle */}
            <div className="flex items-center border border-border rounded-lg p-0.5 bg-muted/50">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "grid" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "list" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
                title="List View"
                aria-label="List View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Filters (Desktop + Mobile Drawer) */}
          <aside
            className={`space-y-6 ${
              showFiltersMobile ? "block" : "hidden"
            } md:block md:col-span-1`}
          >
            <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <SlidersHorizontal className="h-4 w-4 text-amber" />
                  Filter Equipment
                </span>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-muted-foreground hover:text-amber transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
              </div>

              {/* Categories Filter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2.5">
                  Category
                </label>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setCategory(cat);
                        setPage(1);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center justify-between ${
                        category === cat
                          ? "bg-amber/15 text-amber font-bold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <span>{cat}</span>
                      {category === cat && (
                        <span className="h-1.5 w-1.5 rounded-full bg-amber" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2.5">
                  Daily Rate ($ / day)
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="h-8 text-xs bg-background"
                  />
                  <span className="text-xs text-muted-foreground">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="h-8 text-xs bg-background"
                  />
                </div>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2.5">
                  Availability
                </label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                    <input
                      type="radio"
                      name="avail"
                      checked={availability === ""}
                      onChange={() => setAvailability("")}
                      className="text-amber focus:ring-amber"
                    />
                    <span>All Equipment</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                    <input
                      type="radio"
                      name="avail"
                      checked={availability === "true"}
                      onChange={() => setAvailability("true")}
                      className="text-amber focus:ring-amber"
                    />
                    <span>Available Now Only</span>
                  </label>
                </div>
              </div>

              {/* Apply Button */}
              <Button
                type="button"
                onClick={handleFilterSubmit}
                size="sm"
                className="w-full bg-amber text-graphite hover:bg-amber/90 font-bold text-xs"
              >
                Apply Filters
              </Button>
            </div>
          </aside>

          {/* Results Grid / List */}
          <div className="md:col-span-3 space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-xl border border-border p-4 space-y-3">
                    <Skeleton className="h-44 w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-8 w-full mt-4" />
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card">
                <div className="h-12 w-12 rounded-full bg-amber/15 text-amber mx-auto flex items-center justify-center mb-3">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-foreground">No Equipment Found</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-6">
                  We couldn&apos;t find any equipment matching your current search or filter criteria. Try expanding your search or clearing active filters.
                </p>
                <Button onClick={resetFilters} size="sm" variant="outline" className="font-semibold text-xs">
                  Reset All Filters
                </Button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {items.map((item) => (
                  <EquipmentCard key={item._id} item={item} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pt-8 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Page {page} of {totalPages}
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="text-xs font-semibold"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="text-xs font-semibold"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EquipmentBrowsePage() {
  return (
    <React.Suspense fallback={<div className="p-12 text-center text-xs text-muted-foreground">Loading equipment fleet...</div>}>
      <EquipmentBrowseContent />
    </React.Suspense>
  );
}
