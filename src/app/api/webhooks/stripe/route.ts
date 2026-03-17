import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const sig = request.headers.get("stripe-signature")!;
  const body = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const intent = event.data.object;
      const { bookingId, type } = intent.metadata ?? {};
      if (!bookingId) break;

      if (type === "deposit") {
        await db.booking.update({
          where: { id: bookingId },
          data: { depositPaid: true },
        });
      } else if (type === "balance") {
        await db.booking.update({
          where: { id: bookingId },
          data: { balancePaid: true },
        });
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const intent = event.data.object;
      console.error(
        `PaymentIntent failed: id=${intent.id} bookingId=${intent.metadata?.bookingId} reason=${intent.last_payment_error?.message}`
      );
      break;
    }

    default:
      // All other event types — return 200 immediately
      break;
  }

  return NextResponse.json({ received: true });
}
