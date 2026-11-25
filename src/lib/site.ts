// Canonical origin: Vercel redirects erungroup.ca and http:// to this host.
export const SITE_URL = "https://www.erungroup.ca";
export const SITE_NAME = "Erun Consulting Group";
export const LINKEDIN_URL = "https://www.linkedin.com/company/erungroup";
export const CONTACT_EMAIL = "contact@erungroup.ca";

export const HOME_TITLE = "Erun Consulting Group | AI & Data Analytics Consulting in Vancouver";
export const HOME_DESCRIPTION =
  "Erun Consulting Group provides data analytics, process automation, and AI implementation services to organizations in Vancouver and across British Columbia.";

// Existing brand mark, reused as the social preview and logo image.
export const SOCIAL_IMAGE = { url: `${SITE_URL}/icon-512.png`, width: 512, height: 512 };

const services = [
  { name: "Data Analytics", description: "Insights that drive better decisions." },
  { name: "Process Automation", description: "Smarter workflows. Less manual work." },
  { name: "AI Implementation", description: "Practical AI. Real applications." },
];

export const areaServed = [
  {
    "@type": "City",
    name: "Vancouver",
    containedInPlace: { "@type": "AdministrativeArea", name: "British Columbia" },
  },
  { "@type": "AdministrativeArea", name: "British Columbia" },
];

export const organizationId = `${SITE_URL}/#organization`;

export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: SITE_NAME,
      alternateName: "Erun Group",
      url: `${SITE_URL}/`,
      logo: SOCIAL_IMAGE.url,
      description: HOME_DESCRIPTION,
      slogan: "Turning Complexity Into Clarity.",
      email: CONTACT_EMAIL,
      knowsAbout: services.map((service) => service.name),
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

/** Head tags for an inner page: title, description, social cards, canonical and JSON-LD. */
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
      { property: "og:image", content: SOCIAL_IMAGE.url },
      { property: "og:image:width", content: String(SOCIAL_IMAGE.width) },
      { property: "og:image:height", content: String(SOCIAL_IMAGE.height) },
      { property: "og:image:alt", content: `${SITE_NAME} logo` },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: SOCIAL_IMAGE.url },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: jsonLd ? [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }] : [],
  };
}
