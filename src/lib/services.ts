import { areaServed, organizationId, pageHead, SITE_NAME, SITE_URL } from "@/lib/site";

// Content for the three areas of expertise (service pages). URLs keep their earlier slugs so
// existing links and indexed pages still work. Keep claims general and factual: no client
// names, statistics or results that have not been verified.

// Earlier slugs (data-analytics, automation, ai-implementation, analytical-automation,
// ai-adoption) redirect to these.
export type ServiceSlug =
  "economic-analytics" | "economic-workflow-automation" | "ai-adoption-in-economics";

export type Service = {
  slug: ServiceSlug;
  /** Short name, as on the homepage cards and in the footer. */
  name: string;
  /** Name used for the page title and structured data. */
  serviceType: string;
  title: string;
  description: string;
  headline: string;
  intro: string;
  capabilities: { title: string; text: string }[];
  /** One sentence above the applications list. */
  applicationsIntro: string;
  applications: string[];
  deliverables: string[];
  /** Closing call to action; the title gets a blue full stop. */
  ctaTitle: string;
  ctaText: string;
};

export const services: Service[] = [
  {
    slug: "economic-analytics",
    name: "Economic Research",
    serviceType: "Economic Research Consulting",
    title: "Economic Research & Consulting | Erun",
    description:
      "Economic research that helps organizations understand markets, evaluate policies and examine what drives economic and business outcomes.",
    headline: "Understanding the Forces That Shape Economies.",
    intro:
      "We conduct economic research to understand markets, evaluate policies and examine the factors driving economic and business outcomes.",
    capabilities: [
      {
        title: "Economic Research",
        text: "Evidence-based research into economic conditions, trends and emerging challenges.",
      },
      {
        title: "Market Analysis",
        text: "Examination of market structures, supply, demand, competition and pricing.",
      },
      {
        title: "Policy Evaluation",
        text: "Assessment of the economic implications and effectiveness of policies and regulations.",
      },
      {
        title: "Economic Impact Assessment",
        text: "Evaluation of the potential impacts of projects, programs and economic changes.",
      },
      {
        title: "Industry Research",
        text: "Analysis of industry performance, market developments and structural changes.",
      },
      {
        title: "Regional Economics",
        text: "Examination of regional growth, demographic trends and spatial economic patterns.",
      },
    ],
    applicationsIntro:
      "Our research supports organizations in understanding changing markets, evaluating economic opportunities and making evidence-informed decisions.",
    applications: [
      "Market and industry assessments",
      "Economic impact studies",
      "Regulatory and policy analysis",
      "Labour market research",
      "Cost-benefit analysis",
      "Regional economic assessments",
    ],
    deliverables: [
      "Economic research reports",
      "Market and industry studies",
      "Policy assessments",
      "Economic models",
      "Evidence-based recommendations",
    ],
    ctaTitle: "Better Understanding Begins with Better Research",
    ctaText: "Let’s discuss the economic questions that matter to your organization.",
  },
  {
    slug: "economic-workflow-automation",
    name: "Advanced Analytics",
    serviceType: "Economic Modelling and Advanced Analytics",
    title: "Economic Modelling, Forecasting & Data Analytics | Erun",
    description:
      "Econometric modelling, forecasting, scenario analysis, data visualization and spatial analytics that uncover patterns, explain relationships and anticipate change.",
    headline: "Beyond the Numbers.",
    intro:
      "We combine economic reasoning, statistical methods and advanced technology to uncover patterns, understand relationships and anticipate change.",
    capabilities: [
      {
        title: "Econometric Modelling",
        text: "Quantitative models that explain relationships and identify the drivers of economic outcomes.",
      },
      {
        title: "Forecasting",
        text: "Predictive analysis of economic indicators, demand, market trends and future conditions.",
      },
      {
        title: "Scenario Analysis",
        text: "Exploration of alternative outcomes under changing assumptions and conditions.",
      },
      {
        title: "Data Visualization",
        text: "Interactive visualizations that make complex information accessible and meaningful.",
      },
      {
        title: "Performance Measurement",
        text: "Development of indicators and analytical frameworks to evaluate performance over time.",
      },
      {
        title: "Spatial Analytics",
        text: "Geographic analysis of economic activity, regional patterns and market dynamics.",
      },
    ],
    applicationsIntro:
      "We develop analytical solutions that move beyond descriptive statistics to explain what is happening, why it matters and what may happen next.",
    applications: [
      "Economic and demand forecasting",
      "Pricing and revenue modelling",
      "Interactive analytical dashboards",
      "Statistical and predictive modelling",
      "Scenario simulation",
      "Geographic and regional analysis",
    ],
    deliverables: [
      "Statistical and economic models",
      "Interactive dashboards",
      "Forecasting systems",
      "Simulation tools",
      "Analytical frameworks",
    ],
    ctaTitle: "See More in Your Data",
    ctaText:
      "Explore how advanced analytics can bring clarity to your organization’s complex questions.",
  },
  {
    slug: "ai-adoption-in-economics",
    name: "Intelligent Reporting",
    serviceType: "Automated Economic Reporting",
    title: "Automated Economic Reporting & AI | Erun",
    description:
      "Automated reporting, economic monitoring, data integration and AI-assisted research that deliver timely, consistent and reproducible economic insights.",
    headline: "Beyond the Static Report.",
    intro:
      "We integrate automation, advanced analytics and artificial intelligence into research and reporting workflows to deliver timely, consistent and reproducible economic insights.",
    capabilities: [
      {
        title: "Automated Reporting",
        text: "Generation of recurring analytical and economic reports through reproducible workflows.",
      },
      {
        title: "Economic Monitoring",
        text: "Continuous tracking of economic indicators, market developments and emerging trends.",
      },
      {
        title: "Data Integration",
        text: "Streamlined collection, validation and transformation of data from multiple sources.",
      },
      {
        title: "AI-Assisted Research",
        text: "Intelligent tools that support information retrieval, research synthesis and analysis.",
      },
      {
        title: "Dynamic Reporting",
        text: "Interactive reports that adapt to selected parameters, updated data and changing analytical needs.",
      },
      {
        title: "Analytical Automation",
        text: "Automated modelling, forecasting and data processing workflows.",
      },
    ],
    applicationsIntro:
      "We develop intelligent analytical systems that reduce repetitive work and enable organizations to focus on understanding results.",
    applications: [
      "Automated economic reports",
      "Economic indicator monitoring systems",
      "AI-assisted research tools",
      "On-demand analytical assessments",
      "Automated data processing and validation",
      "Dynamic forecasting and reporting systems",
    ],
    deliverables: [
      "Automated reporting systems",
      "Economic monitoring platforms",
      "AI-assisted research applications",
      "Reproducible analytical workflows",
      "Dynamic research reports",
    ],
    ctaTitle: "Less Routine. More Insight",
    ctaText:
      "Discover how intelligent reporting can advance the way your organization conducts research and analysis.",
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
