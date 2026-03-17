import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { AdSlot } from "@/components/AdSlot";
import Link from "next/link";
import type { Category, Tier } from "@prisma/client";

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

export default async function ProPublicProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { userId: clerkId } = await auth();

  const pro = await db.proProfile.findUnique({
    where: { slug },
    include: {
      user: true,
      rates: { orderBy: { category: "asc" } },
    },
  });

  if (!pro || pro.applicationStatus !== "APPROVED") notFound();

  // Fetch reviews for this pro (reviewee = pro.user)
  const reviews = await db.review.findMany({
    where: { revieweeId: pro.userId },
    include: {
      reviewer: { select: { name: true, avatar: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  // Determine ownership
  let isOwner = false;
  if (clerkId) {
    const viewer = await db.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });
    isOwner = viewer?.id === pro.userId;
  }

  const socialLinks = pro.socialLinks as {
    twitter?: string;
    instagram?: string;
    website?: string;
  } | null;

  return (
    <div className="min-h-screen bg-zinc-50">
      <AdSlot zone="pro-profile-top" />

      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link href="/pros" className="text-sm text-zinc-400 hover:text-zinc-600">
          ← Back to directory
        </Link>

        {/* Header card */}
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            {/* Avatar */}
            {pro.user.avatar ? (
              <img
                src={pro.user.avatar}
                alt={pro.user.name}
                className="h-24 w-24 rounded-2xl object-cover shrink-0"
              />
            ) : (
              <div className="h-24 w-24 rounded-2xl bg-zinc-200 flex items-center justify-center text-zinc-500 text-3xl font-bold shrink-0">
                {pro.user.name.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-zinc-900">
                  {pro.user.name}
                </h1>
                <span
                  className={`rounded-full px-3 py-0.5 text-sm font-bold ${TIER_COLORS[pro.tier]}`}
                >
                  Tier {pro.tier}
                </span>
                {pro.instantHireEnabled && (
                  <span className="rounded-full bg-green-50 px-3 py-0.5 text-sm font-semibold text-green-700">
                    Instant Hire
                  </span>
                )}
              </div>

              {/* Rating + stats */}
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-zinc-500">
                {pro.avgRating > 0 && (
                  <span>
                    <span className="text-yellow-500">★</span>{" "}
                    {pro.avgRating.toFixed(1)} rating
                  </span>
                )}
                {pro.totalJobsCompleted > 0 && (
                  <span>{pro.totalJobsCompleted} jobs completed</span>
                )}
                {pro.serviceArea && <span>{pro.serviceArea}</span>}
                {pro.market && <span>{pro.market}</span>}
                {pro.willingToTravel && (
                  <span className="text-blue-500">Willing to travel</span>
                )}
              </div>

              {/* Bio */}
              {pro.bio && (
                <p className="mt-4 text-sm leading-relaxed text-zinc-700">
                  {pro.bio}
                </p>
              )}

              {/* Social links */}
              {socialLinks && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {socialLinks.twitter && (
                    <a
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      Twitter
                    </a>
                  )}
                  {socialLinks.instagram && (
                    <a
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-pink-500 hover:underline"
                    >
                      Instagram
                    </a>
                  )}
                  {socialLinks.website && (
                    <a
                      href={socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-zinc-500 hover:underline"
                    >
                      Website
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2 shrink-0">
              {isOwner ? (
                <Link
                  href={`/pros/${slug}/edit`}
                  className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-center text-sm font-semibold text-zinc-700 hover:border-zinc-400"
                >
                  Edit Profile
                </Link>
              ) : pro.instantHireEnabled ? (
                <Link
                  href={`/pros/${slug}/hire`}
                  className="rounded-xl bg-blue-500 px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-600"
                >
                  Hire Now
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Specialties */}
          {pro.specialties.length > 0 && (
            <section className="rounded-2xl border border-zinc-200 bg-white p-6">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
                Specialties
              </h2>
              <div className="flex flex-wrap gap-2">
                {pro.specialties.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700"
                  >
                    {CATEGORY_LABELS[s]}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Equipment */}
          {pro.equipment.length > 0 && (
            <section className="rounded-2xl border border-zinc-200 bg-white p-6">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
                Equipment
              </h2>
              <ul className="space-y-1">
                {pro.equipment.map((item, i) => (
                  <li key={i} className="text-sm text-zinc-700">
                    • {item}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Rates table */}
        {pro.rates.length > 0 && (
          <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-400">
              Rates
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 text-left">
                    <th className="pb-2 font-medium text-zinc-500">Category</th>
                    <th className="pb-2 font-medium text-zinc-500">Hourly</th>
                    <th className="pb-2 font-medium text-zinc-500">Flat Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {pro.rates.map((rate) => (
                    <tr
                      key={rate.id}
                      className="border-b border-zinc-50 last:border-0"
                    >
                      <td className="py-2.5 font-medium text-zinc-800">
                        {CATEGORY_LABELS[rate.category]}
                      </td>
                      <td className="py-2.5 text-zinc-600">
                        {rate.hourlyRate != null
                          ? `$${rate.hourlyRate}/hr`
                          : "—"}
                      </td>
                      <td className="py-2.5 text-zinc-600">
                        {rate.flatRate != null ? `$${rate.flatRate}` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Portfolio */}
        {pro.portfolioUrls.length > 0 && (
          <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
              Portfolio
            </h2>
            <ul className="space-y-2">
              {pro.portfolioUrls.map((url, i) => (
                <li key={i}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline break-all"
                  >
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-400">
              Reviews
            </h2>
            <ul className="space-y-4">
              {reviews.map((review) => (
                <li
                  key={review.id}
                  className="border-b border-zinc-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    {review.reviewer.avatar ? (
                      <img
                        src={review.reviewer.avatar}
                        alt={review.reviewer.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-semibold text-zinc-500">
                        {review.reviewer.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-zinc-800">
                        {review.reviewer.name}
                      </p>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < review.rating
                                ? "text-yellow-400"
                                : "text-zinc-200"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {review.body && (
                    <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                      {review.body}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-zinc-400">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <AdSlot zone="pro-profile-bottom" className="mt-8 h-16 w-full" />
      </div>
    </div>
  );
}
