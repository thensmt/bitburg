"use client";

// Specialties, HowItWorks, and SplitSections — static marketing panels.

type Spec = { glyph: string; title: string; body: string; meta: string };

export function Specialties() {
  const specs: Spec[] = [
    { glyph: "PHO", title: "Sports photography", body: "On-site coverage, portraits, team photos.", meta: "D → S · $ per shoot" },
    { glyph: "VID", title: "Sports videography", body: "Cinematic event coverage, hype reels, behind-the-scenes.", meta: "D → S · $ per shoot" },
    { glyph: "GFX", title: "Graphic design", body: "Matchday graphics, schedule kits, roster cards.", meta: "D → S · $ per pack" },
    { glyph: "SOC", title: "Social managers", body: "Gameday IG / TikTok, live post, stories, recaps.", meta: "D → S · $ per event" },
    { glyph: "LIV", title: "Live-stream ops", body: "Multi-cam switchers, scoreboard, broadcast graphics.", meta: "D → S · $ per stream" },
    { glyph: "BRO", title: "Broadcasters", body: "Play-by-play, color, sideline reporters.", meta: "D → S · $ per call" },
  ];

  return (
    <section className="bb-section bb-section--alt">
      <div className="bb-wrap">
        <header className="bb-section__head">
          <div className="bb-section__eyebrow">The roster · Phase one</div>
          <h2 className="bb-section__title">
            One crew for <em>every event.</em>
          </h2>
          <p className="bb-section__lede">
            Bitburg launches with six sports-media disciplines — everything a
            team needs to cover an event end-to-end. Hire one, or build a full
            squad from a single post.
          </p>
        </header>

        <div className="bb-specs">
          {specs.map((s) => (
            <article key={s.title} className="bb-spec">
              <span className="bb-spec__glyph"><span>{s.glyph}</span></span>
              <h3 className="bb-spec__title">{s.title}</h3>
              <p className="bb-spec__body">{s.body}</p>
              <div className="bb-spec__meta">{s.meta}</div>
            </article>
          ))}
        </div>

        <div className="bb-phase">
          <b><span>Phase two</span></b>
          <span>After sports, Bitburg expands to weddings, corporate, real estate and beyond — same tiered marketplace, new arenas.</span>
        </div>
      </div>
    </section>
  );
}

type Step = {
  num: string;
  tag: string;
  title: string;
  body: string;
  foot: [string, string];
};

