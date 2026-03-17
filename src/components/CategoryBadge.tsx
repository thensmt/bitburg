import { cn } from "@/lib/utils";

const CATEGORY_LABELS: Record<string, string> = {
  PHOTOGRAPHY: "Photography",
  VIDEOGRAPHY: "Videography",
  VIDEO_EDITING: "Video Editing",
  PHOTO_EDITING: "Photo Editing",
  GRAPHIC_DESIGN: "Graphic Design",
  LIVE_STREAMING: "Live Streaming",
};

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600",
        className
      )}
    >
      {CATEGORY_LABELS[category] ?? category}
    </span>
  );
}
