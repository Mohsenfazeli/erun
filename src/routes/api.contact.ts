import { createFileRoute } from "@tanstack/react-router";

import { deliverEnquiry } from "@/lib/contact.server";

// Pages a plain form post may return to; anything else goes to the homepage.
const RETURN_PATHS = new Set(["/", "/book"]);

// Fallback for the contact form when JavaScript is unavailable: the browser posts the form
// here (so nothing ends up in the URL), and we redirect back with the outcome.
export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let fields: Record<string, string> = {};
        try {
          const form = await request.formData();
          fields = Object.fromEntries(
            [...form.entries()].map(([key, value]) => [
              key,
              typeof value === "string" ? value : "",
            ]),
          );
        } catch {
          // Not a form post: treated as invalid below.
        }
        const result = await deliverEnquiry(fields);
        const back = RETURN_PATHS.has(fields["return"] ?? "") ? fields["return"]! : "/";
        const outcome = result.ok ? "sent" : "failed";
        return new Response(null, {
          status: 303,
          headers: { Location: `${back}?message=${outcome}#contact` },
        });
      },
    },
  },
});