export function HowItWorks() {
  const steps: Step[] = [
    {
      num: "01",
      tag: "Audition",
      title: "Prove your level",
      body: "Every pro submits a portfolio and gets vetted by our team. You're placed into a tier — D through S — based on skill, reliability and past work. Level up as your ratings climb.",
      foot: ["Admin-vetted", "D → C → B → A → S"],
    },
    {
      num: "02",
      tag: "Post or pick",
      title: "Post the gig. Or pick your pro.",
      body: "Teams, leagues and athletes post a media job and let pros apply — or skip the wait and instant-hire any tier at its set rate. The back-and-forth is done.",
      foot: ["On-site + remote", "Fixed tier rates"],
    },
    {
      num: "03",
      tag: "Payout",
      title: "Get paid. Build the rank.",
      body: "Deposit is held in escrow and released on delivery. Every booking builds your rating, which moves you up the ladder — faster gigs, higher rates, better jobs.",
      foot: ["Escrow payouts", "Climb the ladder"],
    },
  ];

  return (
    <section id="how" className="bb-section">
      <div className="bb-wrap">
        <header className="bb-section__head">
          <div className="bb-section__eyebrow">How it works</div>
          <h2 className="bb-section__title">
            Three moves to <em>get on the crew.</em>
          </h2>
          <p className="bb-section__lede">
            Bitburg is built like a team: there are auditions, there are tiers,
            and there&apos;s a scoreboard. Here&apos;s how you play.
          </p>
        </header>
        <div className="bb-steps">
          {steps.map((s) => (
            <article key={s.num} className="bb-step">
              <div className="bb-step__num">{s.num}</div>
              <div className="bb-step__tag">{s.tag}</div>
              <h3 className="bb-step__title">{s.title}</h3>
              <p className="bb-step__body">{s.body}</p>
              <div className="bb-step__foot">
                <span>{s.foot[0]}</span>
                <span>{s.foot[1]}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SplitSections() {
  return (
    <section id="pros" className="bb-section bb-section--ink">
      <div className="bb-wrap">
        <header className="bb-section__head">
          <div className="bb-section__eyebrow">Two sides · one crew</div>
          <h2 className="bb-section__title">
            Built for <em>pros and clients</em> alike.
          </h2>
          <p className="bb-section__lede">
            Whether you shoot the gigs or book them, Bitburg is designed to
            reward skill and move faster than a phone tree ever could.
          </p>
        </header>

        <div className="bb-split">
          <div className="bb-split__side">
            <span className="bb-split__tag bb-split__tag--gold"><span>◆ For pros</span></span>
            <h3 className="bb-split__title">Earn your tier.<br />Name your rate.</h3>
            <p className="bb-split__lede">
              Photographers, videographers, graphic designers, gameday social
              managers, live-stream ops, broadcasters — every tier has a fixed
              rate card. Compete on skill, not on a race to the bottom.
            </p>

            <div className="bb-ladder" aria-label="Sample 3-hour rates by tier">
              <div className="bb-ladder__head">
                <span>Tier</span>
                <span>Fit · 3hr event shoot</span>
              </div>
              <div className="bb-ladder__row bb-ladder__row--s">
                <div className="bb-rate__tier bb-rate__tier--s">S</div>
                <span className="bb-ladder__label">Elite</span>
                <div className="bb-ladder__bar bb-ladder__bar--s" style={{ width: "100%" }} />
                <span className="bb-ladder__rate">★★★★★</span>
              </div>
              <div className="bb-ladder__row">
                <div className="bb-rate__tier bb-rate__tier--a">A</div>
                <span className="bb-ladder__label">Advanced</span>
                <div className="bb-ladder__bar" style={{ width: "78%" }} />
                <span className="bb-ladder__rate">★★★★</span>
              </div>
              <div className="bb-ladder__row">
                <div className="bb-rate__tier bb-rate__tier--b">B</div>
                <span className="bb-ladder__label">Established</span>
                <div className="bb-ladder__bar" style={{ width: "62%" }} />
                <span className="bb-ladder__rate">★★★</span>
              </div>
              <div className="bb-ladder__row">
                <div className="bb-rate__tier bb-rate__tier--c">C</div>
                <span className="bb-ladder__label">Emerging</span>
                <div className="bb-ladder__bar bb-ladder__bar--c" style={{ width: "45%" }} />
                <span className="bb-ladder__rate">★★</span>
              </div>
              <div className="bb-ladder__row">
                <div className="bb-rate__tier bb-rate__tier--d">D</div>
                <span className="bb-ladder__label">Rookie</span>
                <div className="bb-ladder__bar bb-ladder__bar--d" style={{ width: "32%" }} />
                <span className="bb-ladder__rate">★</span>
              </div>
            </div>

            <ul className="bb-split__list">
              <li>
                <span className="bb-split__check bb-split__check--gold">✓</span>
                <span><b>Get vetted once.</b> One review unlocks instant-hire eligibility at your tier.</span>
              </li>
              <li>
                <span className="bb-split__check bb-split__check--gold">✓</span>
                <span><b>No bidding wars.</b> Tier rates are set. Your job is to show up and deliver.</span>
              </li>
              <li>
                <span className="bb-split__check bb-split__check--gold">✓</span>
                <span><b>Climb the ladder.</b> Ratings and completed gigs move you up. Up means more pay, better work.</span>
              </li>
            </ul>

            <a href="#signup" className="bb-btn bb-btn--primary">Apply as a pro →</a>
          </div>

          <div id="clients" className="bb-split__side">
            <span className="bb-split__tag"><span>◆ For clients</span></span>
            <h3 className="bb-split__title">Post it. Pick it.<br />Or book it now.</h3>
            <p className="bb-split__lede">
              Teams, programs, leagues and athletes. Every pro on Bitburg is
              vetted and tiered — you know what you&apos;re getting before the first call.
            </p>

            <div className="bb-post" aria-label="Sample team job post">
              <div className="bb-post__row">
                <span>New gig · Arlington</span>
                <span className="bb-pill">Posted 12 min ago</span>
              </div>
              <h4 className="bb-post__title">Gameday · Media coverage</h4>
              <div className="bb-post__fields">
                <div className="bb-post__field">Date<b>Fri · Oct 3</b></div>
                <div className="bb-post__field">Duration<b>3 hours</b></div>
                <div className="bb-post__field">Min tier<b>A or higher</b></div>
                <div className="bb-post__field">Call time<b>6:00 PM</b></div>
              </div>
              <div className="bb-post__applicants">
                <div className="bb-post__avatars">
                  <i style={{ background: "#0E80FC" }}>MR</i>
                  <i style={{ background: "#F5C84B", color: "#07080A" }}>JT</i>
                  <i style={{ background: "#6FA8FF", color: "#07080A" }}>AK</i>
                  <i style={{ background: "#2F3338" }}>+2</i>
                </div>
                <div className="bb-post__count"><b>5 pros</b> applied · 1 S-tier online</div>
              </div>
            </div>

            <ul className="bb-split__list" style={{ marginTop: 28 }}>
              <li>
                <span className="bb-split__check">✓</span>
                <span><b>Cover the whole event.</b> Event photo, multi-cam stream, post-game reel and event socials — one crew.</span>
              </li>
              <li>
                <span className="bb-split__check">✓</span>
                <span><b>Fixed prices per tier.</b> No quote phone-tag. Book an S-tier shooter or post and let pros apply.</span>
              </li>
              <li>
                <span className="bb-split__check">✓</span>
                <span><b>Escrow-protected.</b> Deposit held, balance released on delivery. Disputes covered.</span>
              </li>
            </ul>

            <a href="#signup" className="bb-btn bb-btn--primary">Book a pro →</a>
          </div>
        </div>
      </div>
    </section>
  );
}
