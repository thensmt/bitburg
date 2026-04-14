import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Footer } from "@/components/marketing/Footer";

// Pre-launch: "Sign in", "Get Started", and both CTA cards all route to /waitlist.
// Post-launch: rewire header links to /sign-in, CTA cards to /onboarding, and
// remove the /waitlist directory.
const CTA_HREF = "/waitlist";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-[#F8F7F3] text-[#3D3C37] font-sans antialiased">
      <Header />
      <main>
        <Hero />
        <SampleWork />
        <HowItWorks />
        <WhyDifferent />
      </main>
      <Footer variant="light" />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#D4CEBC] bg-[#F8F7F3]/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1080px] items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-serif text-xl tracking-tight text-[#3D3C37]"
        >
          Bitburg
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href={CTA_HREF}
            className="text-sm text-[#6B6559] transition-colors hover:text-[#1B4332]"
          >
            Sign in
          </Link>
          <Link
            href={CTA_HREF}
            className="inline-flex items-center rounded-md bg-[#1B4332] px-4 py-2 text-sm font-medium text-[#F8F7F3] transition-colors hover:bg-[#0F2D22]"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-[1080px] px-6 py-20 md:py-28">
      <h1 className="font-serif text-4xl font-medium tracking-tight text-[#3D3C37] md:text-6xl lg:text-7xl">
        Booking media in the DMV,
        <br className="hidden md:block" />{" "}
        <span className="text-[#1B4332]">without the DMs.</span>
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-[#6B6559] md:text-xl">
        Vetted photographers, videographers, and editors for local sports,
        events, and creative work.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
        <CtaCard
          label="For clients"
          heading="I need media coverage"
          description="Post a job, review vetted applicants, and book the right pro for your event."
          ctaLabel="Post a job"
          href={CTA_HREF}
          variant="primary"
        />
        <CtaCard
          label="For pros"
          heading="I'm a media pro"
          description="Apply for access, get tiered on your work, and win jobs from local clients."
          ctaLabel="Apply for access"
          href={CTA_HREF}
          variant="outline"
        />
      </div>

      <p className="mt-12 text-sm text-[#6B6559]">
        40+ vetted pros
        <span className="mx-3 text-[#C9A961]" aria-hidden>
          ·
        </span>
        Tiered from D to S
        <span className="mx-3 text-[#C9A961]" aria-hidden>
          ·
        </span>
        DMV local
      </p>
    </section>
  );
}

function CtaCard({
  label,
  heading,
  description,
  ctaLabel,
  href,
  variant,
}: {
  label: string;
  heading: string;
  description: string;
  ctaLabel: string;
  href: string;
  variant: "primary" | "outline";
}) {
  const buttonClass =
    variant === "primary"
      ? "inline-flex items-center rounded-md bg-[#1B4332] px-5 py-2.5 text-sm font-medium text-[#F8F7F3] transition-colors hover:bg-[#0F2D22]"
      : "inline-flex items-center rounded-md border border-[#1B4332] px-5 py-2.5 text-sm font-medium text-[#1B4332] transition-colors hover:bg-[#1B4332] hover:text-[#F8F7F3]";

  return (
    <div className="group flex flex-col justify-between rounded-lg border border-[#D4CEBC] bg-white p-8 transition-colors hover:border-[#1B4332]">
      <div>
        <span className="text-xs uppercase tracking-[0.18em] text-[#6B6559]">
          {label}
        </span>
        <h3 className="mt-3 font-serif text-2xl font-medium tracking-tight text-[#3D3C37] md:text-3xl">
          {heading}
        </h3>
        <p className="mt-3 text-[#6B6559]">{description}</p>
      </div>
      <Link href={href} className={`${buttonClass} mt-6 w-fit`}>
        {ctaLabel}
        <span className="ml-2" aria-hidden>
          →
        </span>
      </Link>
    </div>
  );
}

function SampleWork() {
  const items = [
    { title: "Fairfax HS Football", tone: "bg-[#D4CEBC]/60" },
    { title: "Gonzaga Basketball", tone: "bg-[#1B4332]/10" },
    { title: "Local creative portrait", tone: "bg-[#C9A961]/15" },
  ];
  return (
    <section className="border-t border-[#D4CEBC] py-20">
      <div className="mx-auto max-w-[1080px] px-6">
        <h2 className="font-serif text-3xl font-medium tracking-tight text-[#3D3C37] md:text-4xl">
          Sample work
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((item) => (
            <div key={item.title}>
              <div
                className={`relative flex aspect-[4/5] items-center justify-center rounded-md border border-[#D4CEBC] ${item.tone}`}
              >
                <span className="absolute right-3 top-3 rounded-sm border border-[#C9A961]/40 bg-[#F8F7F3] px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-[#C9A961]">
                  Placeholder
                </span>
                <span className="font-serif text-lg text-[#3D3C37]/60">
                  ▢
                </span>
              </div>
              <p className="mt-4 text-sm text-[#3D3C37]">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const clients = [
    { n: "01", title: "Post a job", body: "Share what you need, where, when, and your budget. Takes two minutes." },
    { n: "02", title: "Review applicants", body: "See portfolios, tiers, and rates from vetted local pros. No cold DMs." },
    { n: "03", title: "Book with confidence", body: "Pick your fit, deposit held in escrow until the work is delivered." },
  ];
  const pros = [
    { n: "01", title: "Apply", body: "Submit portfolio and a short work history. We vet every application." },
    { n: "02", title: "Get tiered", body: "Start at D, climb to S as you deliver. Tier gates what you can bid on." },
    { n: "03", title: "Win work", body: "Apply to jobs that fit your craft. Get paid on delivery, every time." },
  ];

  return (
    <section className="border-t border-[#D4CEBC] py-20">
      <div className="mx-auto max-w-[1080px] px-6">
        <h2 className="font-serif text-3xl font-medium tracking-tight text-[#3D3C37] md:text-4xl">
          How it works
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-12">
          <div>
            <span className="text-xs uppercase tracking-[0.18em] text-[#6B6559]">
              For clients
            </span>
            <ol className="mt-6 space-y-8">
              {clients.map((step) => (
                <Step key={step.n} {...step} />
              ))}
            </ol>
          </div>
          <div>
            <span className="text-xs uppercase tracking-[0.18em] text-[#6B6559]">
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
        <h4 className="text-base font-medium text-[#3D3C37]">{title}</h4>
        <p className="mt-1 text-sm text-[#6B6559]">{body}</p>
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
    <section className="border-t border-[#D4CEBC] py-20">
      <div className="mx-auto max-w-[1080px] px-6">
        <h2 className="font-serif text-3xl font-medium tracking-tight text-[#3D3C37] md:text-4xl">
          Why it's different
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {items.map((item) => (
            <div key={item.lead}>
              <h3 className="font-serif text-xl font-medium leading-snug text-[#3D3C37]">
                {item.lead}
              </h3>
              <p className="mt-3 text-[#6B6559]">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
