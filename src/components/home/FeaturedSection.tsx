"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { EquipmentCard, EquipmentItem } from "@/components/equipment/EquipmentCard";
import { fetchApi } from "@/lib/api";

const FALLBACK_FEATURED: EquipmentItem[] = [
  {
    _id: "feat_1",
    title: "Caterpillar 305.5E2 Mini Hydraulic Excavator",
    equipmentName: "Caterpillar 305.5E2 Mini Hydraulic Excavator",
    category: "Construction Equipment",
    rentalType: "Daily",
    description: "Compact hydraulic excavator engineered for tight radius earthmoving, trenching, and utility works.",
    images: ["https://images.unsplash.com/photo-1579847188804-ecba0e2ea330?auto=format&fit=crop&w=800&q=80"],
    pricePerDay: 350,
    rentalPrice: 350,
    securityDeposit: 500,
    availableQuantity: 3,
    condition: "Excellent",
    location: { city: "Austin", state: "TX" },
    availability: true,
    status: "Approved",
    isFeatured: true,
    rating: 4.9,
    totalReviews: 14,
    brand: "Caterpillar",
    model: "305.5E2 CR",
    rentalTerms: "Refundable damage deposit required. Certified operator only.",
    specifications: {
      Brand: "Caterpillar",
      Model: "305.5E2 CR",
      "Operating Weight": "5,400 kg (11,905 lbs)",
      "Net Power": "44.1 kW (59 hp)",
      "Max Dig Depth": "3.83 m (12.5 ft)",
      "Fuel Type": "Diesel",
    },
    ownerId: "owner_seed_1",
    ownerName: "Apex Heavy Fleet LLC",
    ownerEmail: "rentals@apexmachinery.com",
    totalBookings: 28,
  },
  {
    _id: "feat_2",
    title: "Sony FX6 Full-Frame Cinema Camera Kit",
    equipmentName: "Sony FX6 Full-Frame Cinema Camera Kit",
    category: "Photography Equipment",
    rentalType: "Daily",
    description: "Full-frame cinema camera with 4K 120p, 10-bit 4:2:2 DCI 4K output, electronic variable ND filter, and G-Master lenses.",
    images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80"],
    pricePerDay: 195,
    rentalPrice: 195,
    securityDeposit: 300,
    availableQuantity: 4,
    condition: "Brand New",
    location: { city: "Austin", state: "TX" },
    availability: true,
    status: "Approved",
    isFeatured: true,
    rating: 5.0,
    totalReviews: 18,
    brand: "Sony",
    model: "ILME-FX6V",
    rentalTerms: "Certificate of camera insurance or full security deposit required.",
    specifications: {
      Brand: "Sony",
      Sensor: "35mm Full-Frame 10.2 MP CMOS",
      "Dynamic Range": "15+ stops",
      Media: "CFexpress Type A / SDXC",
    },
    ownerId: "owner_seed_3",
    ownerName: "CineVault Camera Gear",
    ownerEmail: "gear@cinevault.com",
    totalBookings: 34,
  },
  {
    _id: "feat_3",
    title: "Ford F-550 Super Duty 16ft Flatbed Dump Truck",
    equipmentName: "Ford F-550 Super Duty 16ft Flatbed Dump Truck",
    category: "Vehicles & Transportation",
    rentalType: "Daily",
    description: "Commercial flatbed dump truck with 6.7L V8 Turbo Diesel, hydraulic scissor hoist, and integrated steel racks.",
    images: ["https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80"],
    pricePerDay: 220,
    rentalPrice: 220,
    securityDeposit: 400,
    availableQuantity: 2,
    condition: "Excellent",
    location: { city: "Houston", state: "TX" },
    availability: true,
    status: "Approved",
    isFeatured: true,
    rating: 4.8,
    totalReviews: 12,
    brand: "Ford",
    model: "F-550 PowerStroke",
    rentalTerms: "Valid CDL or commercial driver license required. Unlimited mileage within 150-mile radius.",
    specifications: {
      Brand: "Ford Commercial",
      Engine: "6.7L V8 Turbo Diesel (475 hp)",
      Payload: "12,750 lbs",
      "Bed Length": "16 ft Steel Flatbed with Dumper",
      Transmission: "10-Speed TorqShift Automatic",
    },
    ownerId: "owner_seed_1",
    ownerName: "Apex Heavy Fleet LLC",
    ownerEmail: "rentals@apexmachinery.com",
    totalBookings: 25,
  },
  {
    _id: "feat_4",
    title: "John Deere 3038E Compact Agricultural Utility Tractor",
    equipmentName: "John Deere 3038E Compact Agricultural Utility Tractor",
    category: "Agriculture Equipment",
    rentalType: "Weekly",
    description: "Four-wheel-drive compact utility tractor with front loader, hydrostatic transmission, and rear rotary cutter.",
    images: ["https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80"],
    pricePerDay: 180,
    rentalPrice: 180,
    securityDeposit: 350,
    availableQuantity: 2,
    condition: "Excellent",
    location: { city: "San Antonio", state: "TX" },
    availability: true,
    status: "Approved",
    isFeatured: true,
    rating: 4.9,
    totalReviews: 10,
    brand: "John Deere",
    model: "3038E 4WD",
    rentalTerms: "Includes front-end loader and rear rotary cutter. Clean machinery upon return.",
    specifications: {
      Brand: "John Deere",
      Engine: "Yanmar 3-Cylinder Diesel (37.3 hp)",
      Drivetrain: "4WD Hydrostatic 2-Range",
      "Lift Capacity at 24\"": "1,356 lbs (615 kg)",
      "PTO Power": "30 hp",
    },
    ownerId: "owner_seed_2",
    ownerName: "Northstar Plant Rentals",
    ownerEmail: "dispatch@northstarrentals.com",
    totalBookings: 21,
  },
  {
    _id: "feat_5",
    title: "JBL PRX ONE 2,000W Powered Column Concert PA System",
    equipmentName: "JBL PRX ONE 2,000W Powered Column Concert PA System",
    category: "Event Equipment",
    rentalType: "Daily",
    description: "High-output column array system with built-in 7-channel digital mixer, DSP effects, Bluetooth audio, and wireless mics.",
    images: ["https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80"],
    pricePerDay: 130,
    rentalPrice: 130,
    securityDeposit: 200,
    availableQuantity: 5,
    condition: "Excellent",
    location: { city: "Austin", state: "TX" },
    availability: true,
    status: "Approved",
    isFeatured: true,
    rating: 4.9,
    totalReviews: 11,
    brand: "JBL Professional",
    model: "PRX ONE",
    rentalTerms: "Includes padded transport bags, XLR patch cables, and wireless microphone kit.",
    specifications: {
      Brand: "JBL Professional",
      "Peak Output": "2,000 Watts",
      "Max SPL": "130 dB",
      Woofers: "12\" custom bass-reflex subwoofer",
      Inputs: "4 XLR combo, 2 1/4\" Hi-Z, 1 3.5mm AUX"
    },
    ownerId: "owner_seed_2",
    ownerName: "Northstar Plant Rentals",
    ownerEmail: "dispatch@northstarrentals.com",
    totalBookings: 24,
  },
  {
    _id: "feat_6",
    title: "FLIR T865 High-Performance Thermal Imaging Camera",
    equipmentName: "FLIR T865 High-Performance Thermal Imaging Camera",
    category: "Electronics",
    rentalType: "Daily",
    description: "Non-contact thermal camera with 640x480 IR resolution, 1-Touch Level/Span, laser autofocus, and temp range to 1500°C.",
    images: ["https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"],
    pricePerDay: 165,
    rentalPrice: 165,
    securityDeposit: 300,
    availableQuantity: 3,
    condition: "Brand New",
    location: { city: "Dallas", state: "TX" },
    availability: true,
    status: "Approved",
    isFeatured: true,
    rating: 5.0,
    totalReviews: 7,
    brand: "FLIR Systems",
    model: "T865 24-degree",
    rentalTerms: "Delivered in waterproof Pelican case with two rechargeable lithium batteries and calibration certificate.",
    specifications: {
      Brand: "FLIR",
      "Thermal Resolution": "640 x 480 (307,200 pixels)",
      "Object Temp Range": "-40°C to 120°C / 0°C to 650°C",
      Accuracy: "±1°C (±1.8°F) or ±1%",
      Display: "4-inch 640x480 LCD with touch screen"
    },
    ownerId: "owner_seed_3",
    ownerName: "CineVault Camera Gear",
    ownerEmail: "gear@cinevault.com",
    totalBookings: 15,
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
          // Strictly take 6 items
          setItems(res.data.slice(0, 6));
        }
      } catch (err) {
        // Keeps fallback items if server is starting
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
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-text mb-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Handpicked Machinery</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Featured Fleet Equipment (Top 6)
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Commercial-grade equipment maintained to strict OEM specifications and ready for instant booking.
            </p>
          </div>

          <Link
            href="/equipment"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-text hover:underline group"
          >
            <span>Explore all equipment</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Featured Items Grid with Framer Motion Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="h-full"
            >
              <EquipmentCard item={item} requireAuthForDetails={true} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
