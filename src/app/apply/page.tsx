"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";

const SPECIALTIES = [
  { value: "PHOTOGRAPHY", label: "Photography" },
  { value: "VIDEOGRAPHY", label: "Videography" },
  { value: "VIDEO_EDITING", label: "Video Editing" },
  { value: "PHOTO_EDITING", label: "Photo Editing" },
  { value: "GRAPHIC_DESIGN", label: "Graphic Design" },
  { value: "LIVE_STREAMING", label: "Live Streaming" },
];

export default function ApplyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    bio: "",
    specialties: [] as string[],
    equipment: "",
    portfolioUrls: "",
    instagram: "",
    website: "",
    youtube: "",
    serviceArea: "",
    willingToTravel: false,
  });

  function toggleSpecialty(value: string) {
    setForm((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(value)
        ? prev.specialties.filter((s) => s !== value)
        : [...prev.specialties, value],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.specialties.length === 0) {
      setError("Select at least one specialty.");
      return;
    }
    if (!form.bio.trim()) {
      setError("Bio is required.");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bio: form.bio,
        specialties: form.specialties,
        equipment: form.equipment
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        portfolioUrls: form.portfolioUrls
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        socialLinks: {
          instagram: form.instagram,
          website: form.website,
          youtube: form.youtube,
        },
        serviceArea: form.serviceArea,
        willingToTravel: form.willingToTravel,
      }),
    });

    if (res.ok) {
      router.push("/apply/submitted");
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <AdSlot zone="apply-top" />
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-3xl font-bold text-zinc-900">Apply as a Media Pro</h1>
        <p className="mt-2 text-zinc-500">
          Tell us about yourself. Our team reviews every application and assigns your tier within 3–5 business days.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">

          {/* Specialties */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-3">
              Specialties <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {SPECIALTIES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => toggleSpecialty(s.value)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                    form.specialties.includes(s.value)
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-zinc-300 bg-white text-zinc-700 hover:border-blue-400"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">
              Bio <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Tell clients about yourself, your style, and your experience..."
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Portfolio URLs */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">
              Portfolio Links
            </label>
            <p className="mb-2 text-xs text-zinc-400">One URL per line (Google Drive, Dropbox, website, etc.)</p>
            <textarea
              rows={3}
              placeholder={"https://yourportfolio.com\nhttps://drive.google.com/..."}
              value={form.portfolioUrls}
              onChange={(e) => setForm({ ...form, portfolioUrls: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Equipment */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">
              Equipment
            </label>
            <p className="mb-2 text-xs text-zinc-400">One item per line (e.g. Sony A7 IV, DJI Mavic 3, Adobe Premiere)</p>
            <textarea
              rows={4}
              placeholder={"Sony A7 IV\nDJI Mavic 3 Pro\nGodox AD400 Pro\nAdobe Premiere Pro"}
              value={form.equipment}
              onChange={(e) => setForm({ ...form, equipment: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Social Links */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-3">
              Social & Web Links
            </label>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Instagram URL"
                value={form.instagram}
                onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Website URL"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="YouTube URL"
                value={form.youtube}
                onChange={(e) => setForm({ ...form, youtube: e.target.value })}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Service Area */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">
              Service Area
            </label>
            <input
              type="text"
              placeholder="e.g. Northern Virginia, DMV, Washington DC"
              value={form.serviceArea}
              onChange={(e) => setForm({ ...form, serviceArea: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Willing to Travel */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="travel"
              checked={form.willingToTravel}
              onChange={(e) => setForm({ ...form, willingToTravel: e.target.checked })}
              className="h-4 w-4 rounded border-zinc-300 text-blue-500"
            />
            <label htmlFor="travel" className="text-sm text-zinc-700">
              I&apos;m willing to travel outside my service area
            </label>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-500 px-6 py-4 text-base font-semibold text-white transition-all hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}
