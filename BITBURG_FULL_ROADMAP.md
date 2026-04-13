# Bitburg Full Roadmap

**Owner:** David Gaylor
**Date:** April 13, 2026
**Status:** Planning — pre-build
**Confidential:** Bitburg and NSMT are separate brands. This document is internal only.

---

## 1. Business Model & Positioning

### What Bitburg Is

Bitburg is a two-sided marketplace for media professionals — photographers, videographers, and editors — and the clients who hire them. Clients post jobs, vetted and tiered professionals compete for them, and the platform takes a commission on every booking. Think Uber meets StaffMeUp, but local-first and quality-controlled.

### Launch Scope

- **Geography:** DMV (DC, Maryland, Virginia) — starting in Northern Virginia
- **Category:** Sports media coverage — game shoots, tournament coverage, picture days, highlight editing
- **Expand later into:** Events, corporate media, real estate, headshots, and other verticals once the platform is proven

### Who It's For

**Clients (demand side):** Schools and athletic departments booking game coverage or picture days. Parents wanting professional photos or video of their kids' games. Local sports organizations running tournaments or leagues. Eventually, any business that needs media work.

**Pros (supply side):** Photographers, videographers, and editors in the DMV area. They must apply and be vetted by an admin before they can take jobs. Each pro is assigned a tier (D through S) that determines which jobs they can see and apply for. This tier system is the quality guarantee that separates Bitburg from general-purpose platforms.

### Why Bitburg Wins

The current market for hiring media pros in the DMV is fragmented and informal. Most bookings happen through Instagram DMs, Facebook groups, or word of mouth. Existing platforms don't solve the problem:

- **Thumbtack / Bark:** Generalist — they don't understand media specialties and have zero quality control. Anyone can sign up.
- **Fiverr / Upwork:** Remote-first and race-to-the-bottom pricing. Built for global freelancing, not local on-site coverage.
- **Instagram DMs / word of mouth:** No accountability, no reviews, no standard process. Scales poorly.

Bitburg is different because every pro is admin-vetted and tiered, the platform is built specifically for media work (on-site events AND remote editing), and it's rooted in a local market where reputation compounds.

### Competitive Moat

Bitburg's long-term defensibility comes from three things:

1. **Supply quality via the tier system.** Clients trust the platform because not just anyone can be on it. This is the opposite of Thumbtack's "anyone can sign up" model.
2. **Network density in the DMV.** A national marketplace is a commodity. A marketplace that deeply serves one metro — where pros know the venues, the schools, the leagues — is valuable and hard to replicate.
3. **Review and reputation data.** Over time, the booking history and review data locked inside Bitburg becomes a switching cost for both pros and clients.

---

## 2. Revenue Model

### Primary Revenue: Commission Per Booking

- **Who pays:** The pro. The platform deducts a percentage from the pro's payout after a booking is completed.
- **Commission rate:** 8% at launch.
- **Why pro-side:** Clients see one clean price with no surprise fees, which reduces friction on the demand side. Pros are accustomed to platform cuts from Fiverr, Uber, and similar marketplaces. The existing Stripe Connect architecture in the blueprint already assumes pro-side deduction.

### Unit Economics

| Average Job Value | 8% Commission | Monthly Bookings Needed for $2,400/mo |
|---|---|---|
| $150 (JV game shoot) | $12 | 200 |
| $300 (varsity game shoot) | $24 | 100 |
| $750 (tournament package) | $60 | 40 |
| $1,500 (full event package) | $120 | 20 |

Higher-value bookings (tournaments, multi-day events, full-season packages) are disproportionately valuable. The platform should encourage and facilitate these.

### Future Revenue Streams (Post-MVP)

**Premium Pro Subscription ($29–49/month):** Priority placement in search results, analytics dashboard showing profile views and conversion rates, featured profile badge. Even 20 pros subscribing adds $7–12K/year with near-zero marginal cost.

**Ad Placements:** The architecture already includes `<AdSlot>` components on every page. Local businesses — equipment shops, training facilities, sports medicine clinics, recruiting services — would pay for placement in front of their exact audience. No technical build required; the infrastructure exists.

