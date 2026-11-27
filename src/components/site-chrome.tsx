import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CONTACT_EMAIL } from "@/lib/site";
import { scrollBehavior } from "@/lib/utils";

// Homepage sections the main navigation points to. The homepage scrolls to them in
// place; every other page links back to them with /#id.
const navItems = [
  { id: "expertise", label: "Expertise" },
  { id: "approach", label: "Approach" },
  { id: "about", label: "About" },
] as const;

const CONSULTATION_LABEL = "Book a consultation";

type HeaderProps = {
  /** Homepage only: scroll to a section instead of following a link. */
  onNavigate?: (id: string) => void;
  /** Homepage only: id of the section in view, to highlight its link. */
  activeId?: string | undefined;
};

export function SiteHeader({ onNavigate, activeId }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const onLabPage = activeId === "lab" || pathname === "/lab" || pathname.startsWith("/lab/");

  function navItem(id: string, label: ReactNode, className?: string) {
    if (onNavigate) {
      return (
        <Button
          variant="nav"
          key={id}
          className={className}
          onClick={() => {
            onNavigate(id);
            setMenuOpen(false);
          }}
        >
          {label}
        </Button>
      );
    }
    return (
      <Button variant="nav" key={id} className={className} asChild>
        <Link to="/" hash={id} onClick={() => setMenuOpen(false)}>
          {label}
        </Link>
      </Button>
    );
  }

  const cta = (
    <>
      {CONSULTATION_LABEL} <ArrowUpRight />
    </>
  );

  return (
    <header className="site-header">
      {onNavigate ? (
        <a
          href="#home"
          className="wordmark brand-mark"
          aria-label="Erun home"
          onClick={(event) => {
            event.preventDefault();
            onNavigate("home");
          }}
        >
          <BrandImage />
        </a>
      ) : (
        <Link to="/" className="wordmark brand-mark" aria-label="Erun home">
          <BrandImage />
        </Link>
      )}
      <nav className={menuOpen ? "desktop-nav open" : "desktop-nav"} aria-label="Main navigation">
        {navItems.map((item) =>
          navItem(item.id, item.label, activeId === item.id ? "nav-active" : undefined),
        )}
        {/* The Lab is its own page, not a homepage section. */}
        <Button variant="nav" className={onLabPage ? "nav-active" : undefined} asChild>
          <Link
            to="/lab"
            aria-current={onLabPage ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            Lab
          </Link>
        </Button>
      </nav>
      {onNavigate ? (
        <Button
          variant="editorial"
          className="header-contact"
          onClick={() => onNavigate("contact")}
        >
          {cta}
        </Button>
      ) : (
        <Button variant="editorial" className="header-contact" asChild>
          <Link to="/" hash="contact">
            {cta}
          </Link>
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="mobile-menu"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X /> : <Menu />}
      </Button>
    </header>
  );
}

function BrandImage() {
  return <img src="/brand/erun-mark-160.png" alt="Erun Group" width={160} height={159} />;
}

type FooterProps = {
  className?: string;
  /** Homepage only: scroll back to the top in place. */
  onBackToTop?: () => void;
};

export function SiteFooter({ className, onBackToTop }: FooterProps) {
  const backToTop = onBackToTop ?? (() => window.scrollTo({ top: 0, behavior: scrollBehavior() }));
  return (
    <footer className={className ? `site-footer ${className}` : "site-footer"}>
      <Link to="/" className="wordmark">
        erun<span>.</span>
      </Link>
      <span>Data Analytics · Automation · AI Implementation</span>
      <span>© {new Date().getFullYear()} Erun Group</span>
      <Button variant="nav" size="icon" aria-label="Back to top" onClick={backToTop}>
        <ArrowRight className="back-top-icon" />
      </Button>
    </footer>
  );
}

/** Closing call to action for inner pages: leads to the homepage contact form. */
export function ConsultationCta({
  title = "Let’s talk about your challenge",
  text = "Tell us what you are working on. We will reply by email to arrange a conversation.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="page-cta" aria-labelledby="page-cta-title">
      <div className="eyebrow">
        <span className="small-rule" /> START A CONVERSATION
      </div>
      <h2 id="page-cta-title">
        {title}
        <span className="text-primary">.</span>
      </h2>
      <p>{text}</p>
      <div className="page-cta-actions">
        <Button variant="editorial" asChild>
          <Link to="/" hash="contact">
            {CONSULTATION_LABEL} <ArrowUpRight />
          </Link>
        </Button>
        <a href={`mailto:${CONTACT_EMAIL}`} className="page-cta-email">
          {CONTACT_EMAIL}
        </a>
      </div>
    </section>
  );
}

/** Shared frame for every page other than the homepage. */
export function PageShell({
  children,
  cta = <ConsultationCta />,
}: {
  children: ReactNode;
  /** Closing call to action; pass null to leave it out. */
  cta?: ReactNode;
}) {
  return (
    <div className="erun-site page-site">
      <SiteHeader />
      <main className="page-main">
        {children}
        {cta}
      </main>
      <SiteFooter className="page-footer" />
    </div>
  );
}

/** The standard "Book a consultation" link to the homepage contact form. */
export function ConsultationLink({ className }: { className?: string }) {
  return (
    <Button variant="editorial" className={className} asChild>
      <Link to="/" hash="contact">
        {CONSULTATION_LABEL} <ArrowUpRight />
      </Link>
    </Button>
  );
}
