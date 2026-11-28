// Canonical origin: Vercel redirects erungroup.ca and http:// to this host.
export const SITE_URL = "https://www.erungroup.ca";
export const SITE_NAME = "Erun Consulting Group";
export const LINKEDIN_URL = "https://www.linkedin.com/company/erungroup";
export const CONTACT_EMAIL = "contact@erungroup.ca";
export const LOCATION = "Victoria, BC";

/** The hero headline, kept in one place: line 1, then the accent line in the brand blue. */
export const HEADLINE = { line1: "Economics in", accent: "Motion" } as const;
/** The headline as one sentence, also the footer tagline: "Economics in Motion." */
export const TAGLINE = `${HEADLINE.line1} ${HEADLINE.accent}.`;
export const HOME_TITLE = `${SITE_NAME} | Economic Research & Advanced Analytics`;
export const HOME_DESCRIPTION =
  "Erun Consulting Group is a Canadian economic research and analytics consultancy leveraging advanced technology, automation and artificial intelligence to deliver meaningful economic insights.";
/** One-line company description. */
export const COMPANY_DESCRIPTION = "Economic research and analytics, powered by modern technology.";
/** The three areas of expertise, in order, as shown in the footer and metadata. */
export const SERVICE_NAMES = [
  "Economic Research",
  "Advanced Analytics",
  "Intelligent Reporting",
] as const;

/** Booking page that every "Book a consultation" button leads to. */
export const BOOKING_PATH = "/book";
/**
 * Cal.com event link, for example https://cal.com/your-name/intro-call. Read at build time
 * from VITE_BOOKING_URL; empty means online booking is not set up yet.
 */
export const BOOKING_URL = String(import.meta.env["VITE_BOOKING_URL"] ?? "").trim();

/** Default share image for every page (public/og-image.png). */
export const SOCIAL_IMAGE = {
  url: `${SITE_URL}/og-image.png`,
  width: 1200,
  height: 630,
  alt: `${SITE_NAME}: ${TAGLINE} Economic Research, Advanced Analytics and Intelligent Reporting.`,
};
/** Square brand mark, used as the logo in structured data. */
export const LOGO_URL = `${SITE_URL}/icon-512.png`;

const services = [
  {
    name: "Economic Research",
    description:
      "Market analysis, policy evaluation, economic impact assessment and regional economics.",
  },
  {
    name: "Advanced Analytics",
    description: "Econometric modelling, forecasting, scenario analysis and data visualization.",
  },
  {
    name: "Intelligent Reporting",
    description: "Automated reporting, economic monitoring and AI-assisted research workflows.",
  },
];

export const areaServed = { "@type": "Country", name: "Canada" };

export const address = {
  "@type": "PostalAddress",
  addressLocality: "Victoria",
  addressRegion: "BC",
  addressCountry: "CA",
};

export const organizationId = `${SITE_URL}/#organization`;

export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: LOGO_URL,
      image: SOCIAL_IMAGE.url,
      description: HOME_DESCRIPTION,
      slogan: TAGLINE,
      email: CONTACT_EMAIL,
      address,
      knowsAbout: [
        "Economics",
        "Econometrics",
        "Economic research",
        "Economic forecasting",
        "Data analytics",
        ...services.map((service) => service.name),
      ],
      areaServed,
      makesOffer: services.map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", ...service, areaServed },
      })),
      sameAs: [LINKEDIN_URL],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      inLanguage: "en-CA",
      publisher: { "@id": organizationId },
    },
  ],
};

/** Head tags for a page: title, description, social cards, canonical and JSON-LD. */
export function pageHead({
  title,
  description,
  path,
  jsonLd,
}: {
  title: string;
  description: string;
  path: string;
  jsonLd?: object;
}) {
  const url = `${SITE_URL}${path}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:locale", content: "en_CA" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: SOCIAL_IMAGE.url },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: String(SOCIAL_IMAGE.width) },
      { property: "og:image:height", content: String(SOCIAL_IMAGE.height) },
      { property: "og:image:alt", content: SOCIAL_IMAGE.alt },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: SOCIAL_IMAGE.url },
      { name: "twitter:image:alt", content: SOCIAL_IMAGE.alt },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: jsonLd ? [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }] : [],
  };
}
