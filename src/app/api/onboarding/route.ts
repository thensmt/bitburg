import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role } = await req.json();
  if (!["CLIENT", "PRO"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const existing = await db.user.findUnique({ where: { clerkId: userId } });
  if (existing?.onboardingComplete) {
    return NextResponse.json(
      { error: "Onboarding already completed." },
      { status: 409 }
    );
  }

  // If the Clerk user.created webhook hasn't landed yet (common in local dev),
  // lazily create the User row from Clerk's identity so onboarding can proceed.
  if (!existing) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Clerk user not found" }, { status: 404 });
    }
    await db.user.create({
      data: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress ?? `${userId}@placeholder.local`,
        name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || "New User",
        avatar: clerkUser.imageUrl ?? null,
        role: "CLIENT",
      },
    });
  }

  const user = await db.user.update({
    where: { clerkId: userId },
    data: { role, onboardingComplete: true },
  });

  // If pro, create an empty ProProfile so they can fill it in
  if (role === "PRO") {
    await db.proProfile.upsert({
      where: { userId: user.id },
      create: { userId: user.id },
      update: {},
    });
  }

  return NextResponse.json({ ok: true });
}
