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

  const { id: bookingId } = await params;

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: { dispute: true },
  });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  // Must be the client or the pro on this booking
  const isClient = booking.clientId === user.id;
  const isPro = user.proProfile?.id === booking.proProfileId;

  if (!isClient && !isPro) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (booking.dispute) {
    return NextResponse.json(
      { error: "A dispute already exists for this booking." },
      { status: 409 }
    );
  }

  if (booking.status !== "CONFIRMED" && booking.status !== "COMPLETED") {
    return NextResponse.json(
      { error: "Disputes can only be opened on confirmed or completed bookings." },
      { status: 400 }
    );
  }

  const body = await req.json();
  if (!body.reason || typeof body.reason !== "string" || !body.reason.trim()) {
    return NextResponse.json({ error: "A reason is required." }, { status: 422 });
  }

  const [dispute] = await db.$transaction([
    db.dispute.create({
      data: {
        bookingId,
        openedById: user.id,
        reason: body.reason.trim(),
        evidence: body.evidence?.trim() ?? null,
      },
    }),
    db.booking.update({
      where: { id: bookingId },
      data: { status: "DISPUTED" },
    }),
  ]);

  return NextResponse.json(dispute, { status: 201 });
}
