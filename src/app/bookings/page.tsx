import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { AdSlot } from "@/components/AdSlot";
import Link from "next/link";

const STATUS_BADGE: Record<string, string> = {
  CONFIRMED: "bg-blue-50 text-blue-700",
  COMPLETED: "bg-green-50 text-green-700",
  DISPUTED: "bg-orange-50 text-orange-700",
  CANCELLED: "bg-zinc-100 text-zinc-500",
};

const CATEGORY_LABELS: Record<string, string> = {
  PHOTOGRAPHY: "Photography",
  VIDEOGRAPHY: "Videography",
  VIDEO_EDITING: "Video Editing",
  PHOTO_EDITING: "Photo Editing",
  GRAPHIC_DESIGN: "Graphic Design",
  LIVE_STREAMING: "Live Streaming",
};

export default async function BookingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { proProfile: true },
  });
  if (!user) redirect("/sign-in");

  const isClient = user.role === "CLIENT" || user.role === "ADMIN";
  const isPro = user.role === "PRO";

  let bookings: BookingRow[] = [];

  if (isClient) {
    bookings = await db.booking.findMany({
      where: { clientId: user.id },
      include: {
        job: true,
        pro: { include: { user: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } else if (isPro && user.proProfile) {
    bookings = await db.booking.findMany({
      where: { proProfileId: user.proProfile.id },
      include: {
        job: true,
        client: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  const grouped = {
    CONFIRMED: bookings.filter((b) => b.status === "CONFIRMED"),
    COMPLETED: bookings.filter((b) => b.status === "COMPLETED"),
    DISPUTED: bookings.filter((b) => b.status === "DISPUTED"),
    CANCELLED: bookings.filter((b) => b.status === "CANCELLED"),
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <AdSlot zone="bookings-top" />
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-bold text-zinc-900">My Bookings</h1>
        <p className="mt-1 text-sm text-zinc-400">
          {isClient ? "Jobs you've booked pros for." : "Your booked engagements."}
        </p>

        {bookings.length === 0 && (
          <div className="mt-10 rounded-2xl border border-zinc-200 bg-white px-8 py-12 text-center">
            <p className="text-sm text-zinc-400">No bookings yet.</p>
          </div>
        )}

        {(["CONFIRMED", "COMPLETED", "DISPUTED", "CANCELLED"] as const).map((status) => {
          const list = grouped[status];
          if (list.length === 0) return null;
          return (
            <section key={status} className="mt-10">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                {status === "CONFIRMED"
                  ? "Active"
                  : status.charAt(0) + status.slice(1).toLowerCase()}
              </h2>
              <div className="space-y-3">
                {list.map((booking) => {
                  const otherPartyName = isClient
                    ? (booking as ClientBooking).pro?.user?.name ?? "—"
                    : (booking as ProBooking).client?.name ?? "—";

                  const jobTitle = booking.job?.title ?? "Direct Hire";
                  const category = booking.job
                    ? (CATEGORY_LABELS[booking.job.category] ?? booking.job.category)
                    : null;

                  const dateLabel =
                    booking.job?.jobType === "REMOTE"
                      ? booking.job.deliveryDeadline
                        ? `Due ${new Date(booking.job.deliveryDeadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                        : null
                      : booking.job?.eventDate
                        ? new Date(booking.job.eventDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : null;

                  return (
                    <Link
                      key={booking.id}
                      href={`/bookings/${booking.id}`}
                      className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-5 py-4 hover:border-zinc-300 hover:shadow-sm transition-all"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-900 truncate">{jobTitle}</p>
                        <p className="mt-0.5 text-xs text-zinc-400">
                          {isClient ? "Pro: " : "Client: "}
                          <span className="text-zinc-600">{otherPartyName}</span>
                          {category && (
                            <span className="ml-2 text-zinc-400">· {category}</span>
                          )}
                          {dateLabel && (
                            <span className="ml-2 text-zinc-400">· {dateLabel}</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 ml-4 shrink-0">
                        <span className="text-sm font-semibold text-zinc-900">
                          ${booking.confirmedRate.toLocaleString()}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[booking.status]}`}
                        >
                          {status === "CONFIRMED"
                            ? "Active"
                            : status.charAt(0) + status.slice(1).toLowerCase()}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

// Type helpers to satisfy TypeScript for the two fetch shapes
type ClientBooking = {
  id: string;
  status: string;
  confirmedRate: number;
  job: { title: string; category: string; jobType: string; eventDate: Date | null; deliveryDeadline: Date | null } | null;
  pro: { user: { name: string } } | null;
  client?: never;
};

type ProBooking = {
  id: string;
  status: string;
  confirmedRate: number;
  job: { title: string; category: string; jobType: string; eventDate: Date | null; deliveryDeadline: Date | null } | null;
  client: { name: string } | null;
  pro?: never;
};

type BookingRow = ClientBooking | ProBooking;
