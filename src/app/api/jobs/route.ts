import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

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
    budget,
    applicationDeadline,
    minTierRequired,
  } = await req.json();

  if (!title || !description || !category || !budget || !applicationDeadline) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const job = await db.job.create({
    data: {
      clientId: user.id,
      title,
      description,
      category,
      jobType: jobType ?? "ON_SITE",
      eventDate: eventDate ? new Date(eventDate) : null,
      durationHours: durationHours ?? null,
      location: location ?? null,
      city: city ?? null,
      state: state ?? null,
      market: market ?? "DMV",
      eventType: eventType ?? null,
      deliveryDeadline: deliveryDeadline ? new Date(deliveryDeadline) : null,
      budget,
      applicationDeadline: new Date(applicationDeadline),
      minTierRequired: minTierRequired ?? "D",
    },
  });

  return NextResponse.json({ id: job.id });
}
