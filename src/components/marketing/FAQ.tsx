const faqs = [
  {
    q: "When does Bitburg launch?",
    a: "We're opening access in waves starting September 2026. Waitlist signups get first access, ordered by when you joined and which role you picked.",
  },
  {
    q: "Is there a cost to join?",
    a: "The waitlist is free. Posting jobs as a client will be free at launch. Pros pay a small platform fee per booking — no monthly subscriptions, no listing fees.",
  },
  {
    q: "How do you vet pros?",
    a: "Every pro submits a portfolio and work history. We review each application manually and place approved pros at a starting tier. No auto-approvals, no pay-to-play.",
  },
  {
    q: "What's the tier system?",
    a: "Pros are ranked D through S based on verified work and client feedback. Tier determines which jobs you can bid on and sets expectations for clients. You can't buy a tier — you earn it.",
  },
  {
    q: "Is my deposit safe?",
    a: "Yes. Deposits are held in escrow and only released when the work is delivered. If something goes wrong, we mediate. No wire transfers to strangers.",
  },
  {
    q: "Where is Bitburg available?",
    a: "DMV only at launch — DC, Maryland, and Virginia. Every pro lives and shoots locally. We'd rather be the best in one region than mediocre everywhere.",
  },
  {
    q: "I'm outside the DMV. Can I still sign up?",
    a: "Join the waitlist anyway. We'll let you know when we open in your region, and your spot counts toward proving demand there.",
  },
];

export function FAQ() {
  return (
    <section
      aria-labelledby="faq-heading"
      className="border-t border-[#D4CEBC] bg-[#F1EEE4] py-20"
    >
      <div className="mx-auto max-w-[780px] px-6">
        <span className="text-xs uppercase tracking-[0.18em] text-[#C9A961]">
          Questions, answered
        </span>
        <h2
          id="faq-heading"
          className="mt-3 font-serif text-3xl font-medium tracking-tight text-[#3D3C37] md:text-4xl"
        >
          Before you sign up.
        </h2>

        <dl className="mt-12 divide-y divide-[#D4CEBC] border-y border-[#D4CEBC]">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left">
                <dt className="font-serif text-lg text-[#3D3C37] md:text-xl">
                  {faq.q}
                </dt>
                <span
                  aria-hidden
                  className="mt-1 shrink-0 text-2xl leading-none text-[#C9A961] transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <dd className="pb-6 pr-10 text-[#6B6559]">{faq.a}</dd>
            </details>
          ))}
        </dl>
      </div>
    </section>
  );
}
