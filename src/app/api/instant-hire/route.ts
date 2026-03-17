import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

interface InstantHireBody {
  proSlug: string;
  category: string;
  rateType: "hourly" | "flat";
  hours?: number;
  jobType: "ON_SITE" | "REMOTE";
  eventDate?: string;
  location?: string;
  durationHours?: number;
  deliveryDeadline?: string;
  assetHandoffMethod?: "PLATFORM_UPLOAD" | "EXTERNAL_LINK";
  assetHandoffUrl?: string;
  description: string;
}

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { clerkId },
    include: { proProfile: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.role !== "CLIENT") {
    return NextResponse.json(
      { error: "Only clients can use instant hire" },
      { status: 403 }
    );
  }

  const body: InstantHireBody = await req.json();

  const {
    proSlug,
    category,
    rateType,
    hours,
    jobType,
    eventDate,
    location,
    durationHours,
    deliveryDeadline,
    assetHandoffMethod,
    assetHandoffUrl,
    description,
  } = body;

  if (!proSlug || !category || !rateType || !jobType || !description) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (rateType === "hourly" && (!hours || hours <= 0)) {
    return NextResponse.json(
      { error: "Hours are required and must be greater than 0 for hourly rate" },
      { status: 400 }
    );
  }

  const proProfile = await db.proProfile.findUnique({
    where: { slug: proSlug },
    include: {
      user: true,
      rates: true,
    },
  });

  if (!proProfile) {
    return NextResponse.json({ error: "Pro not found" }, { status: 404 });
  }

  if (!proProfile.instantHireEnabled) {
    return NextResponse.json(
      { error: "This pro is not available for instant hire" },
      { status: 400 }
    );
  }

  if (proProfile.userId === user.id) {
    return NextResponse.json(
      { error: "You cannot hire yourself" },
      { status: 400 }
    );
  }

  const rate = proProfile.rates.find((r) => r.category === category);
  if (!rate) {
    return NextResponse.json(
      { error: "No rate found for this category" },
      { status: 400 }
    );
  }

  let confirmedRate: number;
  if (rateType === "hourly") {
    if (!rate.hourlyRate) {
      return NextResponse.json(
        { error: "This pro does not have an hourly rate for this category" },
        { status: 400 }
      );
    }
    confirmedRate = rate.hourlyRate * hours!;
  } else {
    if (!rate.flatRate) {
      return NextResponse.json(
        { error: "This pro does not have a flat rate for this category" },
        { status: 400 }
      );
    }
    confirmedRate = rate.flatRate;
  }

  const confirmedDate =
    eventDate
      ? new Date(eventDate)
      : deliveryDeadline
      ? new Date(deliveryDeadline)
      : null;

  const booking = await db.booking.create({
    data: {
      clientId: user.id,
      proProfileId: proProfile.id,
      jobId: null,
      confirmedDate,
      confirmedRate,
      depositAmount: Math.round(confirmedRate * 0.25 * 100) / 100,
      depositPaid: false,
      balancePaid: false,
      status: "CONFIRMED",
    },
  });

  return NextResponse.json({ bookingId: booking.id });
}
