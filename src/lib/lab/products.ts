// The three Lab prototypes, one per service. Copy is general: sample data
// for a fictional company, no client names or verified results.

export type LabSlug = "performance-dashboard" | "monthly-report" | "hr-assistant";

export interface LabProduct {
  slug: LabSlug;
  pillar: "Analytics" | "Automation" | "AI Adoption";
  name: string;
  /** One line for the Lab tiles. */
  short: string;
  tagline: string;
  /** Meta description for the prototype page. */
  description: string;
  problem: string;
  solution: string;
  value: string;
  yourData: string;
  cta: string;
  stage: string;
}

export const LAB_PRODUCTS: LabProduct[] = [
  {
    slug: "performance-dashboard",
    pillar: "Analytics",
    name: "Performance Dashboard",
    short: "Live KPIs, a six-month forecast and a breakdown of where revenue comes from.",
    tagline:
      "See how the business is performing and where it is heading, in one view. Filter by region and time range, and read the forecast.",
    description:
      "Try a working performance dashboard prototype: KPIs, a six-month revenue forecast and revenue by channel and region, on sample data.",
    problem: "Sales data sits in spreadsheets, so trends and slowdowns are spotted weeks late.",
    solution:
      "One dashboard with KPIs, a six-month forecast with a confidence range, and revenue by channel and region.",
    value:
      "Earlier warning on slowdowns and faster, better-informed decisions for the leadership team.",
    yourData: "Connected to your sales, finance or operations systems and refreshed automatically.",
    cta: "Want a dashboard like this for your business",
    stage: "Try it: filter by region and time range",
  },
  {
    slug: "monthly-report",
    pillar: "Automation",
    name: "Automated Monthly Report",
    short: "A board-ready report, calculated and written in seconds.",
    tagline:
      "Pick a month and generate a complete performance report: the figures, the charts and the written commentary, ready to share.",
    description:
      "Try an automated reporting prototype: pick a month and generate a formatted performance report with written commentary, on sample data.",
    problem:
      "Analysts spend days each month copying figures into reports and writing the same commentary.",
    solution:
      "Reads the month's data, runs every comparison and writes plain-language commentary on each metric.",
    value:
      "Days of manual work become one click, with consistent numbers and no copy-paste errors.",
    yourData:
      "Scheduled to run each month on your data and delivered to your team's inbox as a PDF.",
    cta: "Let’s automate your reporting",
    stage: "Try it: pick a month and generate the report",
  },
  {
    slug: "hr-assistant",
    pillar: "AI Adoption",
    name: "HR Assistant",
    short: "An AI assistant that answers only from the company's own policies and cites them.",
    tagline:
      "Ask a question in plain language. The assistant answers only from the company's policy documents and shows exactly where each answer comes from.",
    description:
      "Try an AI HR assistant prototype that answers employee questions from a company handbook and cites the exact section, on sample policies.",
    problem:
      "Staff can't find answers in long handbooks, so HR answers the same questions all week.",
    solution:
      "An AI assistant grounded in your own documents, citing the exact section for every answer.",
    value: "Instant, consistent answers for staff and fewer routine requests for HR.",
    yourData:
      "Answers only from your own handbooks, policies or procedures, with guardrails set for your organization.",
    cta: "Let’s put AI to work on your documents",
    stage: "Try it: ask a question about company policy",
  },
];

export function getLabProduct(slug: LabSlug): LabProduct {
  const product = LAB_PRODUCTS.find((item) => item.slug === slug);
  if (!product) throw new Error(`Unknown Lab product: ${slug}`);
  return product;
}

export function labPath(slug: LabSlug) {
  return `/lab/${slug}` as const;
}
