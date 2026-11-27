import { areaServed, organizationId, pageHead, SITE_NAME, SITE_URL } from "@/lib/site";

// Content for the three service pages. Keep claims general and factual: no client
// names, statistics or results that have not been verified.

// Earlier slugs (data-analytics, automation, ai-implementation) redirect to these.
export type ServiceSlug = "economic-analytics" | "analytical-automation" | "ai-adoption";

export type Service = {
  slug: ServiceSlug;
  /** Short name, as on the homepage cards. */
  name: string;
  /** Name used for the page title and structured data. */
  serviceType: string;
  title: string;
  description: string;
  headline: string;
  intro: string;
  capabilities: { title: string; text: string }[];
  applications: string[];
  deliverables: string[];
  outcomes: string[];
  ctaTitle: string;
};

export const services: Service[] = [
  {
    slug: "economic-analytics",
    name: "Economic Analytics",
    serviceType: "Economic Analytics Consulting",
    title: "Economic Analytics Consulting in Vancouver & BC | Erun Consulting Group",
    description:
      "Economic analytics for organizations in British Columbia and across Canada: econometric analysis, forecasting, scenario modelling and dashboards for evidence-based decisions.",
    headline: "Understand more. Decide better.",
    intro:
      "We combine economic reasoning, statistical methods and data science to help organizations understand trends, evaluate alternatives and make evidence-based decisions.",
    capabilities: [
      {
        title: "Economic data integration and management",
        text: "Bring economic, financial and operational data together in one reliable, documented source.",
      },
      {
        title: "Econometric and statistical analysis",
        text: "Sound methods that separate real effects from noise and explain what drives results.",
      },
      {
        title: "Forecasting and scenario modelling",
        text: "Forecasts and what-if scenarios that show the range of likely outcomes.",
      },
      {
        title: "Economic indicators and interactive dashboards",
        text: "Clear indicators and dashboards that track the measures that matter.",
      },
    ],
    applications: [
      "Tracking market conditions and industry performance",
      "Forecasting demand, revenue or budgets",
      "Comparing options through cost and benefit analysis",
      "Evaluating whether a policy or program is working",
      "Understanding costs, pricing and financial feasibility",
    ],
    deliverables: [
      "Economic and statistical models",
      "Interactive dashboards",
      "Economic research and analytical reports",
      "Forecasting and simulation tools",
      "Evidence-based recommendations",
    ],
    outcomes: ["Better forecasts", "Deeper insights", "Informed decisions"],
    ctaTitle: "Let’s talk about the decision ahead",
  },
  {
    slug: "analytical-automation",
    name: "Analytical Automation",
    serviceType: "Analytical Automation",
    title: "Analytical Automation in Vancouver & BC | Erun Consulting Group",
    description:
      "Analytical automation for organizations in British Columbia and across Canada: automated data pipelines, modelling, forecasting and reporting that reduce manual effort.",
    headline: "Less manual work. More meaningful analysis.",
    intro:
      "We automate repetitive research, reporting and analytical processes, enabling organizations to spend less time preparing information and more time understanding it.",
    capabilities: [
      {
        title: "Analytical workflow assessment",
        text: "Map how analysis and reporting are produced today, and where time is lost.",
      },
      {
        title: "Automated data pipelines",
        text: "Collect, clean and combine data on a schedule, without manual steps.",
      },
      {
        title: "Automated modelling and forecasting",
        text: "Models and forecasts that refresh as new data arrives.",
      },
      {
        title: "Automated research and reporting",
        text: "Recurring reports and briefings produced consistently, ready for review.",
      },
    ],
    applications: [
      "Refreshing economic indicators as new data is released",
      "Producing monthly or quarterly reports automatically",
      "Updating forecasts on a regular schedule",
      "Validating and cleaning incoming data",
      "Monitoring key measures and flagging changes",
    ],
    deliverables: [
      "Automated analytical workflows",
      "Data processing pipelines",
      "Automated reporting systems",
      "Reusable analytical tools",
      "Automated monitoring systems",
    ],
    outcomes: ["Faster analysis", "Consistent results", "Reduced manual effort"],
    ctaTitle: "Let’s find the work worth automating",
  },
  {
    slug: "ai-adoption",
    name: "AI Adoption",
    serviceType: "AI Adoption Consulting",
    title: "AI Adoption Consulting in Vancouver & BC | Erun Consulting Group",
    description:
      "AI adoption for organizations in British Columbia and across Canada: AI strategy, domain-specific assistants and responsible use of AI in research and analysis.",
    headline: "Intelligent tools. Informed decisions.",
    intro:
      "We help organizations adopt artificial intelligence across economic research, analytical workflows and decision-making, with an emphasis on accuracy, transparency and responsible use.",
    capabilities: [
      {
        title: "AI readiness and adoption strategy",
        text: "Assess where AI fits, what it needs, and how to introduce it responsibly.",
      },
      {
        title: "Domain-specific AI assistants",
        text: "Assistants grounded in your own documents, data and subject matter.",
      },
      {
        title: "AI-assisted research and analysis",
        text: "Use AI to search, summarize and draft, with people reviewing the results.",
      },
      {
        title: "AI governance, evaluation and validation",
        text: "Clear rules, testing and checks for accuracy, privacy and appropriate use.",
      },
    ],
    applications: [
      "Searching and summarizing research, reports and policy documents",
      "Answering staff questions from internal knowledge",
      "Extracting key information from documents and data",
      "Drafting first versions of routine analysis and briefings",
      "Testing AI outputs for accuracy before wider use",
    ],
    deliverables: [
      "AI adoption roadmaps",
      "Domain-specific AI solutions",
      "Proof-of-concept applications",
      "Knowledge and research assistants",
      "AI governance frameworks",
    ],
    outcomes: ["Improved research productivity", "Accessible knowledge", "Reliable AI adoption"],
    ctaTitle: "Let’s explore where AI can help",
  },
];

export function getService(slug: ServiceSlug): Service {
  const service = services.find((item) => item.slug === slug);
  if (!service) throw new Error(`Unknown service: ${slug}`);
  return service;
}

export function servicePath(slug: ServiceSlug) {
  return `/services/${slug}` as const;
}

/** Title, description, social tags and Service structured data for a service page. */
export function serviceHead(service: Service) {
  const path = servicePath(service.slug);
  const url = `${SITE_URL}${path}`;
  return pageHead({
    title: service.title,
    description: service.description,
    path,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${url}#service`,
      name: service.serviceType,
      serviceType: service.serviceType,
      description: service.description,
      url,
      areaServed,
      provider: {
        "@type": "Organization",
        "@id": organizationId,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
      },
    },
  });
}
