import { createFileRoute } from "@tanstack/react-router";

import { LabProductPage } from "@/components/lab/chrome";
import { Dashboard } from "@/components/lab/dashboard";
import { getLabProduct, labPath } from "@/lib/lab/products";
import { pageHead } from "@/lib/site";

const product = getLabProduct("performance-dashboard");

export const Route = createFileRoute("/lab/performance-dashboard")({
  head: () =>
    pageHead({
      title: `${product.name} Prototype | Erun Lab`,
      description: product.description,
      path: labPath(product.slug),
    }),
  component: () => (
    <LabProductPage slug="performance-dashboard">
      <Dashboard />
    </LabProductPage>
  ),
});
