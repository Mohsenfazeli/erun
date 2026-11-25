import { createFileRoute } from "@tanstack/react-router";

import { ServicePage } from "@/components/service-page";
import { getService, serviceHead } from "@/lib/services";

const service = getService("ai-implementation");

export const Route = createFileRoute("/services/ai-implementation")({
  head: () => serviceHead(service),
  component: () => <ServicePage service={service} />,
});
