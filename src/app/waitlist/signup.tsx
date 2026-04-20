/* eslint-disable */
// @ts-nocheck
"use client";

// Signup + Pro intake wizard — ported verbatim from Claude Design export
// (index.html lines 2397–2995). Types deferred; strict TS disabled on this
// file to allow a fast port. Tighten later.

import { useState, useEffect } from "react";


export function Signup() {
  const [tab, setTab] = useState('client');
  const [clientDone, setClientDone] = useState(false);
  const [clientData, setClientData] = useState({ email: '', name: '', role: '', zip: '' });

  // Pro flow state — total wizard steps depends on how many specialties the
  // pro picks (3 + specialties.length), so "done" is a separate flag rather
  // than a fixed sentinel step.
  const [proStep, setProStep] = useState(0); // 0 = email capture, 1..N = wizard
  const [proDone, setProDone] = useState(false);
  const [pro, setPro] = useState({
    email: '', name: '', zip: '',
    specialties: [],
    years: '', paidGigs: '', tier: '',
    gear: '', hsSports: '', hsCount: '', insurance: '', portfolio: '',
    weekdays: false, weekends: false, radius: '', turnaround: [], rushPct: '',
    pricing: {}, // { specialty: { min, ideal } }
  });

  const [pricingVariantState, setPricingVariant] = useState('bands');
  useEffect(() => {
    function onTweak(e) {
      if (e.detail && e.detail.pricingVariant) setPricingVariant(e.detail.pricingVariant);
    }
    window.addEventListener('bb-tweaks-updated', onTweak);
    return () => window.removeEventListener('bb-tweaks-updated', onTweak);
  }, []);
  const pricingVariant = pricingVariantState;

  function submitClient(e) { e.preventDefault(); setClientDone(true); }
  function submitProEmail(e) { e.preventDefault(); setProStep(1); }
  function finishPro() { setProDone(true); }
  function setP(patch) { setPro(p => ({ ...p, ...patch })); }

  return (
    <section id="signup" className="bb-section bb-section--alt">
      <div className="bb-wrap">
        <header className="bb-section__head">
          <div className="bb-section__eyebrow">◆ Early access — Fall 2026</div>
          <h2 className="bb-section__title">Reserve your <em>crew spot.</em></h2>
          <p className="bb-section__lede">
            Early access opens to a short list first. Tell us which side of the
            side you're on and we'll save you a seat before signups go public.
          </p>
        </header>

        <div className="bb-signup">
          <div className="bb-signup__tabs" role="tablist">
            <button role="tab" aria-selected={tab === 'client'}
              className={`bb-signup__tab${tab === 'client' ? ' is-active' : ''}`}
              onClick={() => { setTab('client'); setClientDone(false); }}>
              I'm a client <span className="badge">Hire</span>
            </button>
            <button role="tab" aria-selected={tab === 'pro'}
              className={`bb-signup__tab bb-signup__tab--pros${tab === 'pro' ? ' is-active' : ''}`}
              onClick={() => { setTab('pro'); setProStep(0); setProDone(false); }}>
              I'm a pro <span className="badge">◆ Audition</span>
            </button>
          </div>

          {tab === 'client' ? (
            clientDone ? (
              <div className="bb-signup__done">
                <div className="bb-signup__done__mark">✓</div>
                <h4>You're on the list.</h4>
                <p>We'll ping <b>{clientData.email || 'you'}</b> the moment client early access opens this fall.</p>
                <button className="bb-signup__reset" onClick={() => { setClientDone(false); setClientData({ email: '', name: '', role: '', zip: '' }); }}>← Sign up someone else</button>
              </div>
            ) : <ClientForm data={clientData} setData={setClientData} onSubmit={submitClient} />
          ) : (
            proDone ? (
              <div className="bb-signup__done">
                <div className="bb-signup__done__mark">✓</div>
                <h4>You're on the list.</h4>
                <p>We'll review your submission and send next steps to <b>{pro.email || 'you'}</b> within 5 business days.</p>
                <button className="bb-signup__reset" onClick={() => { setProDone(false); setProStep(0); setPro({ email: '', name: '', zip: '', specialties: [], years: '', paidGigs: '', tier: '', gear: '', hsSports: '', hsCount: '', insurance: '', portfolio: '', weekdays: false, weekends: false, radius: '', turnaround: [], rushPct: '', pricing: {} }); }}>← Submit another pro</button>
              </div>
            ) : proStep === 0 ? <ProEmailCapture pro={pro} setP={setP} onSubmit={submitProEmail} /> :
            <ProWizard step={proStep} setStep={setProStep} pro={pro} setP={setP} onFinish={finishPro} pricingVariant={pricingVariant} />
          )}
        </div>
      </div>
    </section>
  );
}

