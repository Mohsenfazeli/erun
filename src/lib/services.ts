import { areaServed, organizationId, pageHead, SITE_NAME, SITE_URL } from "@/lib/site";

// Content for the three service pages. Keep claims general and factual: no client
// names, statistics or results that have not been verified.

// Earlier slugs (data-analytics, automation, ai-implementation, analytical-automation,
// ai-adoption) redirect to these.
export type ServiceSlug =
  "economic-analytics" | "economic-workflow-automation" | "ai-adoption-in-economics";

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
    title: "Economic Analytics Consulting in BC & Canada | Erun Consulting Group",
    description:
      "Economic analytics consulting in British Columbia and across Canada: econometric modelling, economic forecasting, market analysis and economic impact assessment.",
    headline: "From economic data to economic intelligence.",
    intro:
      "We transform complex economic data into meaningful intelligence, pairing established economic methods with modern analytical technology.",
    capabilities: [
      {
        title: "Econometric and statistical modelling",
        text: "Models that separate real effects from noise, with sound statistical inference.",
      },
      {
        title: "Economic forecasting",
        text: "Forecasts of demand, prices and economic indicators, with clear ranges of uncertainty.",
      },
      {
        title: "Market and industry analysis",
        text: "Supply and demand, competition and the forces shaping industry performance.",
      },
      {
        title: "Economic indicators and dashboards",
        text: "Economic monitoring systems that track the indicators that matter.",
      },
      {
        title: "Scenario analysis and simulation",
        text: "Test how outcomes change under different assumptions, policies or market conditions.",
      },
      {
        title: "Geospatial economic analysis",
        text: "Regional and spatial patterns in activity, labour markets and access to services.",
      },
      {
        title: "Economic impact assessment",
        text: "Estimate the effects of a project, policy or program, including cost-benefit analysis.",
      },
    ],
    applications: [
      "Forecasting demand, revenue or budgets under different scenarios",
      "Understanding market dynamics, pricing and competition",
      "Measuring productivity and economic performance over time",
      "Assessing the economic impact of a policy, project or program",
      "Monitoring labour market and regional economic conditions",
    ],
    deliverables: [
      "Econometric, statistical and forecasting models",
      "Economic monitoring systems and interactive dashboards",
      "Economic research and analytical reports",
      "Scenario and simulation tools",
      "Evidence-based recommendations",
    ],
    outcomes: ["More reliable forecasts", "Deeper economic insight", "Better-informed decisions"],
    ctaTitle: "Let’s talk about your economic question",
  },
  {
    slug: "economic-workflow-automation",
    name: "Economic Workflow Automation",
    serviceType: "Economic Workflow Automation",
    title: "Economic Workflow Automation | Erun Consulting Group",
    description:
      "Economic workflow automation in British Columbia and across Canada: automated economic reporting, economic data pipelines, indicator monitoring and statistical workflows.",
    headline: "Modern workflows for economic analysis.",
    intro:
      "We modernize economic research and analytical workflows, reducing manual processes and building efficient, reliable and scalable systems.",
    capabilities: [
      {
        title: "Automated economic reporting",
        text: "Recurring economic reports and briefings, produced consistently and ready for review.",
      },
      {
        title: "Economic data pipelines",
        text: "Collect, clean and combine economic data from statistical agencies and internal sources.",
      },
      {
        title: "Economic indicator monitoring",
        text: "Track key indicators as new data is released, and flag meaningful changes.",
      },
      {
        title: "Automated statistical workflows",
        text: "Estimation, testing and forecasting routines that run the same way every time.",
      },
      {
        title: "Economic data validation and processing",
        text: "Checks that catch errors, gaps and revisions before they reach the analysis.",
      },
      {
        title: "Research workflow automation",
        text: "Less time gathering and formatting information, more time interpreting it.",
      },
      {
        title: "Automated economic assessments",
        text: "Repeatable assessments, such as cost or impact estimates, built on documented methods.",
      },
    ],
    applications: [
      "Refreshing economic indicators when new data is published",
      "Producing monthly or quarterly economic reports automatically",
      "Updating forecasts and models on a regular schedule",
      "Validating survey, administrative and market data",
      "Monitoring prices, wages or market conditions and flagging changes",
    ],
    deliverables: [
      "Automated economic reporting systems",
      "Economic data pipelines and infrastructure",
      "Automated statistical and forecasting workflows",
      "Indicator monitoring and alerts",
      "Documentation and handover for your team",
    ],
    outcomes: [
      "Faster economic analysis",
      "Consistent, reproducible results",
      "Less manual effort",
    ],
    ctaTitle: "Let’s modernize your analytical workflow",
  },
  {
    slug: "ai-adoption-in-economics",
    name: "AI Adoption in Economics",
    serviceType: "AI Adoption in Economics",
    title: "AI Adoption in Economics | Erun Consulting Group",
    description:
      "AI adoption in economics for organizations in British Columbia and across Canada: AI-powered economic research assistants, economic knowledge management and responsible AI.",
    headline: "Artificial intelligence for economic research.",
    intro:
      "We help organizations integrate artificial intelligence into economic research, analysis and decision-making, with an emphasis on accuracy, transparency and responsible use.",
    capabilities: [
      {
        title: "AI-powered economic research assistants",
        text: "Assistants that search, summarize and cite economic research and data.",
      },
      {
        title: "Domain-specific AI solutions",
        text: "AI tools shaped around economic concepts, methods and terminology.",
      },
      {
        title: "Economic knowledge management",
        text: "Make reports, studies and institutional knowledge easy to find and use.",
      },
      {
        title: "Intelligent analytical workflows",
        text: "Add AI steps, such as extraction or classification, to existing analysis, with people reviewing the results.",
      },
      {
        title: "AI-assisted economic analysis",
        text: "Use AI to support literature reviews, data exploration and first drafts.",
      },
      {
        title: "AI-powered economic information retrieval",
        text: "Find relevant statistics, policies and research quickly, with sources attached.",
      },
      {
        title: "Responsible AI implementation",
        text: "Clear rules, testing and checks for accuracy, privacy and appropriate use.",
      },
    ],
    applications: [
      "Searching and summarizing economic research, reports and policy documents",
      "Answering staff questions from internal economic knowledge",
      "Extracting key figures from statistical releases and documents",
      "Drafting first versions of routine economic briefings",
      "Testing AI outputs for accuracy before wider use",
    ],
    deliverables: [
      "AI adoption roadmaps",
      "AI-powered economic research assistants",
      "Proof-of-concept applications",
      "Economic knowledge management tools",
      "Responsible AI guidelines and evaluation",
    ],
    outcomes: [
      "More productive economic research",
      "Accessible economic knowledge",
      "Reliable, responsible AI adoption",
    ],
    ctaTitle: "Let’s explore AI for your economic work",
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