**Stripe Connect Payments (Phase 2):** Deposit held in escrow, non-refundable once a pro is selected, balance auto-releases 5 days after event/delivery if the client doesn't dispute. Platform fee deducted from pro payout.

### Infrastructure Costs

| Service | Free Tier Limit | Paid Tier Cost |
|---|---|---|
| Supabase (PostgreSQL) | 500MB, 50K MAU | $25/month |
| Vercel (hosting) | Hobby tier | $20/month |
| Clerk (auth) | 10,000 MAU | $25/month |
| Google Cloud Storage | 5GB free | Pay-as-you-go |
| Domain | — | ~$15/year |
| Stripe | — | 2.9% + $0.30/txn (Phase 2) |

**Estimated monthly cost at launch: $50–75.** Free tiers carry through soft launch.

---

## 3. Go-to-Market & Launch Strategy

### The Chicken-and-Egg Problem

Every marketplace has to solve this: clients won't come without pros, pros won't come without jobs. Bitburg has a built-in advantage — the founder already operates a sports media business with a team of 10–20 shooters and editors, plus a broader network of media pros in the DMV. The supply side is pre-seeded on day one.

### Launch Narrative

Bitburg's origin story is the overflow problem. During peak seasons (football and basketball), demand for sports media coverage in the DMV exceeds what any single team can handle. Jobs get turned down or coordinated informally. Bitburg formalizes this — when one team can't cover a game, the client posts it on Bitburg and another vetted pro picks it up. This is not a hypothetical use case; it's already happening without a platform.

### Phase-by-Phase Launch

**Soft Launch (when app is ready):**

- Onboard 5–10 of the most reliable pros from the existing network
- Run real jobs through the platform — actual bookings, actual coverage, actual reviews
- Work out bugs, UX friction, and process issues before going wider
- This doubles as the smoke test from the technical blueprint (Task 3.3) but with real stakes

**Full Launch (target: football season, August):**

- Reach out to existing school and organization contacts (20–50 relationships) to pitch Bitburg as the way to book coverage this season
- Recruit additional pros from the broader DMV media network
- The tier system becomes the quality pitch — schools know they're getting vetted talent
- Goal: 20+ active pros, 10+ posting clients, consistent weekly bookings

**Expansion (October–November, basketball season):**

- Word of mouth from football season drives organic growth
- Reviews and booking history build social proof
- Begin exploring adjacent categories (events, corporate) if demand signals appear

### Client Acquisition Strategy

Athletic directors and school administrators do not discover vendors through social media. Client acquisition is a direct outreach game:

1. **Warm outreach to existing contacts.** Not a cold pitch — a conversation: "We built something to make booking coverage easier for your school this season."
2. **Referral compounding.** ADs in the same district and conference talk to each other. One successful relationship leads to introductions.
3. **Proof of work.** Every completed booking with a positive review becomes a case study for the next pitch.

### Pro Recruitment Strategy

Media professionals are easier to reach because they're already online and engaged with industry content:

1. **Network outreach.** Direct messages and calls to known pros in the DMV. Personal invitation to apply for early access.
2. **Social posts.** A small number of well-placed posts on Instagram and X: "We built a platform where vetted media pros get booked for sports coverage in the DMV. Apply for early access." The network does the rest.
3. **Word of mouth among pros.** Once early pros start getting booked and paid through the platform, they tell other pros.

---

## 4. Marketing & User Acquisition

### Brand Separation Principle

**Bitburg and NSMT are completely separate brands.** No cross-branding, no shared social accounts, no references to each other in marketing materials. Bitburg must be perceived as a neutral marketplace, not a booking engine for one specific media team. In a tight community like NoVA high school sports, people may eventually connect the dots — that's fine, but it is never advertised or acknowledged in Bitburg's branding.

### Channel Strategy

