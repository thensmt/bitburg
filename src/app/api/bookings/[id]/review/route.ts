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

  const { id: bookingId } = await params;

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: { review: true, pro: true },
  });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  // Only the client may leave a review
  if (booking.clientId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (booking.status !== "COMPLETED") {
    return NextResponse.json(
      { error: "Reviews can only be left on completed bookings." },
      { status: 409 }
    );
  }

  if (booking.review) {
    return NextResponse.json({ error: "A review already exists for this booking." }, { status: 409 });
  }

  const body = await req.json();
  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be an integer between 1 and 5." }, { status: 422 });
  }

  // reviewee is the pro's user id
  const proUserId = booking.pro.userId;

  const review = await db.review.create({
    data: {
      bookingId,
      reviewerId: user.id,
      revieweeId: proUserId,
      rating,
      body: body.body ?? null,
    },
  });

  // Recalculate pro's average rating and increment total jobs completed
  const allReviews = await db.review.findMany({ where: { revieweeId: proUserId } });
  const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

  await db.proProfile.update({
    where: { userId: proUserId },
    data: {
      avgRating: avg,
      totalJobsCompleted: { increment: 1 },
    },
  });

  return NextResponse.json(review, { status: 201 });
}
