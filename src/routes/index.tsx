import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowDown, ArrowUpRight, ArrowRight, Check, Menu, X, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClarityScene } from "@/components/clarity-scene";
import {
  HOME_DESCRIPTION,
  HOME_TITLE,
  LINKEDIN_URL,
  SITE_NAME,
  SITE_URL,
  SOCIAL_IMAGE,
  structuredData,
} from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: HOME_TITLE },
      { name: "description", content: HOME_DESCRIPTION },
      { property: "og:title", content: HOME_TITLE },
      { property: "og:description", content: HOME_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:locale", content: "en_CA" },
      { property: "og:image", content: SOCIAL_IMAGE.url },
      { property: "og:image:width", content: String(SOCIAL_IMAGE.width) },
      { property: "og:image:height", content: String(SOCIAL_IMAGE.height) },
      { property: "og:image:alt", content: `${SITE_NAME} logo` },
      // Square logo image, so the small summary card fits better than the large one.
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: HOME_TITLE },
      { name: "twitter:description", content: HOME_DESCRIPTION },
      { name: "twitter:image", content: SOCIAL_IMAGE.url },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(structuredData) }],
  }),
  component: Index,
});

const sections = ["home", "expertise", "approach", "about", "contact"];
const labels = ["Home", "Expertise", "Approach", "About", "Contact"];

function AnalyticsVisual() {
  return <div className="service-visual analytics-visual" aria-hidden="true">
    <div className="visual-topline"><span>ANALYSIS / LIVE</span><span className="live-dot" /></div>
    <svg viewBox="0 0 340 190"><defs><pattern id="chart-grid" width="56" height="40" patternUnits="userSpaceOnUse"><path d="M 56 0 L 0 0 0 40" className="chart-grid" /></pattern></defs><rect width="340" height="190" fill="url(#chart-grid)" /><path className="chart-secondary" d="M0 160 L40 145 L80 153 L120 120 L160 133 L200 85 L240 97 L280 55 L340 65" /><path className="chart-primary" d="M0 173 C35 174 40 130 70 138 S110 115 135 118 S175 73 202 82 S245 40 269 50 S300 20 340 15" /><circle className="chart-point" cx="269" cy="50" r="5" /></svg>
    <div className="visual-bottomline"><span>COLLECT</span><span>CONNECT</span><span className="text-primary">CLARIFY ↗</span></div>
  </div>;
}
function WorkflowVisual() {
  return <div className="service-visual workflow-visual" aria-hidden="true"><div className="visual-topline"><span>WORKFLOW / CONNECTED</span><span className="live-dot" /></div><div className="workflow-system"><div className="workflow-node"><span className="node-lines" /></div><div className="flow-track"><i /></div><div className="workflow-node main-node"><span className="process-symbol">↻</span></div><div className="flow-track"><i /></div><div className="workflow-node complete-node"><Check size={24} /></div></div><div className="visual-bottomline"><span>INPUT</span><span>PROCESS</span><span className="text-primary">COMPLETE ↗</span></div></div>;
}
function AIVisual() {
  return <div className="service-visual ai-visual" aria-hidden="true"><div className="visual-topline"><span>INTELLIGENCE / APPLIED</span><span className="live-dot" /></div><div className="intelligence-system"><div className="input-stack"><span /><span /><span /></div><div className="intelligence-lines" /><div className="intelligence-core"><span /><span /><span /><span /></div><div className="intelligence-lines" /><div className="output-sheet"><Check size={15} /><i /><i /><i /></div></div><div className="visual-bottomline"><span>CONTEXT</span><span>REASON</span><span className="text-primary">ACTION ↗</span></div></div>;
}

