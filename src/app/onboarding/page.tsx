"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      router.push("/dashboard");
    } else {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="w-full max-w-lg px-6">
        <h1 className="mb-2 text-3xl font-bold text-zinc-900">Welcome to Bitburg</h1>
        <p className="mb-10 text-zinc-500">How will you be using Bitburg?</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            onClick={() => selectRole("CLIENT")}
            disabled={loading}
            className="flex flex-col gap-3 rounded-2xl border-2 border-zinc-200 bg-white p-8 text-left transition-all hover:border-blue-500 hover:shadow-lg disabled:opacity-50"
          >
            <span className="text-3xl">📸</span>
            <span className="text-xl font-semibold text-zinc-900">I need media coverage</span>
            <span className="text-sm text-zinc-500">
              Post jobs, hire photographers, videographers, editors, and more.
            </span>
          </button>

          <button
            onClick={() => selectRole("PRO")}
            disabled={loading}
            className="flex flex-col gap-3 rounded-2xl border-2 border-zinc-200 bg-white p-8 text-left transition-all hover:border-blue-500 hover:shadow-lg disabled:opacity-50"
          >
            <span className="text-3xl">🎥</span>
            <span className="text-xl font-semibold text-zinc-900">I&apos;m a media professional</span>
            <span className="text-sm text-zinc-500">
              Apply for jobs, build your portfolio, and grow your client base.
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
