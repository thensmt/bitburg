# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Project Bitburg** — a two-sided marketplace for media professionals (photographers, videographers, editors, etc.) and clients in the Northern Virginia / DMV area. Think Uber for media work: clients post jobs or instant-hire pros, pros apply and compete for work, admin vets and tiers all professionals.

## Commands

```bash
npm run dev       # start dev server (localhost:3000)
npm run build     # production build
npm run lint      # ESLint
npx prisma migrate dev --name <name>   # create and apply a migration
npx prisma studio                      # visual DB browser
npx prisma generate                    # regenerate Prisma client after schema changes
```

## Architecture

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Clerk (auth) · Prisma (ORM) · PostgreSQL via Supabase · Google Cloud Storage (media)

**Auth — Clerk:**
- Three roles: `CLIENT`, `PRO`, `ADMIN` — stored on the `User` model, synced from Clerk via webhook or metadata
- Middleware at `src/middleware.ts` gates routes by role
- `clerkId` on `User` links Clerk identity to the DB record

**Database — Prisma + Supabase:**
- Schema at `prisma/schema.prisma` — single source of truth for all models
- `.env` needs `DATABASE_URL` (pooled, for Prisma) and `DIRECT_URL` (direct connection, for migrations)
- Use Supabase connection strings: `postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres`
- Generated client outputs to `src/generated/prisma`

**Key data relationships:**
- `User` → `ProProfile` (1:1, only pros have this)
- `ProProfile` → `ProRate[]` (per-category rates for instant hire)
- `Job` (posted by client) → `Application[]` (submitted by pros) → `Booking` (created on award)
- `Booking` → `Review` and `Booking` → `Dispute`

**Job types:**
- `ON_SITE` — has `eventDate`, `durationHours`, `location`
- `REMOTE` — has `deliveryDeadline`, `assetHandoffMethod`, `assetHandoffUrl` (editing, graphic design, etc.)

**Tier system:** `D < C < B < A < S` — assigned by admin, gates job visibility. Jobs have `minTierRequired`; pros below that tier cannot see or apply.

**Payments (Stripe Connect — Phase 2):**
- Deposit is non-refundable once a pro is selected, held in escrow
- Balance auto-releases 5 days after event/delivery if client doesn't dispute
- Platform fee deducted from pro payout

**Advertising:**
- Every page layout includes `<AdSlot zone="..." />` components reserved for ad placements
- Ad slots render nothing until content is assigned; do not remove them
- Zones are defined per-screen in the product spec

**File structure conventions:**
- `src/app/` — App Router pages and layouts
- `src/app/api/` — API route handlers
- `src/components/` — shared React components
- `src/lib/` — server utilities (db client, auth helpers, GCS client)
- `src/generated/prisma` — auto-generated Prisma client (do not edit)
- `prisma/schema.prisma` — DB schema

## Environment Variables

```
DATABASE_URL=          # Supabase pooled connection (Prisma queries)
DIRECT_URL=            # Supabase direct connection (migrations)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
GCS_BUCKET_NAME=bitburg-media
GCS_PROJECT_ID=
GCS_CLIENT_EMAIL=
GCS_PRIVATE_KEY=
```
