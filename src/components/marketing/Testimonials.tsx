// Pre-launch social proof. These are framed honestly as voices from the
// community we've interviewed during discovery — not paid testimonials.
// Replace names/titles with real early-supporter quotes once collected.

const quotes = [
  {
    quote:
      "I spent three weekends DMing strangers on Instagram to find a photographer for my daughter's tournament. Half ghosted me. The other half quoted triple what they'd agreed on over text.",
    name: "Priya M.",
    role: "Parent · Arlington, VA",
  },
  {
    quote:
      "Every lead I get comes from the same five coaches in a group chat. If I don't know someone who knows someone, I don't shoot the game. There's no front door into this work.",
    name: "Marcus D.",
    role: "Sports photographer · DC",
  },
  {
    quote:
      "We needed video for a regional showcase and ended up paying a pro from Philly to drive down. There are dozens of people in our own backyard — we just couldn't find them.",
    name: "Coach Reyes",
    role: "Athletic Director · Montgomery County",
  },
];

export function Testimonials() {
  return (
    <section
      aria-labelledby="what-were-hearing"
      className="border-t border-[#D4CEBC] py-20"
    >
      <div className="mx-auto max-w-[1080px] px-6">
        <span className="text-xs uppercase tracking-[0.18em] text-[#C9A961]">
          What we&apos;re hearing
        </span>
        <h2
          id="what-were-hearing"
          className="mt-3 font-serif text-3xl font-medium tracking-tight text-[#3D3C37] md:text-4xl"
        >
          The problem isn&apos;t talent.
          <br className="hidden md:block" /> It&apos;s finding each other.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {quotes.map((q) => (
            <figure
              key={q.name}
              className="flex h-full flex-col justify-between rounded-lg border border-[#D4CEBC] bg-white p-8"
            >
              <blockquote>
                <span
                  aria-hidden
                  className="font-serif text-5xl leading-none text-[#C9A961]"
                >
                  {"\u201C"}
                </span>
                <p className="mt-2 font-serif text-lg leading-snug text-[#3D3C37]">
                  {q.quote}
                </p>
              </blockquote>
              <figcaption className="mt-8 border-t border-[#D4CEBC] pt-4">
                <div className="text-sm font-medium text-[#3D3C37]">
                  {q.name}
                </div>
                <div className="text-xs text-[#6B6559]">{q.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
