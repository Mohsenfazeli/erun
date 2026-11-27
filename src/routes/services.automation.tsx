import { createFileRoute, redirect } from "@tanstack/react-router";

// Earlier URL for this service; keep old links and search results working.
export const Route = createFileRoute("/services/automation")({
  beforeLoad: () => {
    throw redirect({ to: "/services/analytical-automation", statusCode: 301 });
  },
});
