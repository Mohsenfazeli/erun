import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";
import type { ReactNode } from "react";

import { ConsultationCta, ConsultationLink, PageShell } from "@/components/site-chrome";
import { AIVisual, AnalyticsVisual, WorkflowVisual } from "@/components/service-visuals";

import { servicePath, services, type Service, type ServiceSlug } from "@/lib/services";

const visuals: Record<ServiceSlug, () => ReactNode> = {
  "data-analytics": () => <AnalyticsVisual />,
  automation: () => <WorkflowVisual />,
  "ai-implementation": () => <AIVisual />,
};

export function ServicePage({ service }: { service: Service }) {
  const index = services.findIndex((item) => item.slug === service.slug) + 1;
  const others = services.filter((item) => item.slug !== service.slug);
  return (
    <PageShell cta={<ConsultationCta title={service.ctaTitle} />}>
      <section className="service-hero">
        <div className="service-hero-text">
          <div className="eyebrow">
            <span className="small-rule" /> SERVICES / 0{index} {service.name.toUpperCase()}
          </div>
          <h1>
            {service.headline.replace(/\.$/, "")}
            <span className="text-primary">.</span>
          </h1>
          <p>{service.intro}</p>
          <ConsultationLink />
        </div>
        <div className="service-hero-visual">{visuals[service.slug]()}</div>
      </section>

      <section className="service-block" aria-labelledby="capabilities-title">
        <div className="service-block-label">
          <span className="eyebrow">CORE CAPABILITIES</span>
          <h2 id="capabilities-title">What we do</h2>
        </div>
        <ol className="capability-list">
          {service.capabilities.map((item, i) => (
            <li key={item.title}>
              <span className="service-index">0{i + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="service-block" aria-labelledby="applications-title">
        <div className="service-block-label">
          <span className="eyebrow">PRACTICAL APPLICATIONS</span>
          <h2 id="applications-title">Where it helps</h2>
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
          <span className="eyebrow">DELIVERABLES & OUTCOMES</span>
          <h2 id="results-title">What you receive</h2>
        </div>
        <div className="results-grid">
          <ResultList title="Deliverables" items={service.deliverables} />
          <ResultList title="Outcomes" items={service.outcomes} />
        </div>
      </section>

      <nav className="other-services" aria-label="Other services">
        <span className="eyebrow">OTHER SERVICES</span>
        {others.map((item) => (
          <Link key={item.slug} to={servicePath(item.slug)}>
            {item.name} <ArrowUpRight size={18} />
          </Link>
        ))}
      </nav>
    </PageShell>
  );
}

function ResultList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3>{title}</h3>
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
