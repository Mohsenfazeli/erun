import { createFileRoute, redirect } from "@tanstack/react-router";

// Earlier URL for this service; keep old links and search results working.
export const Route = createFileRoute("/services/data-analytics")({
  beforeLoad: () => {
    throw redirect({ to: "/services/economic-analytics", statusCode: 301 });
  },
});
