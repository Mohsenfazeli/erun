import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";
import type { ReactNode } from "react";

import { ConsultationCta, ConsultationLink, PageShell } from "@/components/site-chrome";
import { AIVisual, AnalyticsVisual, WorkflowVisual } from "@/components/service-visuals";

import { servicePath, services, type Service, type ServiceSlug } from "@/lib/services";

const DISCUSS_LABEL = "Discuss a Project";

const visuals: Record<ServiceSlug, () => ReactNode> = {
  "economic-analytics": () => <AnalyticsVisual />,
  "economic-workflow-automation": () => <WorkflowVisual />,
  "ai-adoption-in-economics": () => <AIVisual />,
};

export function ServicePage({ service }: { service: Service }) {
  const others = services.filter((item) => item.slug !== service.slug);
  return (
    <PageShell
      cta={
        <ConsultationCta
          title={service.ctaTitle}
          text={service.ctaText}
          buttonLabel={DISCUSS_LABEL}
        />
      }
    >
      <section className="service-hero">
        <div className="service-hero-text">
          <div className="eyebrow">
            <span className="small-rule" /> {service.name}
          </div>
          <h1>
            {service.headline.replace(/\.$/, "")}
            <span className="text-primary">.</span>
          </h1>
          <p>{service.intro}</p>
          <div className="service-hero-actions">
            <ConsultationLink label={DISCUSS_LABEL} />
          </div>
        </div>
        <div className="service-hero-visual">{visuals[service.slug]()}</div>
      </section>

      <section className="service-block" aria-labelledby="capabilities-title">
        <div className="service-block-label">
          <span className="eyebrow">Core capabilities</span>
          <h2 id="capabilities-title">What we do</h2>
        </div>
        <ol className="capability-list">
          {service.capabilities.map((item) => (
            <li key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="service-block" aria-labelledby="applications-title">
        <div className="service-block-label">
          <span className="eyebrow">Practical applications</span>
          <h2 id="applications-title">Where it helps</h2>
          <p>{service.applicationsIntro}</p>
        </div>
        <ul className="application-list">
          {service.applications.map((item) => (
            <li key={item}>
              <span className="application-mark" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="service-block" aria-labelledby="results-title">
        <div className="service-block-label">
          <span className="eyebrow">Deliverables</span>
          <h2 id="results-title">What you receive</h2>
        </div>
        <div className="results-grid results-single">
          <ResultList items={service.deliverables} />
        </div>
      </section>

      <nav className="other-services" aria-label="Other areas of expertise">
        <span className="eyebrow">Other expertise</span>
        {others.map((item) => (
          <Link key={item.slug} to={servicePath(item.slug)}>
            {item.name} <ArrowUpRight size={18} />
          </Link>
        ))}
      </nav>
    </PageShell>
  );
}

function ResultList({ items }: { items: string[] }) {
  return (
    <div>
      <ul>
        {items.map((item) => (
          <li key={item}>
            <Check size={15} aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
