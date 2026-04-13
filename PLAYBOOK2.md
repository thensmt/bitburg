# PLAYBOOK.md — David Gaylor's Development Standard

**Version:** 1.0
**Created:** April 13, 2026
**Purpose:** Load this into Claude Code, Claude Projects, or any AI coding tool at the start of every project. It defines how I build, what I check, and what quality bar I hold. It gets updated with every project I ship.

---

## 1. Who I Am (Context for AI Tools)

I am a solo founder learning to code by building real products with AI tools. I am not a professional developer. I run a sports media business (NSMT) in Northern Virginia and I am building software products to grow that business and create new revenue streams.

My skill level: intermediate and improving. I understand project structure, can read and modify code, and rely on AI tools for implementation. I need clear explanations when touching unfamiliar patterns. I learn best by building, not by reading theory.

---

## 2. Default Tech Stack

Use this stack unless the project has a specific reason to deviate. Every deviation must be justified in the project's CLAUDE.md.

| Layer | Default Choice | Why |
|---|---|---|
| Framework | Next.js (App Router) | SSR/SEO support, API routes built in, largest ecosystem for AI-assisted development |
| Language | TypeScript | Type safety, Prisma integration, catches bugs before production |
| Styling | Tailwind CSS | Rapid iteration, pairs with v0 and AI-generated components |
| Auth | Clerk | Pre-built UI, fast integration with Next.js, reduces auth surface area for a solo builder |
| ORM | Prisma | Schema-first, generates TypeScript types, visual DB browser, best docs for learners |
| Database | PostgreSQL via Supabase | Relational data for complex relationships, generous free tier, realtime features available |
| File Storage | Cloudflare R2 | Zero egress fees — critical for media-heavy apps. Use signed URLs for access control. Fallback: Supabase Storage if uploads are minimal in year one |
| Hosting | Vercel | Built for Next.js, automatic deploys on git push, preview deployments |
| Payments | Stripe Connect | Industry standard for marketplace split payments. Never describe held funds as "escrow" in product copy or legal language — use "delayed payout" or "held by platform" |
| Email | Resend | Modern API, strong Next.js integration, generous free tier. Verify current limits before launch |
| Rate Limiting | Upstash Redis | Serverless Redis, works with Next.js middleware. Verify current free tier limits before launch |
| Error Monitoring | Sentry | Server + client error tracking, stack traces, alerting. Add before any user touches the app |
| Analytics | Vercel Analytics + PostHog | Web analytics + product/funnel analytics |

**Critical rule:** All vendor pricing and free-tier limits must be verified against official pricing pages before launch and documented with an "as of YYYY-MM-DD" date. Do not rely on numbers from memory or AI training data.

---

## 3. Project Scaffolding — New App Checklist

Every new project starts with these steps in order:

**Step 1: Repository setup**
- Create GitHub repo
- Initialize with Next.js (`npx create-next-app@latest`)
- Add TypeScript, Tailwind, ESLint
- Create `.gitignore`, `.env.example` (list every required variable)
- First commit: clean scaffold, nothing custom yet

**Step 2: Documentation files**
- `CLAUDE.md` — Project spec for Claude Code (what the app is, commands, architecture, env vars, file conventions)
- `BLUEPRINT.md` — Build plan with phased tasks in dependency order
- `DECISIONS.md` — Log of every architecture decision with date and rationale
- `PLAYBOOK.md` — This file (copy into every project)

**Step 3: Auth setup**
- Install and configure Clerk
- Set up webhook endpoint for user.created events
- Database is ALWAYS the source of truth for roles — Clerk metadata is cache/display only
- Create middleware with a role matrix (document which roles access which routes)
- Test: sign up, verify webhook fires, verify DB record created

**Step 4: Database setup**
- Configure Supabase project
- Set up `.env` with pooled connection (DATABASE_URL) and direct connection (DIRECT_URL)
- Define initial Prisma schema
- Run `npx prisma generate` and `npx prisma db push`
- Open Prisma Studio to verify
- Pick ONE Prisma client import path and use it everywhere

**Step 5: Error monitoring**
- Install Sentry (or equivalent)
- Verify errors appear in dashboard
- Set up alert notifications

**Step 6: First deploy**
- Push to Vercel
- Verify production build succeeds
- Verify environment variables are set in Vercel dashboard

---

## 4. Architecture Rules

These apply to every project. Claude Code should follow these without being asked.

**File structure:**
- `src/app/` — App Router pages and layouts
- `src/app/api/` — API route handlers
- `src/components/` — Shared React components
- `src/lib/` — Server utilities (DB client, auth helpers, external service clients)
- `src/lib/validators.ts` — Shared validation logic (never duplicate validation)
- `prisma/schema.prisma` — Single source of truth for data models

**Business logic goes in `src/lib/`, not in route handlers.** Route handlers should validate input, call a service function, and return a response. This keeps logic testable and makes future service extraction mechanical.

