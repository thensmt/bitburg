import { db } from "@/lib/db";
import Link from "next/link";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

const TIER_COLORS: Record<string, string> = {
  D: "bg-zinc-700 text-zinc-200",
  C: "bg-green-900 text-green-200",
  B: "bg-blue-900 text-blue-200",
  A: "bg-purple-900 text-purple-200",
  S: "bg-yellow-900 text-yellow-200",
};

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filterStatus = status === "APPROVED" || status === "REJECTED" ? status : "PENDING";

  const applications = await db.proProfile.findMany({
    where: { applicationStatus: filterStatus as "PENDING" | "APPROVED" | "REJECTED" },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-100">Pro Applications</h1>
        <div className="flex gap-2">
          {["PENDING", "APPROVED", "REJECTED"].map((s) => (
            <Link
              key={s}
              href={`/admin/applications${s !== "PENDING" ? `?status=${s}` : ""}`}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                filterStatus === s
                  ? "bg-blue-500 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {STATUS_LABELS[s]}
            </Link>
          ))}
        </div>
      </div>

      {applications.length === 0 ? (
        <p className="mt-12 text-center text-zinc-500">No {filterStatus.toLowerCase()} applications.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {applications.map((app) => (
            <Link
              key={app.id}
              href={`/admin/applications/${app.id}`}
              className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4 transition-colors hover:border-zinc-600"
            >
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-semibold text-zinc-100">{app.user.name}</p>
                  <p className="text-xs text-zinc-400">{app.user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-500">
                  {app.specialties.map((s) => s.replace(/_/g, " ")).join(", ")}
                </span>
                {filterStatus === "APPROVED" && (
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${TIER_COLORS[app.tier]}`}>
                    Tier {app.tier}
                  </span>
                )}
                <span className="text-xs text-zinc-500">
                  {new Date(app.createdAt).toLocaleDateString()}
                </span>
                <span className="text-zinc-600">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
