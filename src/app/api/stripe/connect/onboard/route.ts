import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({
    where: { clerkId },
    include: { proProfile: true },
  });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "PRO") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!user.proProfile) return NextResponse.json({ error: "Pro profile not found" }, { status: 404 });

  let stripeAccountId = user.proProfile.stripeAccountId;

  if (!stripeAccountId) {
    const account = await stripe.accounts.create({ type: "express" });
    stripeAccountId = account.id;
    await db.proProfile.update({
      where: { id: user.proProfile.id },
      data: { stripeAccountId },
    });
  }

  const accountLink = await stripe.accountLinks.create({
    account: stripeAccountId,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?stripe=refresh`,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?stripe=success`,
    type: "account_onboarding",
  });

  return NextResponse.json({ url: accountLink.url });
}
