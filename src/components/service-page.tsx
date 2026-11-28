import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";
import type { ReactNode } from "react";

import {
  ConsultationCta,
  ConsultationLink,
  PageShell,
  SendMessageLink,
} from "@/components/site-chrome";
import { AIVisual, AnalyticsVisual, WorkflowVisual } from "@/components/service-visuals";

import { servicePath, services, type Service, type ServiceSlug } from "@/lib/services";

const visuals: Record<ServiceSlug, () => ReactNode> = {
  "economic-analytics": () => <AnalyticsVisual />,
  "economic-workflow-automation": () => <WorkflowVisual />,
  "ai-adoption-in-economics": () => <AIVisual />,
};

export function ServicePage({ service }: { service: Service }) {
  const others = services.filter((item) => item.slug !== service.slug);
  return (
    <PageShell cta={<ConsultationCta title={service.ctaTitle} />}>
      <section className="service-hero">
        <div className="service-hero-text">
          <div className="eyebrow">
            <span className="small-rule" /> Services / {service.name}
          </div>
          <h1>
            {service.headline.replace(/\.$/, "")}
            <span className="text-primary">.</span>
          </h1>
          <p>{service.intro}</p>
          <div className="service-hero-actions">
            <ConsultationLink />
            <SendMessageLink />
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
          <span className="eyebrow">Deliverables & outcomes</span>
          <h2 id="results-title">What you receive</h2>
        </div>
        <div className="results-grid">
          <ResultList title="Deliverables" items={service.deliverables} />
          <ResultList title="Outcomes" items={service.outcomes} />
        </div>
      </section>

      <nav className="other-services" aria-label="Other services">
        <span className="eyebrow">Other services</span>
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
