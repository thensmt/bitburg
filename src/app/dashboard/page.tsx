import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { AdSlot } from "@/components/AdSlot";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect("/sign-in");
  if (!user.onboardingComplete) redirect("/onboarding");

  return (
    <div className="min-h-screen bg-zinc-50">
      <AdSlot zone="dashboard-top" />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-2xl font-bold text-zinc-900">
          Welcome back, {user.name}
        </h1>
        <p className="mt-1 text-zinc-500 capitalize">Role: {user.role.toLowerCase()}</p>
      </main>
    </div>
  );
}
