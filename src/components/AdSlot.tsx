interface AdSlotProps {
  zone: string;
  className?: string;
}

// Ad slot placeholder — reserved for sponsored content.
// Renders nothing until content is assigned via the admin panel.
export function AdSlot({ zone, className }: AdSlotProps) {
  if (process.env.NODE_ENV === "development") {
    return (
      <div
        className={`flex items-center justify-center bg-zinc-100 text-xs text-zinc-400 border border-dashed border-zinc-300 ${className ?? "h-16 w-full"}`}
        data-ad-zone={zone}
      >
        Ad slot: {zone}
      </div>
    );
  }

  // Production: render nothing until ad content is wired up
  return <div data-ad-zone={zone} className={className} />;
}
