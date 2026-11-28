import { createFileRoute } from "@tanstack/react-router";

import { LabProductPage } from "@/components/lab/chrome";
import { HrAssistant } from "@/components/lab/assistant";
import { getLabProduct, labPath } from "@/lib/lab/products";
import { pageHead } from "@/lib/site";

const product = getLabProduct("hr-assistant");

export const Route = createFileRoute("/lab/hr-assistant")({
  head: () =>
    pageHead({
      title: `${product.name} Prototype | Erun Consulting Group`,
      description: product.description,
      path: labPath(product.slug),
    }),
  component: () => (
    <LabProductPage slug="hr-assistant">
      <HrAssistant />
    </LabProductPage>
  ),
});
