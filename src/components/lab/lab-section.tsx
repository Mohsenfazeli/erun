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

/** Homepage section after About: "See It Working." and the three Lab prototypes. */
export function LabSection({ index, total }: { index: number; total: number }) {
  const number = String(index).padStart(2, "0");
  return (
    <section id="lab" className="snap-section lab-section">
      <div className="section-heading">
        <div className="eyebrow">{String(index - 1).padStart(2, "0")} / ERUN LAB</div>
        <h2>
          See It <span className="text-primary">Working</span>.
        </h2>
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
      <div className="section-bottom">
        <span>LIVE PROTOTYPES. SAMPLE DATA FOR A FICTIONAL COMPANY.</span>
        <span>
          {number} / {String(total).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}
