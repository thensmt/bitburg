import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { HireForm } from "./HireForm";
import { AdSlot } from "@/components/AdSlot";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function HirePage({ params }: PageProps) {
  const { slug } = await params;

  const { userId: clerkId } = await auth();
  if (!clerkId) {
    redirect(`/sign-in?redirect_url=/pros/${slug}/hire`);
  }

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user || user.role !== "CLIENT") {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-bold text-zinc-900 mb-2">Access Denied</h1>
          <p className="text-zinc-500 text-sm mb-6">
            Only clients can use instant hire.
          </p>
          <a
            href={`/pros/${slug}`}
            className="inline-block rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-600 transition-colors"
          >
            Back to Profile
          </a>
        </div>
      </div>
    );
  }

  const proProfile = await db.proProfile.findUnique({
    where: { slug },
    include: {
      user: true,
      rates: true,
    },
  });

  if (!proProfile) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-bold text-zinc-900 mb-2">Pro Not Found</h1>
          <p className="text-zinc-500 text-sm mb-6">
            This pro profile does not exist.
          </p>
          <a
            href="/pros"
            className="inline-block rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-600 transition-colors"
          >
            Browse Pros
          </a>
        </div>
      </div>
    );
  }

  const hasRates = proProfile.rates.length > 0;

  if (!proProfile.instantHireEnabled || !hasRates) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-bold text-zinc-900 mb-2">Not Available</h1>
          <p className="text-zinc-500 text-sm mb-6">
            {!proProfile.instantHireEnabled
              ? "This pro is not available for instant hire."
              : "This pro has not set up rates for instant hire yet."}
          </p>
          <a
            href={`/pros/${slug}`}
            className="inline-block rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-600 transition-colors"
          >
            Back to Profile
          </a>
        </div>
      </div>
    );
  }

  const pro = {
    id: proProfile.id,
    slug: proProfile.slug!,
    bio: proProfile.bio,
    tier: proProfile.tier as string,
    avgRating: proProfile.avgRating,
    totalJobsCompleted: proProfile.totalJobsCompleted,
    rates: proProfile.rates.map((r) => ({
      id: r.id,
      category: r.category as string,
      hourlyRate: r.hourlyRate,
      flatRate: r.flatRate,
      notes: r.notes,
    })),
    user: {
      id: proProfile.user.id,
      name: proProfile.user.name,
      avatar: proProfile.user.avatar,
    },
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <AdSlot zone="instant-hire-top" />
      <HireForm pro={pro} />
    </div>
  );
}
