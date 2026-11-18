"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  PlusCircle,
  ArrowLeft,
  Wrench,
  DollarSign,
  MapPin,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

const CATEGORIES = [
  "Heavy Machinery",
  "Construction",
  "Power Tools",
  "Material Handling",
  "Landscaping & Gardening",
  "Generators & Power",
  "Audio/Visual & Event Tech",
  "Cleaning & Restoration",
];

const CONDITIONS = ["Brand New", "Excellent", "Good", "Fair"];

export default function NewEquipmentPage() {
  const router = useRouter();

  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("Heavy Machinery");
  const [description, setDescription] = React.useState("");
  const [pricePerDay, setPricePerDay] = React.useState("");
  const [securityDeposit, setSecurityDeposit] = React.useState("");
  const [condition, setCondition] = React.useState("Excellent");
  const [city, setCity] = React.useState("Austin");
  const [state, setState] = React.useState("TX");
  const [address, setAddress] = React.useState("Main Fleet Yard");

  // Images state
  const [imageUrl, setImageUrl] = React.useState("");
  const [images, setImages] = React.useState<string[]>([
    "https://images.unsplash.com/photo-1579847188804-ecba0e2ea330?auto=format&fit=crop&w=800&q=80",
  ]);

  // Specifications state
  const [specs, setSpecs] = React.useState<Array<{ key: string; value: string }>>([
    { key: "Brand", value: "Caterpillar" },
    { key: "Model", value: "305.5E2" },
    { key: "Fuel Type", value: "Diesel" },
  ]);

  const [loading, setLoading] = React.useState(false);

  const addImage = () => {
    if (!imageUrl.trim()) return;
    setImages([...images, imageUrl.trim()]);
    setImageUrl("");
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addSpec = () => {
    setSpecs([...specs, { key: "", value: "" }]);
  };

  const updateSpec = (index: number, field: "key" | "value", val: string) => {
    const updated = [...specs];
    updated[index][field] = val;
    setSpecs(updated);
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !pricePerDay) {
      toast.error("Please fill in the equipment title and daily rental rate");
      return;
    }

    const specificationsObj: Record<string, string> = {};
    specs.forEach((s) => {
      if (s.key.trim() && s.value.trim()) {
        specificationsObj[s.key.trim()] = s.value.trim();
      }
    });

    try {
      setLoading(true);
      await fetchApi("/equipment", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          category,
          description: description.trim(),
          pricePerDay: Number(pricePerDay),
          securityDeposit: Number(securityDeposit || 0),
          condition,
          location: { city, state, address },
          images,
          specifications: specificationsObj,
          availability: true,
        }),
      });

      toast.success("Equipment successfully added to your fleet!");
      router.push("/dashboard/owner/equipment");
    } catch (err: any) {
      toast.error(err.message || "Failed to create equipment listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header and Back Button */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/owner/equipment">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber">
            Fleet Expansion
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            List New Equipment
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Information Card */}
        <Card className="p-6 rounded-2xl border-border bg-card shadow-xs space-y-4">
          <h2 className="font-bold text-base text-foreground flex items-center gap-2">
            <Wrench className="h-4 w-4 text-amber" />
            <span>General Machine Details</span>
          </h2>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Equipment Title / Model Name *
            </label>
            <Input
              type="text"
              placeholder="e.g. Caterpillar 305.5E2 Mini Hydraulic Excavator"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Equipment Class / Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs font-medium focus:outline-none focus:ring-1 focus:ring-amber"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Mechanical Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs font-medium focus:outline-none focus:ring-1 focus:ring-amber"
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Detailed Scope & Operational Description
            </label>
            <textarea
              rows={4}
              placeholder="Detail operating capacity, hydraulic connections, cab AC, maintenance history..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-md border border-input bg-background text-xs focus:outline-none focus:ring-1 focus:ring-amber"
            />
          </div>
        </Card>

        {/* Pricing & Location Card */}
        <Card className="p-6 rounded-2xl border-border bg-card shadow-xs space-y-4">
          <h2 className="font-bold text-base text-foreground flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-amber" />
            <span>Rental Pricing & Job-Site Location</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Daily Rental Rate (USD $) *
              </label>
              <Input
                type="number"
                placeholder="250"
                value={pricePerDay}
                onChange={(e) => setPricePerDay(e.target.value)}
                required
                min="1"
                className="text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Refundable Security Deposit (USD $)
              </label>
              <Input
                type="number"
                placeholder="300"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">City</label>
              <Input
                type="text"
                placeholder="Austin"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">State</label>
              <Input
                type="text"
                placeholder="TX"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Yard / Depot</label>
              <Input
                type="text"
                placeholder="Industrial Hub 4"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>
        </Card>

        {/* Machine Image URLs */}
        <Card className="p-6 rounded-2xl border-border bg-card shadow-xs space-y-4">
          <h2 className="font-bold text-base text-foreground flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-amber" />
            <span>Machine Photography</span>
          </h2>

          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Paste image URL (https://...)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="text-xs"
            />
            <Button
              type="button"
              onClick={addImage}
              size="sm"
              variant="outline"
              className="shrink-0 text-xs font-semibold"
            >
              Add URL
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {images.map((img, i) => (
              <div key={i} className="relative group rounded-lg overflow-hidden border border-border aspect-[16/10] bg-muted">
                <img src={img} alt="Equipment" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Technical Specifications */}
        <Card className="p-6 rounded-2xl border-border bg-card shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base text-foreground">
              Technical Specifications
            </h2>
            <Button
              type="button"
              onClick={addSpec}
              size="sm"
              variant="outline"
              className="text-xs font-semibold gap-1 h-8"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Add Spec Row</span>
            </Button>
          </div>

          <div className="space-y-2">
            {specs.map((s, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Key (e.g. Operating Weight)"
                  value={s.key}
                  onChange={(e) => updateSpec(idx, "key", e.target.value)}
                  className="text-xs flex-1"
                />
                <Input
                  type="text"
                  placeholder="Value (e.g. 5,400 kg)"
                  value={s.value}
                  onChange={(e) => updateSpec(idx, "value", e.target.value)}
                  className="text-xs flex-1"
                />
                <Button
                  type="button"
                  onClick={() => removeSpec(idx)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="w-full bg-amber text-graphite hover:bg-amber/90 font-bold text-sm shadow-md"
        >
          {loading ? "Publishing Listing..." : "Publish Fleet Listing"}
        </Button>
      </form>
    </div>
  );
}
