const stats = [
  { value: "240+", label: "On the waitlist" },
  { value: "40+", label: "Vetted pros ready to shoot" },
  { value: "D → S", label: "Tiered ranking system" },
  { value: "DMV", label: "Local, every shoot" },
];

export function TrustBand() {
  return (
    <section
      aria-label="By the numbers"
      className="border-y border-white/10 bg-[#0F1F18]"
    >
      <div className="mx-auto grid max-w-[1080px] grid-cols-2 gap-y-10 px-6 py-12 md:grid-cols-4 md:gap-0 md:py-10">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={
              i === 0
                ? "text-center md:text-left"
                : i === stats.length - 1
                ? "text-center md:text-right"
                : "text-center"
            }
          >
            <div className="font-serif text-3xl font-medium tracking-tight text-[#C9A961] md:text-4xl">
              {stat.value}
            </div>
            <div className="mt-2 text-xs uppercase tracking-[0.18em] text-[#A8B5AE]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
