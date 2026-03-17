import { cn } from "@/lib/utils";

type Tier = "S" | "A" | "B" | "C" | "D";

const TIER_STYLES: Record<Tier, string> = {
  S: "bg-amber-100 text-amber-800 border-amber-200",
  A: "bg-orange-100 text-orange-800 border-orange-200",
  B: "bg-violet-100 text-violet-800 border-violet-200",
  C: "bg-blue-100 text-blue-800 border-blue-200",
  D: "bg-zinc-100 text-zinc-600 border-zinc-200",
};

interface TierBadgeProps {
  tier: Tier;
  className?: string;
}

export function TierBadge({ tier, className }: TierBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold",
        TIER_STYLES[tier],
        className
      )}
    >
      Tier {tier}
    </span>
  );
}
