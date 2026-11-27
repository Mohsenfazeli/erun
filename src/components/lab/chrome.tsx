import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

import { ConsultationCta, PageShell } from "@/components/site-chrome";
import { getLabProduct, LAB_PRODUCTS, labPath, type LabSlug } from "@/lib/lab/products";
import { cn } from "@/lib/utils";

/** One template for the three Lab prototypes, mirroring the service pages. */
export function LabProductPage({ slug, children }: { slug: LabSlug; children: ReactNode }) {
  const p = getLabProduct(slug);
  return (
    <PageShell
      cta={
        <ConsultationCta
          title={p.cta}
          text="We build these on your own data and systems. Tell us what you are working on and we will reply by email to arrange a conversation."
        />
      }
    >
      <section className="lab-intro">
        <div>
          <div className="eyebrow">
            <span className="small-rule" /> LAB / {p.number} {p.pillar.toUpperCase()}
          </div>
          <h1>
            {p.name}
            <span className="text-primary">.</span>
          </h1>
          <p>{p.tagline}</p>
        </div>
        <div className="lab-intro-meta">
          <span>
            <span className="live-dot" /> LIVE PROTOTYPE
          </span>
          <span>SAMPLE DATA · FICTIONAL COMPANY</span>
        </div>
      </section>

      <section className="lab-stage" aria-label={`${p.name} prototype`}>
        <div className="lab-stage-bar no-print">
          <span>
            <span className="live-dot" /> {p.stage.toUpperCase()}
          </span>
          <span>LAB / {p.number}</span>
        </div>
        {children}
      </section>

      <section className="service-block no-print" aria-labelledby="usecase-title">
        <div className="service-block-label">
          <span className="eyebrow">THE USE CASE</span>
          <h2 id="usecase-title">Why it matters</h2>
        </div>
        <ol className="capability-list">
          {[
            { title: "The problem", text: p.problem },
            { title: "What it does", text: p.solution },
            { title: "Business value", text: p.value },
            { title: "Built on your data", text: p.yourData },
          ].map((item, i) => (
            <li key={item.title}>
              <span className="service-index">0{i + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <nav className="other-services no-print" aria-label="Other Lab prototypes">
        <span className="eyebrow">MORE FROM THE LAB</span>
        {LAB_PRODUCTS.filter((item) => item.slug !== slug).map((item) => (
          <Link key={item.slug} to={labPath(item.slug)}>
            {item.name} <ArrowUpRight size={18} />
          </Link>
        ))}
      </nav>
    </PageShell>
  );
}

export function SampleTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[10px] font-[650] uppercase text-muted-foreground",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-muted-foreground" /> Sample data
    </span>
  );
}
