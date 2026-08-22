# GIFTORA Deployment Guide (Vercel)

Due to local Vercel CLI execution restrictions, the recommended and most stable deployment path is via Vercel's GitHub integration.

## 1. GitHub Setup
Ensure your local code is committed and pushed to a remote GitHub repository.
```bash
git add .
git commit -m "chore: ready for production deployment"
git push origin main
```

## 2. Vercel Project Setup
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New... > Project**.
3. Import the `GIFTORA` repository from your GitHub account.

## 3. PostgreSQL Setup
1. Provision a PostgreSQL database (Neon, Supabase, or AWS RDS).
2. Copy the Connection Pooling URL (e.g., `postgres://user:pass@pool.region.db.com/db?schema=public`).

## 4. Environment Variables
In the Vercel deployment configuration screen, add the variables documented in `ENV_SETUP.md`:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_APP_URL`
*(Add Razorpay, Cloudinary, and Google vars if you have them).*

## 5. Prisma Migration
Since Vercel environments are ephemeral, ensure your build step triggers the database generation. The `package.json` should have a `postinstall` script:
```json
"scripts": {
  "postinstall": "prisma generate"
}
```
*Note: To apply migrations to the production DB, you must manually run `npx prisma migrate deploy` locally pointing to your production DB URL, or run it in a CI/CD pipeline.*

## 6. Integrations Configuration
- **Google OAuth Callback URL:** Set to `https://<your-vercel-domain>.vercel.app/api/auth/callback/google` in GCP.
- **Razorpay Webhook:** Set to `https://<your-vercel-domain>.vercel.app/api/payments/verify`.

## 7. Post-Deployment Testing
1. Visit the live URL.
2. Attempt to create a dummy account.
3. Access `/admin` to verify rejection.
4. Add an item to the cart and verify the totals hold on page refresh.
