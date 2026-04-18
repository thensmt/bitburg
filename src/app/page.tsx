import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Footer } from "@/components/marketing/Footer";
import { WaitlistForm } from "@/components/marketing/WaitlistForm";
import { TrustBand } from "@/components/marketing/TrustBand";
import { Testimonials } from "@/components/marketing/Testimonials";
import { FAQ } from "@/components/marketing/FAQ";
import { FinalCTA } from "@/components/marketing/FinalCTA";

// Pre-launch landing page — dark mode. Primary purpose is email capture for
// the waitlist. Hero form and final CTA use the same <WaitlistForm />.
// Brand palette in dark mode:
//   --bg        #0A1612  (deep forest-black, base)
//   --bg-alt    #0F1F18  (elevated surface / alt section)
//   --bg-accent #0F2D22  (deep forest, used for the green accent band)
//   --ink       #F8F7F3  (cream, primary text)
//   --mute      #A8B5AE  (soft sage, muted text)
//   --gold      #C9A961  (primary accent — CTAs, eyebrows, rules)
//   --line      rgb(248 247 243 / 0.10)  (hairline borders)

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-[#0A1612] font-sans text-[#F8F7F3] antialiased">
      <Header />
      <main>
        <Hero />
        <TrustBand />
        <SampleWork />
        <WhyDifferent />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer variant="dark" />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0A1612]/80 backdrop-blur">
      <div className="mx-auto flex max-w-[1080px] items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-serif text-xl tracking-tight text-[#F8F7F3]"
        >
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-[#C9A961]"
          />
          Bitburg
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="#faq-heading"
            className="hidden text-sm text-[#A8B5AE] transition-colors hover:text-[#C9A961] sm:inline"
          >
            FAQ
          </Link>
          <a
            href="#waitlist"
            className="inline-flex items-center rounded-md bg-[#C9A961] px-4 py-2 text-sm font-medium text-[#0A1612] transition-colors hover:bg-[#D8BC7B]"
          >
            Get early access
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle ambient glow — single analogous accent, per guidelines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[640px]"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 0%, rgba(201,169,97,0.12), transparent 70%)",
        }}
      />
      {/* Faint hairline grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #F8F7F3 1px, transparent 1px), linear-gradient(to bottom, #F8F7F3 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, black, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, black, transparent 80%)",
        }}
      />

      <div className="relative mx-auto max-w-[1080px] px-6 pb-20 pt-16 md:pb-28 md:pt-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A961]/30 bg-[#C9A961]/5 px-3 py-1 font-mono text-xs uppercase tracking-[0.22em] text-[#C9A961]">
          <span
            aria-hidden
            className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#C9A961]"
          />
          Early access · Opens 2026.09.01 · DMV
        </span>

        <h1 className="mt-6 font-serif text-4xl font-medium leading-[1.02] tracking-tight text-[#F8F7F3] text-balance md:text-6xl lg:text-7xl">
          Booking media in the DMV,
          <br className="hidden md:block" />{" "}
          <span className="text-[#C9A961]">without the DMs.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#A8B5AE] text-pretty md:text-xl">
          Vetted photographers, videographers, and editors for local sports,
          events, and creative work. Launching in waves &mdash; join the
          waitlist to be first through the door.
        </p>

        <div
          id="waitlist"
          className="mt-12 grid scroll-mt-24 grid-cols-1 gap-10 rounded-lg border border-white/10 bg-[#0F1F18] p-8 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)] md:grid-cols-[1.1fr_0.9fr] md:gap-12 md:p-10"
        >
          <div>
            <span className="text-xs uppercase tracking-[0.18em] text-[#C9A961]">
              Request early access
            </span>
            <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight text-[#F8F7F3] md:text-3xl">
              One email. One spot on the list.
            </h2>
            <p className="mt-3 text-[#A8B5AE]">
              Tell us whether you&apos;re booking media or making it.
              We&apos;ll email you when your side opens up &mdash; nothing
              before, nothing after.
            </p>

            <ul className="mt-6 space-y-2 text-sm text-[#F8F7F3]/85">
              <Checkpoint>Priority access the day we open</Checkpoint>
              <Checkpoint>
                Founding-member rates locked for 12 months
              </Checkpoint>
              <Checkpoint>
                Pros: first in line for portfolio review
              </Checkpoint>
            </ul>
          </div>

          <div className="md:border-l md:border-white/10 md:pl-12">
            <WaitlistForm variant="dark" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Checkpoint({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span
        aria-hidden
        className="mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A961]"
      />
      <span>{children}</span>
    </li>
  );
}

function SampleWork() {
  const items = [
    { title: "Fairfax HS Football", tone: "from-[#1B4332]/40 to-[#0F1F18]" },
    { title: "Gonzaga Basketball", tone: "from-[#C9A961]/25 to-[#0F1F18]" },
    { title: "Local creative portrait", tone: "from-[#0F2D22] to-[#0F1F18]" },
  ];
  return (
    <section className="border-t border-white/10 py-20">
      <div className="mx-auto max-w-[1080px] px-6">
        <span className="text-xs uppercase tracking-[0.18em] text-[#C9A961]">
          A taste of the work
        </span>
        <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-[#F8F7F3] md:text-4xl">
          Sample work
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((item) => (
            <div key={item.title}>
              <div
                className={`relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-md border border-white/10 bg-gradient-to-b ${item.tone}`}
              >
                <span className="absolute right-3 top-3 rounded-sm border border-[#C9A961]/40 bg-[#0A1612]/80 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-[#C9A961]">
                  Placeholder
                </span>
                <span
                  aria-hidden
                  className="font-serif text-lg text-[#F8F7F3]/30"
                >
                  {"\u25A2"}
                </span>
              </div>
              <p className="mt-4 text-sm text-[#F8F7F3]/85">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const clients = [
    {
      n: "01",
      title: "Post a job",
      body: "Share what you need, where, when, and your budget. Takes two minutes.",
    },
    {
      n: "02",
      title: "Review applicants",
      body: "See portfolios, tiers, and rates from vetted local pros. No cold DMs.",
    },
    {
      n: "03",
      title: "Book with confidence",
      body: "Pick your fit, deposit held in escrow until the work is delivered.",
    },
  ];
  const pros = [
    {
      n: "01",
      title: "Apply",
      body: "Submit portfolio and a short work history. We vet every application.",
    },
    {
      n: "02",
      title: "Get tiered",
      body: "Start at D, climb to S as you deliver. Tier gates what you can bid on.",
    },
    {
      n: "03",
      title: "Win work",
      body: "Apply to jobs that fit your craft. Get paid on delivery, every time.",
    },
  ];

  return (
    <section className="border-t border-white/10 py-20">
      <div className="mx-auto max-w-[1080px] px-6">
        <span className="text-xs uppercase tracking-[0.18em] text-[#C9A961]">
          How it works
        </span>
        <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-[#F8F7F3] md:text-4xl">
          Two sides. One front door.
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-12">
          <div className="rounded-lg border border-white/10 bg-[#0F1F18] p-8">
            <span className="text-xs uppercase tracking-[0.18em] text-[#C9A961]">
              For clients
            </span>
            <ol className="mt-6 space-y-8">
              {clients.map((step) => (
                <Step key={step.n} {...step} />
              ))}
            </ol>
          </div>
          <div className="rounded-lg border border-white/10 bg-[#0F1F18] p-8">
            <span className="text-xs uppercase tracking-[0.18em] text-[#C9A961]">
              For pros
            </span>
            <ol className="mt-6 space-y-8">
              {pros.map((step) => (
                <Step key={step.n} {...step} />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="flex gap-5">
      <span className="font-serif text-5xl leading-none text-[#C9A961]">
        {n}
      </span>
      <div className="pt-2">
        <h4 className="text-base font-medium text-[#F8F7F3]">{title}</h4>
        <p className="mt-1 text-sm text-[#A8B5AE]">{body}</p>
      </div>
    </li>
  );
}

function WhyDifferent() {
  const items = [
    {
      lead: "Quality is earned, not claimed.",
      body: "Every pro is tiered D through S based on real work and real client feedback. No self-ranking, no gaming the system.",
    },
    {
      lead: "Local means local.",
      body: "Every pro lives and shoots in the DMV. No remote contractors bidding on your kid's game from three time zones away.",
    },
    {
      lead: "Clear pricing, no bidding wars.",
      body: "Post a job at a fair rate and get applicants ready to work. No race-to-the-bottom, no hidden fees.",
    },
  ];
  return (
    <section className="border-t border-white/10 py-20">
      <div className="mx-auto max-w-[1080px] px-6">
        <span className="text-xs uppercase tracking-[0.18em] text-[#C9A961]">
          Why Bitburg
        </span>
        <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-[#F8F7F3] md:text-4xl">
          Built for the way the DMV actually shoots.
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {items.map((item) => (
            <div
              key={item.lead}
              className="relative border-t border-[#C9A961]/40 pt-6"
            >
              <h3 className="font-serif text-xl font-medium leading-snug text-[#F8F7F3]">
                {item.lead}
              </h3>
              <p className="mt-3 text-[#A8B5AE]">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
