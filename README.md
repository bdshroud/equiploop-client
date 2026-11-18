# EquipLoop Client — Commercial Equipment Rental Platform Frontend

Frontend application for **EquipLoop** (Programming Hero Assignment 9 — Category 003).

- **Project Name:** EquipLoop
- **Tagline:** Rent smarter. Work better.
- **Live Client URL:** `https://equiploop.vercel.app` (Placeholder / Deployment Target)
- **Live Server API:** `https://api.equiploop.com/api` (Placeholder / Deployment Target)

---

## 1. Project Purpose & Overview

**EquipLoop** is a commercial-grade equipment rental marketplace that connects construction contractors, event managers, industrial technicians, and individual operators with heavy machinery, power tools, vehicles, and audiovisual equipment.

The application allows:
- **Customers / Renters:** Search machinery by name and depot location, filter across categories and rental pricing, save favorites, book machinery for custom dates, pay via Stripe Checkout, and monitor rental status.
- **Equipment Owners:** Manage their heavy fleet, list new equipment with specifications and rental terms, review customer inquiries, track active on-site machinery, and monitor monthly revenues via interactive Recharts.
- **Platform Admins:** Moderate submitted equipment (Approve / Reject / Update / Delete), oversee registered users (promote roles, suspend/activate accounts), audit platform bookings, and view comprehensive platform financial analytics.

---

## 2. Key Features

1. **Authentication & Authorization:**
   - Password & email-based registration with strict validation (uppercase, lowercase, minimum 6 characters).
   - Google Social Sign-in.
   - Default assignment of `"Customer"` role upon signup.
   - JWT-based authentication using **Better Auth** with the `jwt()` plugin and client-side `jwtClient()` helper.
   - Role-Based Access Control (RBAC) protecting private and role-restricted routes (`Customer`, `Owner`, `Admin`).

2. **Homepage & Brand Experience:**
   - **Hero Banner:** Eye-catching commercial imagery, headline, and search shortcuts.
   - **Featured Equipment:** Displays exactly 6 approved machinery items queried using MongoDB `limit(6)`. Unauthenticated clicks on "View Details" redirect to `/login?redirect=...`.
   - **Categories Section:** Showcases key industries: Construction Equipment, Photography Equipment, Vehicles & Transportation, Agriculture Equipment, Electronics, Event Equipment, etc.
   - **Why Choose Us:** Commercial guarantees including verified owners, transparent damage escrow, and flexible duration terms.
   - **Customer Reviews:** Testimonials with 5-star ratings and contractor feedback.
   - **Extra Sections:** "How It Works" 3-step rental journey and Fleet Owner Call-To-Action banner.

3. **All Equipment Catalog:**
   - 3-column responsive machinery grid with 16:10 aspect ratio imagery.
   - Multi-field search (searches title, description, brand, model, and city/state location).
   - Filters for Category, Rental Type (Daily, Weekly, Monthly), Price Range ($min - $max), and Availability.
   - Sorting options: Price: Low to High, Price: High to Low, Highest Rated, and Recently Added.

4. **Equipment Details & Booking:**
   - High-resolution gallery, specifications table, rental terms & conditions, owner information, and customer reviews.
   - Interactive booking modal with date range selection, real-time day calculation, subtotal + security deposit calculation, delivery method selection, and direct Stripe Checkout redirection.
   - Toggleable Favorites / Wishlist with persistent database sync.

