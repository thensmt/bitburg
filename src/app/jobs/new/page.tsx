"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";

const CATEGORIES = [
  { value: "PHOTOGRAPHY", label: "Photography" },
  { value: "VIDEOGRAPHY", label: "Videography" },
  { value: "VIDEO_EDITING", label: "Video Editing" },
  { value: "PHOTO_EDITING", label: "Photo Editing" },
  { value: "GRAPHIC_DESIGN", label: "Graphic Design" },
  { value: "LIVE_STREAMING", label: "Live Streaming" },
];

const TIERS = [
  { value: "D", label: "D — Any pro" },
  { value: "C", label: "C — Developing" },
  { value: "B", label: "B — Solid" },
  { value: "A", label: "A — Advanced" },
  { value: "S", label: "S — Elite only" },
];

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    jobType: "ON_SITE" as "ON_SITE" | "REMOTE",
    eventDate: "",
    durationHours: "",
    location: "",
    city: "",
    state: "",
    market: "DMV",
    eventType: "",
    deliveryDeadline: "",
    budget: "",
    applicationDeadline: "",
    minTierRequired: "D",
  });

  function set(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.description || !form.category || !form.budget || !form.applicationDeadline) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        budget: parseFloat(form.budget),
        durationHours: form.durationHours ? parseFloat(form.durationHours) : null,
        eventDate: form.eventDate || null,
        deliveryDeadline: form.deliveryDeadline || null,
        location: form.location || null,
        city: form.city || null,
        state: form.state || null,
        eventType: form.eventType || null,
      }),
    });

    if (res.ok) {
      const { id } = await res.json();
      router.push(`/jobs/${id}`);
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none";
  const labelClass = "block text-sm font-semibold text-zinc-700 mb-2";

  return (
    <div className="min-h-screen bg-zinc-50">
      <AdSlot zone="jobs-new-top" />
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-3xl font-bold text-zinc-900">Post a Job</h1>
        <p className="mt-2 text-zinc-500">
          Describe what you need. Approved pros will apply within your deadline.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          {/* Title */}
          <div>
            <label className={labelClass}>
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Photographer for youth basketball tournament"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Category */}
          <div>
            <label className={labelClass}>
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className={inputClass}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Event Type */}
          <div>
            <label className={labelClass}>Event Type / Sport</label>
            <input
              type="text"
              placeholder="e.g. Basketball, Football, Cheer, Wrestling, Corporate, Concert"
              value={form.eventType}
              onChange={(e) => set("eventType", e.target.value)}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-zinc-400">Helps pros find the right jobs and improves ad targeting.</p>
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={5}
              placeholder="Describe the job, what deliverables you expect, any specific requirements..."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Job Type */}
          <div>
            <label className={labelClass}>Job Type</label>
            <div className="flex gap-3">
              {[
                { value: "ON_SITE", label: "On-site" },
                { value: "REMOTE", label: "Remote" },
              ].map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => set("jobType", t.value)}
                  className={`rounded-xl border px-5 py-2.5 text-sm font-medium transition-all ${
                    form.jobType === t.value
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-zinc-300 bg-white text-zinc-700 hover:border-blue-400"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Event Date + Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Event Date</label>
              <input
                type="date"
                value={form.eventDate}
                onChange={(e) => set("eventDate", e.target.value)}
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
                value={form.durationHours}
                onChange={(e) => set("durationHours", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Location */}
          {form.jobType === "ON_SITE" && (
            <div>
              <label className={labelClass}>Location</label>
              <input
                type="text"
                placeholder="e.g. Springfield, VA"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                className={inputClass}
              />
            </div>
          )}

          {/* Budget */}
          <div>
            <label className={labelClass}>
              Budget ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 500"
              value={form.budget}
              onChange={(e) => set("budget", e.target.value)}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-zinc-400">
              Pros can accept or counter this rate.
            </p>
          </div>

          {/* Delivery Deadline */}
          <div>
            <label className={labelClass}>Delivery Deadline</label>
            <input
              type="date"
              value={form.deliveryDeadline}
              onChange={(e) => set("deliveryDeadline", e.target.value)}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-zinc-400">
              When you need the final deliverables by.
            </p>
          </div>

          {/* Application Deadline */}
          <div>
            <label className={labelClass}>
              Application Deadline <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.applicationDeadline}
              onChange={(e) => set("applicationDeadline", e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Min Tier */}
          <div>
            <label className={labelClass}>Minimum Pro Tier</label>
            <select
              value={form.minTierRequired}
              onChange={(e) => set("minTierRequired", e.target.value)}
              className={inputClass}
            >
              {TIERS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-zinc-400">
              Only pros at or above this tier can apply.
            </p>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-500 px-6 py-4 text-base font-semibold text-white transition-all hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
}
