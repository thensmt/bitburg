# Bitburg Tech Stack Review — For External AI Review

**Context for reviewer:** Bitburg is a two-sided marketplace connecting media professionals (photographers, videographers, editors) with clients in the DMV (DC/Maryland/Virginia) area. Sports-first launch targeting football season (August 2026). The founder is a non-developer learning to code by building with AI coding tools (Claude Code CLI). The current stack was chosen during initial architecture and is 26 commits deep. The goal of this review is to validate or challenge every choice before deeper building begins.

---

## Current Stack

| Layer | Current Choice | Status |
|---|---|---|
| Framework | Next.js 16 (App Router) | In repo, 26 commits |
| Language | TypeScript | In repo |
| Styling | Tailwind CSS v4 | In repo |
| Auth | Clerk | In repo, webhook sync to DB |
| ORM | Prisma | In repo, schema defined |
| Database | PostgreSQL via Supabase | Connected |
| File Storage | Google Cloud Storage | Deferred — not implemented |
| Hosting | Vercel | Deployed at bitburg.vercel.app |
| Payments | Stripe Connect | Deferred — Phase 2 |
| Design Tool | v0 (Vercel) | For Phase 2 screen design |
| Build Tool | Claude Code CLI | Primary coding tool |
| Code Review | Codex (OpenAI) | Audit already completed |

---

## Component-by-Component Analysis

### 1. Next.js 16 (App Router) — KEEP

**Why it works:** Next.js is the consensus recommendation for marketplace frontends in 2026. Server-side rendering is critical for SEO on listing pages (pro profiles, job listings). The App Router supports server components, which reduce client-side JavaScript and improve performance. API routes are built in, so there's no need for a separate backend service. The ecosystem is massive — more tutorials, more Stack Overflow answers, more Claude Code training data than any alternative.

**Alternatives considered:** Remix (good but smaller ecosystem), SvelteKit (excellent DX but harder to hire for later), raw React + Express (unnecessary complexity for this use case).

**Verdict:** Next.js is the right choice. No change needed.

### 2. TypeScript — KEEP

**Why it works:** Type safety catches bugs before they hit production. Prisma generates TypeScript types from the schema, so the database models flow through the entire codebase. Every serious marketplace in 2026 uses TypeScript.

**Verdict:** Non-negotiable. Keep.

### 3. Tailwind CSS v4 — KEEP

**Why it works:** Pairs perfectly with v0-generated components. Rapid iteration on UI without writing custom CSS. The utility-first approach works well for someone learning — you can see what every class does. Widely supported by AI coding tools.

**Verdict:** Right choice. Keep.

### 4. Clerk (Auth) — KEEP, BUT ACKNOWLEDGE THE TRADEOFF

**Current situation:** Clerk handles authentication. The database is the source of truth for roles (CLIENT, PRO, ADMIN). A webhook syncs Clerk events to the DB. The middleware currently reads role from Clerk metadata instead of DB — this is the #1 known bug (V1 in the Codex audit).

**Why Clerk is the right choice for this project:**
- Pre-built sign-in/sign-up UI components save significant development time for a solo non-developer founder
- First-class Next.js App Router integration — works with server components, middleware, and edge functions out of the box
- 10,000 free MAUs is more than enough for launch and early growth
- Session management, social login, and MFA are handled without writing auth code
- Implementation takes 1-3 days vs 2-5 days for Supabase Auth (based on developer reports)

