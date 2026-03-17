import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { AdSlot } from "@/components/AdSlot";
import Link from "next/link";
import { ApplyPanel } from "./ApplyPanel";

const CATEGORY_LABELS: Record<string, string> = {
  PHOTOGRAPHY: "Photography",
  VIDEOGRAPHY: "Videography",
  VIDEO_EDITING: "Video Editing",
  PHOTO_EDITING: "Photo Editing",
  GRAPHIC_DESIGN: "Graphic Design",
  LIVE_STREAMING: "Live Streaming",
};

const TIER_ORDER = ["D", "C", "B", "A", "S"];

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [user, job] = await Promise.all([
    db.user.findUnique({
      where: { clerkId: userId },
      include: { proProfile: true },
    }),
    db.job.findUnique({
      where: { id },
      include: { client: { select: { name: true } } },
    }),
  ]);

  if (!user) redirect("/sign-in");
  if (!job) notFound();

  const isPro = user.role === "PRO";
  const proApproved = user.proProfile?.applicationStatus === "APPROVED";
  const proTier = user.proProfile?.tier ?? "D";
  const tierOk =
    TIER_ORDER.indexOf(proTier) >= TIER_ORDER.indexOf(job.minTierRequired);

  // Check if pro already applied
  const existingApplication = isPro && user.proProfile
    ? await db.application.findUnique({
        where: {
          jobId_proProfileId: { jobId: job.id, proProfileId: user.proProfile.id },
        },
      })
    : null;

  const isOwner = job.clientId === user.id;
  const deadlinePassed = new Date(job.applicationDeadline) < new Date();

  return (
    <div className="min-h-screen bg-zinc-50">
      <AdSlot zone="job-detail-top" />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link href="/jobs" className="text-sm text-zinc-400 hover:text-zinc-600">
          ← Back to jobs
        </Link>

        <div className="mt-6">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
              {CATEGORY_LABELS[job.category] ?? job.category}
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
              {job.jobType === "ON_SITE" ? "On-site" : "Remote"}
            </span>
            {job.minTierRequired !== "D" && (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                Tier {job.minTierRequired}+
              </span>
            )}
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                job.status === "OPEN"
                  ? "bg-green-50 text-green-700"
                  : "bg-zinc-100 text-zinc-500"
              }`}
            >
              {job.status}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-zinc-900">{job.title}</h1>
          <p className="mt-1 text-sm text-zinc-400">Posted by {job.client.name}</p>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat label="Budget" value={`$${job.budget.toLocaleString()}`} />
            {job.eventDate && (
              <Stat
                label="Event Date"
                value={new Date(job.eventDate).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                })}
              />
            )}
            {job.durationHours && (
              <Stat label="Duration" value={`${job.durationHours}h`} />
            )}
            {job.location && <Stat label="Location" value={job.location} />}
            <Stat
              label="Apply By"
              value={new Date(job.applicationDeadline).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric",
              })}
            />
            {job.deliveryDeadline && (
              <Stat
                label="Delivery By"
                value={new Date(job.deliveryDeadline).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                })}
              />
            )}
          </div>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-3 text-sm font-semibold text-zinc-500 uppercase tracking-wide">
              Description
            </h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">
              {job.description}
            </p>
          </div>

          {/* Apply Panel — only for approved pros who meet tier req */}
          {isPro && proApproved && tierOk && job.status === "OPEN" && !deadlinePassed && (
            <div className="mt-6">
              {existingApplication?.status === "PENDING" && (
                <div className="rounded-2xl border border-green-200 bg-green-50 px-6 py-4">
                  <p className="text-sm font-medium text-green-800">
                    Application submitted — under review by the client.
                  </p>
                </div>
              )}
              {existingApplication?.status === "SELECTED" && (
                <div className="rounded-2xl border border-green-200 bg-green-50 px-6 py-4">
                  <p className="text-sm font-medium text-green-800">
                    You were selected for this job. 🎉
                  </p>
                </div>
              )}
              {(!existingApplication || existingApplication.status === "REJECTED") && (
                <ApplyPanel jobId={job.id} budget={job.budget} />
              )}
            </div>
          )}

          {isPro && proApproved && !tierOk && (
            <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-4">
              <p className="text-sm text-zinc-500">
                This job requires Tier {job.minTierRequired} or above. Your current tier is {proTier}.
              </p>
            </div>
          )}

          {isPro && !proApproved && (
            <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 px-6 py-4">
              <p className="text-sm text-yellow-800">
                Your application must be approved before you can apply to jobs.
              </p>
            </div>
          )}

          {isOwner && (
            <div className="mt-6 rounded-2xl border border-zinc-200 bg-white px-6 py-4 flex items-center justify-between">
              <p className="text-sm text-zinc-500">You posted this job.</p>
              <Link
                href={`/jobs/${job.id}/applicants`}
                className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
              >
                View Applicants →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3">
      <p className="text-xs text-zinc-400">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-zinc-900">{value}</p>
    </div>
  );
}