**Domain modules:** As the app grows, organize `src/lib/` by domain: `src/lib/jobs/`, `src/lib/users/`, `src/lib/bookings/`. Use typed interfaces at boundaries.

**Auth rules:**
- Database is the single source of truth for user roles. Always.
- Clerk metadata is a cache. If they disagree, the database wins.
- Middleware handles route-level access control (role matrix)
- Page-level code handles ownership checks ("is this MY profile?")
- API routes validate both role AND ownership where applicable

**Status transitions:**
- Every API route that changes a status (job, application, booking, etc.) must check the CURRENT status before allowing the transition
- If the current status is wrong, return 409 Conflict with a clear message
- Document valid transitions in the schema or a constants file

**Input validation:**
- Never trust user input. Validate on the server even if the frontend validates too.
- Client-side validation = nice UX. Server-side validation = actual security.
- Return 400 Bad Request with clear error messages for invalid input.

**Deferred features:**
- Every project has a "frozen" list — features that are planned but must not be touched during MVP
- Claude Code must not implement, expand, or modify frozen features
- If a frozen feature's placeholder exists (like an AdSlot component), leave it as-is

---

## 5. Security & Operational Readiness — Non-Negotiables Before Launch

Nothing goes live to real users without these. This applies to both soft launch and public launch.

### Must-Have Before Soft Launch

- [ ] Error monitoring active (Sentry or equivalent) with alerting
- [ ] Rate limiting on all public-facing API endpoints
- [ ] Webhook signature verification on all inbound webhooks (Clerk, Stripe, etc.)
- [ ] Idempotency checks on webhook handlers (prevent duplicate writes)
- [ ] `.env.example` complete with every required variable documented
- [ ] No hardcoded secrets, API keys, or credentials anywhere in code
- [ ] Sensitive data never logged or returned in API responses
- [ ] Database backup verified — and restore process tested at least once
- [ ] HTTPS enforced (Vercel handles this, but verify)
- [ ] Bot protection / CAPTCHA on high-risk public forms (sign-up, job posting)

### Must-Have Before Public Launch

All of the above, plus:

- [ ] Transactional email working (confirmations, notifications, status updates)
- [ ] Analytics tracking key funnel events (sign-up, job post, application, booking)
- [ ] Audit trail for all admin actions (role changes, tier changes, status overrides)
- [ ] Dependency vulnerability scan (npm audit) with no critical/high issues
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Content/IP licensing policy defined (who owns deliverables, portfolio rights, takedown process)
- [ ] If serving minors' data/media: COPPA compliance reviewed and design decisions documented
- [ ] If handling payments: never use the word "escrow" — use "delayed payout" or "held by platform"
- [ ] Uptime monitoring with alerts

---

## 6. Build Phases — Standard Order

Every project follows this sequence. The order is not flexible.

**Phase 1 — Fix the Foundation (Backend)**
Focus: data model integrity, auth, API hardening, validation. No UI work. Get the backend correct before touching screens.

**Phase 2 — Design Core Screens (v0)**
Focus: design the key user flows in v0 as React + Tailwind components. The backend contract (what data the API expects/returns) must be finalized before designing forms.

**Phase 3 — Build What You Designed**
Focus: implement v0 designs, wire them to APIs, integrate everything into a working flow.

**Phase 4 — End-to-End Testing**
Focus: walk through the entire app as every user role. Document every bug, broken flow, confusing label, missing feedback, and dead end. Fix blockers. Log the rest.

**Phase 5 — Operational Readiness**
Focus: complete the security checklist, add monitoring, set up email, deploy to production, verify backups. This is the "is it ready for real humans?" phase.

**Phase 6 — Cleanup & Documentation**
Focus: remove dead code, update README from boilerplate to real description, update CLAUDE.md if decisions changed, archive completed tasks.

---

## 7. Code Review Checklist — Use Before Every Merge

Run through this before merging any PR or committing significant changes.

**Auth & Roles**
- [ ] Does this code read user role from the DATABASE, not Clerk metadata?
- [ ] If role-restricted, is it covered by the middleware role matrix?
- [ ] If checking ownership, is it using the DB user ID?

**Status Transitions**
- [ ] If changing a status, does it check the CURRENT status first?
- [ ] If wrong status, does it return 409 Conflict?
- [ ] Are there any paths that could set an invalid status?

**Input Validation**
- [ ] Does every API route validate input before acting on it?
- [ ] Are malformed/missing fields returning 400 Bad Request?
- [ ] Is user input ever trusted without checking?

**Database**
- [ ] If schema changed, is there a corresponding migration?
- [ ] Are multi-table writes wrapped in transactions?
- [ ] Are there queries that could return unexpected nulls?

**Security**
- [ ] Any hardcoded secrets or credentials?
- [ ] Is sensitive data logged or returned in responses?
- [ ] Are webhooks validating signatures?

