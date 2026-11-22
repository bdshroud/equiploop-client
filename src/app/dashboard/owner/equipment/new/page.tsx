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
  FileText,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { apiErrorMessage, fetchApi } from "@/lib/api";
import { uploadToImgBB } from "@/lib/upload";
import { toast } from "sonner";

const CATEGORIES = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
  "Heavy Machinery",
  "Power Tools",
  "Material Handling",
  "Cleaning & Restoration",
];

const RENTAL_TYPES = ["Daily", "Weekly", "Monthly"];
const CONDITIONS = ["Brand New", "Excellent", "Good", "Fair"];

export default function NewEquipmentPage() {
  const router = useRouter();

  // Assignment mandatory fields
  const [equipmentName, setEquipmentName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState("Construction Equipment");
  const [city, setCity] = React.useState("Austin");
  const [state, setState] = React.useState("TX");
  const [address, setAddress] = React.useState("742 Fleet Yard Ave");
  const [rentalPrice, setRentalPrice] = React.useState("");
  const [rentalType, setRentalType] = React.useState("Daily");
  const [availableQuantity, setAvailableQuantity] = React.useState("1");
  const [condition, setCondition] = React.useState("Excellent");
  const [brand, setBrand] = React.useState("Caterpillar");
  const [model, setModel] = React.useState("CAT-305E");
  const [rentalTerms, setRentalTerms] = React.useState(
    "Standard commercial rental terms apply. Valid operator certification and security deposit required upon delivery. Unit must be returned cleaned and fueled."
  );

  // Images state
  const [imageUrl, setImageUrl] = React.useState("");
  const [images, setImages] = React.useState<string[]>([
    "https://images.unsplash.com/photo-1579847188804-ecba0e2ea330?auto=format&fit=crop&w=800&q=80",
  ]);
  const [uploadingImg, setUploadingImg] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = React.useState(false);

  const addImage = () => {
    if (!imageUrl.trim()) return;
    setImages([...images, imageUrl.trim()]);
    setImageUrl("");
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImg(true);
      toast.info("Uploading image to ImgBB...");
      const res = await uploadToImgBB(file);
      if (res.success && res.url) {
        setImages((prev) => [...prev, res.url]);
        toast.success("Image successfully uploaded!");
      } else {
        toast.error(res.error || "Failed to upload image");
      }
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to upload image to ImgBB"));
    } finally {
      setUploadingImg(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipmentName.trim() || !rentalPrice) {
      toast.error("Please enter the Equipment Name and Rental Price");
      return;
    }

    try {
      setLoading(true);
      await fetchApi("/equipment", {
        method: "POST",
        body: JSON.stringify({
          title: equipmentName.trim(),
          equipmentName: equipmentName.trim(),
          category,
          description: description.trim(),
          rentalPrice: Number(rentalPrice),
          pricePerDay: Number(rentalPrice),
          rentalType,
          availableQuantity: Number(availableQuantity || 1),
          condition,
          brand: brand.trim(),
          model: model.trim(),
          location: {
            city: city.trim(),
            state: state.trim(),
            address: address.trim(),
          },
          images,
          rentalTerms: rentalTerms.trim(),
          status: "Pending", // Default pending per assignment
          availability: true,
        }),
      });

      toast.success("Equipment submitted! It is now pending administrator review.");
      router.push("/dashboard/owner/equipment");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to list equipment"));
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
            Add Equipment
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            List equipment for rent with comprehensive specifications, pricing terms, and photos.
          </p>
        </div>
      </div>

      {/* Moderation Notice Badge */}
      <div className="p-3.5 rounded-xl border border-amber/30 bg-amber/10 flex items-center justify-between gap-3 text-xs text-foreground">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-amber shrink-0" />
          <span>
            <strong>Status Notice:</strong> All newly added equipment will be marked as{" "}
            <span className="font-bold text-amber">Pending</span> until approved by platform administrators.
          </span>
        </div>
        <Badge variant="amber" className="text-[10px] shrink-0 font-bold">
          Default: Pending
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Details */}
        <Card className="p-6 rounded-2xl border-border bg-card shadow-xs space-y-4">
          <h2 className="font-bold text-base text-foreground flex items-center gap-2">
            <Wrench className="h-4 w-4 text-amber" />
            <span>Equipment Identity & Classification</span>
          </h2>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Equipment Name *
            </label>
            <Input
              type="text"
              placeholder="e.g. Caterpillar 305.5E2 Hydraulic Excavator"
              value={equipmentName}
              onChange={(e) => setEquipmentName(e.target.value)}
              required
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Category (Dropdown) *
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
                Equipment Condition
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Brand
              </label>
              <Input
                type="text"
                placeholder="e.g. Caterpillar, Sony, John Deere"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Model
              </label>
              <Input
                type="text"
                placeholder="e.g. 305.5E2, A7S III, 5075E"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe machine capability, operating weight, included attachments, maintenance log..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-md border border-input bg-background text-xs focus:outline-none focus:ring-1 focus:ring-amber"
            />
          </div>
        </Card>

        {/* Pricing, Quantity & Terms */}
        <Card className="p-6 rounded-2xl border-border bg-card shadow-xs space-y-4">
          <h2 className="font-bold text-base text-foreground flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-amber" />
            <span>Rental Terms & Inventory</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Rental Price ($) *
              </label>
              <Input
                type="number"
                placeholder="250"
                value={rentalPrice}
                onChange={(e) => setRentalPrice(e.target.value)}
                required
                min="1"
                className="text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Rental Type
              </label>
              <select
                value={rentalType}
                onChange={(e) => setRentalType(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs font-medium focus:outline-none focus:ring-1 focus:ring-amber"
              >
                {RENTAL_TYPES.map((t) => (
                  <option key={t} value={t}>{t} Rate</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Available Quantity
              </label>
              <Input
                type="number"
                placeholder="1"
                value={availableQuantity}
                onChange={(e) => setAvailableQuantity(e.target.value)}
                min="1"
                className="text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Rental Terms and Conditions
            </label>
            <textarea
              rows={3}
              placeholder="Specify damage deposit policies, required operator licensing, clean fuel return requirements..."
              value={rentalTerms}
              onChange={(e) => setRentalTerms(e.target.value)}
              className="w-full p-3 rounded-md border border-input bg-background text-xs focus:outline-none focus:ring-1 focus:ring-amber"
            />
          </div>
        </Card>

        {/* Location */}
        <Card className="p-6 rounded-2xl border-border bg-card shadow-xs space-y-4">
          <h2 className="font-bold text-base text-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4 text-amber" />
            <span>Equipment Location</span>
          </h2>

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
              <label className="text-xs font-semibold text-foreground block mb-1">State / Province</label>
              <Input
                type="text"
                placeholder="TX"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Street / Depot Address</label>
              <Input
                type="text"
                placeholder="742 Fleet Yard Ave"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>
        </Card>

        {/* Photography & ImgBB Upload */}
        <Card className="p-6 rounded-2xl border-border bg-card shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base text-foreground flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-amber" />
              <span>Equipment Images (ImgBB Upload / Direct Link)</span>
            </h2>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="imgbb-file-upload"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploadingImg}
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold border-amber/40 hover:bg-amber/10 text-amber"
              >
                {uploadingImg ? "Uploading to ImgBB..." : "Upload via ImgBB"}
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Or paste direct image URL (e.g. imgbb, Unsplash, or CDN URL)"
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
              Add Link
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {images.map((img, i) => (
              <div key={i} className="relative group rounded-lg overflow-hidden border border-border aspect-[16/10] bg-muted">
                <img src={img} alt="Equipment preview" className="h-full w-full object-cover" />
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

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="w-full bg-amber text-graphite hover:bg-amber/90 font-bold text-sm shadow-md"
        >
          {loading ? "Submitting for Moderation..." : "Add Equipment (Submit for Review)"}
        </Button>
      </form>
    </div>
  );
}