// ------- Client form (unchanged) -------
export function ClientForm({ data, setData, onSubmit }) {
  return (
    <>
      <div className="bb-signup__head">
        <h3 className="bb-signup__title">Book vetted pros, faster.</h3>
        <p className="bb-signup__sub">Get early access to post gigs and instant-hire any tier the moment we launch.</p>
      </div>
      <form className="bb-signup__form" onSubmit={onSubmit}>
        <div className="bb-signup__row">
          <div className="bb-field">
            <label htmlFor="c-name">Your name</label>
            <input id="c-name" type="text" placeholder="Alex Reyes" required value={data.name} onChange={e => setData({ ...data, name: e.target.value })} />
          </div>
          <div className="bb-field">
            <label htmlFor="c-zip">ZIP code</label>
            <input id="c-zip" type="text" placeholder="22182" pattern="[0-9]{5}" maxLength="5" required value={data.zip} onChange={e => setData({ ...data, zip: e.target.value })} />
          </div>
        </div>
        <div className="bb-field">
          <label htmlFor="c-email">Email</label>
          <input id="c-email" type="email" placeholder="you@company.com" required value={data.email} onChange={e => setData({ ...data, email: e.target.value })} />
        </div>
        <div className="bb-field">
          <label htmlFor="c-role">What do you mostly hire for?</label>
          <select id="c-role" value={data.role} onChange={e => setData({ ...data, role: e.target.value })}>
            <option value="">Pick one —</option>
            <option>High school program</option>
            <option>Club / travel team</option>
            <option>College / NCAA</option>
            <option>League or tournament</option>
            <option>Individual athlete / brand</option>
            <option>Something else</option>
          </select>
        </div>
        <button type="submit" className="bb-signup__submit">Save my seat <span aria-hidden="true">→</span></button>
        <div className="bb-signup__foot"><span>No spam. One email at launch.</span><span>237 on the list</span></div>
      </form>
    </>
  );
}



// Pro intake wizard — multi-step form collecting rating, gear, availability, pricing.

// useState already available from prior Signup babel block
const SPECIALTIES = [
  { k: 'photo', label: 'Sports photography', dot: '#E62D2D' },
  { k: 'video', label: 'Sports videography', dot: '#1E6EE6' },
  { k: 'broadcast', label: 'Broadcaster / PBP / color', dot: '#F5C84B' },
  { k: 'design', label: 'Graphic design', dot: '#6BC28F' },
  { k: 'social', label: 'Social manager', dot: '#B97CE4' },
  { k: 'stream', label: 'Live-stream / multi-cam', dot: '#E68B4C' },
];

// Scenarios per specialty — used to anchor the pricing question
const SCENARIOS = {
  photo:     { sport: 'Gameday coverage', shoot: 3, edit: 2, deliver: '30 edited photos', turnaround: '48h' },
  video:     { sport: 'Gameday coverage', shoot: 3, edit: 4, deliver: '2-min highlight reel + 4 clips', turnaround: '72h' },
  broadcast: { sport: 'Gameday coverage', shoot: 3, edit: 0, deliver: 'Live PBP, 2 halves', turnaround: 'live' },
  design:    { sport: 'Graphic asset pack', shoot: 0, edit: 5, deliver: '5 matchday graphics (IG + story sizes)', turnaround: '48h' },
  social:    { sport: 'Gameday coverage', shoot: 3, edit: 2, deliver: 'Live-post during game + 5 post-game', turnaround: 'live + 24h' },
  stream:    { sport: 'Gameday coverage', shoot: 3, edit: 0, deliver: 'Live 2-cam broadcast, VOD file', turnaround: 'live' },
};

