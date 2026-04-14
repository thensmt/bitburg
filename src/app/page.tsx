import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const FIELD_PALETTE = {
  primary: "#1B4332",
  primaryText: "#FFFFFF",
  background: "#F8F7F3",
  text: "#3D3C37",
  accent: "#C9A876",
  label: "#6B6559",
  border: "#D4CEBC",
};

export default async function Home() {
  const { userId } = await auth();

  return (
    <div style={{ backgroundColor: FIELD_PALETTE.background }} className="min-h-screen">
      {/* Header */}
      <header className="border-b" style={{ borderColor: FIELD_PALETTE.border }}>
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <h1 className="text-2xl font-bold" style={{ color: FIELD_PALETTE.text }}>
              Bitburg
            </h1>

            {/* Right Nav */}
            <div className="flex items-center gap-6">
              <Link
                href="/sign-in"
                className="text-sm font-medium transition-colors hover:opacity-70"
                style={{ color: FIELD_PALETTE.text }}
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors"
                style={{
                  backgroundColor: FIELD_PALETTE.primary,
                  color: FIELD_PALETTE.primaryText,
                }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b px-6 py-20" style={{ borderColor: FIELD_PALETTE.border }}>
        <div className="mx-auto max-w-4xl">
          <h2
            className="mb-6 text-balance text-5xl font-bold leading-tight"
            style={{ color: FIELD_PALETTE.text }}
          >
            Booking media in the DMV, without the DMs.
          </h2>
          <p
            className="mb-12 text-lg leading-relaxed"
            style={{ color: FIELD_PALETTE.label }}
          >
            Vetted photographers, videographers, and editors for local sports, events, and
            creative work.
          </p>

          {/* CTA Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Card 1: I need media coverage */}
            <Link
              href="/sign-up?role=client"
              className="group rounded-xl border-2 p-8 transition-all hover:shadow-lg"
              style={{
                borderColor: FIELD_PALETTE.border,
                backgroundColor: "#FFFFFF",
              }}
            >
              <div
                className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg text-2xl"
                style={{ backgroundColor: FIELD_PALETTE.accent }}
              >
                📸
              </div>
              <h3 className="mb-2 text-xl font-semibold" style={{ color: FIELD_PALETTE.text }}>
                I need media coverage
              </h3>
              <p className="mb-6 text-sm" style={{ color: FIELD_PALETTE.label }}>
                Post jobs and hire vetted professionals for your events.
              </p>
              <span
                className="inline-flex items-center font-semibold transition-transform group-hover:translate-x-1"
                style={{ color: FIELD_PALETTE.primary }}
              >
                Post a job →
              </span>
            </Link>

            {/* Card 2: I'm a media pro */}
            <Link
              href="/sign-up?role=pro"
              className="group rounded-xl border-2 p-8 transition-all hover:shadow-lg"
              style={{
                borderColor: FIELD_PALETTE.border,
                backgroundColor: "#FFFFFF",
              }}
            >
              <div
                className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg text-2xl"
                style={{ backgroundColor: FIELD_PALETTE.accent }}
              >
                🎥
              </div>
              <h3 className="mb-2 text-xl font-semibold" style={{ color: FIELD_PALETTE.text }}>
                I&apos;m a media pro
              </h3>
              <p className="mb-6 text-sm" style={{ color: FIELD_PALETTE.label }}>
                Apply for jobs and grow your portfolio with quality clients.
              </p>
              <span
                className="inline-flex items-center font-semibold transition-transform group-hover:translate-x-1"
                style={{ color: FIELD_PALETTE.primary }}
              >
                Apply for access →
              </span>
            </Link>
          </div>

          {/* Trust Strip */}
          <div
            className="mt-12 rounded-lg border px-6 py-4 text-center text-sm"
            style={{
              borderColor: FIELD_PALETTE.border,
              color: FIELD_PALETTE.label,
            }}
          >
            40+ vetted pros · Tiered from D to S · DMV local
          </div>
        </div>
      </section>

      {/* Sample Work */}
      <section className="border-b px-6 py-20" style={{ borderColor: FIELD_PALETTE.border }}>
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-3xl font-bold" style={{ color: FIELD_PALETTE.text }}>
            Sample work
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              "Fairfax HS Football",
              "Gonzaga Basketball",
              "Local creative portrait",
            ].map((title, idx) => (
              <div
                key={idx}
                className="aspect-square rounded-lg border-2 flex items-center justify-center"
                style={{
                  borderColor: FIELD_PALETTE.border,
                  backgroundColor: "#FFFFFF",
                }}
              >
                <p
                  className="text-center text-sm font-medium"
                  style={{ color: FIELD_PALETTE.label }}
                >
                  {title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b px-6 py-20" style={{ borderColor: FIELD_PALETTE.border }}>
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-3xl font-bold" style={{ color: FIELD_PALETTE.text }}>
            How it works
          </h2>

          {/* For Clients */}
          <div className="mb-16">
            <h3
              className="mb-8 text-lg font-semibold"
              style={{ color: FIELD_PALETTE.text }}
            >
              For clients
            </h3>
            <div className="space-y-6">
              {[
                { num: "1", title: "Post a job", desc: "Tell us what you need" },
                { num: "2", title: "Review applicants", desc: "See vetted pro profiles" },
                { num: "3", title: "Book with confidence", desc: "Secure payment and support" },
              ].map((step, idx) => (
                <div key={idx} className="flex gap-6">
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full font-bold"
                    style={{
                      backgroundColor: FIELD_PALETTE.primary,
                      color: FIELD_PALETTE.primaryText,
                    }}
                  >
                    {step.num}
                  </div>
                  <div>
                    <h4 className="font-semibold" style={{ color: FIELD_PALETTE.text }}>
                      {step.title}
                    </h4>
                    <p style={{ color: FIELD_PALETTE.label }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* For Pros */}
          <div>
            <h3
              className="mb-8 text-lg font-semibold"
              style={{ color: FIELD_PALETTE.text }}
            >
              For media professionals
            </h3>
            <div className="space-y-6">
              {[
                { num: "1", title: "Apply", desc: "Submit your work sample" },
                { num: "2", title: "Get tiered", desc: "Earn your D to S rating" },
                { num: "3", title: "Win work", desc: "Get matched with clients" },
              ].map((step, idx) => (
                <div key={idx} className="flex gap-6">
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full font-bold"
                    style={{
                      backgroundColor: FIELD_PALETTE.primary,
                      color: FIELD_PALETTE.primaryText,
                    }}
                  >
                    {step.num}
                  </div>
                  <div>
                    <h4 className="font-semibold" style={{ color: FIELD_PALETTE.text }}>
                      {step.title}
                    </h4>
                    <p style={{ color: FIELD_PALETTE.label }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why It's Different */}
      <section className="border-b px-6 py-20" style={{ borderColor: FIELD_PALETTE.border }}>
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-3xl font-bold" style={{ color: FIELD_PALETTE.text }}>
            Why it&apos;s different
          </h2>
          <div className="space-y-8">
            {[
              {
                lead: "Quality is earned, not claimed.",
                text: "Our D–S tier system is based on completed work, client ratings, and portfolio depth. No one-stars on day one.",
              },
              {
                lead: "Local means local.",
                text: "We focus on the DMV area so you're working with people you can actually meet. Better collaboration, better results.",
              },
              {
                lead: "Clear pricing, no bidding wars.",
                text: "You set the rate. Clients book at your rate. No race-to-the-bottom auctions.",
              },
            ].map((item, idx) => (
              <div key={idx}>
                <h3 className="font-semibold" style={{ color: FIELD_PALETTE.text }}>
                  {item.lead}
                </h3>
                <p className="mt-2" style={{ color: FIELD_PALETTE.label }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t px-6 py-12"
        style={{
          borderColor: FIELD_PALETTE.border,
          backgroundColor: "#FFFFFF",
        }}
      >
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <p className="font-bold" style={{ color: FIELD_PALETTE.text }}>
              Bitburg
            </p>
            <nav className="flex gap-6 text-sm">
              {["About", "Terms", "Privacy", "Contact"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="transition-colors hover:opacity-70"
                  style={{ color: FIELD_PALETTE.label }}
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>
          <p
            className="mt-8 border-t pt-8 text-center text-sm"
            style={{
              borderColor: FIELD_PALETTE.border,
              color: FIELD_PALETTE.label,
            }}
          >
            © 2025 Bitburg. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
