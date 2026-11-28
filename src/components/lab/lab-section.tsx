import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

import { AssistantVisual, DashboardVisual, ReportVisual } from "@/components/lab/visuals";
import { LAB_PRODUCTS, labPath, type LabSlug } from "@/lib/lab/products";

const visuals: Record<LabSlug, () => ReactNode> = {
  "performance-dashboard": () => <DashboardVisual />,
  "monthly-report": () => <ReportVisual />,
  "hr-assistant": () => <AssistantVisual />,
};

/** Homepage section after About: "See It Working." and the three Lab prototypes, on a dark band. */
export function LabSection() {
  return (
    <section id="lab" className="snap-section lab-section">
      <div className="section-heading">
        <div className="eyebrow">The Lab</div>
        <h2>
          See It <span className="lab-accent">Working</span>.
        </h2>
        <p>One working prototype for each of our services. Pick one and try it yourself.</p>
        <p className="lab-disclaimer">Live prototypes using sample data for a fictional company.</p>
      </div>
      <nav className="lab-products" aria-label="Lab prototypes">
        {LAB_PRODUCTS.map((p) => (
          <Link
            key={p.slug}
            to={labPath(p.slug)}
            className="lab-product"
            aria-labelledby={`lab-card-${p.slug}`}
            aria-describedby={`lab-card-${p.slug}-text`}
          >
            {visuals[p.slug]()}
            <span className="lab-product-heading">
              <span className="lab-product-name" id={`lab-card-${p.slug}`}>
                {p.name}
              </span>
              <ArrowUpRight size={20} aria-hidden="true" />
            </span>
            <span className="lab-product-copy" id={`lab-card-${p.slug}-text`}>
              <span className="lab-product-pillar">{p.pillar}.</span> {p.short}
            </span>
          </Link>
        ))}
      </nav>
    </section>
  );
}
