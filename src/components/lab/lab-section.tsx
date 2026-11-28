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

/** Homepage section after About: "What We’re Building." and the three Lab prototypes, on a dark band. */
export function LabSection() {
  return (
    <section id="lab" className="snap-section lab-section">
      <div className="section-heading">
        <h2>
          What We’re <span className="lab-accent">Building</span>.
        </h2>
        <p>
          Explore how economic thinking and modern technology come together through interactive
          analytical tools, research prototypes and intelligent applications.
        </p>
        <p className="lab-disclaimer">Live prototypes using sample data for a fictional company.</p>
        <Link to={labPath(LAB_PRODUCTS[0]!.slug)} className="lab-cta">
          Explore the Lab <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
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
