"use client";

import "./bitburg.css";
import { Specialties, HowItWorks, SplitSections } from "./sections";
import { Signup } from "./signup";

export default function WaitlistPage() {
  return (
    <div className="bb-root">
      <div className="bb-page">
        <Nav />
        <Hero />
        <Specialties />
        <HowItWorks />
        <SplitSections />
        <Signup />
        <Footer />
      </div>
    </div>
  );
}

function Nav() {
  return (
    <nav className="bb-nav">
      <div className="bb-nav__brand">
        <span className="bb-nav__mark"><span>B</span></span>
        <span>Bitburg</span>
        <span className="bb-nav__beta"><span>Early access</span></span>
      </div>
      <ul className="bb-nav__links">
        <li><a href="#how">How it works</a></li>
        <li><a href="#pros">For pros</a></li>
        <li><a href="#clients">For clients</a></li>
        <li><a href="#signup">Early access</a></li>
      </ul>
      <div>
        <a href="#signup" className="bb-btn bb-btn--primary">Get in line →</a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="bb-hero">
      <div className="bb-hero__bg" />
      <div className="bb-hero__grid" />
      <div className="bb-hero__grain" />
      <div className="bb-hero__inner">
        <div>
          <span className="bb-capsule bb-capsule--outline">
            <span>● Early access · Fall 2026</span>
          </span>
          <h1 className="bb-hero__title">
            The <em>media crew</em><br />
            Built for sports.
          </h1>
          <p className="bb-hero__lede">
            Bitburg is the tiered marketplace for sports media in the DMV —
            photographers, videographers, broadcasters, graphic designers,
            live-stream ops and social managers. Teams post the gig,
            pros earn the tier, everyone gets paid on the job is done.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="#signup" className="bb-btn bb-btn--primary bb-btn--lg">
              Join the crew <span aria-hidden="true">→</span>
            </a>
            <a href="#how" className="bb-btn bb-btn--ghost-dark bb-btn--lg">
              How it works
            </a>
          </div>
          <div className="bb-hero__stats">
            <div>
              <div className="bb-stat__num bb-stat__num--blue">5</div>
              <span className="bb-stat__label">Tiers · D → S</span>
            </div>
            <div>
              <div className="bb-stat__num">6</div>
              <span className="bb-stat__label">Sports-media specialties</span>
            </div>
            <div>
              <div className="bb-stat__num bb-stat__num--gold">0%</div>
              <span className="bb-stat__label">Early-access fees</span>
            </div>
          </div>
        </div>

        <TeaserCard />
      </div>
    </section>
  );
}

function TeaserCard() {
  return (
    <div style={{ position: "relative" }}>
      <article className="bb-jobcard" role="img" aria-label="Bitburg early access teaser">
        <header className="bb-jobcard__chrome">
          <div className="bb-jobcard__dots"><i /><i /><i /></div>
          <div className="bb-jobcard__url">bitburg.co/early-access</div>
        </header>
        <div className="bb-jobcard__body">
          <div className="bb-jobcard__eyebrow">
            <span className="live">● NOW ENROLLING</span>
            <span>·</span>
            <span>DMV · Fall 2026</span>
          </div>
          <h3 className="bb-jobcard__title">
            Early access is <em>open.</em>
          </h3>
          <div className="bb-jobcard__sub">
            <span>For pros</span>
            <span>For teams</span>
            <span>Invite-only launch</span>
          </div>

          <div className="bb-teaser">
            <div className="bb-teaser__row">
              <span className="bb-teaser__dot" />
              <span className="bb-teaser__label">Event photo</span>
              <span className="bb-teaser__meta">DMV</span>
            </div>
            <div className="bb-teaser__row">
              <span className="bb-teaser__dot" />
              <span className="bb-teaser__label">Event video</span>
              <span className="bb-teaser__meta">DMV</span>
            </div>
            <div className="bb-teaser__row">
              <span className="bb-teaser__dot" />
              <span className="bb-teaser__label">Live broadcast</span>
              <span className="bb-teaser__meta">DMV</span>
            </div>
            <div className="bb-teaser__row">
              <span className="bb-teaser__dot" />
              <span className="bb-teaser__label">Graphic design</span>
              <span className="bb-teaser__meta">DMV</span>
            </div>
            <div className="bb-teaser__row">
              <span className="bb-teaser__dot" />
              <span className="bb-teaser__label">Social media</span>
              <span className="bb-teaser__meta">DMV</span>
            </div>
            <div className="bb-teaser__row">
              <span className="bb-teaser__dot" />
              <span className="bb-teaser__label">Stream ops</span>
              <span className="bb-teaser__meta">DMV</span>
            </div>
          </div>

          <div className="bb-jobcard__actions">
            <a
              href="#signup"
              className="bb-jobcard__btn bb-jobcard__btn--ghost"
              style={{ textDecoration: "none", textAlign: "center", display: "grid", placeItems: "center" }}
            >
              I&apos;m a team
            </a>
            <a
              href="#signup"
              className="bb-jobcard__btn bb-jobcard__btn--primary"
              style={{ textDecoration: "none", textAlign: "center", display: "grid", placeItems: "center" }}
            >
              I&apos;m a pro →
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bb-footer">
      <div className="bb-footer__grid">
        <div className="bb-footer__brand">
          <div className="bb-nav__brand" style={{ color: "#fff" }}>
            <span className="bb-nav__mark"><span>B</span></span>
            <span>Bitburg</span>
          </div>
          <p>
            A two-sided marketplace for media professionals and the
            clients who hire them — purpose-built for the DMV.
          </p>
          <p
            style={{
              marginTop: 16,
              fontSize: 11,
              letterSpacing: ".22em",
              textTransform: "uppercase",
              color: "#6b6e73",
              fontWeight: 700,
            }}
          >
            Launching Fall 2026
          </p>
        </div>
        <div className="bb-footer__col">
          <h4>Product</h4>
          <a>How it works</a>
          <a>Tier system <em>· new</em></a>
          <a>Pricing</a>
          <a>Roadmap</a>
        </div>
        <div className="bb-footer__col">
          <h4>Crew</h4>
          <a>For pros</a>
          <a>For clients</a>
          <a>Tryouts <em>· open</em></a>
          <a>Refer a pro</a>
        </div>
        <div className="bb-footer__col">
          <h4>Company</h4>
          <a href="mailto:hello@bitburg.co">hello@bitburg.co</a>
          <a>Press kit</a>
          <a>Terms</a>
          <a>Privacy</a>
        </div>
      </div>
      <div className="bb-footer__bot">
        <span>© 2026 Bitburg · Northern Virginia</span>
        <span>Built for the DMV</span>
      </div>
    </footer>
  );
}
