import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { SelectProButton } from "./SelectProButton";

const TIER_COLORS: Record<string, string> = {
  D: "bg-zinc-100 text-zinc-600",
  C: "bg-green-100 text-green-700",
  B: "bg-blue-100 text-blue-700",
  A: "bg-purple-100 text-purple-700",
  S: "bg-yellow-100 text-yellow-800",
};

export default async function ApplicantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect("/sign-in");

  const job = await db.job.findUnique({
    where: { id },
    include: {
      applications: {
        include: {
          proProfile: {
            include: { user: { select: { name: true, email: true } } },
          },
        },
        orderBy: { submittedAt: "asc" },
      },
    },
  });

  if (!job) notFound();

  // Only the job owner or admin can see applicants
  if (job.clientId !== user.id && user.role !== "ADMIN") redirect("/jobs");

  const isAwarded = job.status === "AWARDED";

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link href={`/jobs/${id}`} className="text-sm text-zinc-400 hover:text-zinc-600">
          ← Back to job
        </Link>

        <div className="mt-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">{job.title}</h1>
            <p className="mt-1 text-sm text-zinc-500">
              {job.applications.length} applicant{job.applications.length !== 1 ? "s" : ""}
            </p>
          </div>
          {isAwarded && (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Pro Selected
            </span>
          )}
        </div>

        {job.applications.length === 0 ? (
          <p className="mt-16 text-center text-zinc-400">No applications yet.</p>
        ) : (
          <div className="mt-8 space-y-4">
            {job.applications.map((app) => {
              const rate =
                app.rateResponse === "COUNTERED" && app.counterRate
                  ? app.counterRate
                  : job.budget;
              const isSelected = app.status === "SELECTED";
              const isRejected = app.status === "REJECTED";

              return (
                <div
                  key={app.id}
                  className={`rounded-2xl border bg-white p-6 ${
                    isSelected
                      ? "border-green-300 ring-1 ring-green-200"
                      : isRejected
                      ? "border-zinc-100 opacity-60"
                      : "border-zinc-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-zinc-900">
                          {app.proProfile.user.name}
                        </p>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                            TIER_COLORS[app.proProfile.tier]
                          }`}
                        >
                          Tier {app.proProfile.tier}
                        </span>
                        {isSelected && (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                            Selected
                          </span>
                        )}
                        {isRejected && (
                          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
                            Not selected
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-zinc-400">
                        {app.proProfile.user.email} ·{" "}
                        {new Date(app.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-zinc-900">
                        ${rate.toLocaleString()}
                      </p>
                      {app.rateResponse === "COUNTERED" && (
                        <p className="text-xs text-amber-600">Counter offer</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm leading-relaxed text-zinc-700">{app.pitchMessage}</p>
                  </div>

                  {app.counterJustification && (
                    <div className="mt-3 rounded-lg bg-amber-50 px-4 py-3">
                      <p className="text-xs font-medium text-amber-700">Counter justification</p>
                      <p className="mt-0.5 text-sm text-amber-800">{app.counterJustification}</p>
                    </div>
                  )}

                  {app.portfolioSamples.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-zinc-500 mb-1">Portfolio samples</p>
                      <ul className="space-y-0.5">
                        {app.portfolioSamples.map((url) => (
                          <li key={url}>
                            <a
                              href={url.startsWith("http") ? url : `https://${url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-500 hover:underline"
                            >
                              {url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {!isAwarded && app.status === "PENDING" && (
                    <div className="mt-4">
                      <SelectProButton
                        jobId={job.id}
                        applicationId={app.id}
                        proName={app.proProfile.user.name}
                        rate={rate}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