**Why Supabase Auth was considered but is NOT recommended here:**
- Supabase Auth is cheaper (50K free MAUs vs Clerk's 10K) and integrates with Row Level Security
- BUT: Supabase Auth has basic UI components — the founder would need to build custom sign-in/sign-up forms, adding days of work
- Supabase Auth requires deeper PostgreSQL and RLS knowledge that adds learning curve for a non-developer
- Switching from Clerk to Supabase Auth mid-build would require 40-80 hours of migration work — not worth it at this stage

**The Clerk-DB sync complexity is real but manageable.** The webhook pattern (Clerk fires event → API route writes to DB) is well-documented and standard. The V1 bug (middleware reading from Clerk instead of DB) is a one-time fix in Task 1.1 of the build plan.

**Cost projection:** Free until 10K MAU, then $0.02/MAU. At 1,000 active users: free. At 15,000: ~$100/month. This becomes meaningful only if the platform is succeeding, at which point revenue covers it.

**Long-term note:** If Bitburg scales to 50K+ users and costs become a concern, migrating to Supabase Auth or a self-hosted solution becomes worth evaluating. Not a concern for MVP or year one.

**Verdict:** Keep Clerk. The DX advantage is significant for a solo non-developer founder. Fix the V1 middleware bug as planned.

### 5. Prisma (ORM) — KEEP

**Why it works:** Prisma generates TypeScript types from the schema, provides a visual database browser (Prisma Studio), has excellent documentation, and is the most widely used ORM in the Next.js ecosystem. For someone learning, the schema-first approach is intuitive — you define your models in a readable format and Prisma handles the SQL.

**Alternatives considered:**
- Drizzle ORM: Newer, lighter, better raw performance. But less documentation, smaller community, and a more code-first approach that's harder for beginners.
- Kysely: Type-safe query builder, not a full ORM. Too low-level for this project.
- Raw SQL via Supabase client: Maximum flexibility but no type safety or migration tooling.

**Known issue:** There's a Prisma client import path mismatch — CLAUDE.md says the generated client outputs to `src/generated/prisma`, but code may use `@prisma/client`. This needs to be resolved before deeper building (Task 1.5 in the build plan).

**Verdict:** Prisma is the right ORM for this project. Drizzle would be better for an experienced developer optimizing performance, but Prisma's DX and ecosystem fit a learning builder.

### 6. PostgreSQL via Supabase — KEEP

**Why it works:** PostgreSQL is the standard database for marketplaces — complex relationships (User → ProProfile → Rates → Applications → Bookings) are exactly what relational databases excel at. Supabase provides managed PostgreSQL with a generous free tier (500MB, 50K MAUs), connection pooling, and a dashboard for visual management. The realtime features (live subscriptions) could be valuable later for notifications and live job updates.

**Alternatives considered:**
- PlanetScale: MySQL-based, removed their free tier. Not recommended.
- Neon: PostgreSQL with generous free tier and serverless scaling. Viable alternative but no realtime features or built-in auth/storage.
- Railway: Good managed PostgreSQL but less ecosystem around it.

**Verdict:** Supabase is the right choice. PostgreSQL is correct for marketplace data, and Supabase's ecosystem (auth backup, storage, realtime) provides room to grow.

### 7. Google Cloud Storage (Media) — RECONSIDER → RECOMMEND CLOUDFLARE R2 OR SUPABASE STORAGE

**Current status:** Deferred. Pros currently link external URLs for portfolios and deliverables. GCS is listed in CLAUDE.md with env vars but not implemented.

**The problem with GCS:** Google Cloud Storage has complex pricing, significant egress (download) fees, and requires managing service account credentials. For a media-heavy marketplace where clients and pros will upload and view photos/videos, egress costs compound quickly.

**Recommended alternatives (in order):**

1. **Cloudflare R2** — Zero egress fees, S3-compatible API, 10GB free storage. For a media marketplace, the zero-egress pricing is a massive advantage. Photos and videos get downloaded frequently — with GCS or S3, every download costs money. With R2, downloads are free. Pricing: $0.015/GB stored, $0 egress.

2. **Supabase Storage** — Already included with the Supabase plan. 1GB free, integrates with Supabase Auth for access control. Simpler to set up than GCS since the Supabase connection already exists. Limited by Supabase's bandwidth allocation on free/pro tiers.

3. **Uploadthing** — Built specifically for Next.js file uploads. Handles the upload UI, storage, and CDN. Very easy to implement. Free tier: 2GB. Good DX but adds another vendor dependency.

**Verdict:** When file storage is implemented (post-MVP), use Cloudflare R2 for media storage. The zero-egress pricing is the deciding factor for a media marketplace. Update CLAUDE.md to reflect this change.

### 8. Vercel (Hosting) — KEEP

**Why it works:** Vercel is built by the Next.js team. Deployment is automatic on git push, preview deployments let you test branches, and the free tier handles MVP traffic easily. Edge functions, image optimization, and analytics are included.

**Verdict:** Perfect match. No change.

### 9. Stripe Connect (Payments) — KEEP (Phase 2)

**Why it works:** Stripe Connect is the industry standard for marketplace payments — split payments, escrow, identity verification for pros, and automated payouts. There is no real alternative at the same level of marketplace support.

**Verdict:** Correct choice for Phase 2. Keep frozen until MVP is proven.

---

## What's Missing From the Stack

The current stack handles the core app well but is missing several components a marketplace will need as it grows. These should be planned now even if not implemented until post-MVP.

### Transactional Email — NEEDED SOON

**What:** Booking confirmations, application notifications, status updates, password resets. A marketplace without email notifications feels broken.

**Recommendation:** Resend. Modern email API built for developers, excellent Next.js integration, generous free tier (3,000 emails/month on free, 50K on $20/month plan). Better DX than SendGrid or Postmark.

**Alternative:** Supabase has built-in email via GoTrue, but it's limited to auth-related emails only.

**When to add:** During Phase 3 (Build What You Designed) — notifications are part of the MVP user experience.

### Search — PLAN FOR LATER

**What:** As the pro directory and job board grow, users need to search and filter effectively.

**Recommendation for MVP:** PostgreSQL full-text search (free, built into Supabase). Prisma supports raw queries for this.

**Recommendation for scale:** Meilisearch or Algolia when the catalog exceeds ~1,000 listings and search performance matters.

**When to add:** PostgreSQL search during Phase 3. Dedicated search engine post-launch if needed.

### Real-time Notifications — PLAN FOR LATER

**What:** Live updates when a pro gets a new application, when a client gets a booking confirmation, when a job is posted that matches a pro's category.

**Recommendation:** Supabase Realtime (already included). Can subscribe to database changes and push updates to connected clients.

**When to add:** Post-MVP. The app works fine with page refreshes and email notifications at first.

### Rate Limiting — NEEDED FOR LAUNCH

**What:** Preventing abuse of API endpoints (spam job posts, brute force applications, scraping pro profiles).

**Recommendation:** Upstash Redis. Serverless Redis with a generous free tier (10K commands/day). Works well with Next.js middleware for rate limiting API routes.

**When to add:** Before launch. This is a security requirement.

### Analytics — NEEDED FOR LAUNCH

**What:** Understanding marketplace health — how many jobs are posted, conversion rates, which categories are growing.

**Recommendation:** Vercel Analytics (included with Vercel) for web analytics. PostHog (free tier: 1M events/month) for product analytics (funnel tracking, feature usage).

**When to add:** Before launch. You need data to make decisions.

### Mobile — PLAN FOR LATER

**What:** A marketplace where clients need to post jobs from the sidelines and pros need to check applications between shoots needs mobile access.

**Recommendation for MVP:** Responsive web design (Tailwind handles this). The app should work well on mobile browsers.

**Recommendation for scale:** React Native or Expo for native apps when usage data justifies the investment. The Next.js backend/API layer stays the same.

**When to add:** Native apps are a year-2 consideration. Mobile-responsive web is a launch requirement.

---

## Stack Summary — Final Recommendation

| Layer | Choice | Status | Change? |
|---|---|---|---|
| Framework | Next.js 16 (App Router) | In repo | NO |
| Language | TypeScript | In repo | NO |
| Styling | Tailwind CSS v4 | In repo | NO |
| Auth | Clerk | In repo | NO — fix V1 bug |
| ORM | Prisma | In repo | NO — fix import path |
| Database | PostgreSQL via Supabase | Connected | NO |
| File Storage | Cloudflare R2 | Not started | YES — change from GCS |
| Hosting | Vercel | Deployed | NO |
| Payments | Stripe Connect | Deferred | NO |
| Email | Resend | Not started | ADD |
| Rate Limiting | Upstash Redis | Not started | ADD |
| Analytics | Vercel + PostHog | Not started | ADD |
| Search | PostgreSQL full-text → Meilisearch | Not started | ADD (later) |
| Real-time | Supabase Realtime | Not started | ADD (later) |

---

## Questions for the Reviewer

1. **Clerk vs Supabase Auth:** Given that the founder is a non-developer building with AI tools, is Clerk's DX advantage worth the webhook sync complexity and higher per-MAU cost? Or should this project consolidate on Supabase Auth to reduce moving parts?

2. **Prisma vs Drizzle:** Prisma is the safe, well-documented choice. Drizzle is newer with better performance. For a solo founder learning to code, is Prisma the right call or is Drizzle now mature enough to recommend?

3. **Cloudflare R2 vs alternatives:** For a media-heavy marketplace (photos, video, highlight reels), is R2's zero-egress pricing the right call? Or is Supabase Storage sufficient for year one?

4. **Missing components:** Are there any critical pieces missing from this stack that should be added before MVP launch? Particularly around security, monitoring, or marketplace-specific functionality.

5. **Overall architecture:** This is a monolithic Next.js app (frontend + API routes in one repo). At what point should this project consider splitting into separate services, and is there anything in the current architecture that would make that harder later?

6. **Cost at scale:** If Bitburg reaches 10,000 active users processing 500 bookings/month with heavy media uploads, what's the estimated monthly infrastructure cost with this stack? Are there any cost landmines to watch for?

---

## Technical Context (For Reviewer Reference)

**Repo:** github.com/thensmt/bitburg (public)
**Key files:** CLAUDE.md (project spec), BITBURG_MVP_BLUEPRINT.md (build plan with dependency order)
**Current state:** Foundation laid — auth, database schema, basic routes. No core user flows (job posting, applying, booking) are complete yet.
**Build approach:** Solo founder using Claude Code CLI for implementation, Codex for code review, v0 for UI design.
**MVP definition:** Client posts a job → Pro applies → Client awards booking. No payments, no file uploads, no disputes.
