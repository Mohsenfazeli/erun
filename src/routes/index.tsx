import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUpRight, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contact-form";
import { AnalyticsVisual, ReportingVisual, ResearchVisual } from "@/components/service-visuals";
import { LabSection } from "@/components/lab/lab-section";
import { ParticleWave } from "@/components/particle-wave";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { servicePath } from "@/lib/services";
import { scrollBehavior } from "@/lib/utils";
import {
  HEADLINE,
  HOME_DESCRIPTION,
  HOME_TITLE,
  LINKEDIN_URL,
  pageHead,
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

const sections = ["home", "expertise", "approach", "about", "lab", "contact"];
const labels = ["Home", "Expertise", "Approach", "About", "Lab", "Contact"];
const approachStages = [
  {
    title: "Understand",
    text: "Define the question, understand the context and establish clear analytical objectives.",
  },
  {
    title: "Analyze",
    text: "Apply economic reasoning, statistical methods and advanced analytical techniques.",
  },
  {
    title: "Integrate",
    text: "Incorporate automation and AI where they improve the analytical process.",
  },
  {
    title: "Deliver",
    text: "Translate findings into clear insights, practical tools and informed recommendations.",
  },
];
const serviceCards = [
  {
    title: "Economic Research",
    text: "Understand economic conditions, market dynamics and the forces shaping industries and communities.",
    visual: <ResearchVisual />,
    to: servicePath("economic-analytics"),
  },
  {
    title: "Advanced Analytics",
    text: "Turn complex data into meaningful insights through statistical modelling, forecasting and visualization.",
    visual: <AnalyticsVisual />,
    to: servicePath("economic-workflow-automation"),
  },
  {
    title: "Intelligent Reporting",
    text: "Deliver timely, consistent economic insights through automated reporting and AI-assisted analytical workflows.",
    visual: <ReportingVisual />,
    to: servicePath("ai-adoption-in-economics"),
  },
];
// About panel: facts supplied by the firm.
const atAGlance = [
  { label: "Location", value: "British Columbia, Canada" },
  { label: "Expertise", value: "Economics, research and data analytics" },
  { label: "Approach", value: "Advanced technology, automation and AI" },
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
          <ParticleWave />
          <div className="hero-content">
            <h1>
              {HEADLINE.line1} <br />
              <span className="clarity-word">{HEADLINE.accent}.</span>
            </h1>
            <p className="hero-description">
              A new approach to economic analysis and research, powered by advanced technology,
              automation and artificial intelligence.
            </p>
            <div className="hero-actions">
              <Button variant="default" className="cta-primary" onClick={() => goToId("expertise")}>
                Explore Our Expertise <ArrowDown />
              </Button>
              <Button
                variant="editorial"
                className="explore-button"
                onClick={() => goToId("about")}
              >
                Learn About Erun <ArrowDown />
              </Button>
            </div>
          </div>
        </section>
        <section id="expertise" className="snap-section expertise-section">
          <div className="section-heading">
            <h2>
              What We Do<span className="text-primary">.</span>
            </h2>
            <p>
              From understanding economic trends to developing intelligent analytical systems, we
              bring modern methods to complex questions.
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
        </section>
        <section id="approach" className="snap-section approach-section">
          <div className="section-heading">
            <h2>
              How We Work<span className="text-primary">.</span>
            </h2>
            <p>
              We combine established economic principles with modern technology to make research
              more efficient, reproducible and informative.
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
                  <span className="stage-title">{item.title}</span>
                  <span className="stage-copy">{item.text}</span>
                </button>
              </li>
            ))}
          </ol>
          <p className="approach-statement">
            Technology enhances our analysis. Economic reasoning guides it.
          </p>
        </section>
        <section id="about" className="snap-section about-section">
          <div className="about-content">
            <div>
              <h2>
                Who We Are<span className="text-primary">.</span>
              </h2>
              <p>
                Erun Consulting Group is an independent economic research and analytics consultancy
                based in British Columbia, Canada.
              </p>
              <p>
                We bring together economics, data science and modern technology to address complex
                economic and business questions. Our approach integrates advanced analytical
                methods, automation and artificial intelligence into the research process, enabling
                more efficient analysis and accessible insights.
              </p>
              <p>
                We believe the future of economic research lies in combining sound methodology with
                intelligent technology.
              </p>
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
          <div className="contact-layout">
            <div>
              <h2>
                Let’s Talk<span className="text-primary">.</span>
              </h2>
              <p>
                Have an economic question, a complex dataset or a research challenge? Let’s explore
                how we can help.
              </p>
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
