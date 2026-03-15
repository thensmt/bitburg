import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { AdSlot } from "@/components/AdSlot";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { proProfile: true },
  });
  if (!user) redirect("/sign-in");
  if (!user.onboardingComplete) redirect("/onboarding");

  // Pros who haven't applied yet go to the application form
  if (user.role === "PRO" && !user.proProfile) redirect("/apply");

  const proStatus = user.proProfile?.applicationStatus ?? null;

  return (
    <div className="min-h-screen bg-zinc-50">
      <AdSlot zone="dashboard-top" />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-2xl font-bold text-zinc-900">
          Welcome back, {user.name}
        </h1>
        <p className="mt-1 text-zinc-500 capitalize">Role: {user.role.toLowerCase()}</p>

        {proStatus === "PENDING" && (
          <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 px-5 py-4">
            <p className="text-sm font-medium text-yellow-800">
              Your application is under review. We&apos;ll notify you within 3–5 business days.
            </p>
          </div>
        )}

        {proStatus === "REJECTED" && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
            <p className="text-sm font-medium text-red-800">
              Your application wasn&apos;t approved this time.{" "}
              <a href="/apply" className="underline">Reapply</a> with an updated portfolio.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
