import { createFileRoute } from "@tanstack/react-router";

import { LabProductPage } from "@/components/lab/chrome";
import { AutomatedReport } from "@/components/lab/report";
import { getLabProduct, labPath } from "@/lib/lab/products";
import { pageHead } from "@/lib/site";

const product = getLabProduct("monthly-report");

export const Route = createFileRoute("/lab/monthly-report")({
  head: () =>
    pageHead({
      title: `${product.name} Prototype | Erun Consulting Group`,
      description: product.description,
      path: labPath(product.slug),
    }),
  component: () => (
    <LabProductPage slug="monthly-report">
      <AutomatedReport />
    </LabProductPage>
  ),
});