**Instagram (Bitburg's own account):**

- Portfolio-style content showcasing work done through the platform (with pro permission)
- Booking success stories — "This game was covered through Bitburg"
- Behind-the-scenes from events booked on the platform
- Goal: build credibility and attract both sides of the marketplace

**X / Twitter (Bitburg's own account):**

- Real-time coverage moments — sharing highlights from Bitburg-booked events
- Industry commentary on sports media in the DMV
- Quick-hit testimonials from clients and pros

**YouTube (longer-term play):**

- Event highlight reels branded through Bitburg
- Eventually, live streams of games booked through the platform
- This builds a content library that markets the platform year-round

### Content Strategy

The work is the marketing. Every highlight reel, every game photo gallery, every well-executed event is an advertisement for the platform. The content strategy is:

1. **Showcase the output.** Post the actual work — a perfectly lit Friday night touchdown grab does more for Bitburg than any talking-head video about marketplaces.
2. **Let pros shine.** Feature the pros who do the work. This attracts more pros (they want exposure) and impresses clients (they see the talent pool).
3. **Keep it local.** Tag schools, teams, and venues. This is a local business — every piece of content should feel rooted in the DMV sports community.

### What Not To Do

- No "founder story" content. The founder's identity is intentionally separate.
- No paid ads at launch. The market is small enough to reach through direct outreach and organic content.
- No generic "marketplace launch" announcements. Every piece of content should show the product working, not talk about it.

---

## 5. Technical Roadmap & Timeline

### Current State

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Clerk for auth (three roles: CLIENT, PRO, ADMIN)
- Prisma ORM + Supabase PostgreSQL
- Google Cloud Storage for media (deferred)
- Deployed to Vercel at bitburg.vercel.app
- 26 commits, foundation in place
- CLAUDE.md and BITBURG_MVP_BLUEPRINT.md locked and in repo

### MVP Definition

A client can post a job. A pro can find and apply. The client can award the booking. No payments, no disputes, no ads.

### Build Phases (from the Blueprint)

**Phase 1 — Fix the Foundation (Backend Only)**

- Task 1.1: Finalize middleware role resolution (DB-authoritative, not Clerk metadata)
- Task 1.2: Normalize role policy between middleware and API routes
- Task 1.3: Harden all status-changing APIs with precondition checks
- Task 1.4: Complete job creation validation (ON_SITE vs REMOTE)
- Task 1.5: Migration hygiene + .env.example

**Phase 2 — Design Core Screens (v0)**

- Task 2.1: Design job post form (ON_SITE/REMOTE switching)
- Task 2.2: Design role-specific dashboards (Client, Pro, Admin)

**Phase 3 — Build What You Designed**

- Task 3.1: Implement v0 job post form
- Task 3.2: Implement v0 dashboards
- Task 3.3: End-to-end MVP smoke test

**Phase 4 — Cleanup**

- Task 4.1: Dead code and documentation cleanup

### Frozen / Deferred (Do Not Touch)

- Stripe Connect / payments / escrow
- AdSlot system expansion
- GCS file uploads (pros link external URLs for now)
- Dispute admin resolution
- Review system expansion

### Learning Path

Key O'Reilly courses aligned to the build:

**Before coding starts:**
- Spec-Driven Development with Claude Code (April 20)
- Claude Code for Everyone (May 28)

**While building:**
- Agentic Coding with Claude Code (May 14)
- Claude Code Masterclass (on-demand)
- Claude, Claude Projects and Claude Code for Non-Coders (on-demand)

### Tools & Workflow

- **Claude Code CLI:** Primary building tool. Reads CLAUDE.md automatically for project context.
- **Codex:** Code reviews and audits before merging.
- **v0:** UI/component design for Phase 2.
- **Claude (chat):** Architecture decisions, planning, and non-code work (this document).

### Suggested Timeline

| Period | Focus | Milestone |
|---|---|---|
| April–May | Learning: O'Reilly courses, get comfortable with Next.js and Claude Code | Confident with tools and workflow |
| June | Phase 1: Fix the foundation (5 backend tasks) | All APIs hardened, middleware locked |
| July | Phase 2 & 3: Design and build core screens | Job posting, dashboards, and full MVP loop working |
| Early August | Phase 4 + soft launch with own team | Real jobs running through the platform |
| Mid-August | Full launch for football season | 20+ pros, 10+ clients, weekly bookings |

Dates are flexible. The phase order is not.

---

## 6. Financial Plan

### Path to $100K+ Combined Annual Revenue

The $100K target is Bitburg commission plus NSMT's existing revenue streams (live coverage, picture days, events, sponsorships). Bitburg does not need to carry this number alone.

**Year 1 Projection (Conservative):**

| Revenue Stream | Monthly Estimate | Annual Estimate |
|---|---|---|
| Bitburg commission (50 bookings/mo × $300 avg × 8%) | $1,200 | $14,400 |
| Premium pro subscriptions (10 pros × $39/mo, starting month 6) | $390 | $2,340 |
| NSMT existing revenue | Varies | Varies |
| **Bitburg-only total** | **~$1,590** | **~$16,740** |

**Year 2 Projection (Growth):**

| Revenue Stream | Monthly Estimate | Annual Estimate |
|---|---|---|
| Bitburg commission (150 bookings/mo × $400 avg × 8%) | $4,800 | $57,600 |
| Premium pro subscriptions (30 pros × $39/mo) | $1,170 | $14,040 |
| Ad placements (5 advertisers × $200/mo) | $1,000 | $12,000 |
| **Bitburg-only total** | **~$6,970** | **~$83,640** |

Combined with NSMT revenue, the $100K+ threshold is achievable in year 2.

### Key Assumptions

- Average job value grows as the platform attracts higher-value bookings (tournaments, multi-day events, season packages)
- Booking volume grows through referrals, repeat clients, and geographic density
- Commission rate stays at 8% (can increase if platform proves value)
- Premium subscriptions launch 6 months post-launch once pros see the value
- Ad placements activate once there's meaningful traffic

### When to Leave the 9-5

This is not a "quit your job and bet everything" play. The decision to leave should be based on:

1. **NSMT + Bitburg combined revenue consistently exceeding your salary for 3+ months** — not one good month, but a sustained trend
2. **A pipeline of upcoming bookings** that gives confidence the revenue continues
3. **An emergency fund** that covers 6 months of personal expenses without any business income
4. **Health insurance sorted** — often the hidden cost of leaving employment

---

## 7. Pre-Launch Landing Page

### Purpose

Before the full app is ready, a landing page works for you — collecting leads, pre-vetting supply, and building anticipation. When launch day arrives, you don't start from zero. Pros already have profiles, tiers, and portfolios. Clients are waiting for jobs to post. The marketplace looks alive on day one.

### Prerequisite: Brand Name

"Bitburg" is a working title. The final brand name must be locked and the domain secured before the landing page goes live. This is the first public impression — you can't easily rebrand after people start signing up.

### Where It Lives

Build it as the homepage of the existing repo. Replace the default Next.js page with a proper coming-soon page. This uses your real stack and gives you practice with Claude Code before tackling harder features. When the full app is ready, the landing page evolves into the real homepage.

### Two Signup Paths

**Pro path — "I'm a media professional"**

Collects: name, email, location (city/county), specialty (photographer / videographer / editor — multi-select), sports they cover, portfolio links (Instagram, website, YouTube, Google Drive — whatever they have), short bio or experience summary.

**Client path — "I need media coverage"**

Collects: name, email, organization name (school, league, business), what they typically need (game coverage, picture days, tournaments, highlight editing), location.

### Confirmation Experience

Both paths get a confirmation email and land on a "You're on the list" page showing their waitlist position and a unique referral link. That waitlist number creates urgency, and the referral link turns every signup into a growth engine (see Section 9: Referral Program for milestone rewards).

### Behind the Scenes

All submissions write directly to the Supabase database. Pro portfolios are reviewed as they come in. Preliminary tier ratings are assigned before launch. When the platform goes live, top pros already have profiles, tiers, and portfolios loaded — the marketplace has instant credibility.

### Landing Page Timeline

Build and launch the landing page as soon as the brand name is finalized. This can happen in parallel with the main app build. The landing page is intentionally simple — it's a strong first Claude Code project.

---

## 8. Feature Rollout Strategy

### Philosophy

Do not ship everything at once. Hold back features you've already built so each update becomes free marketing — a social post, an email blast, and a reason for users to re-engage. Every update creates the perception that the platform is constantly improving.

### Launch — August (Football Season)

These are the features without which the core loop feels broken or the value proposition doesn't land:

- Guided job posting wizard (step-by-step, adapts for ON_SITE vs REMOTE)
- Pro profiles with portfolio gallery and tier badges
- Pro directory with filters (sport, category, tier, price range)
- Job board for pros with filters (sport, date, location, pay, job type)
- One-click apply (pre-fills from pro profile)
- Booking status tracker (visual timeline: posted → applications in → pro selected → event day → completed)
- In-app messaging (after application or booking)
- Email notifications for key moments (new application, booking confirmed, message received)
- Client reviews displayed on pro profiles

Both sides get a complete, professional experience on day one. A client can post, browse pros, book someone, message them, and leave a review. A pro can browse jobs, apply fast, get booked, communicate, and build their reputation.

### Update 1 — September ("Bitburg just got smarter")

Drop 3-4 weeks into football season when there's real user data:

- Smart match suggestions — when a client posts a job, auto-suggest top pros by category, tier, and availability
- Automated reminders — 24-hour pre-event summary to both client and pro with location and details
- "Available this weekend" section — surfaces active pros and upcoming jobs, creates urgency

Marketing angle: social post, email to all users, reason for ADs to check back in.

### Update 2 — October ("Your season, organized")

Right as basketball ramps up and football is deep in season:

- Calendar sync — "Add to Google Calendar" on every confirmed booking
- Quick re-book — "Book this pro again for your next game" (huge for repeat clients, major retention play)
- Booking count on pro profiles — "15 jobs completed on Bitburg" (social proof compounds as the season progresses)

Marketing angle: targets retention. Early users see pros with real track records. New users see a platform with traction.

### Update 3 — November ("Find work faster")

Pro-side features that make the platform stickier for supply:

- Map view for on-site jobs — pros see nearby gigs visually
- Response time indicator on profiles — "Usually responds within 2 hours" (rewards responsive pros)
- Pre-apply Q&A — pros can ask clarifying questions on a listing before committing to apply

Marketing angle: recruitment push. "We just made it easier to find and land gigs on Bitburg."

### Update 4 — December/January ("Bitburg 2.0")

Bundle remaining polish into a bigger narrative during the offseason:

- Notification center (bell icon with real-time updates)
- Automated event-day notifications (morning-of summary with address, time, contact info)
- UX improvements based on feedback from the first full season

Marketing angle: positions for basketball season and sets up the story that the platform listens and evolves.

---

## 9. Referral Program

### Philosophy

In a tight local community like NoVA high school sports, everyone knows each other. ADs talk to ADs, photographers know other photographers, parents talk in the stands. A referral program turns existing users into a sales team. The program is designed to evolve across three phases, with each phase building on the last so early supporters feel increasingly invested.

### Phase 1 — Pre-Launch (Landing Page / Waitlist)

This is the biggest referral opportunity. The waitlist IS the product.

**Mechanic:** Every signup gets a unique referral link. Every person who signs up through that link moves the referrer up in the waitlist. People at the top get early access, first dibs on the best jobs (pros), or first pick of the best pros (clients).

**Milestones:**

| Referrals | Reward |
|---|---|
| 3 | Jump 10 spots on the waitlist |
| 10 | Guaranteed early access to the platform |
| 25 | Founding Member badge — permanent, displayed on profile forever |

The Founding Member badge becomes a status symbol once the platform is live. It says "I was here before everyone else." This costs nothing to implement and creates viral urgency — someone signs up, immediately shares with friends to move up, those friends share too.

**Implementation:** Each signup generates a unique referral code stored in Supabase. The landing page tracks referral source on every new signup. A simple counter shows the referrer their current position and how many people they've referred. This is a straightforward Claude Code project.

### Phase 2 — Launch (MVP — No Payments Yet)

Once the app is live but Stripe isn't connected, incentives are status and visibility — things that feel valuable without costing money.

**Pro referring anyone:**

Each successful referral earns 30 days of priority placement in search results — their profile shows up higher when clients browse. This directly translates to more bookings. Founding Pro badges (earned during waitlist or at launch) stay on profiles permanently.

**Client referring anyone:**

Each successful referral earns a "Trusted Client" badge and gets their next job post featured at the top of the job board for one week. Pros see featured posts first, so the client gets faster and better applications.

**Cross-side referrals (most valuable):**

If a pro refers a client who posts their first job, or a client refers a pro who completes their first booking, the referrer gets both the badge and the priority boost. Cross-side referrals grow both sides of the marketplace simultaneously and are rewarded accordingly.

**Implementation:** Referral tracking table in Prisma schema linking referrer to referee with timestamp and type (pro→pro, client→client, pro→client, client→pro). Priority placement logic in the pro directory and job board queries. Badge display on profile components.

### Phase 3 — Post-Payments (Stripe Connect Live)

Now real money stacks on top of the status incentives.

**Pro incentive — reduced commission:**

Standard rate is 8%. Each successful referral drops commission to 5% for one booking. Refer five people, get five discounted bookings. This costs nothing upfront — you just earn slightly less on those bookings, and only when the referral results in actual platform activity.

**Client incentive — booking credit:**

Refer someone who completes a booking and get $25 off your next booking. The referred person also gets $10 off their first booking. Dual-sided rewards increase conversion because both people have a reason to follow through.

**Compounding loyalty:**

Someone who referred 25 people during the waitlist phase now has a Founding Member badge, priority placement, AND reduced commission once payments are live. They feel invested. They're not leaving for Thumbtack.

### Referral Program Integration with Feature Rollout

| Phase | Timing | Referral Features |
|---|---|---|
| Pre-launch | Landing page live | Unique referral links, waitlist position tracking, milestone badges |
| Launch (August) | Football season | Priority placement rewards, Trusted Client badges, cross-side bonuses |
| Update 2 (October) | Mid-season | Surface referral stats on profiles ("Invited 12 pros to the platform") |
| Post-payments | When Stripe Connect goes live | Commission discounts, booking credits, dual-sided rewards |

### Anti-Gaming Rules

Referral programs attract abuse. Basic protections to build in from the start:

- Referred accounts must complete a real action (pro: complete a booking; client: post a job) before the referrer gets credit
- Self-referral detection: flag accounts with the same IP, email domain, or device fingerprint
- Cap referral rewards per user per month to prevent exploitation
- Admin can manually review and revoke suspicious referral credit
- All referral activity is logged in the audit trail

---

## Appendix: Key Decisions Log

| Decision | Choice | Rationale |
|---|---|---|
| Bitburg–NSMT relationship | Fully separate brands | Neutral marketplace credibility |
| Revenue model | Pro-side commission, 8% | Clean client pricing, familiar to pros |
| Launch geography | DMV, starting in NoVA | Existing network and market knowledge |
| Launch category | Sports media only | Proven supply and demand |
| Target launch | Football season (August) | Natural demand spike, urgency driver |
| Build approach | Self-built with Claude Code | Learning by building, cost-effective |
| Payments | Deferred to Phase 2 | MVP doesn't need transactions |
| Ads | Infrastructure exists, activation deferred | No traffic to monetize yet |
| Feature rollout | Strategic phased releases, not all at once | Each update = marketing moment |
| Pre-launch landing page | Build on existing repo, collect pro + client signups | Pre-seed both sides before launch |
| Brand name | Working title "Bitburg" — must finalize before landing page | First public impression, can't rebrand later |
| Storage (updated per review) | Cloudflare R2 when uploads are implemented | Zero egress fees for media-heavy platform |
| Payments language (per review) | Never use "escrow" — use "delayed payout" | Stripe guidance, legal risk avoidance |
| Referral program | Phased: waitlist position → status/visibility → monetary rewards | Grows both sides, costs nothing pre-payments, compounds loyalty |