5. **Tabular Dashboards by Role:**
   - **Customer:**
     - `My Rentals` (`/dashboard/rentals`): Tabular layout showing Equipment Name, Rental Duration, Total Price, Payment Status, and Booking Status.
     - `Favorites` (`/dashboard/favorites`): Tabular layout of saved machinery with instant booking shortcuts.
     - `Profile` (`/dashboard/profile`): Update name, phone, operating address, and profile photo.
   - **Owner:**
     - `Fleet Overview` (`/dashboard/owner`): Recharts monthly revenue bar chart, active rental counts, and inquiry triage.
     - `My Equipment` (`/dashboard/owner/equipment`): Tabular layout showing Equipment Image, Title, Category, Price, and Status.
     - `Add Equipment` (`/dashboard/owner/equipment/new`): Comprehensive form with brand, model, condition, rental type, terms, and default `Pending` status.
     - `My Equipment Rental` (`/dashboard/owner/bookings`): Tabular layout with customer contact, rental duration, and inquiry approval controls.
   - **Admin:**
     - `Platform Overview` (`/dashboard/admin`): Recharts revenue trends, category distribution, and global booking metrics.
     - `All Users` (`/dashboard/admin/users`): Tabular layout showing Name, Email, Role, Registration Date, and Role Management/Account Controls.
     - `All Equipment` (`/dashboard/admin/equipment`): Tabular layout showing Equipment Image, Name, Category, Rental Price, Owner, Available Quantity, Status, and Approve/Reject/Update/Delete actions.
     - `All Bookings` (`/dashboard/admin/bookings`): Tabular layout showing Customer Info, Owner Info, Equipment Name, Duration, Amount, Payment Status, and Status controls.

6. **Design System & UX:**
   - Built on Tailwind CSS and **shadcn/ui** (Radix UI primitives).
   - Strict brand palette: **Graphite** (`#202C35`), **Amber** (`#E9A44C`), and **Warm White** (`#F7F7F3`).
   - Full Light Mode and Dark Mode support with smooth theme toggle persisted via `next-themes`.
   - Toast notifications powered by `sonner`.
   - Modern **X** SVG icon for Twitter/X social link (never the deprecated bird).

---

## 3. NPM Packages Used

### Core Framework & UI
- `next` (^16.4.6) — React Server Components & App Router framework
- `react` (^19.0.0) & `react-dom` (^19.0.0) — Modern React 19 core
- `typescript` (^5.7.3) — Type safety and strict interfaces
- `tailwindcss` (^3.4.17) — Utility-first CSS framework
- `next-themes` (^0.4.4) — Persistent theme provider for Light and Dark modes
- `framer-motion` (^12.4.7) — Smooth, performant interactive animations
- `lucide-react` (^0.475.0) — Modern, clean icons
- `recharts` (^2.15.1) — Composable SVG charting library for dashboard analytics
- `sonner` (^2.0.1) — Toast notification system

### Radix UI / shadcn Components
- `@radix-ui/react-dialog` — Accessible modals and alerts
- `@radix-ui/react-dropdown-menu` — Action menus and user dropdowns
- `@radix-ui/react-tabs` — Dashboard and filter tabs
- `@radix-ui/react-avatar` — User and fleet profile avatars
- `@radix-ui/react-separator` — Semantic dividing lines
- `class-variance-authority` & `clsx` & `tailwind-merge` — Dynamic component variant utilities

### Authentication & API Integration
- `better-auth` (^1.1.21) — Full-featured TypeScript authentication engine with `jwt()` plugin
- `@better-auth/mongo-adapter` (^1.1.21) — Direct MongoDB adapter for Better Auth
- `mongodb` (^6.13.0) — Native MongoDB client connecting to `equiploop` database
- `react-hook-form` (^7.54.2) & `@hookform/resolvers` (^4.1.0) & `zod` (^3.24.2) — Robust form validation

---

## 4. Environment Variables

Create `.env.local` in `equiploop-client`:

```env
# Next.js Server & Client URL
NEXT_PUBLIC_CLIENT_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:3000

# Backend API Endpoint
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Shared MongoDB Database Connection
DB_URI=mongodb://localhost:27017
DB_NAME=equiploop

# Better Auth Secret (Min 32 characters)
BETTER_AUTH_SECRET=equiploop_super_secret_jwt_encryption_key_2026

# Google OAuth Credentials (Optional / Production)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Stripe Public Key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder
```

---

## 5. Getting Started Locally

```bash
# Navigate to the client directory
cd equiploop-client

# Install dependencies
npm install

# Start the Next.js development server
npm run dev

# Open http://localhost:3000 in your browser
```
