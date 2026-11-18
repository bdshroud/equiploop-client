"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  RotateCcw,
  MapPin,
  Tag,
  DollarSign,
  Calendar,
} from "lucide-react";
import { EquipmentCard, EquipmentItem } from "@/components/equipment/EquipmentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchApi } from "@/lib/api";

const CATEGORIES = [
  "All",
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
  "Power Tools",
  "Heavy Machinery",
  "Material Handling",
  "Generators & Power",
];

const RENTAL_TYPES = ["All", "Daily", "Weekly", "Monthly"];

const SORT_OPTIONS = [
  { label: "Recently Added", value: "recently-added" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Highest Rated", value: "rating-desc" },
  { label: "Most Popular", value: "popular" },
];

function EquipmentBrowseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL query params
  const querySearch = searchParams.get("search") || "";
  const queryLocation = searchParams.get("location") || "";
  const queryCategory = searchParams.get("category") || "All";
  const queryRentalType = searchParams.get("rentalType") || "All";
  const queryMinPrice = searchParams.get("minPrice") || "";
  const queryMaxPrice = searchParams.get("maxPrice") || "";
  const querySort = searchParams.get("sort") || "recently-added";
  const queryAvailability = searchParams.get("availability") || "";

  // State
  const [items, setItems] = React.useState<EquipmentItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [search, setSearch] = React.useState(querySearch);
  const [locationInput, setLocationInput] = React.useState(queryLocation);
  const [category, setCategory] = React.useState(queryCategory);
  const [rentalType, setRentalType] = React.useState(queryRentalType);
  const [minPrice, setMinPrice] = React.useState(queryMinPrice);
  const [maxPrice, setMaxPrice] = React.useState(queryMaxPrice);
  const [sort, setSort] = React.useState(querySort);
  const [availability, setAvailability] = React.useState(queryAvailability);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState(0);
  const [showFiltersMobile, setShowFiltersMobile] = React.useState(false);

  // Sync state if URL query changes
  React.useEffect(() => {
    setSearch(querySearch);
    setLocationInput(queryLocation);
    setCategory(queryCategory);
    setRentalType(queryRentalType);
    setSort(querySort);
  }, [querySearch, queryLocation, queryCategory, queryRentalType, querySort]);

  // Load items from API with server-side filters & sorting
  const loadEquipment = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (locationInput.trim()) params.set("location", locationInput.trim());
      if (category && category !== "All") params.set("category", category);
      if (rentalType && rentalType !== "All") params.set("rentalType", rentalType);
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
  }, [search, locationInput, category, rentalType, minPrice, maxPrice, sort, availability, page]);

  React.useEffect(() => {
    loadEquipment();
  }, [loadEquipment]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (locationInput.trim()) params.set("location", locationInput.trim());
    if (category && category !== "All") params.set("category", category);
    if (rentalType && rentalType !== "All") params.set("rentalType", rentalType);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sort) params.set("sort", sort);
    if (availability) params.set("availability", availability);
    router.push(`/equipment?${params.toString()}`);
  };

  const resetFilters = () => {
    setSearch("");
    setLocationInput("");
    setCategory("All");
    setRentalType("All");
    setMinPrice("");
    setMaxPrice("");
    setSort("recently-added");
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
            All Equipment
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Showing {totalCount} verified machines available for job-site dispatch or local pickup.
          </p>
        </div>

        {/* Top Control Bar: Search by Equipment Name & Location */}
        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs mb-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          <form onSubmit={handleFilterSubmit} className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {/* Equipment Name Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search equipment name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-xs bg-background"
              />
            </div>

            {/* Location Search */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search location (city, state)..."
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="pl-9 text-xs bg-background"
              />
            </div>

            <Button type="submit" size="sm" className="bg-amber text-graphite hover:bg-amber/90 font-bold text-xs">
              Search Fleet
            </Button>
          </form>

          {/* Controls: Sorting & View Switch */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground hidden sm:inline">Sort:</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="h-9 px-3 rounded-md border border-input bg-background text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="lg:hidden gap-1.5 text-xs"
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Filters</span>
            </Button>

            <div className="flex items-center border border-border rounded-lg p-0.5 bg-muted/50">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "grid" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
                title="3-Column Grid View"
                aria-label="3-Column Grid View"
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

        {/* Main Content Layout: Sidebar Filters + 3-Column Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`space-y-6 ${
              showFiltersMobile ? "block" : "hidden"
            } lg:block lg:col-span-1`}
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

              {/* Equipment Category Filter */}
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
                      <span className="truncate">{cat}</span>
                      {category === cat && (
                        <span className="h-1.5 w-1.5 rounded-full bg-amber shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rental Type Filter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                  Rental Type
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {RENTAL_TYPES.map((rt) => (
                    <button
                      key={rt}
                      type="button"
                      onClick={() => {
                        setRentalType(rt);
                        setPage(1);
                      }}
                      className={`p-2 rounded-lg border text-xs font-semibold text-center transition-all ${
                        rentalType === rt
                          ? "border-amber bg-amber/15 text-amber"
                          : "border-border bg-background text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {rt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                  Price Range ($)
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
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
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
                    <span>All Inventory</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                    <input
                      type="radio"
                      name="avail"
                      checked={availability === "true"}
                      onChange={() => setAvailability("true")}
                      className="text-amber focus:ring-amber"
                    />
                    <span>Available In Stock Only</span>
                  </label>
                </div>
              </div>

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

          {/* Results: 3-Column Grid Layout */}
          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-2xl border border-border p-4 space-y-3">
                    <Skeleton className="h-44 w-full rounded-xl" />
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
                <h3 className="font-bold text-lg text-foreground">No Machinery Found</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-6">
                  No equipment matched your search or filters. Try clearing your category or location filters.
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
                  <EquipmentCard key={item._id} item={item} requireAuthForDetails={true} />
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
