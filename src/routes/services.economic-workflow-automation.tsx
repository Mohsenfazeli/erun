import { createFileRoute } from "@tanstack/react-router";

import { ServicePage } from "@/components/service-page";
import { getService, serviceHead } from "@/lib/services";

const service = getService("economic-workflow-automation");

export const Route = createFileRoute("/services/economic-workflow-automation")({
  head: () => serviceHead(service),
  component: () => <ServicePage service={service} />,
});
