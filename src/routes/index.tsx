import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUpRight, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contact-form";
import { EconomicFlow } from "@/components/economic-flow";
import { AIVisual, AnalyticsVisual, WorkflowVisual } from "@/components/service-visuals";
import { LabSection } from "@/components/lab/lab-section";
import { ConsultationLink, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { servicePath } from "@/lib/services";
import { scrollBehavior } from "@/lib/utils";
import {
  HEADLINE,
  HOME_DESCRIPTION,
  HOME_TITLE,
  LINKEDIN_URL,
  LOCATION,
  pageHead,
  SERVICE_NAMES,
  SITE_NAME,
  structuredData,
} from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      title: HOME_TITLE,
      description: HOME_DESCRIPTION,
      path: "/",
      jsonLd: structuredData,
    }),
  component: Index,
});

const sections = ["home", "expertise", "approach", "applications", "about", "lab", "contact"];
const labels = ["Home", "Services", "Approach", "Areas of Focus", "About", "Lab", "Contact"];
const approachStages = [
  {
    title: "Discover",
    text: "We pin down the question, the decision it informs and what a useful answer looks like.",
  },
  {
    title: "Design",
    text: "We choose the methods, data sources and tools that fit the question and your team’s capacity.",
  },
  {
    title: "Develop",
    text: "We build and test the model, pipeline or assistant, and check the results against real data.",
  },
  {
    title: "Deliver",
    text: "You get a working tool, clear documentation and a handover, so your team can run it independently.",
  },
];
// Potential economic application areas, not past clients or partnerships. Six, to
// keep the existing three-column grid even.
const applicationAreas = [
  {
    title: "Markets & Industries",
    text: "Market dynamics, competition, pricing and industry performance.",
  },
  {
    title: "Labour & Workforce",
    text: "Employment trends, wages, productivity and workforce planning.",
  },
  {
    title: "Regional & Urban Development",
    text: "Regional growth, housing, land use and spatial analysis.",
  },
  {
    title: "Policy & Regulation",
    text: "Policy evaluation, regulatory impacts and cost-benefit analysis.",
  },
  {
    title: "Transportation & Mobility",
    text: "Travel demand, pricing, accessibility and market performance.",
  },
  {
    title: "Forecasting & Intelligence",
    text: "Economic trends, predictive modelling and scenario analysis.",
  },
];
const serviceCards = [
  {
    title: "Analytics",
    text: "Models, forecasts and impact assessments that explain what drives your numbers and what is likely to happen next.",
    visual: <AnalyticsVisual />,
    to: servicePath("economic-analytics"),
  },
  {
    title: "Automation",
    text: "Data pipelines and recurring reports that update themselves when new data is released.",
    visual: <WorkflowVisual />,
    to: servicePath("economic-workflow-automation"),
  },
  {
    title: "AI Adoption",
    text: "Research and knowledge assistants that answer from your own documents and show their sources.",
    visual: <AIVisual />,
    to: servicePath("ai-adoption-in-economics"),
  },
];
// About panel: facts supplied by the firm.
const atAGlance = [
  { label: "Based in", value: "Victoria, British Columbia" },
  { label: "Services", value: SERVICE_NAMES.join(" · ") },
  { label: "Works with", value: "Python, R, Power BI and modern AI tools" },
  { label: "Serving", value: "Organizations across Canada" },
];

function Index() {
  const [active, setActive] = useState(0);
  const [stage, setStage] = useState(0);
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
          <EconomicFlow />
          <div className="hero-content">
            <div className="eyebrow">
              <span className="small-rule" /> {SITE_NAME} · {LOCATION}
            </div>
            <h1>
              {HEADLINE.line1}
              <br />
              {HEADLINE.line2} <span className="clarity-word">{HEADLINE.accent}</span>
              <span className="headline-period">.</span>
            </h1>
            <p className="hero-description">
              We help public agencies, non-profits and businesses answer economic questions with
              solid evidence, then automate the analysis so the answers stay current.
            </p>
            <div className="hero-actions">
              <ConsultationLink />
              <Button variant="editorial" className="explore-button" onClick={() => goTo(1)}>
                See our services <ArrowDown />
              </Button>
            </div>
          </div>
          <div className="hero-bottom">
            <span className="hero-bottom-note">{SERVICE_NAMES.join(" · ")}</span>
          </div>
        </section>
        <section id="expertise" className="snap-section expertise-section">
          <div className="section-heading">
            <div className="eyebrow">Our Expertise</div>
            <h2>
              What We Do<span className="text-primary">.</span>
            </h2>
            <p>
              Three services that build on each other: answer the question, automate the work, and
              use AI where it genuinely helps.
            </p>
          </div>
          <div className="expertise-grid">
            {serviceCards.map((service, i) => (
              <article className="expertise-item" key={service.title}>
                <Link
                  to={service.to}
                  className="expertise-link"
                  aria-labelledby={`service-card-${i}`}
                  aria-describedby={`service-card-${i}-text`}
                >
                  {service.visual}
                  <div className="service-heading">
                    <h3 id={`service-card-${i}`}>{service.title}</h3>
                    <ArrowUpRight size={20} aria-hidden="true" />
                  </div>
                  <p id={`service-card-${i}-text`}>{service.text}</p>
                </Link>
              </article>
            ))}
          </div>
          <div className="section-bottom">
            <Button variant="nav" onClick={() => goTo(2)}>
              Our approach <ArrowDown />
            </Button>
          </div>
        </section>
        <section id="approach" className="snap-section approach-section">
          <div className="section-heading">
            <div className="eyebrow">Our Approach</div>
            <h2>
              From Question
              <br />
              to Impact<span className="text-primary">.</span>
            </h2>
            <p>Every project starts with the decision you need to make, not with the tools.</p>
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
                  <span className="stage-title">{item.title}</span>
                  <span className="stage-copy">{item.text}</span>
                </button>
              </li>
            ))}
          </ol>
        </section>
        <section id="applications" className="snap-section applications-section">
          <div className="section-heading">
            <div className="eyebrow">Areas of Focus</div>
            <h2>
              Areas of Focus<span className="text-primary">.</span>
            </h2>
            <p>Where we apply economics and data most often.</p>
          </div>
          <ul className="applications-grid">
            {applicationAreas.map((item) => (
              <li key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </section>
        <section id="about" className="snap-section about-section">
          <div className="eyebrow">About {SITE_NAME}</div>
          <div className="about-content">
            <div>
              <h2>
                Where Economics
                <br />
                Meets Technology<span className="text-primary">.</span>
              </h2>
              <p>
                Erun Consulting Group is an economics and data consultancy based in Victoria,
                British Columbia. We combine economic training with hands-on technical work: we
                build the models, dashboards, pipelines and AI tools ourselves, and explain the
                results in plain language. We work with organizations across Canada.
              </p>
              <ConsultationLink />
            </div>
            <aside className="glance-panel" aria-labelledby="glance-title">
              <h3 id="glance-title">At a glance</h3>
              <dl>
                {atAGlance.map((item) => (
                  <div key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </section>
        <LabSection />
        <section id="contact" className="snap-section contact-section">
          <div className="eyebrow">Start a Conversation</div>
          <div className="contact-layout">
            <div>
              <h2>
                Let’s Build
                <br />
                What’s Next<span className="text-primary">.</span>
              </h2>
              <p>
                Tell us what you’re working on. Book a short call, or send a message and we’ll reply
                by email.
              </p>
              <ConsultationLink />
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
            <ContactForm />
          </div>
          <SiteFooter onBackToTop={() => goTo(0)} />
        </section>
      </main>
    </div>
  );
}
