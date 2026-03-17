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
  if (booking.status !== "COMPLETED") return NextResponse.json({ error: "Booking is not completed" }, { status: 400 });
  if (booking.balancePaid) return NextResponse.json({ error: "Balance already paid" }, { status: 400 });
  if (!booking.pro.stripeAccountId) {
    return NextResponse.json({ error: "Pro has not connected a payment account" }, { status: 400 });
  }

  const balanceAmount = booking.confirmedRate - booking.depositAmount;

  const intent = await getStripe().paymentIntents.create({
    amount: Math.round(balanceAmount * 100),
    currency: "usd",
    transfer_data: { destination: booking.pro.stripeAccountId },
    application_fee_amount: Math.floor(balanceAmount * 0.10 * 100),
    metadata: { bookingId: booking.id, type: "balance" },
  });

  return NextResponse.json({ clientSecret: intent.client_secret });
}
