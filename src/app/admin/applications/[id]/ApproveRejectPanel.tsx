"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TIERS = ["D", "C", "B", "A", "S"] as const;

export function ApproveRejectPanel({
  profileId,
  currentStatus,
  currentTier,
}: {
  profileId: string;
  currentStatus: string;
  currentTier: string;
}) {
  const router = useRouter();
  const [tier, setTier] = useState<string>(currentTier);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(action: "APPROVED" | "REJECTED") {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/admin/applications/${profileId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, tier }),
    });
    if (res.ok) {
      router.push("/admin/applications");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <section className="rounded-xl border border-zinc-700 bg-zinc-900 p-5">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Review Decision
      </h2>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Assign Tier
        </label>
        <div className="flex gap-2">
          {TIERS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTier(t)}
              className={`h-10 w-10 rounded-lg text-sm font-bold transition-all ${
                tier === t
                  ? "bg-blue-500 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-zinc-600">
          D = entry level · C = developing · B = solid · A = advanced · S = elite
        </p>
      </div>

      {error && (
        <p className="mb-3 rounded-lg bg-red-900/40 px-3 py-2 text-xs text-red-400">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => submit("APPROVED")}
          disabled={loading}
          className="flex-1 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-500 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Approve"}
        </button>
        <button
          onClick={() => submit("REJECTED")}
          disabled={loading}
          className="flex-1 rounded-xl bg-red-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Reject"}
        </button>
      </div>

      {currentStatus !== "PENDING" && (
        <p className="mt-3 text-center text-xs text-zinc-600">
          Current status: <span className="text-zinc-400">{currentStatus}</span> — submitting will update it.
        </p>
      )}
    </section>
  );
}
