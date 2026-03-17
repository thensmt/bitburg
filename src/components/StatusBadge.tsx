import { cn } from "@/lib/utils";

type StatusVariant =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CONFIRMED"
  | "COMPLETED"
  | "DISPUTED"
  | "CANCELLED"
  | "SELECTED"
  | "WITHDRAWN"
  | "OPEN"
  | "IN_REVIEW"
  | "AWARDED";

const STATUS_STYLES: Record<StatusVariant, string> = {
  PENDING: "bg-yellow-50 text-yellow-800 border-yellow-200",
  APPROVED: "bg-green-50 text-green-700 border-green-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
  DISPUTED: "bg-orange-50 text-orange-700 border-orange-200",
  CANCELLED: "bg-zinc-50 text-zinc-500 border-zinc-200",
  SELECTED: "bg-green-50 text-green-700 border-green-200",
  WITHDRAWN: "bg-zinc-50 text-zinc-500 border-zinc-200",
  OPEN: "bg-blue-50 text-blue-700 border-blue-200",
  IN_REVIEW: "bg-yellow-50 text-yellow-800 border-yellow-200",
  AWARDED: "bg-violet-50 text-violet-700 border-violet-200",
};

const STATUS_LABELS: Record<StatusVariant, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  DISPUTED: "Disputed",
  CANCELLED: "Cancelled",
  SELECTED: "Selected",
  WITHDRAWN: "Withdrawn",
  OPEN: "Open",
  IN_REVIEW: "In Review",
  AWARDED: "Awarded",
};

interface StatusBadgeProps {
  status: StatusVariant;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status] ?? "bg-zinc-50 text-zinc-500 border-zinc-200",
        className
      )}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
