import { WaitlistForm } from "./WaitlistForm";

// The final CTA uses the brand forest green as an accent band against the
// near-black body background — visually signaling "this is the moment to act."

export function FinalCTA() {
  return (
    <section
      aria-labelledby="final-cta-heading"
      className="relative overflow-hidden border-t border-white/10 bg-[#0F2D22] text-[#F8F7F3]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 100% 0%, rgba(201,169,97,0.18), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-[780px] px-6 py-24 md:py-32">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A961]/30 bg-[#C9A961]/5 px-3 py-1 font-mono text-xs uppercase tracking-[0.22em] text-[#C9A961]">
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-[#C9A961]"
          />
          Early access · Opens 2026.09.01
        </span>
        <h2
          id="final-cta-heading"
          className="mt-6 font-serif text-4xl font-medium leading-[1] tracking-tight text-[#F8F7F3] md:text-6xl"
        >
          Be first through the door.
        </h2>
        <p className="mt-6 max-w-prose text-lg text-[#F8F7F3]/70">
          Bitburg opens in waves. Waitlist signups get access before everyone
          else — pros get their applications reviewed first, clients get a
          head start on booking the region&apos;s best.
        </p>

        <div className="mt-12">
          <WaitlistForm
            variant="dark"
            submitLabel="Claim my spot"
            microcopy="One email when your role opens. That's it."
          />
        </div>
      </div>
    </section>
  );
}
