import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowDown, ArrowUpRight, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClarityScene } from "@/components/clarity-scene";
import { AIVisual, AnalyticsVisual, WorkflowVisual } from "@/components/service-visuals";
import { LabSection } from "@/components/lab/lab-section";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { servicePath } from "@/lib/services";
import { scrollBehavior } from "@/lib/utils";
import { sendEnquiry } from "@/lib/contact.functions";
import {
  CONTACT_EMAIL,
  HOME_DESCRIPTION,
  HOME_TITLE,
  LINKEDIN_URL,
  POSITIONING,
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

const sections = ["home", "expertise", "approach", "applications", "about", "lab", "contact"];
const labels = ["Home", "Expertise", "Approach", "Applications", "About", "Lab", "Contact"];
const approachStages = [
  {
    title: "Discover",
    text: "Understand the economic context, organizational challenges and decision-making needs.",
  },
  {
    title: "Design",
    text: "Define the analytical methodology, technology and implementation strategy.",
  },
  { title: "Develop", text: "Build, validate and refine models, tools and analytical solutions." },
  {
    title: "Deliver",
    text: "Implement solutions and support their adoption and continuous improvement.",
  },
];
// Potential application areas, not past clients or partnerships.
const applicationAreas = [
  {
    title: "Market & Economic Intelligence",
    text: "Market trends, economic conditions and industry performance.",
  },
  {
    title: "Forecasting & Scenario Analysis",
    text: "Demand forecasting, predictive models and economic simulations.",
  },
  {
    title: "Pricing & Financial Economics",
    text: "Cost analysis, pricing strategies and financial feasibility.",
  },
  {
    title: "Policy & Program Evaluation",
    text: "Impact assessment, performance measurement and evidence-based evaluation.",
  },
  {
    title: "Labour & Workforce Economics",
    text: "Labour markets, workforce planning and employment trends.",
  },
  {
    title: "Regional & Sector Economics",
    text: "Regional development, industry dynamics and spatial analysis.",
  },
];

function Index() {
  const [active, setActive] = useState(0);
  const [stage, setStage] = useState(0);
  const [contactStatus, setContactStatus] = useState("");
  const [sending, setSending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            const index = sections.indexOf(entry.target.id);
            setActive(index);
            if (entry.target.id === "approach") setStage(0);
          }
      },
      { threshold: 0.45 },
    );
    document.querySelectorAll("main > section").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  // A link such as /#contact from another page or a shared URL: open at that section.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!sections.includes(id)) return;
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (
      sections[active] !== "approach" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const timer = window.setInterval(
      () => setStage((current) => (current + 1) % approachStages.length),
      3500,
    );
    return () => window.clearInterval(timer);
  }, [active]);
  function goTo(index: number) {
    const id = sections[index];
    if (id) goToId(id);
  }
  function goToId(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: scrollBehavior() });
  }
  async function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const field = (name: string) => String(data.get(name) ?? "");
    setSending(true);
    setContactStatus("Sending your enquiry…");
    const failed = `Sorry, your enquiry could not be sent. Please email ${CONTACT_EMAIL} instead.`;
    try {
      const result = await sendEnquiry({
        data: {
          name: field("name"),
          email: field("email"),
          message: field("message"),
          website: field("website"),
        },
      });
      if (result.ok) {
        form.reset();
        setContactStatus("Thank you. Your enquiry has been sent.");
      } else {
        setContactStatus(failed);
      }
    } catch {
      setContactStatus(failed);
    } finally {
      setSending(false);
    }
  }
  return (
    <div className="erun-site">
      <SiteHeader onNavigate={goToId} activeId={sections[active]} />
      <aside className="section-progress" aria-label="Section navigation">
        {sections.map((section, i) => (
          <Button
            key={section}
            variant="ghost"
            size="icon"
            aria-label={`Go to ${labels[i]}`}
            aria-current={active === i ? "location" : undefined}
            onClick={() => goTo(i)}
            className={active === i ? "progress-dot current" : "progress-dot"}
          >
            <span />
            <span className="progress-label">{labels[i]}</span>
          </Button>
        ))}
      </aside>
      <main>
        <section id="home" className="hero-section snap-section">
          <div className="hero-grid" aria-hidden="true" />
          <ClarityScene />
          <div className="hero-content">
            <div className="eyebrow">
              <span className="small-rule" /> ERUN GROUP
            </div>
            <h1>
              Turning
              <br />
              Complexity
              <br />
              Into{" "}
              <span className="clarity-word">
                Clarity<span className="headline-period">.</span>
              </span>
            </h1>
            <p className="hero-description">
              Economic Analytics. Analytical Automation.
              <br />
              AI Adoption.
            </p>
            <Button variant="editorial" className="explore-button" onClick={() => goTo(1)}>
              Explore Our Expertise <ArrowUpRight />
            </Button>
          </div>
          <div className="scene-caption">
            <span className="live-dot" /> COMPLEXITY, CONNECTED.
          </div>
          <div className="hero-bottom">
            <Button variant="nav" className="scroll-cue" onClick={() => goTo(1)}>
              <ArrowDown /> SCROLL TO DISCOVER
            </Button>
            <span className="hero-bottom-note">{POSITIONING}</span>
            <span className="section-counter">
              01 <span>/ 07</span>
            </span>
          </div>
        </section>
        <section id="expertise" className="snap-section expertise-section">
          <div className="section-heading">
            <div className="eyebrow">01 / OUR EXPERTISE</div>
            <h2>
              What We Do<span className="text-primary">.</span>
            </h2>
            <p>Economic understanding. Analytical precision. Practical innovation.</p>
          </div>
          <div className="expertise-grid">
            {[
              {
                title: "Economic Analytics",
                text: "Economic insights that drive better decisions.",
                visual: <AnalyticsVisual />,
                to: servicePath("economic-analytics"),
              },
              {
                title: "Analytical Automation",
                text: "Streamlined analysis. Smarter workflows.",
                visual: <WorkflowVisual />,
                to: servicePath("analytical-automation"),
              },
              {
                title: "AI Adoption",
                text: "Practical AI for research, analysis and decision-making.",
                visual: <AIVisual />,
                to: servicePath("ai-adoption"),
              },
            ].map((service, i) => (
              <article className="expertise-item" key={service.title}>
                <Link to={service.to} className="expertise-link">
                  {service.visual}
                  <div className="service-heading">
                    <span className="service-index">0{i + 1}</span>
                    <h3>{service.title}</h3>
                    <ArrowUpRight size={20} />
                  </div>
                  <p>{service.text}</p>
                </Link>
              </article>
            ))}
          </div>
          <div className="section-bottom">
            <span>THREE DISCIPLINES. ONE CLEAR DIRECTION.</span>
            <Button variant="nav" onClick={() => goTo(2)}>
              Our approach <ArrowDown />
            </Button>
          </div>
        </section>
        <section id="approach" className="snap-section approach-section">
          <div className="section-heading">
            <div className="eyebrow">02 / OUR APPROACH</div>
            <h2>
              From Complexity
              <br />
              to Capability<span className="text-primary">.</span>
            </h2>
            <p>
              A structured approach to understanding challenges, developing solutions, and
              delivering measurable value.
            </p>
          </div>
          <ol className="approach-track">
            {approachStages.map((item, i) => (
              <li
                key={item.title}
                className={[
                  i < stage ? "passed" : "",
                  i <= stage ? "reached" : "",
                  i === stage ? "selected" : "",
                ]
                  .join(" ")
                  .trim()}
              >
                <button
                  type="button"
                  className="approach-step"
                  aria-pressed={stage === i}
                  onClick={() => setStage(i)}
                >
                  <span className="step-node" aria-hidden="true" />
                  <span className="stage-number">0{i + 1}</span>
                  <span className="stage-title">{item.title}</span>
                  <span className="stage-copy">{item.text}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="section-bottom">
            <span>GOOD SOLUTIONS BEGIN WITH THE RIGHT QUESTIONS.</span>
            <span>03 / 07</span>
          </div>
        </section>
        <section id="applications" className="snap-section applications-section">
          <div className="section-heading">
            <div className="eyebrow">03 / AREAS OF APPLICATION</div>
            <h2>
              Where It Applies<span className="text-primary">.</span>
            </h2>
            <p>Applying economics, analytics and technology to real-world challenges.</p>
          </div>
          <ul className="applications-grid">
            {applicationAreas.map((item, i) => (
              <li key={item.title}>
                <span className="area-index">0{i + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
          <div className="section-bottom">
            <span>DIFFERENT SECTORS. THE SAME NEED FOR CLARITY.</span>
            <span>04 / 07</span>
          </div>
        </section>
        <section id="about" className="snap-section about-section">
          <div className="eyebrow">04 / ABOUT ERUN</div>
          <div className="about-content">
            <div>
              <h2>
                Built Around
                <br />
                Better Solutions<span className="text-primary">.</span>
              </h2>
              <p>
                Erun is a specialized consulting firm at the intersection of economics, data
                analytics and technology. We help organizations understand complex challenges,
                improve analytical capabilities and turn economic insights into practical decisions.
              </p>
              <Button variant="editorial" onClick={() => goToId("contact")}>
                Let’s make progress <ArrowUpRight />
              </Button>
            </div>
            <div
              className="architecture-art"
              role="img"
              aria-label="Interconnected architectural frames forming one coherent structure"
            >
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className={`architecture-frame frame-${i}`} />
              ))}
              <div className="architecture-baseline" />
              <span>THINKING IN SYSTEMS.</span>
            </div>
          </div>
          <div className="section-bottom">
            <span>ECONOMICS FIRST. TECHNOLOGY WITH PURPOSE.</span>
            <span>05 / 07</span>
          </div>
        </section>
        <LabSection index={6} total={7} />
        <section id="contact" className="snap-section contact-section">
          <div className="eyebrow">06 / START A CONVERSATION</div>
          <div className="contact-layout">
            <div>
              <h2>
                Let’s Make
                <br />
                It Work Better<span className="text-primary">.</span>
              </h2>
              <p>Have an economic, analytical or technology challenge in mind? Let’s talk.</p>
              <Button
                variant="editorial"
                onClick={() => formRef.current?.querySelector("input")?.focus()}
              >
                Get in Touch <ArrowUpRight />
              </Button>
              <div className="linkedin-link">
                <Button variant="nav" asChild>
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${SITE_NAME} on LinkedIn (opens in a new tab)`}
                  >
                    <Linkedin size={16} /> LinkedIn <ArrowUpRight size={14} />
                  </a>
                </Button>
              </div>
            </div>
            <form ref={formRef} onSubmit={submitEnquiry} className="contact-form">
              <label>
                Your name
                <input required name="name" autoComplete="name" placeholder="Alex Morgan" />
              </label>
              <label>
                Email address
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="alex@company.com"
                />
              </label>
              <label>
                What’s on your mind?
                <textarea
                  required
                  name="message"
                  rows={3}
                  placeholder="Tell us a little about your challenge…"
                />
              </label>
              <div className="form-trap" aria-hidden="true">
                <label>
                  Website
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              <Button variant="default" type="submit" className="enquiry-button" disabled={sending}>
                Send enquiry <ArrowUpRight />
              </Button>
              <p className="form-note" role="status">
                {contactStatus || (
                  <>
                    Prefer email? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                  </>
                )}
              </p>
            </form>
          </div>
          <SiteFooter onBackToTop={() => goTo(0)} />
        </section>
      </main>
    </div>
  );
}
