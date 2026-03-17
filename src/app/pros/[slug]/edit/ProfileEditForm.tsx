"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@prisma/client";

const ALL_CATEGORIES: Category[] = [
  "PHOTOGRAPHY",
  "VIDEOGRAPHY",
  "VIDEO_EDITING",
  "PHOTO_EDITING",
  "GRAPHIC_DESIGN",
  "LIVE_STREAMING",
];

const CATEGORY_LABELS: Record<Category, string> = {
  PHOTOGRAPHY: "Photography",
  VIDEOGRAPHY: "Videography",
  VIDEO_EDITING: "Video Editing",
  PHOTO_EDITING: "Photo Editing",
  GRAPHIC_DESIGN: "Graphic Design",
  LIVE_STREAMING: "Live Streaming",
};

interface RateInput {
  category: Category;
  hourlyRate?: number;
  flatRate?: number;
}

interface ProfileEditFormProps {
  slug: string;
  initialData: {
    bio: string;
    specialties: Category[];
    equipment: string;
    portfolioUrls: [string, string, string, string, string];
    twitter: string;
    instagram: string;
    website: string;
    serviceArea: string;
    market: string;
    state: string;
    willingToTravel: boolean;
    instantHireEnabled: boolean;
    rates: RateInput[];
  };
}

