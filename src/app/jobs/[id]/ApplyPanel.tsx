"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ApplyPanel({ jobId, budget }: { jobId: string; budget: number }) {
  const router = useRouter();
  const [rateResponse, setRateResponse] = useState<"ACCEPTED" | "COUNTERED">("ACCEPTED");
  const [counterRate, setCounterRate] = useState("");
  const [counterJustification, setCounterJustification] = useState("");
  const [pitchMessage, setPitchMessage] = useState("");
  const [portfolioSamples, setPortfolioSamples] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pitchMessage.trim()) {
      setError("A pitch message is required.");
      return;
    }
    if (rateResponse === "COUNTERED" && !counterRate) {
      setError("Enter your counter rate.");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch(`/api/jobs/${jobId}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pitchMessage,
        rateResponse,
        counterRate: rateResponse === "COUNTERED" ? parseFloat(counterRate) : null,
        counterJustification: rateResponse === "COUNTERED" ? counterJustification : null,
        portfolioSamples: portfolioSamples
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-6"
    >
      <h2 className="text-lg font-semibold text-zinc-900">Apply for this Job</h2>

      {/* Rate Response */}
      <div>
        <label className="block text-sm font-semibold text-zinc-700 mb-2">
          Rate — Client&apos;s budget is ${budget.toLocaleString()}
        </label>
        <div className="flex gap-3 mb-3">
          {[
            { value: "ACCEPTED", label: `Accept $${budget.toLocaleString()}` },
            { value: "COUNTERED", label: "Counter offer" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRateResponse(opt.value as "ACCEPTED" | "COUNTERED")}
              className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                rateResponse === opt.value
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-zinc-300 bg-white text-zinc-700 hover:border-blue-400"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {rateResponse === "COUNTERED" && (
          <div className="space-y-3">
            <input
              type="number"
              min="1"
              placeholder="Your rate ($)"
              value={counterRate}
              onChange={(e) => setCounterRate(e.target.value)}
              className={inputClass}
            />
            <textarea
              rows={2}
              placeholder="Briefly explain your counter rate..."
              value={counterJustification}
              onChange={(e) => setCounterJustification(e.target.value)}
              className={inputClass}
            />
          </div>
        )}
      </div>

      {/* Pitch */}
      <div>
        <label className="block text-sm font-semibold text-zinc-700 mb-2">
          Pitch Message <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={4}
          placeholder="Why are you the right pro for this job? Mention relevant experience, your approach, and availability..."
          value={pitchMessage}
          onChange={(e) => setPitchMessage(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Portfolio Samples */}
      <div>
        <label className="block text-sm font-semibold text-zinc-700 mb-2">
          Portfolio Samples for This Job
        </label>
        <p className="mb-2 text-xs text-zinc-400">One URL per line — relevant work only</p>
        <textarea
          rows={3}
          placeholder={"https://drive.google.com/...\nhttps://vimeo.com/..."}
          value={portfolioSamples}
          onChange={(e) => setPortfolioSamples(e.target.value)}
          className={inputClass}
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-blue-500 px-6 py-4 text-base font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}
