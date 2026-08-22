# GIFTORA Environment Setup Guide

To run GIFTORA securely in production, configure the following environment variables. **Never commit these values to version control.**

## REQUIRED FOR PRODUCTION
These variables must be populated for the application to build and execute its core functionalities.

- `DATABASE_URL`: Connection string for your PostgreSQL database (e.g., Neon). Must include `?schema=public`.
- `NEXTAUTH_SECRET`: A secure randomly generated string for encrypting JWT sessions.
- `NEXTAUTH_URL`: The canonical URL of your deployed application (e.g., `https://giftora.com`).
- `NEXT_PUBLIC_APP_URL`: Mirror of the canonical URL, used by client components.

## OPTIONAL (Feature Flags)
These variables are required only if you intend to enable the specific third-party integrations. The application will degrade gracefully if they are absent.

**Google OAuth:**
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

**Payment Processing (Razorpay):**
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`

**Email Notifications:**
- `EMAIL_SERVER`: The SMTP connection URI.
- `EMAIL_FROM`: The address orders will be sent from.

**Image CDNs (Cloudinary):**
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## DEVELOPMENT ONLY
- `ADMIN_EMAIL`: Seed data for the initial admin account.
- `ADMIN_PASSWORD_HASH`: Pre-hashed bcrypt password for the initial admin account.
