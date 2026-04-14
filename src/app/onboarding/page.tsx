"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const FIELD_PALETTE = {
  primary: "#1B4332",
  primaryText: "#FFFFFF",
  background: "#F8F7F3",
  text: "#3D3C37",
  accent: "#C9A876",
  label: "#6B6559",
  border: "#D4CEBC",
};

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function selectRole(role: "CLIENT" | "PRO") {
    setLoading(true);
    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });

    if (res.ok) {
      router.push(role === "PRO" ? "/apply" : "/dashboard");
    } else {
      setLoading(false);
    }
  }

  return (
    <div style={{ backgroundColor: FIELD_PALETTE.background }} className="min-h-screen">
      {/* Header */}
      <header className="border-b" style={{ borderColor: FIELD_PALETTE.border }}>
        <div className="mx-auto max-w-4xl px-6 py-6">
          <Link href="/" className="text-2xl font-bold" style={{ color: FIELD_PALETTE.text }}>
            Bitburg
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6">
        <div className="w-full max-w-2xl">
          <div className="mb-16 text-center">
            <h1
              className="mb-4 text-4xl font-bold"
              style={{ color: FIELD_PALETTE.text }}
            >
              Welcome to Bitburg
            </h1>
            <p className="text-lg" style={{ color: FIELD_PALETTE.label }}>
              How will you be using Bitburg?
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Card 1: I need media coverage */}
            <button
              onClick={() => selectRole("CLIENT")}
              disabled={loading}
              className="group flex flex-col gap-6 rounded-xl border-2 p-10 text-left transition-all hover:shadow-lg disabled:opacity-50"
              style={{
                borderColor: FIELD_PALETTE.border,
                backgroundColor: "#FFFFFF",
              }}
            >
              <div
                className="inline-flex h-14 w-14 items-center justify-center rounded-lg text-3xl"
                style={{ backgroundColor: FIELD_PALETTE.accent }}
              >
                📸
              </div>
              <div>
                <h2 className="mb-2 text-2xl font-semibold" style={{ color: FIELD_PALETTE.text }}>
                  I need media coverage
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: FIELD_PALETTE.label }}>
                  Post jobs, hire photographers, videographers, editors, and more for your
                  events.
                </p>
              </div>
              <div
                className="mt-4 inline-flex items-center font-semibold transition-transform group-hover:translate-x-1"
                style={{ color: FIELD_PALETTE.primary }}
              >
                Continue as a client →
              </div>
            </button>

            {/* Card 2: I'm a media pro */}
            <button
              onClick={() => selectRole("PRO")}
              disabled={loading}
              className="group flex flex-col gap-6 rounded-xl border-2 p-10 text-left transition-all hover:shadow-lg disabled:opacity-50"
              style={{
                borderColor: FIELD_PALETTE.border,
                backgroundColor: "#FFFFFF",
              }}
            >
              <div
                className="inline-flex h-14 w-14 items-center justify-center rounded-lg text-3xl"
                style={{ backgroundColor: FIELD_PALETTE.accent }}
              >
                🎥
              </div>
              <div>
                <h2 className="mb-2 text-2xl font-semibold" style={{ color: FIELD_PALETTE.text }}>
                  I&apos;m a media professional
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: FIELD_PALETTE.label }}>
                  Apply for quality jobs, build your portfolio, and grow your client base in the
                  DMV.
                </p>
              </div>
              <div
                className="mt-4 inline-flex items-center font-semibold transition-transform group-hover:translate-x-1"
                style={{ color: FIELD_PALETTE.primary }}
              >
                Continue as a pro →
              </div>
            </button>
          </div>

          {/* Fine Print */}
          <p
            className="mt-12 text-center text-xs"
            style={{ color: FIELD_PALETTE.label }}
          >
            You can&apos;t change this later without contacting support. Pick the one that fits
            your main use.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="border-t px-6 py-8"
        style={{
          borderColor: FIELD_PALETTE.border,
          backgroundColor: "#FFFFFF",
        }}
      >
        <div className="mx-auto max-w-4xl text-center text-xs" style={{ color: FIELD_PALETTE.label }}>
          © 2025 Bitburg. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
