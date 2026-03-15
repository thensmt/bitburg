import { db } from "@/lib/db";
import Link from "next/link";

export default async function AdminPage() {
  const [pending, approved, rejected, totalUsers, totalPros] = await Promise.all([
    db.proProfile.count({ where: { applicationStatus: "PENDING" } }),
    db.proProfile.count({ where: { applicationStatus: "APPROVED" } }),
    db.proProfile.count({ where: { applicationStatus: "REJECTED" } }),
    db.user.count(),
    db.user.count({ where: { role: "PRO" } }),
  ]);

  const stats = [
    { label: "Pending Applications", value: pending, href: "/admin/applications", highlight: pending > 0 },
    { label: "Approved Pros", value: approved, href: "/admin/applications?status=APPROVED" },
    { label: "Rejected", value: rejected, href: "/admin/applications?status=REJECTED" },
    { label: "Total Users", value: totalUsers, href: null },
    { label: "Total Pros", value: totalPros, href: null },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-100">Admin Overview</h1>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`rounded-xl border p-5 ${
              s.highlight
                ? "border-yellow-500/50 bg-yellow-500/10"
                : "border-zinc-800 bg-zinc-900"
            }`}
          >
            <p className="text-3xl font-bold text-zinc-100">{s.value}</p>
            <p className="mt-1 text-xs text-zinc-400">{s.label}</p>
            {s.href && (
              <Link
                href={s.href}
                className="mt-2 block text-xs text-blue-400 hover:text-blue-300"
              >
                View →
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
