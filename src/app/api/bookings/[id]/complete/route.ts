import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { id: bookingId } = await params;

  const booking = await db.booking.findUnique({ where: { id: bookingId } });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  // Only the client on this booking may mark it complete
  if (booking.clientId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (booking.status !== "CONFIRMED") {
    return NextResponse.json(
      { error: "Only confirmed bookings can be marked as completed." },
      { status: 400 }
    );
  }

  const updated = await db.booking.update({
    where: { id: bookingId },
    data: { status: "COMPLETED" },
  });

  return NextResponse.json(updated);
}
