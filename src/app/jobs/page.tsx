import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { AdSlot } from "@/components/AdSlot";
import Link from "next/link";
import type { Tier } from "@prisma/client";

const TIER_ORDER: Tier[] = ["D", "C", "B", "A", "S"];

const CATEGORY_LABELS: Record<string, string> = {
  PHOTOGRAPHY: "Photography",
  VIDEOGRAPHY: "Videography",
  VIDEO_EDITING: "Video Editing",
  PHOTO_EDITING: "Photo Editing",
  GRAPHIC_DESIGN: "Graphic Design",
  LIVE_STREAMING: "Live Streaming",
};

export default async function JobsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { proProfile: true },
  });
  if (!user) redirect("/sign-in");

  const isClient = user.role === "CLIENT" || user.role === "ADMIN";
  const isPro = user.role === "PRO";
  const proTier = user.proProfile?.tier ?? "D";
  const proApproved = user.proProfile?.applicationStatus === "APPROVED";

  // Pros only see jobs at or below their tier
  const jobs = await db.job.findMany({
    where: {
      status: "OPEN",
      applicationDeadline: { gte: new Date() },
      ...(isPro && proApproved
        ? {
            minTierRequired: {
              in: TIER_ORDER.slice(0, TIER_ORDER.indexOf(proTier) + 1),
            },
          }
        : {}),
    },
    include: { client: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-zinc-50">
      <AdSlot zone="jobs-top" />
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">Job Board</h1>
            <p className="mt-1 text-zinc-500">
              {isPro
                ? proApproved
                  ? `Showing jobs open to Tier ${proTier} and above`
                  : "Your application must be approved before you can apply to jobs"
                : "Jobs posted by clients"}
            </p>
          </div>
          {isClient && (
            <Link
              href="/jobs/new"
              className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-600"
            >
              + Post a Job
            </Link>
          )}
        </div>

        {isPro && !proApproved && (
          <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 px-5 py-4">
            <p className="text-sm text-yellow-800">
              Your application is pending review. Once approved you&apos;ll be able to apply to jobs.
            </p>
          </div>
        )}

        <div className="mt-8 space-y-4">
          {jobs.length === 0 ? (
            <p className="py-16 text-center text-zinc-400">No open jobs right now.</p>
          ) : (
            jobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="block rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                        {CATEGORY_LABELS[job.category] ?? job.category}
                      </span>
                      <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                        {job.jobType === "ON_SITE" ? "On-site" : "Remote"}
                      </span>
                      {job.minTierRequired !== "D" && (
                        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                          Tier {job.minTierRequired}+
                        </span>
                      )}
                    </div>
                    <h2 className="mt-2 text-lg font-semibold text-zinc-900">{job.title}</h2>
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-500">{job.description}</p>
                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-zinc-400">
                      {job.location && <span>📍 {job.location}</span>}
                      {job.eventDate && (
                        <span>
                          📅 {new Date(job.eventDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      )}
                      <span>
                        Apply by{" "}
                        {new Date(job.applicationDeadline).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-bold text-zinc-900">${job.budget.toLocaleString()}</p>
                    <p className="text-xs text-zinc-400">budget</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
