# Bitburg MVP Architecture Blueprint

**Owner:** David Gaylor  
**Date:** April 13, 2026  
**Status:** Active — reference throughout build  
**Tools:** Claude (architecture + teaching) · Codex (building + auditing) · v0 (design)

---

## Section 1 — Architecture Checklist

Every item below is a locked decision. Check it off when implemented and verified.

### Auth & Roles

- [ ] Database is the single source of truth for user roles
- [ ] Every role change in DB triggers a dual-write to Clerk `publicMetadata.role`
- [x] Clerk webhook (`/api/webhooks/clerk`) sets default role to CLIENT on `user.created`
- [ ] Nav component reads role from DB (via `/api/me/role`), not Clerk metadata
- [x] `src/proxy.ts` exists with centralized role matrix (Next.js 16 convention — `middleware.ts` is deprecated, `proxy.ts` is the new name and runs on Node.js by default)
- [x] Middleware role resolution is DB-authoritative (resolves role via `getSessionUserByClerkId` in `src/lib/auth.ts`)
- [x] Onboarding route blocks re-onboarding for users who already have a role

**Role Matrix (enforced in middleware):**

| Route Pattern | Allowed Roles |
|---|---|
| `/admin/*` | ADMIN only |
| `/jobs/new` | CLIENT only |
| `/apply/*` | PRO only |
| `/pros/*/edit` | PRO only (own profile — page-level check) |
| `/dashboard/*` | Any authenticated role |
| `/jobs/*`, `/pros/*` (public views) | Any authenticated user |
| Everything else | Authenticated |

### Data Model

- [ ] Single `Job` table for both ON_SITE and REMOTE types
- [ ] API validates required fields by `jobType`: ON_SITE needs `eventDate`, `durationHours`, `location`; REMOTE needs `deliveryDeadline`
- [ ] API also persists `assetHandoffMethod` and `assetHandoffUrl` for REMOTE jobs
- [ ] Pro slug auto-generated from name on admin approval (format: `david-gaylor`, collisions get `-2`, `-3`)
- [ ] Slug is immutable once set
- [ ] All status-changing API routes check current status before allowing transition

### Schema Health

- [x] Prisma migrations reconciled with current `schema.prisma` — `prisma migrate status` confirms 2 migrations applied, "Database schema is up to date" (2026-04-13, after credentials fix)
- [x] `.env.example` file created with all required variables
- [x] Prisma client import path consistent — all code imports from `@prisma/client`; CLAUDE.md updated to drop the stale `src/generated/prisma` reference

### Deferred (Not MVP — Do Not Touch)

- [ ] Stripe Connect / payments / escrow — FROZEN
- [ ] AdSlot system — leave as-is, no expansion
- [ ] GCS file uploads — deferred, pros link external URLs
- [ ] Dispute admin resolution — deferred, create-only stays
- [ ] Review system — keep stable, no expansion

---

## Section 2 — MVP Build Plan (Dependency Order)

**MVP definition:** A client can post a job → a pro can find and apply → the client can award the booking. No payments, no disputes, no ads.

### Phase 1 — Fix the Foundation (Backend Only)

**Task 1.1: Finalize middleware role resolution** ✅ DONE (2026-04-13)

- What: Proxy (Next.js 16 name for middleware) now resolves role from the DB on every protected request via `getSessionUserByClerkId` in `src/lib/auth.ts`. Role matrix enforced: `/admin/*` → ADMIN, `/jobs/new` → CLIENT, `/apply/*` → PRO. Onboarding gate redirects users without `onboardingComplete=true` to `/onboarding`, and users who are already onboarded are redirected away from `/onboarding`.
- Files: `src/proxy.ts`, `src/lib/auth.ts` (new)
- Note: Next.js 16 deprecated `middleware.ts` in favor of `proxy.ts`. Proxy files always run on Node.js runtime — do not add `export const runtime = 'nodejs'`, Next will error. The API (`clerkMiddleware`, `createRouteMatcher`, `config.matcher`) is identical to old middleware.
- Complexity: Medium
- Depends on: Nothing
- v0 needed: No

**Task 1.2: Normalize role policy between proxy and API routes** ✅ DONE (2026-04-13)

