"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  PHOTOGRAPHY: "Photography",
  VIDEOGRAPHY: "Videography",
  VIDEO_EDITING: "Video Editing",
  PHOTO_EDITING: "Photo Editing",
  GRAPHIC_DESIGN: "Graphic Design",
  LIVE_STREAMING: "Live Streaming",
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProRate {
  id: string;
  category: string;
  hourlyRate: number | null;
  flatRate: number | null;
  notes: string | null;
}

export interface ProData {
  id: string;
  slug: string;
  bio: string | null;
  tier: string;
  avgRating: number;
  totalJobsCompleted: number;
  rates: ProRate[];
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

// ─── Hire Form ────────────────────────────────────────────────────────────────

export function HireForm({ pro }: { pro: ProData }) {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1
  const [category, setCategory] = useState("");

  // Step 2
  const [rateType, setRateType] = useState<"hourly" | "flat" | "">("");
  const [hours, setHours] = useState("");

  // Step 3
  const [jobType, setJobType] = useState<"ON_SITE" | "REMOTE">("ON_SITE");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [durationHours, setDurationHours] = useState("");
  const [deliveryDeadline, setDeliveryDeadline] = useState("");
  const [assetHandoffMethod, setAssetHandoffMethod] = useState<"PLATFORM_UPLOAD" | "EXTERNAL_LINK">("PLATFORM_UPLOAD");
  const [assetHandoffUrl, setAssetHandoffUrl] = useState("");
  const [description, setDescription] = useState("");

  const selectedRate = pro.rates.find((r) => r.category === category) ?? null;

  const confirmedRate = (() => {
    if (!selectedRate || !rateType) return null;
    if (rateType === "hourly") {
      const h = parseFloat(hours);
      if (!selectedRate.hourlyRate || isNaN(h) || h <= 0) return null;
      return selectedRate.hourlyRate * h;
    }
    if (rateType === "flat") {
      return selectedRate.flatRate ?? null;
    }
    return null;
  })();

  const deposit =
    confirmedRate !== null
      ? Math.round(confirmedRate * 0.25 * 100) / 100
      : null;

  function canProceedStep2() {
    if (!rateType) return false;
    if (rateType === "hourly") {
      const h = parseFloat(hours);
      return !isNaN(h) && h > 0;
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) {
      setError("Please describe what you need done.");
      return;
    }
    if (confirmedRate === null) {
      setError("Please complete all rate selections.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/instant-hire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proSlug: pro.slug,
          category,
          rateType,
          hours: rateType === "hourly" ? parseFloat(hours) : undefined,
          jobType,
          eventDate: jobType === "ON_SITE" && eventDate ? eventDate : undefined,
          location: jobType === "ON_SITE" && location ? location : undefined,
          durationHours:
            jobType === "ON_SITE" && durationHours
              ? parseFloat(durationHours)
              : undefined,
          deliveryDeadline:
            jobType === "REMOTE" && deliveryDeadline
              ? deliveryDeadline
              : undefined,
          assetHandoffMethod:
            jobType === "REMOTE" ? assetHandoffMethod : undefined,
          assetHandoffUrl:
            jobType === "REMOTE" && assetHandoffUrl
              ? assetHandoffUrl
              : undefined,
          description,
        }),
      });