**Deferred Features**
- [ ] Does this touch any frozen/deferred feature? (It shouldn't)

**Code Quality**
- [ ] Unused imports or dead code?
- [ ] Are error messages clear to a user?
- [ ] Would I understand this code in 3 months?

**Testing**
- [ ] Tested the happy path?
- [ ] Tested at least one error path?
- [ ] Tested as the correct role AND verified other roles are blocked?

---

## 8. Marketplace-Specific Rules

These apply to any two-sided marketplace I build.

**Trust & Governance**
- Define vetting criteria objectively before onboarding any supply
- Document tier/rating rubrics with measurable criteria (not vibes)
- Include an appeal/re-evaluation process on a regular cadence (e.g., every 90 days)
- If the founder or founder's team is also supply on the platform, apply vetting and tiering rules equally and document this as a conflict-of-interest policy
- Admin actions (tier changes, approvals, rejections, bans) must be logged with who, what, when, and why

**Payments Language**
- Never use "escrow" in product copy, marketing, or legal documents
- Stripe Connect supports delayed payouts and manual transfers — describe the flow accurately
- Model contribution margins: take rate minus payment processing, Connect fees, chargebacks, refunds, and support time

**Content & IP**
- Define who owns deliverables by default (client license, pro portfolio rights)
- Define takedown process for content disputes
- If platform features media of minors, design to avoid COPPA scope or comply with it — document the decision

**Privacy**
- Data minimization: collect only what you need
- If serving Virginia residents: be aware of VCDPA thresholds and design for access/delete workflows
- Vendor DPAs (data processing agreements) for any service handling user data

**Client Acquisition for Service Marketplaces**
- Schools and institutional clients care about: vendor registration, proof of insurance, event access policies, and who signs contracts
- Pre-check these operational requirements before outreach, not after

---

## 9. AI Workflow — How I Use Tools

**Claude Code CLI:** Primary building tool. Reads CLAUDE.md for project context. Use for all implementation work — writing code, debugging, refactoring.

**Claude (chat — claude.ai):** Architecture decisions, planning, strategy, non-code work, document drafting. Use this project space for ongoing Bitburg planning.

**Codex (OpenAI):** Code reviews and audits. Feed it the codebase or specific files and ask it to find bugs, security issues, and inconsistencies.

**ChatGPT:** Second-opinion reviews on strategy docs, research, and competitive analysis. Good for catching blind spots and factual errors.

**v0 (Vercel):** UI/component design. Use for designing screens before implementing them. Export as React + Tailwind.

**Rule:** When any AI tool gives you vendor-specific facts (pricing, limits, features), verify against the official source before acting on them. AI training data goes stale. Both Claude and ChatGPT got specific pricing numbers wrong in the Bitburg review process — this is expected and not a reason to distrust the tools, but it is a reason to always verify.

---

## 10. Lessons Learned Log

Update this after every project. These are real mistakes and insights, not theory.

### From Bitburg (Project 1 — In Progress)

- **Pricing claims go stale fast.** Clerk changed from MAU to MRU pricing and updated free tier limits. Supabase Auth added better UI components. Always check vendor sites directly and date-stamp any pricing in docs.
- **"Escrow" is a legal term.** Stripe explicitly warns against using it. Use "delayed payout" instead.
- **Both AI reviewers (Codex and ChatGPT) independently flagged the same gaps:** error monitoring, audit trails, governance policies, and legal/compliance. If two separate AI tools flag the same thing, it's real.
- **The tech stack matters less than operational readiness.** Both reviews concluded: the stack is fine, the risk is execution discipline and trust rules.
- **Marketplace rules ARE the product.** Tier rubrics, conflict-of-interest policies, IP licensing, refund rules — these aren't legal afterthoughts, they're what makes a marketplace trustworthy.
- **Define "launch" clearly.** Soft launch (internal, known users) and public launch (open onboarding) have different readiness bars. Name them and attach checklists to each.

---

## Appendix: Assumptions That Must Be Re-Verified

Every item below was stated in planning docs and must be confirmed against official sources before launch.

| Assumption | Source to verify | Last verified |
|---|---|---|
| Clerk free tier limits and pricing metric (MAU vs MRU) | https://clerk.com/pricing | Not yet |
| Supabase free tier limits (storage, bandwidth, MAU) | https://supabase.com/pricing | Not yet |
| Cloudflare R2 pricing and free tier | https://developers.cloudflare.com/r2/pricing/ | Not yet |
| Upstash Redis free tier command limits | https://upstash.com/pricing | Not yet |
| Resend free tier email limits | https://resend.com/pricing | Not yet |
| Vercel free/pro tier limits | https://vercel.com/pricing | Not yet |
| PostHog free tier event limits | https://posthog.com/pricing | Not yet |
| Sentry free tier limits | https://sentry.io/pricing/ | Not yet |
| Stripe Connect fee structure | https://stripe.com/connect/pricing | Not yet |
