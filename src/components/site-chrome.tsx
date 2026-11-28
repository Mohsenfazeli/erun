import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { servicePath, services } from "@/lib/services";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";
import { scrollBehavior } from "@/lib/utils";

// Homepage sections the main navigation points to. The homepage scrolls to them in
// place; every other page links back to them with /#id. The services section keeps
// the id "expertise" so existing links still work.
const navItems = [
  { id: "expertise", label: "Expertise" },
  { id: "approach", label: "Approach" },
  { id: "about", label: "About" },
  { id: "lab", label: "Lab" },
  { id: "contact", label: "Contact" },
] as const;

const CONTACT_LABEL = "Discuss a Project";

type HeaderProps = {
  /** Homepage only: scroll to a section instead of following a link. */
  onNavigate?: (id: string) => void;
  /** Homepage only: id of the section in view, to highlight its link. */
  activeId?: string | undefined;
};

export function SiteHeader({ onNavigate, activeId }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  // Lab prototype pages keep the Lab link highlighted.
  const onLabPage = pathname.startsWith("/lab/");

  // Solid header once the page scrolls, so content never shows through behind the logo.
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

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

  const classes = scrolled || menuOpen ? "site-header is-scrolled" : "site-header";
  return (
    <header className={classes}>
      {onNavigate ? (
        <a
          href="#home"
          className="wordmark brand-mark"
          aria-label={`${SITE_NAME} home`}
          onClick={(event) => {
            event.preventDefault();
            onNavigate("home");
          }}
        >
          <BrandImage />
        </a>
      ) : (
        <Link to="/" className="wordmark brand-mark" aria-label={`${SITE_NAME} home`}>
          <BrandImage />
        </Link>
      )}
      <nav className={menuOpen ? "desktop-nav open" : "desktop-nav"} aria-label="Main navigation">
        {navItems.map((item) =>
          navItem(
            item.id,
            item.label,
            activeId === item.id || (item.id === "lab" && onLabPage) ? "nav-active" : undefined,
          ),
        )}
      </nav>
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
  return <img src="/brand/erun-mark-160.png" alt={SITE_NAME} width={160} height={159} />;
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
        {SITE_NAME}
        <span>.</span>
      </Link>
      <span className="footer-services">
        {services.map((service, i) => (
          <span key={service.slug}>
            {i > 0 && " · "}
            <Link to={servicePath(service.slug)}>{service.name}</Link>
          </span>
        ))}
      </span>
      <span className="footer-legal">
        {/* Privacy Policy link hidden for now; the page still exists at /privacy. */}©{" "}
        {new Date().getFullYear()} {SITE_NAME}
      </span>
      <Button variant="nav" size="icon" aria-label="Back to top" onClick={backToTop}>
        <ArrowRight className="back-top-icon" />
      </Button>
    </footer>
  );
}

/** Closing call to action for inner pages: a button to the contact form. */
export function ConsultationCta({
  title = "Let’s talk about your challenge",
  text = "Send us a message and we’ll reply by email.",
  buttonLabel,
}: {
  title?: string;
  text?: string;
  /** Label of the button; "Discuss a Project" by default. */
  buttonLabel?: string;
}) {
  return (
    <section className="page-cta" aria-labelledby="page-cta-title">
      <div className="eyebrow">
        <span className="small-rule" /> Start a conversation
      </div>
      <h2 id="page-cta-title">
        {title}
        <span className="text-primary">.</span>
      </h2>
      <p>{text}</p>
      <div className="page-cta-actions">
        <ConsultationLink label={buttonLabel} />
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

/** Primary call to action, to the homepage contact form: "Discuss a Project" unless relabelled. */
export function ConsultationLink({
  className,
  label,
}: {
  className?: string;
  label?: string | undefined;
}) {
  return (
    <Button variant="default" className={["cta-primary", className].join(" ").trim()} asChild>
      <Link to="/" hash="contact">
        {label ?? CONTACT_LABEL} <ArrowUpRight />
      </Link>
    </Button>
  );
}

/** Secondary call to action: a text link to the homepage contact form. */
export function SendMessageLink({ label = "or send a message" }: { label?: string }) {
  return (
    <Link to="/" hash="contact" className="cta-secondary">
      {label}
    </Link>
  );
}
