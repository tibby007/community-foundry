import { ArrowRight, Blocks, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="landing-shell">
      <nav className="topbar" aria-label="Primary navigation">
        <a className="wordmark" href="#top" aria-label="Community Foundry home">
          <span className="wordmark-mark" aria-hidden="true">CF</span>
          Community Foundry
        </a>
        <span className="status-pill"><span aria-hidden="true" />AI community architect</span>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles size={15} aria-hidden="true" /> Community to business, in minutes</p>
          <h1>Turn what you know into a community people want to join.</h1>
          <p className="lede">
            Build the offer, classroom, conversations, brand, and launch plan in one AI-guided studio.
          </p>

          <div className="idea-card">
            <label htmlFor="community-idea">What could you teach, lead, or help people achieve?</label>
            <div className="idea-row">
              <input
                id="community-idea"
                name="community-idea"
                placeholder="I help women over 40 launch consulting businesses..."
              />
              <button type="button">Build my community <ArrowRight size={17} aria-hidden="true" /></button>
            </div>
            <p>No polished idea required. The strategist will help shape it.</p>
          </div>

          <div className="divider"><span>or</span></div>

          <button className="template-button" type="button">
            <span className="template-icon"><Blocks size={20} aria-hidden="true" /></span>
            <span><strong>Start with a proven template</strong><small>Explore 10 market-tested community models</small></span>
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="hero-visual" aria-label="Community Studio preview">
          <div className="glow glow-one" />
          <div className="glow glow-two" />
          <div className="studio-card">
            <div className="studio-toolbar">
              <div><i /><i /><i /></div>
              <span>Community Studio</span>
              <b>Saved</b>
            </div>
            <div className="studio-body">
              <aside>
                <small>BUILD</small>
                {[
                  ["01", "Foundation", true],
                  ["02", "Offer", true],
                  ["03", "Classroom", false],
                  ["04", "Launch", false],
                ].map(([number, label, active]) => (
                  <div className={active ? "step active" : "step"} key={String(number)}>
                    <span>{number}</span>{label}
                  </div>
                ))}
              </aside>
              <section className="mock-preview">
                <div className="mock-cover"><span>Second Act</span><strong>Consulting Lab</strong></div>
                <div className="mock-title"><div className="avatar">SA</div><div><b>The Second Act Consulting Lab</b><small>Build the business your experience deserves.</small></div></div>
                <div className="mock-tabs"><b>Community</b><span>Classroom</span><span>Calendar</span></div>
                <div className="mock-post"><i /><div><b>Welcome to your second act.</b><span /></div></div>
                <div className="mock-post"><i /><div><b>What expertise are you ready to monetize?</b><span /></div></div>
              </section>
              <aside className="coach-panel">
                <small>AI COACH</small>
                <div className="coach-score"><span>Launch score</span><strong>84</strong></div>
                <p>Your transformation is strong. Add a founding-member deadline to make the offer easier to act on.</p>
                <button type="button">Apply suggestion</button>
              </aside>
            </div>
          </div>
          <div className="floating-tag tag-one">6-module classroom</div>
          <div className="floating-tag tag-two">30-day launch plan</div>
        </div>
      </section>

      <footer>
        <span>Independent product. Not affiliated with Skool.</span>
        <span>Strategy · Structure · Launch</span>
      </footer>
    </main>
  );
}
