import { db } from "@/lib/db";
import { AdSlot } from "@/components/AdSlot";
import Link from "next/link";
import type { Category, Tier } from "@/generated/prisma";

const CATEGORY_LABELS: Record<Category, string> = {
  PHOTOGRAPHY: "Photography",
  VIDEOGRAPHY: "Videography",
  VIDEO_EDITING: "Video Editing",
  PHOTO_EDITING: "Photo Editing",
  GRAPHIC_DESIGN: "Graphic Design",
  LIVE_STREAMING: "Live Streaming",
};

const TIER_COLORS: Record<Tier, string> = {
  D: "bg-zinc-100 text-zinc-600",
  C: "bg-blue-100 text-blue-700",
  B: "bg-purple-100 text-purple-700",
  A: "bg-orange-100 text-orange-700",
  S: "bg-yellow-100 text-yellow-700",
};

const ALL_CATEGORIES: Category[] = [
  "PHOTOGRAPHY",
  "VIDEOGRAPHY",
  "VIDEO_EDITING",
  "PHOTO_EDITING",
  "GRAPHIC_DESIGN",
  "LIVE_STREAMING",
];

const ALL_TIERS: Tier[] = ["D", "C", "B", "A", "S"];

export default async function ProsDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    tier?: string;
    market?: string;
    instantHireOnly?: string;
  }>;
}) {
  const filters = await searchParams;

  const category = filters.category as Category | undefined;
  const tier = filters.tier as Tier | undefined;
  const market = filters.market;
  const instantHireOnly = filters.instantHireOnly === "true";

  const pros = await db.proProfile.findMany({
    where: {
      applicationStatus: "APPROVED",
      ...(category ? { specialties: { has: category } } : {}),
      ...(tier ? { tier } : {}),
      ...(market ? { market } : {}),
      ...(instantHireOnly ? { instantHireEnabled: true } : {}),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      rates: true,
    },
    orderBy: [{ avgRating: "desc" }, { totalJobsCompleted: "desc" }],
  });

  function buildFilterUrl(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const merged = {
      ...(category ? { category } : {}),
      ...(tier ? { tier } : {}),
      ...(market ? { market } : {}),
      ...(instantHireOnly ? { instantHireOnly: "true" } : {}),
      ...overrides,
    };
    for (const [key, val] of Object.entries(merged)) {
      if (val) params.set(key, val);
    }
    const str = params.toString();
    return `/pros${str ? `?${str}` : ""}`;
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <AdSlot zone="pros-directory-top" />

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">Pro Directory</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Find vetted media professionals in the DMV area.
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar filters */}
          <aside className="w-full shrink-0 lg:w-56">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-6">
              {/* Category filter */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Category
                </p>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href={buildFilterUrl({ category: undefined })}
                      className={`block rounded-lg px-3 py-1.5 text-sm ${
                        !category
                          ? "bg-zinc-100 font-semibold text-zinc-900"
                          : "text-zinc-600 hover:bg-zinc-50"
                      }`}
                    >
                      All
                    </Link>
                  </li>
                  {ALL_CATEGORIES.map((cat) => (
                    <li key={cat}>
                      <Link
                        href={buildFilterUrl({ category: cat })}
                        className={`block rounded-lg px-3 py-1.5 text-sm ${
                          category === cat
                            ? "bg-zinc-100 font-semibold text-zinc-900"
                            : "text-zinc-600 hover:bg-zinc-50"
                        }`}
                      >
                        {CATEGORY_LABELS[cat]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tier filter */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Tier
                </p>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href={buildFilterUrl({ tier: undefined })}
                      className={`block rounded-lg px-3 py-1.5 text-sm ${
                        !tier
                          ? "bg-zinc-100 font-semibold text-zinc-900"
                          : "text-zinc-600 hover:bg-zinc-50"
                      }`}
                    >
                      All tiers
                    </Link>
                  </li>
                  {ALL_TIERS.map((t) => (
                    <li key={t}>
                      <Link
                        href={buildFilterUrl({ tier: t })}
                        className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${
                          tier === t
                            ? "bg-zinc-100 font-semibold text-zinc-900"
                            : "text-zinc-600 hover:bg-zinc-50"
                        }`}
                      >
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-bold ${TIER_COLORS[t]}`}
                        >
                          {t}
                        </span>
                        Tier {t}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instant hire toggle */}
              <div>
                <Link
                  href={buildFilterUrl({
                    instantHireOnly: instantHireOnly ? undefined : "true",
                  })}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    instantHireOnly
                      ? "bg-blue-50 text-blue-700"
                      : "text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded border-2 flex items-center justify-center ${
                      instantHireOnly
                        ? "border-blue-500 bg-blue-500"
                        : "border-zinc-300"
                    }`}
                  >
                    {instantHireOnly && (
                      <svg
                        viewBox="0 0 10 10"
                        className="h-2.5 w-2.5 text-white"
                        fill="currentColor"
                      >
                        <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  Instant Hire only
                </Link>
              </div>
            </div>
          </aside>

          {/* Pro grid */}
          <main className="flex-1">
            {pros.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-white px-8 py-16 text-center">
                <p className="text-zinc-500">No pros match your filters.</p>
                <Link
                  href="/pros"
                  className="mt-3 inline-block text-sm text-blue-500 hover:underline"
                >
                  Clear filters
                </Link>
              </div>
            ) : (
              <>
                <p className="mb-4 text-sm text-zinc-400">
                  {pros.length} pro{pros.length !== 1 ? "s" : ""} found
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {pros.map((pro) => (
                    <div
                      key={pro.id}
                      className="rounded-2xl border border-zinc-200 bg-white p-5 flex flex-col gap-3 hover:shadow-sm transition-shadow"
                    >
                      {/* Avatar + name */}
                      <div className="flex items-center gap-3">
                        {pro.user.avatar ? (
                          <img
                            src={pro.user.avatar}
                            alt={pro.user.name}
                            className="h-11 w-11 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-11 w-11 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-500 text-base font-semibold">
                            {pro.user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-zinc-900">
                            {pro.user.name}
                          </p>
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${TIER_COLORS[pro.tier]}`}
                          >
                            Tier {pro.tier}
                          </span>
                        </div>
                      </div>

                      {/* Specialties */}
                      {pro.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {pro.specialties.slice(0, 3).map((s) => (
                            <span
                              key={s}
                              className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600"
                            >
                              {CATEGORY_LABELS[s]}
                            </span>
                          ))}
                          {pro.specialties.length > 3 && (
                            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-400">
                              +{pro.specialties.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Rating + jobs */}
                      <div className="flex items-center gap-3 text-xs text-zinc-400">
                        {pro.avgRating > 0 && (
                          <span>
                            <span className="text-yellow-500">★</span>{" "}
                            {pro.avgRating.toFixed(1)}
                          </span>
                        )}
                        {pro.totalJobsCompleted > 0 && (
                          <span>{pro.totalJobsCompleted} jobs</span>
                        )}
                        {pro.instantHireEnabled && (
                          <span className="rounded-full bg-green-50 px-2 py-0.5 text-green-700 font-medium">
                            Instant Hire
                          </span>
                        )}
                      </div>

                      {/* CTA */}
                      {pro.slug && (
                        <Link
                          href={`/pros/${pro.slug}`}
                          className="mt-auto block rounded-xl bg-zinc-900 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-zinc-700"
                        >
                          View Profile
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
            <AdSlot zone="pros-directory-bottom" className="mt-8 h-16 w-full" />
          </main>
        </div>
      </div>
    </div>
  );
}
