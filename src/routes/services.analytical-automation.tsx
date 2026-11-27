import { createFileRoute } from "@tanstack/react-router";

import { ServicePage } from "@/components/service-page";
import { getService, serviceHead } from "@/lib/services";

const service = getService("analytical-automation");

export const Route = createFileRoute("/services/analytical-automation")({
  head: () => serviceHead(service),
  component: () => <ServicePage service={service} />,
});