- Decision: **Only CLIENT can post jobs** — ADMIN access removed. Matches PLAYBOOK marketplace conflict-of-interest rule. Admins test via a separate CLIENT account.
- Change: `src/app/api/jobs/route.ts` — removed `|| ADMIN` from the role check.
- Change: `src/app/admin/layout.tsx` — removed redundant ADMIN re-check (proxy already gates `/admin/*`). Added `export const dynamic = "force-dynamic"` to preserve dynamic rendering after the DB call was removed, so `/admin` isn't prerendered at build time.
- API-level role gates elsewhere (instant-hire, apply, bookings, stripe, admin API) are intentionally **kept** as defense in depth per PLAYBOOK §4 — only page-level role gates covered by the proxy were removed.
- Files: `src/app/api/jobs/route.ts`, `src/app/admin/layout.tsx`
- Complexity: Small
- Depends on: Task 1.1

**Task 1.3: Harden all status-changing APIs with precondition checks** ✅ DONE (2026-04-13)

- Pattern applied: every status-changing route now verifies the current state before transitioning; wrong state → **409 Conflict** with a human-readable message. Input-validation errors stay 400; Stripe routes (frozen) were not touched.
- Changes:
  - `admin/applications/[id]/review` — added PENDING precondition (admin can only review a pending application; already-approved/rejected returns 409)
  - `jobs/[id]/apply` — job status & deadline checks 400 → 409
  - `jobs/[id]/select` — job status check 400 → 409
  - `bookings/[id]/complete` — status check 400 → 409
  - `bookings/[id]/dispute` — status check 400 → 409
  - `bookings/[id]/review` — status check 400 → 409
  - `api/apply` — added precondition: if profile is already APPROVED, returns 409 (fixes bug where re-submitting would demote an approved pro back to PENDING)
  - `api/onboarding` — added precondition: if `onboardingComplete=true`, returns 409
- Files: `src/app/api/{admin/applications/[id]/review, jobs/[id]/{apply,select}, bookings/[id]/{complete,dispute,review}, apply, onboarding}/route.ts`
- Complexity: Medium
- Depends on: Task 1.1

**Task 1.4: Complete job creation validation** ✅ DONE (2026-04-13)

- New shared validator: `src/lib/validators.ts` → `validateJobByType()` — returns `string | null` for a per-jobType field check. ON_SITE requires `eventDate`, positive `durationHours`, and non-empty `location`. REMOTE requires `deliveryDeadline`, and if `assetHandoffMethod === "EXTERNAL_LINK"` then `assetHandoffUrl` is required. Invalid `jobType` values are rejected.
- `POST /api/jobs` now:
  - Calls `validateJobByType` and returns 400 with a specific message on failure
  - Checks `budget` is a positive number (400 if not)
  - Rejects `applicationDeadline` that is invalid or in the past (400)
  - **Persists `assetHandoffMethod` and `assetHandoffUrl`** — resolves audit finding V5's backend half
- V5 UI half (form missing handoff fields) is still open, deferred to Task 2.1 (v0 job post form design).
- Files: `src/lib/validators.ts` (new), `src/app/api/jobs/route.ts`
- Complexity: Medium
- Depends on: Task 1.3

**Task 1.5: Migration hygiene + .env.example** ✅ DONE (2026-04-13)

- `.env.example` created at repo root documenting every variable referenced in code or existing env files — Database/Supabase, Clerk + webhook, Stripe (Phase 2/frozen), GCS (deferred), and app URL.
- Prisma import path: schema has no `output` override, so the generated client lives at `node_modules/@prisma/client` and all code imports from there. CLAUDE.md had a stale note pointing at `src/generated/prisma` — updated to match reality.
- Supabase DB password was stale; reset and `.env.local` updated. `DATABASE_URL` now uses transaction pooler (port 6543, `?pgbouncer=true`) and `DIRECT_URL` uses session pooler (port 5432) per Supabase's Prisma recommendation.
- `npx prisma migrate status` confirms 2 migrations (`20260315173808_init`, `20260315182114_add_onboarding_complete`) applied and no drift.
- Files: `.env.example` (new), `CLAUDE.md`, `.env.local` (local only, gitignored)
- Complexity: Medium
- Depends on: Task 1.3 (schema changes from slug logic)

### Phase 2 — Design Core Screens (v0)

**Task 2.1: Design job post form in v0**

- What: The form needs to handle ON_SITE vs REMOTE switching, show/hide the right fields for each type, collect all required data including `assetHandoffMethod` and `assetHandoffUrl` for remote jobs. Design it in v0 as a React + Tailwind component.
- Files: Will replace `src/app/jobs/new/page.tsx`
- Complexity: Medium
- Depends on: Task 1.4 (backend contract must be finalized first so the form matches)
- v0 needed: YES

**Task 2.2: Design role-specific dashboards in v0**

