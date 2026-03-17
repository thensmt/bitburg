"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { AdSlot } from "@/components/AdSlot";
import Link from "next/link";
import { CompleteButton } from "./CompleteButton";
import { ReviewForm } from "./ReviewForm";
import { DisputeForm } from "./DisputeForm";

const CATEGORY_LABELS: Record<string, string> = {
  PHOTOGRAPHY: "Photography",
  VIDEOGRAPHY: "Videography",
  VIDEO_EDITING: "Video Editing",
  PHOTO_EDITING: "Photo Editing",
  GRAPHIC_DESIGN: "Graphic Design",
  LIVE_STREAMING: "Live Streaming",
};

const STATUS_BADGE: Record<string, string> = {
  CONFIRMED: "bg-blue-50 text-blue-700",
  COMPLETED: "bg-green-50 text-green-700",
  DISPUTED: "bg-orange-50 text-orange-700",
  CANCELLED: "bg-zinc-100 text-zinc-500",
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-amber-400">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < rating ? "★" : "☆"}</span>
      ))}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-zinc-100 last:border-0">
      <span className="text-sm text-zinc-400">{label}</span>
      <span className="text-sm font-medium text-zinc-900">{value}</span>
    </div>
  );
}

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { proProfile: true },
  });
  if (!user) redirect("/sign-in");

  const booking = await db.booking.findUnique({
    where: { id },
    include: {
      job: true,
      client: true,
      pro: { include: { user: true } },
      review: { include: { reviewer: true } },
      dispute: true,
    },
  });

  if (!booking) notFound();

  // Authorization: must be client or the pro on this booking
  const isClient = booking.clientId === user.id;
  const isPro = user.proProfile?.id === booking.proProfileId;

  if (!isClient && !isPro && user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="rounded-2xl border border-zinc-200 bg-white px-8 py-12 text-center max-w-sm">
          <p className="text-sm font-semibold text-zinc-900">Access Denied</p>
          <p className="mt-1 text-sm text-zinc-400">You are not a party to this booking.</p>
          <Link href="/bookings" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
            ← Back to bookings
          </Link>
        </div>
      </div>
    );
  }

  const job = booking.job;
  const statusLabel =
    booking.status === "CONFIRMED"
      ? "Active"
      : booking.status.charAt(0) + booking.status.slice(1).toLowerCase();

  const dateLabel =
    job?.jobType === "REMOTE"
      ? job.deliveryDeadline
        ? new Date(job.deliveryDeadline).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : "—"
      : job?.eventDate
        ? new Date(job.eventDate).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : "—";

  const dateLabelKey = job?.jobType === "REMOTE" ? "Delivery Deadline" : "Event Date";

  const canComplete = isClient && booking.status === "CONFIRMED";
  const canReview =
    isClient && booking.status === "COMPLETED" && !booking.review;
  const canDispute =
    (isClient || isPro) &&
    (booking.status === "CONFIRMED" || booking.status === "COMPLETED") &&
    !booking.dispute;

  return (
    <div className="min-h-screen bg-zinc-50">
      <AdSlot zone="booking-detail-top" />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link href="/bookings" className="text-sm text-zinc-400 hover:text-zinc-600">
          ← Back to bookings
        </Link>

        <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">
              {job?.title ?? "Direct Hire"}
            </h1>
            {job && (
              <p className="mt-1 text-sm text-zinc-400">
                {CATEGORY_LABELS[job.category] ?? job.category} ·{" "}
                {job.jobType === "ON_SITE" ? "On-site" : "Remote"}
              </p>
            )}
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE[booking.status]}`}
          >
            {statusLabel}
          </span>
        </div>

        {/* Booking details */}
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Booking Details
          </h2>
          <div className="mt-3">
            <InfoRow label="Confirmed Rate" value={`$${booking.confirmedRate.toLocaleString()}`} />
            <InfoRow label="Deposit Amount" value={`$${booking.depositAmount.toLocaleString()}`} />
            <InfoRow
              label="Deposit Paid"
              value={booking.depositPaid ? "✓ Paid" : "✗ Unpaid"}
            />
            <InfoRow
              label="Balance Paid"
              value={booking.balancePaid ? "✓ Paid" : "✗ Unpaid"}
            />
            {job && <InfoRow label={dateLabelKey} value={dateLabel} />}
          </div>
        </div>

        {/* Parties */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
              Client
            </p>
            <div className="flex items-center gap-3">
              {booking.client.avatar ? (
                <img
                  src={booking.client.avatar}
                  alt={booking.client.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-zinc-200 flex items-center justify-center text-sm font-semibold text-zinc-600">
                  {booking.client.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-zinc-900">{booking.client.name}</p>
                <p className="text-xs text-zinc-400">Client</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
              Pro
            </p>
            <div className="flex items-center gap-3">
              {booking.pro.user.avatar ? (
                <img
                  src={booking.pro.user.avatar}
                  alt={booking.pro.user.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-zinc-200 flex items-center justify-center text-sm font-semibold text-zinc-600">
                  {booking.pro.user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-zinc-900">{booking.pro.user.name}</p>
                <p className="text-xs text-zinc-400">Tier {booking.pro.tier}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        {canComplete && (
          <div className="mt-6">
            <CompleteButton bookingId={booking.id} />
          </div>
        )}

        {canReview && (
          <div className="mt-6">
            <ReviewForm bookingId={booking.id} />
          </div>
        )}

        {canDispute && (
          <div className="mt-6">
            <DisputeForm bookingId={booking.id} />
          </div>
        )}

        {/* Existing dispute */}
        {booking.dispute && (
          <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-6">
            <h2 className="text-sm font-semibold text-orange-800 mb-3">Dispute Open</h2>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-orange-600 font-medium">Reason</p>
                <p className="text-sm text-orange-900 mt-0.5">{booking.dispute.reason}</p>
              </div>
              {booking.dispute.evidence && (
                <div>
                  <p className="text-xs text-orange-600 font-medium">Evidence</p>
                  <p className="text-sm text-orange-900 mt-0.5">{booking.dispute.evidence}</p>
                </div>
              )}
              {booking.dispute.resolution && (
                <div>
                  <p className="text-xs text-orange-600 font-medium">Resolution</p>
                  <p className="text-sm text-orange-900 mt-0.5">{booking.dispute.resolution}</p>
                  {booking.dispute.resolvedAt && (
                    <p className="text-xs text-orange-500 mt-1">
                      Resolved{" "}
                      {new Date(booking.dispute.resolvedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Existing review */}
        {booking.review && (
          <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-zinc-700 mb-3">Review</h2>
            <div className="flex items-center gap-2 mb-2">
              <Stars rating={booking.review.rating} />
              <span className="text-sm font-semibold text-zinc-700">{booking.review.rating}/5</span>
            </div>
            {booking.review.body && (
              <p className="text-sm text-zinc-700 leading-relaxed">{booking.review.body}</p>
            )}
            <p className="mt-3 text-xs text-zinc-400">
              By {booking.review.reviewer.name} ·{" "}
              {new Date(booking.review.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        )}

        <AdSlot zone="booking-detail-bottom" />
      </div>
    </div>
  );
}
