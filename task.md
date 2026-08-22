# GIFTORA - Project Tasks

## Foundation & Setup
- [x] Inspect existing architecture and dependencies
- [x] Fix Next.js App Router & TypeScript errors
- [x] Fix Prisma & PostgreSQL configuration
- [x] Fix ESLint and Build errors (Missing dependencies, incorrect imports)
- [x] Ensure `npm run build` succeeds completely

## Database & Models
- [x] Validate Prisma schema (User, Product, Order, Category, etc.)
- [x] Configure global Prisma client to prevent multiple instances
- [x] Configure adapter for serverless Edge environment

## Authentication & Security
- [x] NextAuth (Auth.js) implementation with Credentials (bcrypt)
- [x] Role-based access control (ADMIN, STAFF, CUSTOMER)
- [x] Protect API routes and Admin dashboard using middleware

## Admin Dashboard
- [x] Dashboard Layout & UI Foundation
- [x] Admin Products List & Creation Form (with Zod validation)
- [x] Admin Orders List & Status Updater

## Customer Storefront
- [x] Homepage Layout & UI
- [x] Shop (Catalog) Page
- [x] Product Details Page
- [x] Shopping Cart (State Management)
- [x] Checkout Flow
- [x] Order Success / Tracking Page

## Payment & Integration
- [x] Razorpay Order Creation API
- [x] Razorpay Payment Verification API
- [x] Cash on Delivery (COD) flow implementation

## Pending / Remaining Work
- [ ] Implement Wishlist functionality (Database-backed)
- [ ] User Profile & Address Management
- [ ] Connect Homepage sections (Bestsellers, New Arrivals) to real database queries
- [ ] Implement real Server-Side Search, Filtering, and Pagination
- [ ] Cart Stock & Price Validation (Server-side recalculation during checkout)
- [ ] Email Service Integration (Resend / SMTP)
- [ ] Cloudinary Image Upload Integration (Admin panel)
- [ ] Admin Customer Management, Coupons, & Reviews Moderation
- [ ] UI Polish (Mobile responsiveness, empty states, loading states)