- What: Client dashboard should emphasize posting jobs and reviewing applicants. Pro dashboard should emphasize finding jobs and managing applications. Admin dashboard should emphasize reviewing pro applications and assigning tiers. Design each as a separate v0 component.
- Files: Will update `src/app/dashboard/page.tsx` and sub-components
- Complexity: Medium
- Depends on: Task 1.2 (role policy must be clear)
- v0 needed: YES

### Phase 3 — Build What You Designed

**Task 3.1: Implement v0 job post form**

- What: Take the v0 export, integrate it into the app, wire it to the `/api/jobs` endpoint.
- Files: `src/app/jobs/new/page.tsx`
- Complexity: Medium
- Depends on: Task 2.1

**Task 3.2: Implement v0 dashboards**

- What: Replace current dashboard with v0-designed role-specific versions.
- Files: `src/app/dashboard/page.tsx` and sub-components
- Complexity: Medium
- Depends on: Task 2.2

**Task 3.3: End-to-end MVP smoke test**

- What: Manually walk through the entire loop as both a client and a pro. Post a job, apply as a pro, award the booking. Document every bug, broken flow, or confusing UX moment.
- Files: All — this is integration testing
- Complexity: Large (time, not code)
- Depends on: All previous tasks

### Phase 4 — Cleanup

**Task 4.1: Dead code / documentation cleanup**

- What: Mark `StripeConnectBanner` as Phase 2. Clean up unused imports. Update `README.md` from boilerplate to real project description. Update `CLAUDE.md` if any decisions changed.
- Files: `src/app/dashboard/StripeConnectBanner.tsx`, `README.md`, `CLAUDE.md`
- Complexity: Small
- Depends on: Nothing (can happen anytime)

---

## Section 3 — Teaching Notes (What You'll Learn Per Task)

### Task 1.1 — Proxy (middleware)

**Concept: How proxy/middleware works in Next.js**

A proxy (called "middleware" in Next.js ≤15) is code that runs BEFORE any page or API route loads. Think of it as airport security — everyone passes through it before reaching their gate. In Next.js 16, `proxy.ts` in your `src/` folder intercepts every request and can redirect, block, or modify it. It always runs on the Node.js runtime, so it can use your Prisma client directly.

**What you'll understand after this task:**
- How HTTP requests flow through a Next.js app (request → middleware → page/API)
- What a "role matrix" is and why centralizing auth decisions prevents security holes
- The difference between authentication (are you logged in?) and authorization (are you allowed here?)

### Task 1.2 — Role Policy

**Concept: Defense in depth**

Even with middleware, individual pages and API routes can have their own checks. This is called defense in depth — multiple layers of security so if one fails, another catches it. But you don't want redundant checks that make the code confusing. The skill is knowing which checks belong where.

**What you'll understand after this task:**
- When to check roles in middleware vs in page code vs in API routes
- The difference between "role access" (are you a CLIENT?) and "ownership access" (is this YOUR profile?)

### Task 1.3 — Status Transitions

**Concept: State management and data integrity**

Every job, application, and booking in your app has a lifecycle. A job starts OPEN, gets filled, gets completed. An application starts PENDING, gets accepted or rejected. If your code doesn't check where something currently IS before changing it, you get impossible states — a completed booking getting completed again, or a rejected application getting accepted.

**What you'll understand after this task:**
- Why databases can hold invalid states if your code doesn't prevent them
- How to write guard clauses (the if-check at the top of a function that rejects bad input)
- What a 409 Conflict HTTP status means and when to use it

### Task 1.4 — Validation

**Concept: Never trust user input**

The browser can send your API literally anything. A malicious user could bypass your form entirely and send raw HTTP requests. Your API must validate every piece of data it receives, regardless of what the frontend does. This is the single most important security concept in web development.

**What you'll understand after this task:**
- The difference between client-side validation (nice UX) and server-side validation (actual security)
- How to structure validation logic so it's reusable
- What happens when validation fails and how to return useful error messages

### Task 1.5 — Migrations

**Concept: Database schema management**

Your Prisma schema describes what your database SHOULD look like. Migrations are the step-by-step instructions that transform your database from one version to another. When these get out of sync (schema says one thing, database has something different), things break in confusing ways.

**What you'll understand after this task:**
- What a migration is and why it matters
- How to read a migration file and understand what it does
- What "drift" means and how to fix it
- Why `.env.example` matters for any project that involves credentials

### Task 2.1 — Form Design

**Concept: Conditional UI and data contracts**

