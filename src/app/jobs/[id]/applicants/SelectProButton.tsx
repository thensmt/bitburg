"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SelectProButton({
  jobId,
  applicationId,
  proName,
  rate,
}: {
  jobId: string;
  applicationId: string;
  proName: string;
  rate: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSelect() {
    if (
      !confirm(
        `Select ${proName} for $${rate.toLocaleString()}? All other applicants will be notified they weren't selected.`
      )
    )
      return;

    setLoading(true);
    setError("");

    const res = await fetch(`/api/jobs/${jobId}/select`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleSelect}
        disabled={loading}
        className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Selecting..." : `Select ${proName}`}
      </button>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