// Tier drafts — flagged as NSMT to finalize
const TIERS = [
  { k: 'S', name: 'Elite',       desc: '7+ yrs paid · 40+ gigs/yr · published / sponsored' },
  { k: 'A', name: 'Advanced',    desc: '4-6 yrs paid · 20+ gigs/yr · consistent quality' },
  { k: 'B', name: 'Established', desc: '2-3 yrs paid · 10+ gigs/yr · reliable' },
  { k: 'C', name: 'Emerging',    desc: '1-2 yrs · first paid work · building portfolio' },
  { k: 'D', name: 'Developing',  desc: 'Student / hobbyist · unpaid or occasional' },
];

export function ProEmailCapture({ pro, setP, onSubmit }) {
  return (
    <>
      <div className="bb-signup__head">
        <h3 className="bb-signup__title">Early access opens soon.</h3>
        <p className="bb-signup__sub">Start your intake — we'll save your progress. Takes about 4 minutes.</p>
      </div>
      <form className="bb-signup__form" onSubmit={onSubmit}>
        <div className="bb-signup__row">
          <div className="bb-field">
            <label htmlFor="p-name">Your name</label>
            <input id="p-name" type="text" placeholder="Maya Reyes" required value={pro.name} onChange={e => setP({ name: e.target.value })} />
          </div>
          <div className="bb-field">
            <label htmlFor="p-zip">ZIP code</label>
            <input id="p-zip" type="text" placeholder="22182" pattern="[0-9]{5}" maxLength="5" required value={pro.zip} onChange={e => setP({ zip: e.target.value })} />
          </div>
        </div>
        <div className="bb-field">
          <label htmlFor="p-email">Email</label>
          <input id="p-email" type="email" placeholder="you@studio.co" required value={pro.email} onChange={e => setP({ email: e.target.value })} />
        </div>
        <div className="bb-field">
          <label>What do you shoot / produce? <span style={{ opacity: .5 }}>· pick all that apply</span></label>
          <div className="bb-chiprow">
            {SPECIALTIES.map(s => {
              const on = pro.specialties.includes(s.k);
              return (
                <button type="button" key={s.k}
                  className={`bb-chip${on ? ' is-on' : ''}`}
                  onClick={() => setP({ specialties: on ? pro.specialties.filter(x => x !== s.k) : [...pro.specialties, s.k] })}>
                  <span className="bb-chip__dot" style={{ background: s.dot }} />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
        <button type="submit" className="bb-signup__submit" style={{ background: '#F5C84B', color: '#07080A' }} disabled={pro.specialties.length === 0}>
          Start intake <span aria-hidden="true">→</span>
        </button>
        <div className="bb-signup__foot"><span>Invite-only review · DMV only</span><span>84 pros already submitted</span></div>
      </form>
    </>
  );
}

export function ProWizard({ step, setStep, pro, setP, onFinish, pricingVariant }) {
  const totalSteps = 4 + pro.specialties.length; // 1 rating, 2 gear, 3 avail, 4..N pricing per specialty
  const maxStep = 3 + pro.specialties.length;
  const isPricing = step >= 4;
  const specialtyIdx = step - 4;
  const specialtyKey = isPricing ? pro.specialties[specialtyIdx] : null;

  // Validation — every field required on every step
  function stepComplete() {
    if (step === 1) return pro.years && pro.paidGigs && pro.tier;
    if (step === 2) {
      if (!pro.gear.trim()) return false;
      if (!pro.hsSports) return false;
      if (pro.hsSports === 'Yes' && !pro.hsCount) return false;
      if (!pro.insurance) return false;
      if (!pro.portfolio.trim()) return false;
      return true;
    }
    if (step === 3) {
      if (!pro.weekdays && !pro.weekends) return false;
      if (!pro.radius) return false;
      if (pro.turnaround.length === 0) return false;
      return true;
    }
    if (isPricing) {
      const p = pro.pricing[specialtyKey];
      if (!p) return false;
      if (!p.min && p.min !== 0) return false;
      if (!p.ideal && p.ideal !== 0) return false;
      return true;
    }
    return true;
  }
  const canContinue = stepComplete();

  function next() {
    if (!canContinue) return;
    if (step >= maxStep) { onFinish(); return; }
    setStep(step + 1);
  }
  function back() { setStep(Math.max(1, step - 1)); }

  return (
    <div className="bb-wiz">
      <div className="bb-wiz__head">
        <button className="bb-wiz__back" onClick={back} disabled={step === 1}>← Back</button>
        <div className="bb-wiz__progress">
          <span>Step {step} of {maxStep}</span>
          <div className="bb-wiz__bar"><div style={{ width: `${(step / maxStep) * 100}%` }} /></div>
        </div>
      </div>

      {step === 1 && <StepRating pro={pro} setP={setP} />}
      {step === 2 && <StepGear pro={pro} setP={setP} />}
      {step === 3 && <StepAvailability pro={pro} setP={setP} />}
      {isPricing && <StepPricing specialtyKey={specialtyKey} pro={pro} setP={setP} variant={pricingVariant} />}

      <div className="bb-wiz__nav">
        <button className="bb-signup__submit" onClick={next} disabled={!canContinue}>
          {step >= maxStep ? 'Submit application →' : 'Continue →'}
        </button>
        {!canContinue && <div className="bb-wiz__hint">Please complete every field to continue.</div>}
      </div>
    </div>
  );
}

export function StepRating({ pro, setP }) {
  return (
    <div className="bb-wiz__body">
      <h3 className="bb-signup__title">Rate yourself honestly.</h3>
      <p className="bb-signup__sub">Self-assessed — we'll verify with portfolio + references during review.</p>

      <div className="bb-signup__row" style={{ marginTop: 20 }}>
        <div className="bb-field">
          <label>Years shooting paid work</label>
          <select value={pro.years} onChange={e => setP({ years: e.target.value })}>
            <option value="">Pick —</option>
            <option>Less than 1</option>
            <option>1-2</option>
            <option>3-5</option>
            <option>6-10</option>
            <option>10+</option>
          </select>
        </div>
        <div className="bb-field">
          <label>Paid gigs in the last 12 months</label>
          <select value={pro.paidGigs} onChange={e => setP({ paidGigs: e.target.value })}>
            <option value="">Pick —</option>
            <option>0</option>
            <option>1-5</option>
            <option>6-15</option>
            <option>16-40</option>
            <option>40+</option>
          </select>
        </div>
      </div>

      <div className="bb-field" style={{ marginTop: 20 }}>
        <label>Where do you place yourself? <span className="bb-draft">DRAFT — tiers TBD</span></label>
        <div className="bb-tiers">
          {TIERS.map(t => (
            <button type="button" key={t.k}
              className={`bb-tiercard${pro.tier === t.k ? ' is-on' : ''}`}
              onClick={() => setP({ tier: t.k })}>
              <div className={`bb-tiercard__badge bb-tiercard__badge--${t.k.toLowerCase()}`}>{t.k}</div>
              <div>
                <div className="bb-tiercard__name">{t.name}</div>
                <div className="bb-tiercard__desc">{t.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StepGear({ pro, setP }) {
  return (
    <div className="bb-wiz__body">
      <h3 className="bb-signup__title">Your gear & credentials.</h3>
      <p className="bb-signup__sub">Quick sanity check — helps us match you to gigs that fit.</p>

      <div className="bb-field" style={{ marginTop: 20 }}>
        <label>Primary kit <span style={{ opacity: .5 }}>· bodies + lenses, short-form is fine</span></label>
        <textarea rows="2" placeholder="e.g. Sony A7IV, 70-200 f2.8, 24-70 f2.8, backup A7III" value={pro.gear} onChange={e => setP({ gear: e.target.value })} />
      </div>

      <div className="bb-signup__row">
        <div className="bb-field">
          <label>Shot team sports before?</label>
          <select value={pro.hsSports} onChange={e => setP({ hsSports: e.target.value })}>
            <option value="">Pick —</option>
            <option>Yes</option>
            <option>No — first timer</option>
          </select>
        </div>
        {pro.hsSports === 'Yes' && (
          <div className="bb-field">
            <label>Roughly how many team events?</label>
            <input type="number" min="1" placeholder="e.g. 12" value={pro.hsCount} onChange={e => setP({ hsCount: e.target.value })} />
          </div>
        )}
      </div>

      <div className="bb-signup__row">
        <div className="bb-field">
          <label>Business / insurance status</label>
          <select value={pro.insurance} onChange={e => setP({ insurance: e.target.value })}>
            <option value="">Pick —</option>
            <option>LLC + liability insurance</option>
            <option>Sole proprietor, insured</option>
            <option>Sole proprietor, not insured</option>
            <option>Freelance / 1099</option>
            <option>Hobbyist / W-2 day job</option>
          </select>
        </div>
        <div className="bb-field">
          <label>Portfolio URL</label>
          <input type="url" placeholder="https://…" value={pro.portfolio} onChange={e => setP({ portfolio: e.target.value })} />
        </div>
      </div>
    </div>
  );
}

export function StepAvailability({ pro, setP }) {
  const TURNAROUNDS = ['24h', '48h', '72h'];
  function toggleTurn(t) {
    const on = pro.turnaround.includes(t);
    setP({ turnaround: on ? pro.turnaround.filter(x => x !== t) : [...pro.turnaround, t] });
  }
  return (
    <div className="bb-wiz__body">
      <h3 className="bb-signup__title">When can you shoot?</h3>
      <p className="bb-signup__sub">Travel, turnaround, rush multiplier.</p>

      <div className="bb-field" style={{ marginTop: 20 }}>
        <label>Availability</label>
        <div className="bb-chiprow">
          <button type="button" className={`bb-chip${pro.weekdays ? ' is-on' : ''}`} onClick={() => setP({ weekdays: !pro.weekdays })}>Weekdays</button>
          <button type="button" className={`bb-chip${pro.weekends ? ' is-on' : ''}`} onClick={() => setP({ weekends: !pro.weekends })}>Weekends</button>
        </div>
      </div>

      <div className="bb-signup__row">
        <div className="bb-field">
          <label>Travel radius from your ZIP</label>
          <select value={pro.radius} onChange={e => setP({ radius: e.target.value })}>
            <option value="">Pick —</option>
            <option>Under 15 mi</option>
            <option>15-30 mi</option>
            <option>30-60 mi</option>
            <option>60+ mi / anywhere in DMV</option>
          </select>
        </div>
      </div>

      <div className="bb-field">
        <label>Turnaround you'll commit to <span style={{ opacity: .5 }}>· pick all you can hit</span></label>
        <div className="bb-chiprow">
          {TURNAROUNDS.map(t => (
            <button type="button" key={t} className={`bb-chip${pro.turnaround.includes(t) ? ' is-on' : ''}`} onClick={() => toggleTurn(t)}>{t}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StepPricing({ specialtyKey, pro, setP, variant }) {
  const sp = SPECIALTIES.find(s => s.k === specialtyKey) || SPECIALTIES[0];
  const sc = SCENARIOS[specialtyKey] || SCENARIOS.photo;
  const current = pro.pricing[specialtyKey] || { min: '', ideal: '' };
  function setPrice(patch) {
    setP({ pricing: { ...pro.pricing, [specialtyKey]: { ...current, ...patch } } });
  }

  return (
    <div className="bb-wiz__body">
      <div className="bb-pricing__eyebrow">
        <span className="bb-pricing__spec"><span className="bb-chip__dot" style={{ background: sp.dot }} /> {sp.label}</span>
        <span className="bb-pricing__variant">variant: {variant}</span>
      </div>
      <h3 className="bb-signup__title">What's fair take-home?</h3>
      <p className="bb-signup__sub">No anchoring — we want your honest numbers so we can set fair rates for everyone.</p>

      <div className="bb-scenario">
        <div className="bb-scenario__head">
          <span>THE GIG</span>
          <span>{sc.sport}</span>
        </div>
        <div className="bb-scenario__row"><span>Shoot time</span><b>{sc.shoot} hr{sc.shoot !== 1 ? 's' : ''}</b></div>
        {sc.edit > 0 && <div className="bb-scenario__row"><span>Edit time</span><b>{sc.edit} hr{sc.edit !== 1 ? 's' : ''}</b></div>}
        <div className="bb-scenario__row"><span>Deliverables</span><b>{sc.deliver}</b></div>
        <div className="bb-scenario__row"><span>Turnaround</span><b>{sc.turnaround}</b></div>
        <div className="bb-scenario__total"><span>Your total commitment</span><b>{sc.shoot + sc.edit} hours</b></div>
      </div>

      {variant === 'bands' && <PricingBands current={current} setPrice={setPrice} />}
      {variant === 'receipt' && <PricingReceipt sc={sc} sp={sp} current={current} setPrice={setPrice} />}
      {variant === 'sliders' && <PricingSliders current={current} setPrice={setPrice} />}
    </div>
  );
}

// Variant A — Band tap: three suggested amounts + custom
export function PricingBands({ current, setPrice }) {
  const MIN_BANDS = [
    { k: 'low', label: 'Comfortable floor' },
    { k: 'mid', label: 'Fair floor' },
    { k: 'high', label: 'Premium floor' },
  ];
  const IDEAL_BANDS = [
    { k: 'low', label: 'Comfortable ideal' },
    { k: 'mid', label: 'Strong ideal' },
    { k: 'high', label: 'Premium ideal' },
  ];
  const [minMode, setMinMode] = useState('bands');
  const [idealMode, setIdealMode] = useState('bands');
  return (
    <div className="bb-bandwrap">
      <div className="bb-bandq">
        <div className="bb-bandq__label">
          <b>Minimum</b> — the floor. Below this, you'd pass.
        </div>
        <div className="bb-bands">
          {MIN_BANDS.map(b => (
            <button type="button" key={b.k}
              className={`bb-band${current.min === b.k && minMode === 'bands' ? ' is-on' : ''}`}
              onClick={() => { setMinMode('bands'); setPrice({ min: b.k }); }}>
              <span className="bb-band__amt">{b.k.toUpperCase()}</span>
              <span className="bb-band__unit">{b.label}</span>
            </button>
          ))}
          <button type="button" className={`bb-band bb-band--custom${minMode === 'custom' ? ' is-on' : ''}`} onClick={() => setMinMode('custom')}>
            <span className="bb-band__amt">$__</span>
            <span className="bb-band__unit">write-in</span>
          </button>
        </div>
        {minMode === 'custom' && (
          <div className="bb-inputaffix bb-inputaffix--big">
            <span>$</span>
            <input type="number" min="0" placeholder="Your number" value={current.min} onChange={e => setPrice({ min: e.target.value })} />
          </div>
        )}
      </div>

      <div className="bb-bandq">
        <div className="bb-bandq__label">
          <b>Ideal</b> — what you'd love to walk away with.
        </div>
        <div className="bb-bands">
          {IDEAL_BANDS.map(b => (
            <button type="button" key={b.k}
              className={`bb-band${current.ideal === b.k && idealMode === 'bands' ? ' is-on' : ''}`}
              onClick={() => { setIdealMode('bands'); setPrice({ ideal: b.k }); }}>
              <span className="bb-band__amt">{b.k.toUpperCase()}</span>
              <span className="bb-band__unit">{b.label}</span>
            </button>
          ))}
          <button type="button" className={`bb-band bb-band--custom${idealMode === 'custom' ? ' is-on' : ''}`} onClick={() => setIdealMode('custom')}>
            <span className="bb-band__amt">$__</span>
            <span className="bb-band__unit">write-in</span>
          </button>
        </div>
        {idealMode === 'custom' && (
          <div className="bb-inputaffix bb-inputaffix--big">
            <span>$</span>
            <input type="number" min="0" placeholder="Your number" value={current.ideal} onChange={e => setPrice({ ideal: e.target.value })} />
          </div>
        )}
      </div>
    </div>
  );
}

// Variant B — Receipt card: a printed-receipt look, you fill in the total
export function PricingReceipt({ sc, sp, current, setPrice }) {
  return (
    <div className="bb-receipt">
      <div className="bb-receipt__head">
        <div className="bb-receipt__brand">BITBURG · GIG RECEIPT</div>
        <div className="bb-receipt__num">#DRAFT-{sp.k.toUpperCase()}</div>
      </div>
      <div className="bb-receipt__row"><span>{sp.label.toUpperCase()}</span><span>{sc.sport}</span></div>
      <div className="bb-receipt__row"><span>Shoot time</span><span>{sc.shoot} hr{sc.shoot !== 1 ? 's' : ''}</span></div>
      {sc.edit > 0 && <div className="bb-receipt__row"><span>Edit time</span><span>{sc.edit} hr{sc.edit !== 1 ? 's' : ''}</span></div>}
      <div className="bb-receipt__row"><span>Deliverables</span><span>{sc.deliver}</span></div>
      <div className="bb-receipt__row"><span>Turnaround</span><span>{sc.turnaround}</span></div>
      <div className="bb-receipt__hr" />

      <div className="bb-receipt__fillrow">
        <label>YOUR FLOOR</label>
        <div className="bb-receipt__fill">
          <span>$</span>
          <input type="number" min="0" placeholder="000" value={current.min} onChange={e => setPrice({ min: e.target.value })} />
        </div>
      </div>
      <div className="bb-receipt__fillrow">
        <label>YOUR IDEAL</label>
        <div className="bb-receipt__fill">
          <span>$</span>
          <input type="number" min="0" placeholder="000" value={current.ideal} onChange={e => setPrice({ ideal: e.target.value })} />
        </div>
      </div>
      <div className="bb-receipt__hr" />
      <div className="bb-receipt__foot">
        <span>Signed: {'{ your_name }'}</span>
        <span>★ fair take-home</span>
      </div>
    </div>
  );
}

// Variant C — Split sliders
export function PricingSliders({ current, setPrice }) {
  const [min, setMin] = useState(current.min || 200);
  const [ideal, setIdeal] = useState(current.ideal || 350);
  useEffect(() => { setPrice({ min, ideal }); }, [min, ideal]);
  return (
    <div className="bb-sliderwrap">
      <div className="bb-sliderq">
        <div className="bb-sliderq__head">
          <span><b>Minimum</b> — the floor</span>
          <span className="bb-sliderq__val">${min}</span>
        </div>
        <input type="range" min="75" max="800" step="25" value={min} onChange={e => setMin(Number(e.target.value))} className="bb-slider" />
        <div className="bb-sliderq__ticks"><span>LOW</span><span>MID</span><span>HIGH</span></div>
      </div>
      <div className="bb-sliderq">
        <div className="bb-sliderq__head">
          <span><b>Ideal</b> — what you'd love</span>
          <span className="bb-sliderq__val">${ideal}</span>
        </div>
        <input type="range" min="100" max="1200" step="25" value={ideal} onChange={e => setIdeal(Number(e.target.value))} className="bb-slider" />
        <div className="bb-sliderq__ticks"><span>LOW</span><span>MID</span><span>HIGH</span></div>
      </div>
    </div>
  );
}

