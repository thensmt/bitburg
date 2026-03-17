import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { id: jobId } = await params;
  const job = await db.job.findUnique({
    where: { id: jobId },
    include: { applications: true },
  });

  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  if (job.clientId !== user.id && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (job.status !== "OPEN" && job.status !== "IN_REVIEW") {
    return NextResponse.json({ error: "Job is no longer open" }, { status: 400 });
  }

  const { applicationId } = await req.json();

  const selectedApp = job.applications.find((a) => a.id === applicationId);
  if (!selectedApp) return NextResponse.json({ error: "Application not found" }, { status: 404 });

  const confirmedRate =
    selectedApp.rateResponse === "COUNTERED" && selectedApp.counterRate
      ? selectedApp.counterRate
      : job.budget;

  // Run everything in a transaction
  await db.$transaction([
    // Mark selected application
    db.application.update({
      where: { id: applicationId },
      data: { status: "SELECTED" },
    }),
    // Reject all other applications
    db.application.updateMany({
      where: { jobId, id: { not: applicationId } },
      data: { status: "REJECTED" },
    }),
    // Create booking
    db.booking.create({
      data: {
        jobId,
        clientId: job.clientId,
        proProfileId: selectedApp.proProfileId,
        confirmedRate,
        depositAmount: Math.round(confirmedRate * 0.25 * 100) / 100,
        status: "CONFIRMED",
      },
    }),
    // Update job status
    db.job.update({
      where: { id: jobId },
      data: { status: "AWARDED" },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
