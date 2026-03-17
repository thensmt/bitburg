import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { AdSlot } from "@/components/AdSlot";
import Link from "next/link";
import { ProfileEditForm } from "./ProfileEditForm";

export default async function EditProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const [user, pro] = await Promise.all([
    db.user.findUnique({ where: { clerkId }, select: { id: true } }),
    db.proProfile.findUnique({
      where: { slug },
      include: { rates: { orderBy: { category: "asc" } } },
    }),
  ]);

  if (!user) redirect("/sign-in");
  if (!pro) notFound();
  if (pro.userId !== user.id) redirect(`/pros/${slug}`);

  const socialLinks = pro.socialLinks as {
    twitter?: string;
    instagram?: string;
    website?: string;
  } | null;

  return (
    <div className="min-h-screen bg-zinc-50">
      <AdSlot zone="pro-edit-top" />
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Link
          href={`/pros/${slug}`}
          className="text-sm text-zinc-400 hover:text-zinc-600"
        >
          ← Back to profile
        </Link>

        <h1 className="mt-6 text-2xl font-bold text-zinc-900">Edit Profile</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Update your public profile and service rates.
        </p>

        <ProfileEditForm
          slug={slug}
          initialData={{
            bio: pro.bio ?? "",
            specialties: pro.specialties,
            equipment: pro.equipment.join(", "),
            portfolioUrls: [
              ...pro.portfolioUrls,
              ...Array(Math.max(0, 5 - pro.portfolioUrls.length)).fill(""),
            ].slice(0, 5) as [string, string, string, string, string],
            twitter: socialLinks?.twitter ?? "",
            instagram: socialLinks?.instagram ?? "",
            website: socialLinks?.website ?? "",
            serviceArea: pro.serviceArea ?? "",
            market: pro.market ?? "",
            state: pro.state ?? "",
            willingToTravel: pro.willingToTravel,
            instantHireEnabled: pro.instantHireEnabled,
            rates: pro.rates.map((r) => ({
              category: r.category,
              hourlyRate: r.hourlyRate ?? undefined,
              flatRate: r.flatRate ?? undefined,
            })),
          }}
        />
      </div>
    </div>
  );
}
