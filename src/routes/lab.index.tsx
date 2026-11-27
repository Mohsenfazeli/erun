import { createFileRoute, redirect } from "@tanstack/react-router";

// The Lab is a homepage section (/#lab). Keep /lab working for existing links.
export const Route = createFileRoute("/lab/")({
  beforeLoad: () => {
    throw redirect({ to: "/", hash: "lab", statusCode: 301 });
  },
});
