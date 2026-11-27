import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

import { SiteHeader } from "@/components/site-chrome";
import { AssistantVisual, DashboardVisual, ReportVisual } from "@/components/lab/visuals";
import {
  LAB_DESCRIPTION,
  LAB_PRODUCTS,
  LAB_TITLE,
  labPath,
  type LabSlug,
} from "@/lib/lab/products";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/lab/")({
  head: () => pageHead({ title: LAB_TITLE, description: LAB_DESCRIPTION, path: "/lab" }),
  component: LabPage,
});

const visuals: Record<LabSlug, () => ReactNode> = {
  "performance-dashboard": () => <DashboardVisual />,
  "monthly-report": () => <ReportVisual />,
  "hr-assistant": () => <AssistantVisual />,
};

/** The Lab is a single screen, like the homepage hero: a headline and three ways in. */
function LabPage() {
  return (
    <div className="erun-site">
      <SiteHeader activeId="lab" />
      <main>
        <section className="lab-hero">
          <div className="hero-grid" aria-hidden="true" />
          <div className="lab-hero-text">
            <div className="eyebrow">
              <span className="small-rule" /> ERUN LAB
            </div>
            <h1>
              See It <span className="clarity-word">Working</span>
              <span className="headline-period">.</span>
            </h1>
            <p>One working prototype for each of our services. Pick one and try it yourself.</p>
          </div>

          <nav className="lab-products" aria-label="Lab prototypes">
            {LAB_PRODUCTS.map((p) => (
              <Link key={p.slug} to={labPath(p.slug)} className="lab-product">
                {visuals[p.slug]()}
                <span className="lab-product-heading">
                  <span className="service-index">{p.number}</span>
                  <span className="lab-product-name">{p.name}</span>
                  <ArrowUpRight size={20} />
                </span>
                <span className="lab-product-copy">
                  <span className="lab-product-pillar">{p.pillar}.</span> {p.short}
                </span>
              </Link>
            ))}
          </nav>

          <div className="hero-bottom">
            <span className="hero-bottom-note">
              <span className="live-dot" /> Live prototypes · sample data for a fictional company
            </span>
            <span className="hero-bottom-note lab-hide-mobile">
              Analytical thinking. Practical progress.
            </span>
            <span className="section-counter">
              03 <span>prototypes</span>
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}
