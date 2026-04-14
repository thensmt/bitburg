import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { proProfile: true },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (user.role !== "PRO") return NextResponse.json({ error: "Only pros can apply" }, { status: 403 });
  if (!user.proProfile || user.proProfile.applicationStatus !== "APPROVED") {
    return NextResponse.json({ error: "Your profile must be approved to apply" }, { status: 403 });
  }

  const { id: jobId } = await params;
  const job = await db.job.findUnique({ where: { id: jobId } });
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  if (job.status !== "OPEN") return NextResponse.json({ error: "Job is no longer open" }, { status: 409 });
  if (new Date(job.applicationDeadline) < new Date()) {
    return NextResponse.json({ error: "Application deadline has passed" }, { status: 409 });
  }

  const TIER_ORDER = ["D", "C", "B", "A", "S"];
  if (TIER_ORDER.indexOf(user.proProfile.tier) < TIER_ORDER.indexOf(job.minTierRequired)) {
    return NextResponse.json({ error: "Your tier does not meet the minimum requirement" }, { status: 403 });
  }

  const { pitchMessage, rateResponse, counterRate, counterJustification, portfolioSamples } =
    await req.json();

  if (!pitchMessage) {
    return NextResponse.json({ error: "Pitch message is required" }, { status: 400 });
  }

  const application = await db.application.upsert({
    where: {
      jobId_proProfileId: { jobId, proProfileId: user.proProfile.id },
    },
    create: {
      jobId,
      proProfileId: user.proProfile.id,
      pitchMessage,
      rateResponse: rateResponse ?? "ACCEPTED",
      counterRate: counterRate ?? null,
      counterJustification: counterJustification ?? null,
      portfolioSamples: portfolioSamples ?? [],
    },
    update: {
      pitchMessage,
      rateResponse: rateResponse ?? "ACCEPTED",
      counterRate: counterRate ?? null,
      counterJustification: counterJustification ?? null,
      portfolioSamples: portfolioSamples ?? [],
      status: "PENDING",
    },
  });

  return NextResponse.json({ id: application.id });
}