export function ProfileEditForm({ slug, initialData }: ProfileEditFormProps) {
  const router = useRouter();

  const [bio, setBio] = useState(initialData.bio);
  const [specialties, setSpecialties] = useState<Category[]>(
    initialData.specialties
  );
  const [equipment, setEquipment] = useState(initialData.equipment);
  const [portfolioUrls, setPortfolioUrls] = useState<
    [string, string, string, string, string]
  >(initialData.portfolioUrls);
  const [twitter, setTwitter] = useState(initialData.twitter);
  const [instagram, setInstagram] = useState(initialData.instagram);
  const [website, setWebsite] = useState(initialData.website);
  const [serviceArea, setServiceArea] = useState(initialData.serviceArea);
  const [market, setMarket] = useState(initialData.market);
  const [state, setState] = useState(initialData.state);
  const [willingToTravel, setWillingToTravel] = useState(
    initialData.willingToTravel
  );
  const [instantHireEnabled, setInstantHireEnabled] = useState(
    initialData.instantHireEnabled
  );

  // Rates keyed by category
  const initialRatesMap: Record<string, RateInput> = {};
  for (const r of initialData.rates) {
    initialRatesMap[r.category] = r;
  }
  const [ratesMap, setRatesMap] = useState<Record<string, RateInput>>(
    initialRatesMap
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleSpecialty(cat: Category) {
    setSpecialties((prev) =>
      prev.includes(cat) ? prev.filter((s) => s !== cat) : [...prev, cat]
    );
  }

  function setPortfolioUrl(index: number, value: string) {
    setPortfolioUrls((prev) => {
      const next = [...prev] as [string, string, string, string, string];
      next[index] = value;
      return next;
    });
  }

  function setRate(
    cat: Category,
    field: "hourlyRate" | "flatRate",
    value: string
  ) {
    const num = value === "" ? undefined : parseFloat(value);
    setRatesMap((prev) => ({
      ...prev,
      [cat]: {
        ...prev[cat],
        category: cat,
        [field]: isNaN(num as number) ? undefined : num,
      },
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const rates = Object.values(ratesMap).filter(
      (r) => r.hourlyRate != null || r.flatRate != null
    );

    try {
      const res = await fetch(`/api/pros/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio,
          specialties,
          equipment,
          portfolioUrls: portfolioUrls.filter(Boolean),
          socialLinks: {
            ...(twitter ? { twitter } : {}),
            ...(instagram ? { instagram } : {}),
            ...(website ? { website } : {}),
          },
          serviceArea,
          market,
          state,
          willingToTravel,
          instantHireEnabled,
          rates,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to save profile.");
      }

      router.push(`/pros/${slug}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Bio */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4">
        <h2 className="text-sm font-semibold text-zinc-900">About</h2>

        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-500">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Tell clients about yourself, your style, and your experience..."
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-400 focus:outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-500">
              Market
            </label>
            <input
              type="text"
              value={market}
              onChange={(e) => setMarket(e.target.value)}
              placeholder="e.g. DMV"
              className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-500">
              State
            </label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="e.g. VA"
              maxLength={2}
              className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-500">
            Service Area
          </label>
          <input
            type="text"
            value={serviceArea}
            onChange={(e) => setServiceArea(e.target.value)}
            placeholder="e.g. Northern Virginia, DC Metro Area"
            className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-400 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={willingToTravel}
              onChange={(e) => setWillingToTravel(e.target.checked)}
              className="h-4 w-4 rounded accent-blue-500"
            />
            <span className="text-sm text-zinc-700">Willing to travel</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={instantHireEnabled}
              onChange={(e) => setInstantHireEnabled(e.target.checked)}
              className="h-4 w-4 rounded accent-blue-500"
            />
            <span className="text-sm text-zinc-700">
              Enable Instant Hire (clients can hire you directly)
            </span>
          </label>
        </div>
      </section>

      {/* Specialties */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-zinc-900">
          Specialties
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {ALL_CATEGORIES.map((cat) => (
            <label
              key={cat}
              className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                specialties.includes(cat)
                  ? "border-blue-300 bg-blue-50 text-blue-800"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
              }`}
            >
              <input
                type="checkbox"
                checked={specialties.includes(cat)}
                onChange={() => toggleSpecialty(cat)}
                className="h-4 w-4 accent-blue-500"
              />
              {CATEGORY_LABELS[cat]}
            </label>
          ))}
        </div>
      </section>

      {/* Equipment */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-1 text-sm font-semibold text-zinc-900">Equipment</h2>
        <p className="mb-3 text-xs text-zinc-400">
          Comma-separated list of gear you own.
        </p>
        <textarea
          value={equipment}
          onChange={(e) => setEquipment(e.target.value)}
          rows={3}
          placeholder="Sony A7 IV, DJI Mavic 3, Adobe Premiere Pro..."
          className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-400 focus:outline-none resize-none"
        />
      </section>

      {/* Portfolio URLs */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-3">
        <h2 className="text-sm font-semibold text-zinc-900">
          Portfolio URLs
        </h2>
        {portfolioUrls.map((url, i) => (
          <div key={i}>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Link {i + 1}
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setPortfolioUrl(i, e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-400 focus:outline-none"
            />
          </div>
        ))}
      </section>

      {/* Social Links */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-3">
        <h2 className="text-sm font-semibold text-zinc-900">Social Links</h2>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-400">
            Twitter / X
          </label>
          <input
            type="url"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
            placeholder="https://twitter.com/yourhandle"
            className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-400">
            Instagram
          </label>
          <input
            type="url"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="https://instagram.com/yourhandle"
            className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-400">
            Website
          </label>
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://yourwebsite.com"
            className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-400 focus:outline-none"
          />
        </div>
      </section>

      {/* Rates */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-1 text-sm font-semibold text-zinc-900">
          Service Rates
        </h2>
        <p className="mb-4 text-xs text-zinc-400">
          Set rates for categories you offer. Leave blank to omit a category.
        </p>
        <div className="space-y-4">
          {ALL_CATEGORIES.map((cat) => {
            const rate = ratesMap[cat];
            return (
              <div key={cat}>
                <p className="mb-1.5 text-xs font-semibold text-zinc-500">
                  {CATEGORY_LABELS[cat]}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs text-zinc-400">
                      Hourly ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={rate?.hourlyRate ?? ""}
                      onChange={(e) =>
                        setRate(cat, "hourlyRate", e.target.value)
                      }
                      placeholder="—"
                      className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-300 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-zinc-400">
                      Flat Rate ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={rate?.flatRate ?? ""}
                      onChange={(e) =>
                        setRate(cat, "flatRate", e.target.value)
                      }
                      placeholder="—"
                      className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-300 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Submit */}
      <div className="flex items-center gap-3 pb-8">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
        <a
          href={`/pros/${slug}`}
          className="text-sm text-zinc-400 hover:text-zinc-600"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
