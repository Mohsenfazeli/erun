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
    name: "Analytics",
    serviceType: "Economic Analytics Consulting",
    title: "Analytics: Economic Modelling & Forecasting | Erun Consulting Group",
    description:
      "Economic modelling, forecasting, market analysis and scenario analysis for organizations in British Columbia and across Canada.",
    headline: "Understand markets. Anticipate change.",
    intro:
      "We combine economic reasoning with modern data science to uncover insights, understand markets and anticipate what comes next.",
    capabilities: [
      {
        title: "Economic modelling",
        text: "Econometric and statistical models that explain what drives results.",
      },
      {
        title: "Forecasting",
        text: "Forecasts of demand, prices and key indicators, with clear ranges of uncertainty.",
      },
      {
        title: "Market analysis",
        text: "Supply and demand, competition and the forces shaping industry performance.",
      },
      {
        title: "Data visualization",
        text: "Dashboards and charts that make trends and indicators easy to follow.",
      },
      {
        title: "Scenario analysis",
        text: "Test how outcomes change under different assumptions, policies or market conditions.",
      },
      {
        title: "Impact assessment",
        text: "Estimate the effects of a policy, project or program, including cost-benefit analysis.",
      },
    ],
    applications: [
      "Forecasting demand, revenue or budgets under different scenarios",
      "Understanding market dynamics, pricing and competition",
      "Measuring productivity and performance over time",
      "Assessing the impact of a policy, project or program",
      "Monitoring labour market and regional conditions",
    ],
    deliverables: [
      "Economic, statistical and forecasting models",
      "Interactive dashboards",
      "Research and analytical reports",
      "Scenario and simulation tools",
      "Evidence-based recommendations",
    ],
    outcomes: [
      "Clear explanations of what drives your results",
      "Forecasts with honest ranges of uncertainty",
      "Evidence you can stand behind in a briefing or board meeting",
    ],
    ctaTitle: "Let’s talk about your question",
  },
  {
    slug: "economic-workflow-automation",
    name: "Automation",
    serviceType: "Analytical Workflow Automation",
    title: "Automation: Analytical Workflows & Reporting | Erun Consulting Group",
    description:
      "Data pipelines, automated reporting, indicator monitoring and data validation that streamline research and analytical workflows.",
    headline: "Less manual work. More time for analysis.",
    intro:
      "We simplify complex research and reporting workflows, so teams spend less time preparing data and more time understanding it.",
    capabilities: [
      {
        title: "Data pipelines",
        text: "Collect, clean and combine data from statistical agencies and internal sources.",
      },
      {
        title: "Automated reporting",
        text: "Recurring reports and briefings, produced consistently and ready for review.",
      },
      {
        title: "Indicator monitoring",
        text: "Track key indicators as new data is released, and flag meaningful changes.",
      },
      {
        title: "Data validation",
        text: "Checks that catch errors, gaps and revisions before they reach the analysis.",
      },
      {
        title: "Streamlined analytical workflows",
        text: "Estimation, testing and forecasting routines that run the same way every time.",
      },
      {
        title: "Research automation",
        text: "Less time gathering and formatting information, more time interpreting it.",
      },
    ],
    applications: [
      "Refreshing indicators when new data is published",
      "Producing monthly or quarterly reports automatically",
      "Updating forecasts and models on a regular schedule",
      "Validating survey, administrative and market data",
      "Monitoring prices, wages or market conditions",
    ],
    deliverables: [
      "Automated reporting systems",
      "Data pipelines and processing tools",
      "Automated statistical and forecasting workflows",
      "Indicator monitoring and alerts",
      "Documentation and handover for your team",
    ],
    outcomes: [
      "Reports that refresh when new data is released",
      "Results you can reproduce and audit",
      "Hours of manual work returned to your team",
    ],
    ctaTitle: "Let’s simplify your workflow",
  },
  {
    slug: "ai-adoption-in-economics",
    name: "AI Adoption",
    serviceType: "AI Adoption Consulting",
    title: "AI Adoption for Research & Analysis | Erun Consulting Group",
    description:
      "Practical AI integration into research, knowledge management, analytical workflows and decision-making, with an emphasis on responsible use.",
    headline: "Practical AI for research and decisions.",
    intro:
      "We help organizations integrate AI into research, analysis and decision-making, with attention to accuracy, transparency and responsible use.",
    capabilities: [
      {
        title: "Research assistants",
        text: "AI assistants that search, summarize and cite research, reports and data.",
      },
      {
        title: "Knowledge management",
        text: "Make reports, studies and institutional knowledge easy to find and use.",
      },
      {
        title: "AI in analytical workflows",
        text: "Add steps such as extraction or classification to existing analysis, with people reviewing the results.",
      },
      {
        title: "Decision support",
        text: "Bring relevant evidence, figures and context together when decisions are made.",
      },
      {
        title: "Information retrieval",
        text: "Find relevant statistics, policies and research quickly, with sources attached.",
      },
      {
        title: "Responsible AI",
        text: "Clear rules, testing and checks for accuracy, privacy and appropriate use.",
      },
    ],
    applications: [
      "Searching and summarizing research, reports and policy documents",
      "Answering staff questions from internal knowledge",
      "Extracting key figures from statistical releases and documents",
      "Drafting first versions of routine briefings",
      "Testing AI outputs for accuracy before wider use",
    ],
    deliverables: [
      "AI adoption roadmaps",
      "Research and knowledge assistants",
      "Proof-of-concept applications",
      "Knowledge management tools",
      "Responsible AI guidelines and evaluation",
    ],
    outcomes: [
      "Faster answers from your own documents, with sources",
      "Institutional knowledge that stays when people move on",
      "AI use you can explain and defend",
    ],
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
