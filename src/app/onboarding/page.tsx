"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Footer } from "@/components/marketing/Footer";

type Role = "CLIENT" | "PRO";

export default function OnboardingPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState<Role | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function selectRole(role: Role) {
    if (submitting) return;
    setSubmitting(role);
    setError(null);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        setSubmitting(null);
        setError("Something went wrong. Try again or contact support.");
        return;
      }
      router.push(role === "PRO" ? "/apply" : "/dashboard");
    } catch {
      setSubmitting(null);
      setError("Network error. Check your connection and try again.");
    }
  }

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
            busy={submitting === "CLIENT"}
            disabled={submitting !== null && submitting !== "CLIENT"}
            onSelect={() => selectRole("CLIENT")}
          />
          <RoleCard
            role="PRO"
            title="I'm a media professional"
            description="Apply for access, get tiered on your portfolio, and win jobs from clients across the DMV."
            cta="Continue as a pro"
            busy={submitting === "PRO"}
            disabled={submitting !== null && submitting !== "PRO"}
            onSelect={() => selectRole("PRO")}
          />
        </div>

        {error && (
          <p role="alert" className="mt-6 text-sm text-[#C41E3A]">
            {error}
          </p>
        )}

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
  busy,
  disabled,
  onSelect,
}: {
  role: "CLIENT" | "PRO";
  title: string;
  description: string;
  cta: string;
  busy: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  const wrapperClass = busy
    ? "w-full rounded-lg border border-[#1B4332] bg-white p-8 text-left ring-2 ring-[#C9A961] ring-offset-4 ring-offset-[#F8F7F3] transition-all"
    : "w-full rounded-lg border border-[#D4CEBC] bg-white p-8 text-left transition-all hover:border-[#1B4332] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[#D4CEBC]";

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled || busy}
      aria-busy={busy}
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
            busy
              ? "inline-flex items-center rounded-md bg-[#1B4332] px-5 py-2.5 text-sm font-medium text-[#F8F7F3]"
              : "inline-flex items-center text-sm font-medium text-[#1B4332]"
          }
        >
          {busy ? "Setting up…" : cta}
          {!busy && (
            <span className="ml-2" aria-hidden>
              →
            </span>
          )}
        </span>
      </div>
    </button>
  );
}
