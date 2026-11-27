import { createFileRoute, redirect } from "@tanstack/react-router";

// Earlier URL for this service; keep old links and search results working.
export const Route = createFileRoute("/services/ai-implementation")({
  beforeLoad: () => {
    throw redirect({ to: "/services/ai-adoption", statusCode: 301 });
  },
});
