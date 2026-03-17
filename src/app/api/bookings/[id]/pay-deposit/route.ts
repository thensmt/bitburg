import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "CLIENT") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id: bookingId } = await params;
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: { pro: true },
  });

  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (booking.clientId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (booking.depositPaid) return NextResponse.json({ error: "Deposit already paid" }, { status: 400 });
  if (booking.status !== "CONFIRMED") return NextResponse.json({ error: "Booking is not confirmed" }, { status: 400 });
  if (!booking.pro.stripeAccountId) {
    return NextResponse.json({ error: "Pro has not connected a payment account" }, { status: 400 });
  }

  const intent = await getStripe().paymentIntents.create({
    amount: Math.round(booking.depositAmount * 100),
    currency: "usd",
    transfer_data: { destination: booking.pro.stripeAccountId },
    application_fee_amount: Math.floor(booking.depositAmount * 0.05 * 100),
    metadata: { bookingId: booking.id, type: "deposit" },
  });

  return NextResponse.json({ clientSecret: intent.client_secret });
}
