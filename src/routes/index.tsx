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
  SERVICE_NAMES,
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
    text: "Understand the economic question, its market context and the decisions it informs.",
  },
  {
    title: "Design",
    text: "Choose the methodology, data and tools, from econometric models to AI-assisted analysis.",
  },
  {
    title: "Develop",
    text: "Build, validate and refine models, data pipelines and analytical tools.",
  },
  {
    title: "Deliver",
    text: "Put results into everyday use and support adoption and continuous improvement.",
  },
];
// Potential economic application areas, not past clients or partnerships. Six, to
// keep the existing three-column grid even.
const applicationAreas = [
  {
    title: "Market & Industry Economics",
    text: "Supply and demand, competition and industry performance.",
  },
  {
    title: "Labour & Workforce Economics",
    text: "Labour markets, wages, productivity and workforce needs.",
  },
  {
    title: "Regional & Urban Economics",
    text: "Regional growth, housing, land use and spatial patterns.",
  },
  {
    title: "Policy & Regulatory Analysis",
    text: "Policy impact, cost-benefit analysis and regulatory review.",
  },
  {
    title: "Transportation Economics",
    text: "Travel demand, pricing, service levels and market structure.",
  },
  {
    title: "Economic Forecasting & Intelligence",
    text: "Economic indicators, forecasts and scenario simulation.",
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
              Modernizing
              <br />
              <span className="clarity-word">
                Economics<span className="headline-period">.</span>
              </span>
            </h1>
            <p className="hero-description">
              We bring together economic expertise, advanced analytics, automation and artificial
              intelligence to transform how economic analysis is conducted.
            </p>
            <Button variant="editorial" className="explore-button" onClick={() => goTo(1)}>
              Explore Our Expertise <ArrowUpRight />
            </Button>
          </div>
          <div className="scene-caption">
            <span className="live-dot" /> ECONOMICS, CONNECTED.
          </div>
          <div className="hero-bottom">
            <Button variant="nav" className="scroll-cue" onClick={() => goTo(1)}>
              <ArrowDown /> SCROLL TO DISCOVER
            </Button>
            <span className="hero-bottom-note">{SERVICE_NAMES.join(" · ")}</span>
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
            <p>Three capabilities. One discipline: economics.</p>
          </div>
          <div className="expertise-grid">
            {[
              {
                title: "Economic Analytics",
                text: "Economic intelligence from complex data.",
                visual: <AnalyticsVisual />,
                to: servicePath("economic-analytics"),
              },
              {
                title: "Economic Workflow Automation",
                text: "Faster, more reliable economic analysis.",
                visual: <WorkflowVisual />,
                to: servicePath("economic-workflow-automation"),
              },
              {
                title: "AI Adoption in Economics",
                text: "AI for economic research and analysis.",
                visual: <AIVisual />,
                to: servicePath("ai-adoption-in-economics"),
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
            <span>THREE CAPABILITIES. ONE DISCIPLINE.</span>
            <Button variant="nav" onClick={() => goTo(2)}>
              Our approach <ArrowDown />
            </Button>
          </div>
        </section>
        <section id="approach" className="snap-section approach-section">
          <div className="section-heading">
            <div className="eyebrow">02 / OUR APPROACH</div>
            <h2>
              From Question
              <br />
              to Evidence<span className="text-primary">.</span>
            </h2>
            <p>A structured approach that pairs economic reasoning with modern analytical tools.</p>
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
            <p>The economic questions we help organizations answer.</p>
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
            <span>MANY SECTORS. ONE ECONOMIC LENS.</span>
            <span>04 / 07</span>
          </div>
        </section>
        <section id="about" className="snap-section about-section">
          <div className="eyebrow">04 / ABOUT ERUN</div>
          <div className="about-content">
            <div>
              <h2>
                Where Economics
                <br />
                Meets Technology<span className="text-primary">.</span>
              </h2>
              <p>
                Erun Consulting Group is a specialized consulting firm dedicated to modernizing
                economics through technology. We combine economic expertise and analytical rigour
                with automation and artificial intelligence to build more efficient, reliable ways
                to understand complex economic questions.
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
                Let’s Modernize
                <br />
                Your Analysis<span className="text-primary">.</span>
              </h2>
              <p>Have an economic question or analytical challenge in mind? Let’s talk.</p>
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
