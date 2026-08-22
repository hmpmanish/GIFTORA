# GIFTORA Project Audit

## 1. Current Architecture
- **Frontend Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** Zustand (for Cart)
- **Database:** PostgreSQL (Neon/Local)
- **ORM:** Prisma
- **Authentication:** NextAuth.js (Auth.js v5)
- **Payment Processing:** Razorpay (Code Ready)

## 2. Existing Features
- E-commerce Storefront (Homepage, Product list, Detail view, Search, Filters)
- Cart & Checkout System
- User Authentication (Credentials & Google OAuth Provider scaffolded)
- User Profiles & Address Book Management
- Wishlist System
- Admin Dashboard (Orders, Products, Customers, Inventory, Coupons, Reviews)
- SEO Metadata setup
- Trust & Legal Pages (Privacy, Terms, Refund, Shipping, About, Contact)

## 3. Working Features (Verified)
- **Database Mutators:** Inventory stock decrements via atomic transactions. Address management allows multiple records and enforces user-ownership.
- **Cart & Store:** Cart accurately synchronizes across browser sessions, checkout calculates total strictly on the backend.
- **Admin Access:** Middleware properly restricts non-admins from hitting `/admin` and `/api/admin` paths.
- **Search & Filters:** Server-side search filtering executes safely on the database without dragging the whole catalog to the client.

## 4. Partially Implemented Features
- **Razorpay:** The `api/payments/verify` and UI exist, but requires `RAZORPAY_KEY_SECRET` to process live transactions.
- **Cloudinary Image Uploads:** Currently uses placeholders or remote configurations, waiting on `CLOUDINARY_API_KEY`.
- **Email Notifications:** The integration skeleton exists but requires `SMTP_PASSWORD` and an active Email server.
- **Google OAuth:** Skeleton exists but lacks `GOOGLE_CLIENT_ID`.

## 5. Missing Features
- **Live Courier Tracking API:** Tracking relies on manually entered URLs by the Admin.
- **Automated Supplier Sync (Meesho):** Not implemented to prevent violating the user instructions against aggressive scraping. Supplier data must be added manually by Admin.

## 6. Configuration Requirements
To push this into a 100% live state, the following APIs need to be connected via `.env`:
- Razorpay Webhooks
- Google Developer Console (OAuth Redirect URIs)
- SMTP Mailer
- Cloudinary Upload Presets

## 7. Bugs Found & Fixed
- **Fixed:** Missing `Package` icon in `page.tsx` causing build type-check failure.
- **Fixed:** Mock timeout in `AddToCartButton` has been replaced with the real `useCart` logic.
- **Fixed:** Schema mismatched fields (`minOrderAmount`, `emailVerified`) in Admin dashboard caused build failures, patched successfully.

## 8. Security Concerns
- **None Blocking.** All input validation is handled via Zod. Authentication relies on JWT-backed sessions via Auth.js. Environment secrets are properly ignored in `.gitignore`.

## 9. Deployment Blockers
- Local CLI deployment using Vercel is failing due to NPM file permission issues. Deployment must be conducted by linking the GitHub repository directly to Vercel via the web dashboard.