The job post form is your first real UX challenge. When a user picks ON_SITE, certain fields appear. When they pick REMOTE, different fields appear. The form has to match exactly what the API expects — this is called a "data contract." If the form sends data the API doesn't expect, or misses data the API requires, things break.

**What you'll understand after this task:**
- How to design forms that adapt based on user choices
- What a data contract is between frontend and backend
- How v0-generated components connect to your existing app

### Task 3.3 — Smoke Testing

**Concept: Thinking like a user, not a developer**

A smoke test is walking through your app like a real person would and writing down everything that's wrong. Not just crashes — confusing labels, missing feedback, slow loads, dead ends. This is where you shift from "does the code work?" to "does the product work?"

**What you'll understand after this task:**
- The difference between "it works" and "it's good"
- How to write bug reports that are useful
- How to prioritize what to fix (blockers vs annoyances)

---

## Section 4 — Code Review Checklist (Use Before Every PR)

Print this out or keep it open. Run through it before you merge anything.

### Auth & Roles

- [ ] Does this code read user role from the DATABASE, not Clerk metadata?
- [ ] If this route/page is role-restricted, is it covered by the middleware role matrix?
- [ ] If this checks ownership (e.g., "is this MY profile"), is the check using the DB user ID, not just the Clerk session?

### Status Transitions

- [ ] If this code changes a status (job, application, booking), does it check the CURRENT status first?
- [ ] If the current status is wrong, does it return 409 Conflict with a clear message?
- [ ] Are there any code paths that could set an invalid status?

### Input Validation

- [ ] Does every API route validate its input before doing anything with it?
- [ ] If the request body is malformed or missing fields, does the route return 400 Bad Request?
- [ ] Are ON_SITE/REMOTE job fields validated according to their type?
- [ ] Is there any place where user input is trusted without checking?

### Database

- [ ] If this changes the Prisma schema, is there a corresponding migration?
- [ ] Are database writes wrapped in transactions where multiple tables are affected?
- [ ] Are there any queries that could return unexpected null values?

### Security

- [ ] Are there any hardcoded secrets, API keys, or credentials?
- [ ] Is sensitive data (passwords, tokens) ever logged or returned in API responses?
- [ ] Are webhook endpoints validating their signatures?

### Deferred Features

- [ ] Does this PR touch any Stripe/payment code? (It shouldn't)
- [ ] Does this PR modify AdSlot behavior? (It shouldn't)
- [ ] Does this PR add file upload functionality? (It shouldn't)

### Code Quality

- [ ] Are there any unused imports or dead code?
- [ ] Are error messages clear enough that you'd understand them as a user?
- [ ] If you came back to this code in 3 months, would you understand what it does?

### Testing

- [ ] Did you manually test the happy path (everything works correctly)?
- [ ] Did you test at least one error path (what happens when something goes wrong)?
- [ ] Did you test as the correct role AND verify other roles are blocked?

---

## Appendix — Known Issues from Codex Audit

These are flagged but not yet resolved. Reference during build.

| ID | Issue | File | Priority |
|---|---|---|---|
| V1 | ~~Middleware reads role from Clerk metadata, not DB~~ Resolved 2026-04-13 — proxy now reads role from DB via `getSessionUserByClerkId` | `src/proxy.ts`, `src/lib/auth.ts` | DONE — Task 1.1 |
| V3 | Stripe webhook boolean transitions have no idempotency check | `src/app/api/webhooks/stripe/route.ts` | LOW — Stripe is frozen |
| V5 | Job post UI missing `assetHandoffMethod` / `assetHandoffUrl` fields. Backend now accepts and persists them (Task 1.4, 2026-04-13); form-side still pending. | `src/app/jobs/new/page.tsx` | MEDIUM — Task 2.1 (backend half done) |
| V6 | StripeConnectBanner is dead code | `src/app/dashboard/StripeConnectBanner.tsx` | LOW — Task 4.1 |
| V7 | ~~Proxy gates `/jobs/new` to CLIENT but API allows ADMIN too~~ Resolved 2026-04-13 — API now CLIENT-only | `src/proxy.ts` + `src/app/api/jobs/route.ts` | DONE — Task 1.2 |
| — | `@supabase/supabase-js` in package.json but no imports found | `package.json` | LOW — cleanup |
| — | `ProProfile.profileViews` has no increment logic | schema + routes | LOW — post-MVP |
| — | `ApplicationResponseStatus.WITHDRAWN` enum exists but no withdraw endpoint | schema + routes | LOW — post-MVP |
| — | `JobStatus.IN_REVIEW` and `CANCELLED` enums exist but no routes use them | schema + routes | LOW — post-MVP |
