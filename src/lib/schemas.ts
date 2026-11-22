import { z } from "zod";
import type { EquipmentCategory } from "@/types";

/** Mirrors EquipmentCategory from src/types so lists can't drift apart. */
const EQUIPMENT_CATEGORIES = [
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
] as const satisfies readonly EquipmentCategory[];

export const equipmentCategorySchema = z.enum(EQUIPMENT_CATEGORIES);

export const rentalTypeSchema = z.enum(["Daily", "Weekly", "Monthly"]);

export const equipmentSortSchema = z.enum([
  "recently-added",
  "price-asc",
  "price-desc",
  "rating-desc",
  "popular",
]);

export const deliveryOptionSchema = z.enum(["Pickup", "Delivery"]);

const rentalDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Please select a valid date")
  .refine((value) => !Number.isNaN(new Date(value).getTime()), "Please select a valid date");

/** Booking dates (YYYY-MM-DD strings as produced by the browser date picker). */
export const bookingDatesSchema = z.object({
  startDate: rentalDateSchema,
  endDate: rentalDateSchema,
});

/** Core booking form: dates plus the number of units to rent. */
export const bookingFormSchema = z
  .object({
    startDate: rentalDateSchema,
    endDate: rentalDateSchema,
    requiredQuantity: z.number().int().min(1, "At least 1 unit is required").max(99),
  })
  .superRefine((value, ctx) => {
    if (new Date(value.startDate) > new Date(value.endDate)) {
      ctx.addIssue({
        code: "custom",
        message: "End date must be the same as or after the start date",
      });
    }
  });

/** Booking widget on the equipment detail page, including delivery details. */
export const bookingWidgetSchema = z
  .object({
    startDate: rentalDateSchema,
    endDate: rentalDateSchema,
    requiredQuantity: z.number().int().min(1, "At least 1 unit is required").max(99),
    deliveryOption: deliveryOptionSchema.default("Pickup"),
    deliveryAddress: z.string().trim().max(200).optional(),
    customerPhone: z.string().trim().min(1, "A contact phone number is required"),
  })
  .superRefine((value, ctx) => {
    if (new Date(value.startDate) > new Date(value.endDate)) {
      ctx.addIssue({
        code: "custom",
        message: "End date must be the same as or after the start date",
      });
    }
  });

const rentalTypeWithAllSchema = z.union([z.literal("All"), rentalTypeSchema]);

/** Filters applied on the equipment browse page (also used by the search form). */
export const searchFiltersSchema = z
  .object({
    search: z.string().trim().max(200).optional(),
    location: z.string().trim().max(200).optional(),
    category: z.union([z.literal("All"), equipmentCategorySchema]).optional(),
    rentalType: rentalTypeWithAllSchema.optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    availability: z.union([z.literal(""), z.literal("true")]).optional(),
    sort: equipmentSortSchema.optional(),
  })
  .superRefine((value, ctx) => {
    if (
      value.minPrice !== undefined &&
      value.maxPrice !== undefined &&
      value.minPrice > value.maxPrice
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Minimum price must be less than or equal to the maximum price",
      });
    }
  });

const PROFILE_PHONE_PATTERN = /^\+?[0-9()\-\s]{10,}$/;

/** Editable profile fields on the account dashboard. */
export const profileEditSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: z.email("Please enter a valid email address").optional(),
  phone: z.string().trim().regex(PROFILE_PHONE_PATTERN, "Please enter a valid phone number").optional(),
  address: z.string().trim().max(200, "Address is too long").optional(),
});

/** Customer review form fields. */
export const reviewSchema = z.object({
  rating: z.number().int().min(1, "Please pick a rating").max(5, "Please pick a rating"),
  comment: z.string().trim().min(5, "Please leave at least 5 characters of feedback").max(2000),
});
