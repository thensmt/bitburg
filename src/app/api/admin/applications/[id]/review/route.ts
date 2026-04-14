import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = await db.user.findUnique({ where: { clerkId: userId } });
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { action, tier } = await req.json();

  if (action !== "APPROVED" && action !== "REJECTED") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const validTiers = ["D", "C", "B", "A", "S"];
  if (action === "APPROVED" && !validTiers.includes(tier)) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  const profile = await db.proProfile.findUnique({ where: { id } });
  if (!profile) return NextResponse.json({ error: "Application not found" }, { status: 404 });
  if (profile.applicationStatus !== "PENDING") {
    return NextResponse.json(
      { error: `Application is already ${profile.applicationStatus.toLowerCase()}.` },
      { status: 409 }
    );
  }

  await db.proProfile.update({
    where: { id },
    data: {
      applicationStatus: action,
      ...(action === "APPROVED" ? { tier } : {}),
    },
  });

  return NextResponse.json({ ok: true });
}
