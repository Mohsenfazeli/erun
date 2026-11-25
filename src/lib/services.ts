import { areaServed, organizationId, pageHead, SITE_NAME, SITE_URL } from "@/lib/site";

// Content for the three service pages. Keep claims general and factual: no client
// names, statistics or results that have not been verified.

export type ServiceSlug = "data-analytics" | "automation" | "ai-implementation";

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
  /** Tools typically used for this service: plain text, no logos or implied partnerships. */
  technologies: string[];
};

export const services: Service[] = [
  {
    slug: "data-analytics",
    name: "Data Analytics",
    serviceType: "Data Analytics Consulting",
    title: "Data Analytics Consulting in Vancouver & BC | Erun Consulting Group",
    description:
      "Data analytics consulting for organizations in British Columbia and across Canada: reporting, dashboards, analysis and forecasting that support clear decisions.",
    headline: "Clearer data. Better decisions.",
    intro:
      "Most organizations already hold the data they need. It sits in different systems, takes too long to pull together, and rarely answers the question at hand. We bring it together, analyse it carefully, and present it in a way people can act on.",
    capabilities: [
      {
        title: "Data integration and preparation",
        text: "Combine spreadsheets, databases and business systems into one reliable, documented source.",
      },
      {
        title: "Reporting and dashboards",
        text: "Clear reports and dashboards, built around the decisions they need to support.",
      },
      {
        title: "Analysis and forecasting",
        text: "Statistical analysis, trends and forecasts that explain what is happening and what is likely next.",
      },
      {
        title: "Measurement frameworks",
        text: "Define the indicators that matter, how they are calculated, and who is responsible for them.",
      },
    ],
    applications: [
      "Tracking operational performance across teams or locations",
      "Understanding costs, revenue drivers and pricing",
      "Forecasting demand, workload or budgets",
      "Evaluating whether a program or initiative is working",
      "Replacing manual monthly reporting with a maintained dashboard",
    ],
    deliverables: [
      "A clean, documented dataset or data model",
      "Dashboards and reports your team can maintain",
      "Analysis with a plain-language summary of findings",
      "Recommendations tied to the evidence",
    ],
    outcomes: [
      "Less time spent assembling numbers",
      "One consistent version of key figures",
      "Decisions grounded in evidence rather than assumption",
    ],
    ctaTitle: "Let’s talk about your data",
    technologies: ["Python", "SQL", "R", "Microsoft Power BI", "Microsoft Fabric"],
  },
  {
    slug: "automation",
    name: "Automation",
    serviceType: "Business Process Automation",
    title: "Business Process Automation in Vancouver & BC | Erun Consulting Group",
    description:
      "Business automation for organizations in British Columbia and across Canada: we map how work flows and automate the repetitive steps that cost time and cause errors.",
    headline: "Less manual work. Smoother operations.",
    intro:
      "Copying data between systems, assembling reports and chasing approvals take time away from the work that matters, and they introduce errors. We look at how work actually flows, then automate the steps where it makes a real difference.",
    capabilities: [
      {
        title: "Process review and mapping",
        text: "Map how work moves today, where time is lost, and which steps are worth automating.",
      },
      {
        title: "Workflow automation",
        text: "Automate routine steps such as data entry, approvals, notifications and file handling.",
      },
      {
        title: "System integration",
        text: "Connect the tools you already use so information moves between them without re-keying.",
      },
      {
        title: "Automated reporting",
        text: "Scheduled data refreshes and reports that arrive without manual effort.",
      },
    ],
    applications: [
      "Moving data between forms, spreadsheets and business systems",
      "Routing requests and approvals",
      "Producing recurring reports automatically",
      "Document intake, naming and filing",
      "Data validation and quality checks",
    ],
    deliverables: [
      "A map of the current process and the improved one",
      "Working, tested automations",
      "Documentation and handover so your team can run them",
      "A short list of further opportunities, ranked by value",
    ],
    outcomes: [
      "Fewer hours spent on repetitive tasks",
      "Fewer errors from manual handling",
      "Processes that are consistent and easier to scale",
    ],
    ctaTitle: "Let’s find the work worth automating",
    technologies: ["Python", "SQL", "Microsoft Fabric", "Microsoft Power BI", "Cloud platforms"],
  },
  {
    slug: "ai-implementation",
    name: "AI Implementation",
    serviceType: "AI Implementation Consulting",
    title: "AI Implementation Consulting in Vancouver & BC | Erun Consulting Group",
    description:
      "AI implementation for organizations in British Columbia and across Canada: identify sound use cases, build and test them on your own data, and adopt them responsibly.",
    headline: "Practical AI, applied where it helps.",
    intro:
      "AI can save real time, but only when it is applied to the right problem and fits how your organization works. We help you choose sensible use cases, build and test them carefully, and put them into everyday use with appropriate oversight.",
    capabilities: [
      {
        title: "Use-case assessment",
        text: "Identify where AI adds value, and where it should not be used, based on your processes and data.",
      },
      {
        title: "Document and knowledge tools",
        text: "Tools that search, summarize and draft from your own documents and knowledge base.",
      },
      {
        title: "AI-assisted workflows",
        text: "Add AI steps such as classification, extraction or drafting to existing processes, with people reviewing the results.",
      },
      {
        title: "Responsible adoption",
        text: "Guidance on privacy, accuracy checks and clear rules for how staff use AI tools.",
      },
    ],
    applications: [
      "Answering staff questions from internal policies and documents",
      "Summarizing reports, submissions or correspondence",
      "Extracting key information from forms and documents",
      "Drafting first versions of routine documents",
      "Classifying and routing incoming requests",
    ],
    deliverables: [
      "A prioritized list of AI use cases",
      "A working pilot, tested on your own data",
      "Guidelines for safe and effective use",
      "A plan for rollout and ongoing improvement",
    ],
    outcomes: [
      "Time saved on reading, searching and drafting",
      "Faster access to organizational knowledge",
      "AI adoption that is measured, controlled and useful",
    ],
    ctaTitle: "Let’s explore where AI can help",
    technologies: ["OpenAI", "Python", "SQL", "Cloud platforms"],
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

/** Every technology the site mentions, for the homepage line. */
export const technologies = [
  "Python",
  "SQL",
  "R",
  "Microsoft Power BI",
  "Microsoft Fabric",
  "OpenAI",
  "Cloud platforms",
];
