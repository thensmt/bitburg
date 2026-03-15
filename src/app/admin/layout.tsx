import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user || user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-900 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-sm font-bold tracking-widest text-blue-400 uppercase">
              Bitburg Admin
            </span>
            <nav className="flex gap-4 text-sm">
              <Link
                href="/admin"
                className="text-zinc-400 transition-colors hover:text-zinc-100"
              >
                Overview
              </Link>
              <Link
                href="/admin/applications"
                className="text-zinc-400 transition-colors hover:text-zinc-100"
              >
                Applications
              </Link>
            </nav>
          </div>
          <Link href="/dashboard" className="text-xs text-zinc-500 hover:text-zinc-300">
            ← Back to app
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
