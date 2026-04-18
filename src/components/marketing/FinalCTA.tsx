import { WaitlistForm } from "./WaitlistForm";

export function FinalCTA() {
  return (
    <section
      aria-labelledby="final-cta-heading"
      className="bg-[#0F2D22] text-[#F8F7F3]"
    >
      <div className="mx-auto max-w-[780px] px-6 py-24 md:py-32">
        <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#C9A961]">
          Early access · Opens 2026.09.01
        </span>
        <h2
          id="final-cta-heading"
          className="mt-6 font-serif text-4xl font-medium leading-[1] tracking-tight text-[#F8F7F3] md:text-6xl"
        >
          Be first through the door.
        </h2>
        <p className="mt-6 max-w-prose text-lg text-[#F8F7F3]/70">
          Bitburg opens in waves. Waitlist signups get access before
          everyone else — pros get their applications reviewed first,
          clients get a head start on booking the region&apos;s best.
        </p>

        <div className="mt-12">
          <WaitlistForm
            variant="dark"
            submitLabel="Claim my spot"
            microcopy="One email when your role opens. That&apos;s it."
          />
        </div>
      </div>
    </section>
  );
}