      if (res.ok) {
        const { bookingId } = await res.json();
        router.push(`/bookings/${bookingId}`);
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none";
  const labelClass = "block text-sm font-semibold text-zinc-700 mb-2";
  const sectionClass = "rounded-2xl border border-zinc-200 bg-white p-6";

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <AdSlot zone="instant-hire-sidebar" />

      {/* Header */}
      <div className="mb-8">
        <a
          href={`/pros/${pro.slug}`}
          className="text-sm text-blue-500 hover:underline"
        >
          ← Back to profile
        </a>
        <h1 className="mt-3 text-3xl font-bold text-zinc-900">Instant Hire</h1>
        <p className="mt-1 text-zinc-500 text-sm">
          Book {pro.user.name} directly — no waiting for applications.
        </p>
      </div>

      {/* Pro Info Card */}
      <div className={`${sectionClass} mb-8 flex items-start gap-4`}>
        {pro.user.avatar ? (
          <img
            src={pro.user.avatar}
            alt={pro.user.name}
            className="h-16 w-16 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-blue-500">
              {pro.user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-bold text-zinc-900">{pro.user.name}</h2>
            <span className="rounded-full bg-zinc-900 px-2.5 py-0.5 text-xs font-bold text-white">
              Tier {pro.tier}
            </span>
          </div>
          {pro.avgRating > 0 && (
            <p className="mt-0.5 text-sm text-zinc-500">
              ★ {pro.avgRating.toFixed(1)} · {pro.totalJobsCompleted} jobs completed
            </p>
          )}
          {pro.bio && (
            <p className="mt-2 text-sm text-zinc-600 line-clamp-2">{pro.bio}</p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Step 1 — Category */}
        <div className={sectionClass}>
          <div className="flex items-center gap-3 mb-5">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shrink-0 ${
                category ? "bg-green-500" : "bg-blue-500"
              }`}
            >
              {category ? "✓" : "1"}
            </span>
            <h3 className="font-semibold text-zinc-900">Select a Category</h3>
          </div>

          <div>
            <label className={labelClass}>
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setRateType("");
                setHours("");
                if (e.target.value) setStep(Math.max(step, 2));
              }}
              className={inputClass}
            >
              <option value="">Choose a category…</option>
              {pro.rates.map((r) => (
                <option key={r.id} value={r.category}>
                  {CATEGORY_LABELS[r.category] || r.category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Step 2 — Rate Type */}
        {step >= 2 && category && selectedRate && (
          <div className={sectionClass}>
            <div className="flex items-center gap-3 mb-5">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shrink-0 ${
                  canProceedStep2() ? "bg-green-500" : "bg-blue-500"
                }`}
              >
                {canProceedStep2() ? "✓" : "2"}
              </span>
              <h3 className="font-semibold text-zinc-900">Select Rate Type</h3>
            </div>

            <div className="space-y-3">
              {selectedRate.hourlyRate !== null && (
                <button
                  type="button"
                  onClick={() => {
                    setRateType("hourly");
                    setStep(Math.max(step, 3));
                  }}
                  className={`w-full flex items-center justify-between rounded-xl border px-5 py-4 text-sm transition-all ${
                    rateType === "hourly"
                      ? "border-blue-500 bg-blue-50"
                      : "border-zinc-200 bg-white hover:border-blue-300"
                  }`}
                >
                  <div className="text-left">
                    <p className="font-semibold text-zinc-900">Hourly Rate</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      ${selectedRate.hourlyRate.toFixed(2)} / hour
                    </p>
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      rateType === "hourly"
                        ? "border-blue-500 bg-blue-500"
                        : "border-zinc-300"
                    }`}
                  >
                    {rateType === "hourly" && (
                      <div className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>
                </button>
              )}

              {selectedRate.flatRate !== null && (
                <button
                  type="button"
                  onClick={() => {
                    setRateType("flat");
                    setStep(Math.max(step, 3));
                  }}
                  className={`w-full flex items-center justify-between rounded-xl border px-5 py-4 text-sm transition-all ${
                    rateType === "flat"
                      ? "border-blue-500 bg-blue-50"
                      : "border-zinc-200 bg-white hover:border-blue-300"
                  }`}
                >
                  <div className="text-left">
                    <p className="font-semibold text-zinc-900">Flat Rate</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      ${selectedRate.flatRate.toFixed(2)} total
                    </p>
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      rateType === "flat"
                        ? "border-blue-500 bg-blue-500"
                        : "border-zinc-300"
                    }`}
                  >
                    {rateType === "flat" && (
                      <div className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>
                </button>
              )}
            </div>

            {rateType === "hourly" && (
              <div className="mt-4">
                <label className={labelClass}>
                  Number of Hours <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  placeholder="e.g. 4"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className={inputClass}
                />
                {hours && parseFloat(hours) > 0 && selectedRate.hourlyRate && (
                  <p className="mt-2 text-sm font-medium text-zinc-700">
                    Subtotal:{" "}
                    <span className="text-zinc-900 font-bold">
                      ${(selectedRate.hourlyRate * parseFloat(hours)).toFixed(2)}
                    </span>
                  </p>
                )}
              </div>
            )}

            {selectedRate.notes && (
              <p className="mt-3 text-xs text-zinc-400 italic">
                {selectedRate.notes}
              </p>
            )}
          </div>
        )}

        {/* Step 3 — Job Details */}
        {step >= 3 && rateType && (
          <div className={sectionClass}>
            <div className="flex items-center gap-3 mb-5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white shrink-0">
                3
              </span>
              <h3 className="font-semibold text-zinc-900">Job Details</h3>
            </div>

            {/* Job Type Toggle */}
            <div className="mb-5">
              <label className={labelClass}>Job Type</label>
              <div className="flex gap-3">
                {(["ON_SITE", "REMOTE"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setJobType(t)}
                    className={`rounded-xl border px-5 py-2.5 text-sm font-medium transition-all ${
                      jobType === t
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-zinc-300 bg-white text-zinc-700 hover:border-blue-400"
                    }`}
                  >
                    {t === "ON_SITE" ? "On-site" : "Remote"}
                  </button>
                ))}
              </div>
            </div>

            {/* ON_SITE fields */}
            {jobType === "ON_SITE" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Event Date</label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Duration (hours)</label>
                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      placeholder="e.g. 4"
                      value={durationHours}
                      onChange={(e) => setDurationHours(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Springfield, VA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {/* REMOTE fields */}
            {jobType === "REMOTE" && (
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Delivery Deadline</label>
                  <input
                    type="date"
                    value={deliveryDeadline}
                    onChange={(e) => setDeliveryDeadline(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Asset Handoff Method</label>
                  <select
                    value={assetHandoffMethod}
                    onChange={(e) =>
                      setAssetHandoffMethod(
                        e.target.value as "PLATFORM_UPLOAD" | "EXTERNAL_LINK"
                      )
                    }
                    className={inputClass}
                  >
                    <option value="PLATFORM_UPLOAD">Platform Upload</option>
                    <option value="EXTERNAL_LINK">External Link</option>
                  </select>
                </div>
                {assetHandoffMethod === "EXTERNAL_LINK" && (
                  <div>
                    <label className={labelClass}>Handoff URL (optional)</label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/…"
                      value={assetHandoffUrl}
                      onChange={(e) => setAssetHandoffUrl(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="mt-5">
              <label className={labelClass}>
                What do you need done? <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Describe what you need, any specific requirements, deliverables, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        )}

        {/* Booking Summary */}
        {step >= 3 &&
          rateType &&
          confirmedRate !== null &&
          deposit !== null && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
              <h3 className="font-semibold text-zinc-900 mb-3">
                Booking Summary
              </h3>
              <div className="space-y-1.5 text-sm text-zinc-700">
                <div className="flex justify-between">
                  <span>Pro</span>
                  <span className="font-medium">{pro.user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category</span>
                  <span className="font-medium">
                    {CATEGORY_LABELS[category] || category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Rate type</span>
                  <span className="font-medium capitalize">{rateType}</span>
                </div>
                {rateType === "hourly" && hours && (
                  <div className="flex justify-between">
                    <span>Hours</span>
                    <span className="font-medium">{hours}</span>
                  </div>
                )}
                <div className="mt-2 pt-2 border-t border-blue-200 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-zinc-900">
                    ${confirmedRate.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Deposit due now (25%)</span>
                  <span className="font-bold text-blue-700">
                    ${deposit.toFixed(2)}
                  </span>
                </div>
                <p className="mt-2 text-xs text-zinc-400">
                  You'll be charged ${deposit.toFixed(2)} deposit today.
                  Remaining ${(confirmedRate - deposit).toFixed(2)} is due after delivery.
                </p>
              </div>
            </div>
          )}

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {step >= 3 && rateType && (
          <button
            type="submit"
            disabled={
              loading ||
              !category ||
              !canProceedStep2() ||
              !description.trim() ||
              confirmedRate === null
            }
            className="w-full rounded-xl bg-blue-500 px-6 py-4 text-base font-semibold text-white transition-all hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Booking…"
              : deposit !== null
              ? `Book Now — $${deposit.toFixed(2)} deposit`
              : "Book Now"}
          </button>
        )}
      </form>
    </div>
  );
}