function Index() {
  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [stage, setStage] = useState(0);
  const [contactStatus, setContactStatus] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => { for (const entry of entries) if (entry.isIntersecting) { const index = sections.indexOf(entry.target.id); setActive(index); if (index === 2) setStage(0); } }, { threshold: 0.45 });
    document.querySelectorAll("main > section").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (active !== 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setStage((current) => (current + 1) % 3), 3500);
    return () => window.clearInterval(timer);
  }, [active]);
  function goTo(index: number) { const id = sections[index]; if (!id) return; document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }); setMenuOpen(false); }
  async function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`;
    try { await navigator.clipboard.writeText(message); setContactStatus("Enquiry copied. Direct delivery is not connected yet."); }
    catch { setContactStatus("Direct delivery is not connected yet. Please keep your enquiry here until contact details are available."); }
  }
  return <div className="erun-site">
    <header className="site-header"><a href="#home" className="wordmark brand-mark" aria-label="Erun home"><img src="/brand/erun-mark-160.png" alt="Erun Group" width={160} height={159} /></a><nav className={menuOpen ? "desktop-nav open" : "desktop-nav"} aria-label="Main navigation">{labels.slice(1, 4).map((label, i) => <Button variant="nav" key={label} className={active === i + 1 ? "nav-active" : ""} onClick={() => goTo(i + 1)}>{label}</Button>)}</nav><Button variant="editorial" className="header-contact" onClick={() => goTo(4)}>Let’s talk <ArrowUpRight /></Button><Button variant="ghost" size="icon" className="mobile-menu" aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button></header>
    <aside className="section-progress" aria-label="Section navigation">{sections.map((section, i) => <Button key={section} variant="ghost" size="icon" aria-label={`Go to ${labels[i]}`} aria-current={active === i ? "location" : undefined} onClick={() => goTo(i)} className={active === i ? "progress-dot current" : "progress-dot"}><span /><span className="progress-label">{labels[i]}</span></Button>)}</aside>
    <main>
      <section id="home" className="hero-section snap-section">
        <div className="hero-grid" aria-hidden="true" /><ClarityScene />
        <div className="hero-content"><div className="eyebrow"><span className="small-rule" /> ERUN GROUP</div><h1>Turning<br />Complexity<br />Into <span className="clarity-word">Clarity<span className="headline-period">.</span></span></h1><p className="hero-description">Data Analytics. Automation.<br />AI Implementation.</p><Button variant="editorial" className="explore-button" onClick={() => goTo(1)}>Explore Our Expertise <ArrowUpRight /></Button></div>
        <div className="scene-caption"><span className="live-dot" /> COMPLEXITY, CONNECTED.</div>
        <div className="hero-bottom"><Button variant="nav" className="scroll-cue" onClick={() => goTo(1)}><ArrowDown /> SCROLL TO DISCOVER</Button><span className="hero-bottom-note">Analytical thinking. Practical progress.</span><span className="section-counter">01 <span>/ 05</span></span></div>
      </section>
      <section id="expertise" className="snap-section expertise-section"><div className="section-heading"><div className="eyebrow">01 / OUR EXPERTISE</div><h2>What We Do<span className="text-primary">.</span></h2><p>Clarity in your data. Confidence in your next move.</p></div><div className="expertise-grid">{[{ title: "Data Analytics", text: "Insights that drive better decisions.", visual: <AnalyticsVisual /> }, { title: "Automation", text: "Smarter workflows. Less manual work.", visual: <WorkflowVisual /> }, { title: "AI Implementation", text: "Practical AI. Real applications.", visual: <AIVisual /> }].map((service, i) => <article className="expertise-item" key={service.title}>{service.visual}<div className="service-heading"><span className="service-index">0{i + 1}</span><h3>{service.title}</h3><ArrowUpRight size={20} /></div><p>{service.text}</p></article>)}</div><div className="section-bottom"><span>THREE DISCIPLINES. ONE CLEAR DIRECTION.</span><Button variant="nav" onClick={() => goTo(2)}>Our approach <ArrowDown /></Button></div></section>
      <section id="approach" className="snap-section approach-section"><div className="section-heading"><div className="eyebrow">02 / OUR APPROACH</div><h2>From Challenge<br />to Solution<span className="text-primary">.</span></h2></div><div className="approach-stages">{["Understand", "Design", "Deliver"].map((title, i) => <Button variant="ghost" key={title} className={`approach-stage ${stage === i ? "selected" : ""}`} onClick={() => setStage(i)} aria-pressed={stage === i}><span className="stage-number">0{i + 1}</span><div className={`stage-art stage-art-${i}`} aria-hidden="true">{Array.from({ length: 9 }, (_, j) => <span key={j} />)}</div><span className="stage-title">{title}</span><span className="stage-copy">{["Make sense of the challenge.", "Shape the right solution.", "Make progress tangible."][i]}</span></Button>)}</div><p className="approach-summary">Thoughtful analysis. Practical execution. Measurable impact.</p><div className="section-bottom"><span>GOOD SOLUTIONS BEGIN WITH THE RIGHT QUESTIONS.</span><span>03 / 05</span></div></section>
      <section id="about" className="snap-section about-section"><div className="eyebrow">03 / ABOUT ERUN</div><div className="about-content"><div><h2>Built Around<br />Better Solutions<span className="text-primary">.</span></h2><p>Erun brings together analytical thinking, business understanding, and technology to help organizations work smarter.</p><Button variant="editorial" onClick={() => goTo(4)}>Let’s make progress <ArrowUpRight /></Button></div><div className="architecture-art" role="img" aria-label="Interconnected architectural frames forming one coherent structure">{Array.from({ length: 6 }, (_, i) => <div key={i} className={`architecture-frame frame-${i}`} />)}<div className="architecture-baseline" /><span>THINKING IN SYSTEMS.</span></div></div><div className="section-bottom"><span>BUSINESS FIRST. TECHNOLOGY WITH PURPOSE.</span><span>04 / 05</span></div></section>
      <section id="contact" className="snap-section contact-section"><div className="eyebrow">04 / START A CONVERSATION</div><div className="contact-layout"><div><h2>Let’s Make<br />It Work Better<span className="text-primary">.</span></h2><p>Have a challenge in mind? Let’s talk.</p><Button variant="editorial" onClick={() => formRef.current?.querySelector("input")?.focus()}>Get in Touch <ArrowUpRight /></Button><div className="linkedin-link"><Button variant="nav" asChild><a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label={`${SITE_NAME} on LinkedIn (opens in a new tab)`}><Linkedin size={16} /> LinkedIn <ArrowUpRight size={14} /></a></Button></div></div><form ref={formRef} onSubmit={submitEnquiry} className="contact-form"><label>Your name<input required name="name" autoComplete="name" placeholder="Alex Morgan" /></label><label>Email address<input required type="email" name="email" autoComplete="email" placeholder="alex@company.com" /></label><label>What’s on your mind?<textarea required name="message" rows={3} placeholder="Tell us a little about your challenge…" /></label><Button variant="default" type="submit" className="enquiry-button">Prepare enquiry <ArrowUpRight /></Button><p className="form-note" role="status">{contactStatus || "Enquiries can be copied. Direct delivery coming soon."}</p></form></div><footer className="site-footer"><a href="#home" className="wordmark">erun<span>.</span></a><span>Data Analytics · Automation · AI Implementation</span><span>© {new Date().getFullYear()} Erun Group</span><Button variant="nav" size="icon" aria-label="Back to top" onClick={() => goTo(0)}><ArrowRight className="back-top-icon" /></Button></footer></section>
    </main>
  </div>;
}