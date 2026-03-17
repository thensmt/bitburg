import { db } from "@/lib/db";
import Link from "next/link";

interface Props {
  clerkId: string;
}

export default async function ProDashboard({ clerkId }: Props) {
  const user = await db.user.findUnique({
    where: { clerkId },
    include: {
      proProfile: {
        include: {
          applications: {
            include: { job: { include: { client: true } } },
            orderBy: { submittedAt: "desc" },
          },
          bookings: {
            include: { job: true, client: true, review: true },
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  if (!user || !user.proProfile) return null;

  const { proProfile } = user;
  const { applications, bookings } = proProfile;

  // ── Stats ────────────────────────────────────────────────────────────────
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(
    (a) => a.status === "PENDING"
  ).length;
  const jobsWon =
    applications.filter((a) => a.status === "SELECTED").length +
    bookings.filter((b) => b.jobId === null).length; // direct hires count too
  const avgRating = proProfile.avgRating;
  const profileViews = proProfile.profileViews;

  // ── Bookings split ───────────────────────────────────────────────────────
  const activeBookings = bookings.filter((b) => b.status === "CONFIRMED");
  const completedBookings = bookings
    .filter((b) => b.status === "COMPLETED")
    .slice(0, 5);

  // ── Earnings ─────────────────────────────────────────────────────────────
  const totalEarned = bookings
    .filter((b) => b.status === "COMPLETED")
    .reduce((sum, b) => sum + b.confirmedRate, 0);
  const pendingPayout = bookings
    .filter((b) => b.status === "CONFIRMED")
    .reduce((sum, b) => sum + b.confirmedRate, 0);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const slug = proProfile.slug;

  const statusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            Pending
          </span>
        );
      case "SELECTED":
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            Selected
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-500">
            Rejected
          </span>
        );
      case "WITHDRAWN":
        return (
          <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-500">
            Withdrawn
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-500">
            {status}
          </span>
        );
    }
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "—";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="space-y-10">
      {/* ── Stats bar ───────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">
          Your Stats
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { label: "Total Applications", value: totalApplications },
            { label: "Pending", value: pendingApplications },
            { label: "Jobs Won", value: jobsWon },
            {
              label: "Avg Rating",
              value: avgRating > 0 ? avgRating.toFixed(1) : "—",
            },
            { label: "Profile Views", value: profileViews },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl border border-zinc-200 bg-white px-5 py-4"
            >
              <p className="text-2xl font-bold text-zinc-900">{value}</p>
              <p className="mt-1 text-xs text-zinc-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Earnings ────────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Earnings</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-white px-5 py-5">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
              Total Earned
            </p>
            <p className="mt-1 text-3xl font-bold text-zinc-900">
              {formatCurrency(totalEarned)}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white px-5 py-5">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
              Pending Payout
            </p>
            <p className="mt-1 text-3xl font-bold text-blue-600">
              {formatCurrency(pendingPayout)}
            </p>
          </div>
        </div>
      </section>

      {/* ── Active Applications ──────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">
          Active Applications
        </h2>
        {applications.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white px-5 py-8 text-center text-sm text-zinc-500">
            No applications yet.{" "}
            <Link href="/jobs" className="text-blue-500 hover:underline">
              Browse jobs
            </Link>{" "}
            to get started.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <table className="min-w-full divide-y divide-zinc-100">
              <thead>
                <tr className="bg-zinc-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Job
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Budget
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Submitted
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-zinc-50">
                    <td className="px-5 py-3">
                      <Link
                        href={`/jobs/${app.jobId}`}
                        className="text-sm font-medium text-zinc-900 hover:text-blue-600"
                      >
                        {app.job.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-sm text-zinc-600">
                      {formatCurrency(app.job.budget)}
                    </td>
                    <td className="px-5 py-3 text-sm text-zinc-500">
                      {formatDate(app.submittedAt)}
                    </td>
                    <td className="px-5 py-3">{statusBadge(app.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Active Bookings ──────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">
          Active Bookings
        </h2>
        {activeBookings.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white px-5 py-8 text-center text-sm text-zinc-500">
            No active bookings.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <table className="min-w-full divide-y divide-zinc-100">
              <thead>
                <tr className="bg-zinc-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Job
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Rate
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Event / Delivery
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Deposit
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {activeBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-zinc-50">
                    <td className="px-5 py-3">
                      <Link
                        href={`/bookings/${booking.id}`}
                        className="text-sm font-medium text-zinc-900 hover:text-blue-600"
                      >
                        {booking.job?.title ?? "Direct Hire"}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-sm text-zinc-600">
                      {formatCurrency(booking.confirmedRate)}
                    </td>
                    <td className="px-5 py-3 text-sm text-zinc-500">
                      {formatDate(
                        booking.job?.eventDate ?? booking.job?.deliveryDeadline
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {booking.depositPaid ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-500">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Completed Bookings ───────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">
          Recent Completed Bookings
        </h2>
        {completedBookings.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white px-5 py-8 text-center text-sm text-zinc-500">
            No completed bookings yet.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <table className="min-w-full divide-y divide-zinc-100">
              <thead>
                <tr className="bg-zinc-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Job
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Rate
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Completed
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Review
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {completedBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-zinc-50">
                    <td className="px-5 py-3">
                      <Link
                        href={`/bookings/${booking.id}`}
                        className="text-sm font-medium text-zinc-900 hover:text-blue-600"
                      >
                        {booking.job?.title ?? "Direct Hire"}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-sm text-zinc-600">
                      {formatCurrency(booking.confirmedRate)}
                    </td>
                    <td className="px-5 py-3 text-sm text-zinc-500">
                      {formatDate(booking.updatedAt)}
                    </td>
                    <td className="px-5 py-3">
                      {booking.review ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Reviewed
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-500">
                          Pending review
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Quick Actions ────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/jobs"
            className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-600"
          >
            Browse Jobs
          </Link>
          <Link
            href={slug ? `/pros/${slug}/edit` : "/apply"}
            className="rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 hover:border-blue-400"
          >
            Edit Profile
          </Link>
          {slug && (
            <Link
              href={`/pros/${slug}`}
              className="rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 hover:border-blue-400"
            >
              View My Profile
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
