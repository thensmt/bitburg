"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DisputeForm({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [evidence, setEvidence] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Please provide a reason for the dispute.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/dispute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: reason.trim(),
          evidence: evidence.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong.");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl border border-orange-200 bg-orange-50 px-5 py-2.5 text-sm font-semibold text-orange-700 hover:bg-orange-100 transition-colors"
      >
        Open Dispute
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6">
      <h2 className="text-sm font-semibold text-orange-800 mb-1">Open a Dispute</h2>
      <p className="text-xs text-orange-600 mb-4">
        Disputes will be reviewed by the Bitburg team. Provide as much detail as possible.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-orange-700 mb-1 block">
            Reason <span className="text-orange-400">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            required
            placeholder="Describe the issue…"
            className="w-full rounded-xl border border-orange-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-300 focus:border-orange-400 focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-orange-700 mb-1 block">
            Evidence <span className="text-orange-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            rows={3}
            placeholder="Links, screenshots, timestamps, or other supporting details…"
            className="w-full rounded-xl border border-orange-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-300 focus:border-orange-400 focus:outline-none resize-none"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Submitting…" : "Submit Dispute"}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-xl border border-orange-200 px-5 py-2.5 text-sm font-semibold text-orange-700 hover:bg-orange-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
