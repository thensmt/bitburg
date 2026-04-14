import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateJobByType } from "@/lib/validators";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (user.role !== "CLIENT") {
    return NextResponse.json({ error: "Only clients can post jobs" }, { status: 403 });
  }

  const {
    title,
    description,
    category,
    jobType,
    eventDate,
    durationHours,
    location,
    city,
    state,
    market,
    eventType,
    deliveryDeadline,
    assetHandoffMethod,
    assetHandoffUrl,
    budget,
    applicationDeadline,
    minTierRequired,
  } = await req.json();

  if (!title || !description || !category || !budget || !applicationDeadline) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (typeof budget !== "number" || budget <= 0) {
    return NextResponse.json({ error: "budget must be a positive number" }, { status: 400 });
  }

  const resolvedJobType = jobType ?? "ON_SITE";
  const typeError = validateJobByType({
    jobType: resolvedJobType,
    eventDate,
    durationHours,
    location,
    deliveryDeadline,
    assetHandoffMethod,
    assetHandoffUrl,
  });
  if (typeError) {
    return NextResponse.json({ error: typeError }, { status: 400 });
  }

  const deadline = new Date(applicationDeadline);
  if (Number.isNaN(deadline.getTime()) || deadline < new Date()) {
    return NextResponse.json(
      { error: "applicationDeadline must be a valid future date" },
      { status: 400 }
    );
  }

  const job = await db.job.create({
    data: {
      clientId: user.id,
      title,
      description,
      category,
      jobType: resolvedJobType,
      eventDate: eventDate ? new Date(eventDate) : null,
      durationHours: durationHours ?? null,
      location: location ?? null,
      city: city ?? null,
      state: state ?? null,
      market: market ?? "DMV",
      eventType: eventType ?? null,
      deliveryDeadline: deliveryDeadline ? new Date(deliveryDeadline) : null,
      assetHandoffMethod: assetHandoffMethod ?? null,
      assetHandoffUrl: assetHandoffUrl ?? null,
      budget,
      applicationDeadline: deadline,
      minTierRequired: minTierRequired ?? "D",
    },
  });

  return NextResponse.json({ id: job.id });
}
