"use client";

import Link from "next/link";
import { useState } from "react";
import { Footer } from "@/components/marketing/Footer";

// Visual mockup only. The existing backend at POST /api/onboarding will be
// wired in after design approval — see CLAUDE.md role model.

type Role = "CLIENT" | "PRO" | null;

export default function OnboardingPage() {
  const [selected, setSelected] = useState<Role>(null);

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F7F3] text-[#3D3C37] font-sans antialiased">
      <div className="px-6 pt-10">
        <Link
          href="/"
          className="font-serif text-base text-[#3D3C37] transition-colors hover:text-[#1B4332]"
        >
          Bitburg
        </Link>
      </div>

      <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col justify-center px-6 py-16 md:py-24">
        <span className="mb-6 text-xs uppercase tracking-[0.22em] text-[#6B6559]">
          Step 1 of 2
        </span>

        <h1 className="font-serif text-4xl font-medium leading-[1.05] tracking-tight text-[#3D3C37] md:text-5xl">
          Welcome to Bitburg.
        </h1>
        <p className="mt-4 text-lg text-[#6B6559]">
          How will you be using Bitburg?
        </p>

        <div className="mt-12 space-y-4">
          <RoleCard
            role="CLIENT"
            title="I need media coverage"
            description="Post jobs, review vetted applicants, and book photographers, videographers, and editors for your events."
            cta="Continue as a client"
            selected={selected === "CLIENT"}
            onSelect={() => setSelected("CLIENT")}
          />
          <RoleCard
            role="PRO"
            title="I'm a media professional"
            description="Apply for access, get tiered on your portfolio, and win jobs from clients across the DMV."
            cta="Continue as a pro"
            selected={selected === "PRO"}
            onSelect={() => setSelected("PRO")}
          />
        </div>

        <p className="mt-10 text-sm text-[#6B6559]">
          You can't change this later without contacting support. Pick the one
          that fits your main use.
        </p>
      </main>

      <Footer variant="light" />
    </div>
  );
}

function RoleCard({
  role,
  title,
  description,
  cta,
  selected,
  onSelect,
}: {
  role: "CLIENT" | "PRO";
  title: string;
  description: string;
  cta: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const wrapperClass = selected
    ? "w-full rounded-lg border border-[#1B4332] bg-white p-8 text-left ring-2 ring-[#C9A961] ring-offset-4 ring-offset-[#F8F7F3] transition-all"
    : "w-full rounded-lg border border-[#D4CEBC] bg-white p-8 text-left transition-all hover:border-[#1B4332]";

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      data-role={role}
      className={wrapperClass}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <h2 className="font-serif text-2xl font-medium tracking-tight text-[#3D3C37] md:text-[28px]">
            {title}
          </h2>
          <p className="mt-3 text-[#6B6559]">{description}</p>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end">
        <span
          className={
            selected
              ? "inline-flex items-center rounded-md bg-[#1B4332] px-5 py-2.5 text-sm font-medium text-[#F8F7F3]"
              : "inline-flex items-center text-sm font-medium text-[#1B4332]"
          }
        >
          {cta}
          <span className="ml-2" aria-hidden>
            →
          </span>
        </span>
      </div>
    </button>
  );
}
