import React from 'react';

/**
 * TapMyMenu landing page — drop-in component.
 *
 * INTEGRATION:
 * 1. Save this file as src/LandingPage.jsx
 * 2. In App.js, import it and add a route BEFORE your catch-all `/:urlname` route:
 *
 *      import LandingPage from './LandingPage';
 *      ...
 *      <Routes>
 *        <Route path="/" element={<LandingPage />} />
 *        <Route path="/c/:code" element={<CodeRoute />} />
 *        <Route path="/:urlname" element={<MenuRoute />} />
 *      </Routes>
 *
 *    Order matters — "/" must be matched before the `/:urlname` wildcard, otherwise
 *    the root path gets swallowed by the menu route.
 *
 * 3. Fonts: for best performance, add these to the <head> of public/index.html
 *    instead of relying on the @import below (which works, but blocks a beat on load):
 *
 *      <link rel="preconnect" href="https://fonts.googleapis.com">
 *      <link href="https://fonts.googleapis.com/css2?family=Bitter:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
 *
 *    If you add them there, delete the @import line in the <style> block below.
 *
 * 4. The "Get your QR menu" buttons currently link to /login-like anchors (#get-started).
 *    Point them at your actual signup flow once it exists — search for `href="#get-started"`.
 */
export default function LandingPage() {
  return (
    <div className="tmm-landing">
      <style>{`
        .tmm-landing {
          --tmm-paper: #FAF7F0;
          --tmm-card: #FFFEFA;
          --tmm-ink: #1C1B19;
          --tmm-text: #26241F;
          --tmm-text-soft: #5B5749;
          --tmm-muted: #8B8577;
          --tmm-border: #E4DFD1;
          --tmm-amber: #E0982F;
          --tmm-amber-dark: #B9791E;
          --tmm-sage: #5F8161;
          --tmm-sage-dark: #4A6A4C;
          --tmm-rust: #B8483A;

          font-family: 'Inter', system-ui, sans-serif;
          background: var(--tmm-paper);
          color: var(--tmm-text);
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }
        .tmm-landing * { box-sizing: border-box; }
        .tmm-landing h1, .tmm-landing h2, .tmm-landing h3 {
          font-family: 'Bitter', Georgia, serif;
          color: var(--tmm-ink);
          margin: 0;
        }
        .tmm-landing .tmm-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
        .tmm-landing a { color: inherit; text-decoration: none; }
        .tmm-landing button { font-family: inherit; }
        .tmm-landing :focus-visible { outline: 2px solid var(--tmm-amber-dark); outline-offset: 3px; }

        /* ---------- nav ---------- */
        .tmm-nav {
          display: flex; align-items: center; justify-content: space-between;
          max-width: 1120px; margin: 0 auto; padding: 22px 24px;
        }
        .tmm-nav-brand { display: flex; align-items: baseline; gap: 8px; }
        .tmm-nav-brand h1 { font-size: 19px; letter-spacing: 0.2px; }
        .tmm-nav-brand span { color: var(--tmm-amber-dark); font-size: 11px; font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.5px; }
        .tmm-nav-cta {
          background: var(--tmm-ink); color: #FBF8F1; border: none; border-radius: 999px;
          padding: 10px 18px; font-size: 13.5px; font-weight: 600; cursor: pointer;
          transition: transform .15s ease, background .15s ease;
        }
        .tmm-nav-cta:hover { background: #302D26; transform: translateY(-1px); }

        /* ---------- hero ---------- */
        .tmm-hero {
          max-width: 1120px; margin: 0 auto; padding: 40px 24px 90px;
          display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 56px; align-items: center;
        }
        @media (max-width: 880px) { .tmm-hero { grid-template-columns: 1fr; padding-bottom: 60px; } }

        .tmm-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; letter-spacing: 0.5px;
          color: var(--tmm-sage-dark); text-transform: uppercase;
          border: 1px solid #BFD6BF; background: #F1F5EE; border-radius: 999px;
          padding: 5px 12px; margin-bottom: 22px;
        }
        .tmm-eyebrow .tmm-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--tmm-sage); }

        .tmm-hero h2 {
          font-size: clamp(34px, 4.6vw, 54px); line-height: 1.05; letter-spacing: -0.01em;
          margin-bottom: 20px;
        }
        .tmm-hero h2 em {
          font-style: normal; color: var(--tmm-amber-dark);
          text-decoration: underline; text-decoration-style: wavy; text-decoration-color: var(--tmm-amber);
          text-underline-offset: 4px;
        }
        .tmm-hero p.tmm-sub {
          font-size: 17px; line-height: 1.6; color: var(--tmm-text-soft); max-width: 460px; margin-bottom: 30px;
        }
        .tmm-hero-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 26px; }
        .tmm-btn {
          border: none; border-radius: 8px; padding: 13px 22px; font-size: 14.5px; font-weight: 600;
          cursor: pointer; transition: filter .15s ease, transform .15s ease;
        }
        .tmm-btn-primary { background: var(--tmm-amber); color: #241A08; }
        .tmm-btn-primary:hover { filter: brightness(1.06); transform: translateY(-1px); }
        .tmm-btn-ghost { background: transparent; color: var(--tmm-text-soft); border: 1px solid var(--tmm-border); }
        .tmm-btn-ghost:hover { background: #F1ECDE; }

        .tmm-hero-note { font-size: 12.5px; color: var(--tmm-muted); font-family: 'IBM Plex Mono', monospace; }

        /* ---------- signature: the printed ticket ---------- */
        .tmm-ticket-wrap { position: relative; display: flex; justify-content: center; }
        .tmm-slot {
          position: absolute; top: -14px; left: 50%; transform: translateX(-50%);
          width: 220px; height: 14px; background: var(--tmm-ink); border-radius: 4px;
          box-shadow: 0 3px 10px rgba(0,0,0,0.25);
          z-index: 3;
        }
        .tmm-ticket {
          position: relative; width: min(320px, 90%); background: var(--tmm-card);
          border: 1px solid var(--tmm-border); border-radius: 2px 2px 0 0;
          box-shadow: 0 18px 40px rgba(28,27,25,0.14), 0 2px 8px rgba(28,27,25,0.08);
          padding: 30px 22px 26px; z-index: 2;
          animation: tmm-print 900ms cubic-bezier(.2,.7,.3,1) 200ms both;
          transform-origin: top center;
        }
        .tmm-ticket::after {
          content: "";
          position: absolute; left: 0; right: 0; bottom: -9px; height: 18px;
          background:
            radial-gradient(circle at 8px 0, transparent 8px, var(--tmm-card) 8.5px) 0 0/18px 18px repeat-x;
          filter: drop-shadow(0 2px 2px rgba(28,27,25,0.06));
        }
        @keyframes tmm-print {
          from { transform: scaleY(0.15) translateY(-8px); opacity: 0; }
          to { transform: scaleY(1) translateY(0); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .tmm-ticket { animation: none; }
        }

        .tmm-ticket-head { text-align: center; margin-bottom: 16px; }
        .tmm-ticket-head .tmm-name { font-family: 'Bitter', serif; font-weight: 700; font-size: 17px; }
        .tmm-ticket-head .tmm-slogan { font-size: 11px; color: var(--tmm-muted); font-family: 'IBM Plex Mono', monospace; margin-top: 3px; }
        .tmm-ticket-divider { border-top: 1px dashed #C9C2AE; margin: 14px 0; }

        .tmm-ticket-item { display: flex; align-items: baseline; gap: 6px; margin-bottom: 10px; font-size: 13px; }
        .tmm-ticket-item .tmm-ti-name { font-weight: 600; white-space: nowrap; }
        .tmm-ticket-item .tmm-ti-leader { flex: 1; border-bottom: 1px dotted #C9C2AE; margin-bottom: 3px; }
        .tmm-ticket-item .tmm-ti-price { font-family: 'IBM Plex Mono', monospace; color: var(--tmm-sage-dark); white-space: nowrap; }

        .tmm-stamp {
          position: absolute; top: 128px; right: -18px;
          font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600;
          letter-spacing: 1px; text-transform: uppercase; color: var(--tmm-rust);
          border: 2px solid var(--tmm-rust); border-radius: 6px; padding: 5px 10px;
          transform: rotate(-11deg);
          background: rgba(184,72,58,0.03);
        }
        @media (max-width: 480px) { .tmm-stamp { right: -6px; font-size: 10.5px; padding: 4px 8px; } }

        .tmm-qr {
          margin-top: 18px; display: flex; align-items: center; gap: 10px;
          background: var(--tmm-paper); border: 1px solid var(--tmm-border); border-radius: 8px; padding: 10px 12px;
        }
        .tmm-qr-glyph {
          width: 40px; height: 40px; flex-shrink: 0; border-radius: 4px;
          background:
            linear-gradient(90deg, var(--tmm-ink) 0 8px, transparent 8px 12px, var(--tmm-ink) 12px 20px, transparent 20px 24px, var(--tmm-ink) 24px 32px, transparent 32px 40px) 0 0/40px 8px,
            linear-gradient(90deg, transparent 0 4px, var(--tmm-ink) 4px 12px, transparent 12px 20px, var(--tmm-ink) 20px 28px, transparent 28px 40px) 0 8px/40px 8px repeat-y;
          background-color: #fff;
          border: 1px solid var(--tmm-border);
        }
        .tmm-qr-text { font-size: 11px; color: var(--tmm-text-soft); line-height: 1.4; }
        .tmm-qr-text b { color: var(--tmm-ink); }

        /* ---------- how it works ---------- */
        .tmm-section { max-width: 1120px; margin: 0 auto; padding: 70px 24px; }
        .tmm-section-head { text-align: center; max-width: 560px; margin: 0 auto 44px; }
        .tmm-section-head .tmm-eyebrow { margin-bottom: 14px; }
        .tmm-section-head h3 { font-size: clamp(26px, 3.2vw, 34px); margin-bottom: 10px; }
        .tmm-section-head p { color: var(--tmm-text-soft); font-size: 15.5px; line-height: 1.6; }

        .tmm-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media (max-width: 780px) { .tmm-steps { grid-template-columns: 1fr; } }
        .tmm-step {
          background: var(--tmm-card); border: 1px solid var(--tmm-border); border-radius: 10px;
          padding: 26px 22px; position: relative;
        }
        .tmm-step .tmm-step-no {
          font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--tmm-muted);
          border: 1px solid var(--tmm-border); border-radius: 999px; padding: 2px 9px; display: inline-block;
          margin-bottom: 14px;
        }
        .tmm-step h4 { font-family: 'Bitter', serif; font-size: 17px; margin-bottom: 8px; color: var(--tmm-ink); }
        .tmm-step p { font-size: 13.5px; color: var(--tmm-text-soft); line-height: 1.55; margin: 0; }

        /* ---------- compare ---------- */
        .tmm-compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
        @media (max-width: 780px) { .tmm-compare-grid { grid-template-columns: 1fr; } }
        .tmm-compare-card { border-radius: 10px; padding: 26px 24px; border: 1px solid var(--tmm-border); }
        .tmm-compare-card.tmm-old { background: #F2EEE3; }
        .tmm-compare-card.tmm-new { background: var(--tmm-card); border-color: #D8E3D8; box-shadow: 0 10px 26px rgba(95,129,97,0.1); }
        .tmm-compare-label {
          font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.4px; text-transform: uppercase;
          margin-bottom: 14px; display: inline-block;
        }
        .tmm-old .tmm-compare-label { color: var(--tmm-rust); }
        .tmm-new .tmm-compare-label { color: var(--tmm-sage-dark); }
        .tmm-compare-card ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 11px; }
        .tmm-compare-card li { font-size: 14px; display: flex; gap: 9px; align-items: flex-start; line-height: 1.5; }
        .tmm-old li::before { content: "✕"; color: var(--tmm-rust); font-size: 12px; margin-top: 2px; }
        .tmm-new li::before { content: "✓"; color: var(--tmm-sage-dark); font-size: 12px; margin-top: 2px; }

        /* ---------- feature menu ---------- */
        .tmm-menu-card {
          background: var(--tmm-card); border: 1px solid var(--tmm-border); border-radius: 10px;
          padding: 8px 28px; box-shadow: 0 1px 2px rgba(28,27,25,0.05);
        }
        .tmm-menu-row {
          display: flex; align-items: baseline; gap: 10px; padding: 16px 2px;
          border-bottom: 1px solid var(--tmm-border);
        }
        .tmm-menu-row:last-child { border-bottom: none; }
        .tmm-menu-row .tmm-mn-name { font-weight: 600; font-size: 15px; color: var(--tmm-ink); white-space: nowrap; }
        .tmm-menu-row .tmm-mn-desc { font-size: 12.5px; color: var(--tmm-muted); display: block; margin-top: 3px; }
        .tmm-menu-row-main { flex: 1; min-width: 0; }
        .tmm-menu-row .tmm-mn-leader { flex: 1; min-width: 20px; border-bottom: 2px dotted #C9C2AE; margin: 0 2px 5px; }
        .tmm-menu-row .tmm-mn-val {
          font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; font-weight: 600;
          color: var(--tmm-sage-dark); white-space: nowrap; text-transform: uppercase; letter-spacing: 0.3px;
        }
        .tmm-menu-row-top { display: flex; align-items: baseline; gap: 10px; }

        /* ---------- final cta ---------- */
        .tmm-final {
          max-width: 1120px; margin: 0 auto; padding: 20px 24px 90px;
        }
        .tmm-final-card {
          background: var(--tmm-ink); border-radius: 16px; padding: 56px 40px;
          text-align: center; position: relative; overflow: hidden;
        }
        .tmm-final-card h3 {
          color: #FBF8F1; font-size: clamp(26px, 3.4vw, 36px); margin-bottom: 14px;
        }
        .tmm-final-card p { color: #B8B29F; font-size: 15.5px; margin-bottom: 30px; }
        .tmm-final-card .tmm-btn-primary { padding: 15px 28px; font-size: 15px; }

        /* ---------- footer ---------- */
        .tmm-footer {
          max-width: 1120px; margin: 0 auto; padding: 30px 24px 50px;
          display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;
          color: var(--tmm-muted); font-size: 12.5px; border-top: 1px solid var(--tmm-border);
        }
        .tmm-footer .tmm-mono { letter-spacing: 0.3px; }
      `}</style>

      {/* ---------- nav ---------- */}
      <nav className="tmm-nav">
        <div className="tmm-nav-brand">
          <h1>TapMyMenu</h1>
          <span>QR MENUS</span>
        </div>
        <a href="#get-started">
          <button className="tmm-nav-cta">Get started</button>
        </a>
      </nav>

      {/* ---------- hero ---------- */}
      <header className="tmm-hero">
        <div>
          <span className="tmm-eyebrow"><span className="tmm-dot" />Live in under 5 minutes</span>
          <h2>Your menu. <em>Always fresh.</em> Never reprinted.</h2>
          <p className="tmm-sub">
            Guests scan a code on the table and see your real menu — the one you
            just updated, not the one from three price changes ago. No app, no
            waiting on a print shop.
          </p>
          <div className="tmm-hero-actions">
            <a href="#get-started"><button className="tmm-btn tmm-btn-primary">Get your QR menu</button></a>
            <a href="#how-it-works"><button className="tmm-btn tmm-btn-ghost">See how it works</button></a>
          </div>
          <div className="tmm-hero-note tmm-mono">NO APP · NO INSTALL · WORKS ON ANY PHONE CAMERA</div>
        </div>

        <div className="tmm-ticket-wrap">
          <div className="tmm-slot" />
          <div className="tmm-ticket">
            <div className="tmm-stamp">Live</div>
            <div className="tmm-ticket-head">
              <div className="tmm-name">The Rusty Fork</div>
              <div className="tmm-slogan">EST. TODAY · UPDATED 2 MIN AGO</div>
            </div>
            <div className="tmm-ticket-divider" />
            <div className="tmm-ticket-item">
              <span className="tmm-ti-name">Charred Corn Soup</span>
              <span className="tmm-ti-leader" />
              <span className="tmm-ti-price">$9</span>
            </div>
            <div className="tmm-ticket-item">
              <span className="tmm-ti-name">Roast Chicken</span>
              <span className="tmm-ti-leader" />
              <span className="tmm-ti-price">$21</span>
            </div>
            <div className="tmm-ticket-item">
              <span className="tmm-ti-name">Market Fish</span>
              <span className="tmm-ti-leader" />
              <span className="tmm-ti-price">$26</span>
            </div>
            <div className="tmm-ticket-divider" />
            <div className="tmm-qr">
              <div className="tmm-qr-glyph" />
              <div className="tmm-qr-text">Scan with any camera —<br /><b>opens instantly, no app.</b></div>
            </div>
          </div>
        </div>
      </header>

      {/* ---------- how it works ---------- */}
      <section className="tmm-section" id="how-it-works">
        <div className="tmm-section-head">
          <span className="tmm-eyebrow"><span className="tmm-dot" />How it works</span>
          <h3>Three steps, in order — then you're done</h3>
          <p>This is the one place order actually matters: print once, guests scan, you edit forever.</p>
        </div>
        <div className="tmm-steps">
          <div className="tmm-step">
            <span className="tmm-step-no">STEP 1</span>
            <h4>Print your code</h4>
            <p>One QR code — on a table tent, window decal, or receipt. You order it once; it never needs replacing.</p>
          </div>
          <div className="tmm-step">
            <span className="tmm-step-no">STEP 2</span>
            <h4>Guests tap to scan</h4>
            <p>Any phone camera opens your live menu in a browser tab — no app to download, nothing to sign up for.</p>
          </div>
          <div className="tmm-step">
            <span className="tmm-step-no">STEP 3</span>
            <h4>You edit, anytime</h4>
            <p>Change a price, add a special, mark something sold out — every guest sees it the moment you save.</p>
          </div>
        </div>
      </section>

      {/* ---------- compare ---------- */}
      <section className="tmm-section">
        <div className="tmm-section-head">
          <span className="tmm-eyebrow"><span className="tmm-dot" />The old way vs. the tap way</span>
          <h3>Paper menus fight you. This doesn't.</h3>
        </div>
        <div className="tmm-compare-grid">
          <div className="tmm-compare-card tmm-old">
            <span className="tmm-compare-label tmm-mono">Printed menu</span>
            <ul>
              <li>Every price change means a reprint</li>
              <li>Sold-out items stay on the menu until someone crosses them out</li>
              <li>Photos and allergen info don't fit on the page</li>
              <li>Torn, stained, or missing by dinner rush</li>
            </ul>
          </div>
          <div className="tmm-compare-card tmm-new">
            <span className="tmm-compare-label tmm-mono">TapMyMenu</span>
            <ul>
              <li>Edit a price and it's live everywhere in seconds</li>
              <li>Mark something sold out the moment it runs out</li>
              <li>Add a photo, a description, or an allergen note freely</li>
              <li>Lives on your domain — nothing to reprint, ever</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- features as a menu ---------- */}
      <section className="tmm-section">
        <div className="tmm-section-head">
          <span className="tmm-eyebrow"><span className="tmm-dot" />What's on the menu</span>
          <h3>Everything included, nothing extra</h3>
        </div>
        <div className="tmm-menu-card">
          <div className="tmm-menu-row">
            <div className="tmm-menu-row-main">
              <div className="tmm-menu-row-top">
                <span className="tmm-mn-name">Real-time editing</span>
                <span className="tmm-mn-leader" />
                <span className="tmm-mn-val">Included</span>
              </div>
              <span className="tmm-mn-desc">Change anything and guests see it on their next scan — no rebuild, no wait.</span>
            </div>
          </div>
          <div className="tmm-menu-row">
            <div className="tmm-menu-row-main">
              <div className="tmm-menu-row-top">
                <span className="tmm-mn-name">Works on any phone</span>
                <span className="tmm-mn-leader" />
                <span className="tmm-mn-val">No app</span>
              </div>
              <span className="tmm-mn-desc">Opens straight from the camera. Nothing for guests to download or sign into.</span>
            </div>
          </div>
          <div className="tmm-menu-row">
            <div className="tmm-menu-row-main">
              <div className="tmm-menu-row-top">
                <span className="tmm-mn-name">Photos &amp; descriptions</span>
                <span className="tmm-mn-leader" />
                <span className="tmm-mn-val">$0 extra</span>
              </div>
              <span className="tmm-mn-desc">Show a dish, not just its name — as much detail as you want, for every item.</span>
            </div>
          </div>
          <div className="tmm-menu-row">
            <div className="tmm-menu-row-main">
              <div className="tmm-menu-row-top">
                <span className="tmm-mn-name">Sold-out toggling</span>
                <span className="tmm-mn-leader" />
                <span className="tmm-mn-val">Instant</span>
              </div>
              <span className="tmm-mn-desc">Flip one switch when the kitchen runs out — it disappears from every guest's screen.</span>
            </div>
          </div>
          <div className="tmm-menu-row">
            <div className="tmm-menu-row-main">
              <div className="tmm-menu-row-top">
                <span className="tmm-mn-name">Your own domain</span>
                <span className="tmm-mn-leader" />
                <span className="tmm-mn-val">Included</span>
              </div>
              <span className="tmm-mn-desc">Your menu lives at your address, not a generic subdomain buried in a URL.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- final cta ---------- */}
      <section className="tmm-final" id="get-started">
        <div className="tmm-final-card">
          <h3>Ready to stop reprinting?</h3>
          <p>Set up your first digital menu today — it's live the moment you save it.</p>
          <a href="/"><button className="tmm-btn tmm-btn-primary">Get your QR menu</button></a>
        </div>
      </section>

      {/* ---------- footer ---------- */}
      <footer className="tmm-footer">
        <span className="tmm-mono">TAPMYMENU © {new Date().getFullYear()}</span>
        <span className="tmm-mono">MADE FOR RESTAURANTS THAT HATE REPRINTING</span>
      </footer>
    </div>
  );
}
