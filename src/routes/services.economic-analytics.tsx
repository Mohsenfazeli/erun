import { createFileRoute } from "@tanstack/react-router";

import { ServicePage } from "@/components/service-page";
import { getService, serviceHead } from "@/lib/services";

const service = getService("economic-analytics");

export const Route = createFileRoute("/services/economic-analytics")({
  head: () => serviceHead(service),
  component: () => <ServicePage service={service} />,
});
