import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (user.role !== "PRO") return NextResponse.json({ error: "Only pros can apply" }, { status: 403 });

  const { bio, specialties, equipment, portfolioUrls, socialLinks, serviceArea, willingToTravel } =
    await req.json();

  if (!bio || !specialties?.length) {
    return NextResponse.json({ error: "Bio and at least one specialty are required" }, { status: 400 });
  }

  await db.proProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      bio,
      specialties,
      equipment: equipment ?? [],
      portfolioUrls: portfolioUrls ?? [],
      socialLinks: socialLinks ?? {},
      serviceArea: serviceArea ?? null,
      willingToTravel: willingToTravel ?? false,
      applicationStatus: "PENDING",
    },
    update: {
      bio,
      specialties,
      equipment: equipment ?? [],
      portfolioUrls: portfolioUrls ?? [],
      socialLinks: socialLinks ?? {},
      serviceArea: serviceArea ?? null,
      willingToTravel: willingToTravel ?? false,
      applicationStatus: "PENDING",
    },
  });

  return NextResponse.json({ ok: true });
}
