/**
 * EquipLoop shared domain types.
 *
 * These mirror the server contract in equiploop-server/src/seed and the
 * public /api routes. Update both sides together when the shape changes.
 */

export type EquipmentCategory =
  | "Construction Equipment"
  | "Photography Equipment"
  | "Vehicles & Transportation"
  | "Agriculture Equipment"
  | "Electronics"
  | "Event Equipment"
  | "Power Tools"
  | "Heavy Machinery"
  | "Material Handling"
  | "Generators & Power";

export type EquipmentCondition = "Brand New" | "Excellent" | "Good";

export type RentalType = "Daily" | "Weekly" | "Monthly";

export interface EquipmentLocation {
  city: string;
  state: string;
  address?: string;
}

export interface Equipment {
  _id: string;
  title: string;
  equipmentName: string;
  category: EquipmentCategory;
  rentalType: RentalType;
  rentalPrice: number;
  pricePerDay: number;
  availableQuantity: number;
  securityDeposit: number;
  condition: EquipmentCondition;
  brand: string;
  model: string;
  rentalTerms: string;
  description: string;
  images: string[];
  specifications: Record<string, string>;
  location: EquipmentLocation;
  availability: boolean;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  status: string; // Approved | Pending | Rejected | Hidden
  isFeatured: boolean;
  rating: number; // 4.5 to 5.0
  totalReviews: number;
  totalBookings: number;
  createdAt?: string;
  updatedAt?: string;
}

/** Back-compat alias: the card component and browse page both refer to this name. */
export type EquipmentItem = Equipment;

export interface EquipmentListResponse extends ApiResponse<Equipment[]> {
  pagination?: PaginatedInfo<Equipment>;
}

export type EquipmentSort =
  | "recently-added"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "popular";

export interface EquipmentFilters {
  search?: string;
  location?: string;
  category?: string;
  rentalType?: string; // "All" or a RentalType
  minPrice?: string;
  maxPrice?: string;
  availability?: string; // "" or "true"
  sort: EquipmentSort;
}

export interface PaginatedInfo<T = unknown> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  items?: T[];
  data?: T[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  url?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination?: PaginatedInfo<T>;
}

export interface EquipmentReview {
  _id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface BookingResponse {
  _id: string;
  status?: string;
  paymentStatus?: string;
}

/** Better Auth payloads (see src/lib/auth.ts for configuration details). */
export interface BetterAuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role?: string;
  phone?: string;
  address?: string;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface BetterAuthSession {
  id: string;
  token: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  expires?: boolean;
  ipAddress?: string;
  userAgent?: string;
}

export interface EquipLoopSession {
  user: BetterAuthUser;
  session: BetterAuthSession;
}
