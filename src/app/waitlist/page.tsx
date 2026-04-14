"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Footer } from "@/components/marketing/Footer";

// Pre-launch waitlist — visual only. Form submit does nothing.
// Delete this route and re-point CTAs to Clerk's /sign-up at launch.

type Role = "client" | "pro" | null;

export default function WaitlistPage() {
  const [role, setRole] = useState<Role>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // no network — visual-only mockup
    setSubmitted(true);
  }

  const textareaPlaceholder =
    role === "pro"
      ? "What do you shoot? Sports, events, portraits, video, editing…"
      : role === "client"
      ? "What do you need coverage for? Sport, event, date if you know it…"
      : "Tell us a little about what brings you here.";

  return (
    <div className="relative min-h-screen bg-[#0F2D22] text-[#F8F7F3] font-sans antialiased">
      <Link
        href="/"
        className="fixed left-6 top-6 z-10 font-serif text-base text-[#F8F7F3]/80 transition-colors hover:text-[#C9A961]"
      >
        Bitburg
      </Link>

      <main className="mx-auto flex min-h-screen max-w-[640px] flex-col justify-center px-6 py-24 md:py-32">
        <span className="mb-10 font-mono text-xs uppercase tracking-[0.22em] text-[#C9A961]">
          Early access · Opens 2026.09.01
        </span>

        <h1 className="font-serif text-5xl font-medium leading-[0.95] tracking-tight text-[#F8F7F3] md:text-7xl">
          Get in early.
        </h1>

        <p className="mt-8 max-w-prose text-lg leading-relaxed text-[#F8F7F3]/70">
          Bitburg is the DMV's first vetted media marketplace. Sports, events,
          creative work — booked without the DMs. We're rolling out access in
          waves. Join the list to be first.
        </p>

        {submitted ? (
          <div className="mt-12 border-t border-[#F8F7F3]/15 pt-12">
            <p className="font-serif text-2xl text-[#F8F7F3]">
              You're on the list.
            </p>
            <p className="mt-3 text-[#F8F7F3]/60">
              We'll email you when your role opens up.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-12 space-y-8">
            <Field label="Name">
              <input
                type="text"
                name="name"
                required
                autoComplete="name"
                className="w-full border-b border-[#F8F7F3]/30 bg-transparent py-3 text-[#F8F7F3] placeholder:text-[#F8F7F3]/40 focus:border-[#C9A961] focus:outline-none"
                placeholder="Your name"
              />
            </Field>

            <Field label="Email">
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="w-full border-b border-[#F8F7F3]/30 bg-transparent py-3 text-[#F8F7F3] placeholder:text-[#F8F7F3]/40 focus:border-[#C9A961] focus:outline-none"
                placeholder="you@domain.com"
              />
            </Field>

            <Field label="I'm signing up as…">
              <div className="flex flex-wrap gap-3 pt-2">
                <RolePill
                  active={role === "client"}
                  onClick={() => setRole("client")}
                >
                  I need media
                </RolePill>
                <RolePill
                  active={role === "pro"}
                  onClick={() => setRole("pro")}
                >
                  I'm a pro
                </RolePill>
              </div>
            </Field>

            <Field label="Tell us more (optional)">
              <textarea
                name="notes"
                rows={3}
                className="w-full resize-none border-b border-[#F8F7F3]/30 bg-transparent py-3 text-[#F8F7F3] placeholder:text-[#F8F7F3]/40 focus:border-[#C9A961] focus:outline-none"
                placeholder={textareaPlaceholder}
              />
            </Field>

            <button
              type="submit"
              className="mt-4 w-full rounded-sm bg-[#F8F7F3] px-6 py-4 text-sm font-medium uppercase tracking-[0.18em] text-[#0F2D22] transition-colors hover:bg-[#C9A961]"
            >
              Request early access
            </button>

            <p className="text-xs text-[#F8F7F3]/50">
              We'll email you when your role opens up. No spam.
            </p>
          </form>
        )}
      </main>

      <Footer variant="dark" />
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-[0.18em] text-[#F8F7F3]/50">
        {label}
      </span>
      {children}
    </label>
  );
}

function RolePill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const className = active
    ? "rounded-full bg-[#C9A961] px-5 py-2 text-sm text-[#0F2D22] transition-colors"
    : "rounded-full border border-[#F8F7F3]/30 px-5 py-2 text-sm text-[#F8F7F3]/70 transition-colors hover:border-[#C9A961] hover:text-[#F8F7F3]";

  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}
