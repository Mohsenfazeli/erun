import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { CONTACT_EMAIL } from "@/lib/site";

// Built inside the handler so the schema stays server-side.
function enquirySchema() {
  return z.object({
    name: z.string().trim().min(1).max(200),
    email: z.string().trim().email().max(320),
    message: z.string().trim().min(1).max(5000),
    // Honeypot: hidden from people, often filled by bots.
    website: z.string().max(500).optional(),
  });
}

export type EnquiryResult = { ok: true } | { ok: false; error: "invalid" | "unavailable" };

// Sends website enquiries through Resend's HTTP API. Needs RESEND_API_KEY in the
// hosting environment; CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL are optional overrides.
export const sendEnquiry = createServerFn({ method: "POST" })
  .validator((input: unknown) => input)
  .handler(async ({ data }): Promise<EnquiryResult> => {
    const parsed = enquirySchema().safeParse(data);
    if (!parsed.success) return { ok: false, error: "invalid" };
    const { name, email, message, website } = parsed.data;

    // Pretend success so bots get no signal, but send nothing.
    if (website) return { ok: true };

    const apiKey = process.env["RESEND_API_KEY"];
    if (!apiKey) {
      console.error("Contact form: RESEND_API_KEY is not set");
      return { ok: false, error: "unavailable" };
    }

    const to = process.env["CONTACT_TO_EMAIL"] || CONTACT_EMAIL;
    const from = process.env["CONTACT_FROM_EMAIL"] || "Erun Website <website@erungroup.ca>";
    const safeName = name.replace(/[\r\n]+/g, " ");

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: email,
          subject: `Website enquiry from ${safeName}`,
          text: `Name: ${safeName}\nEmail: ${email}\n\n${message}\n`,
        }),
      });
      if (!response.ok) {
        console.error("Contact form: Resend returned", response.status, await response.text());
        return { ok: false, error: "unavailable" };
      }
      return { ok: true };
    } catch (error) {
      console.error("Contact form: request to Resend failed", error);
      return { ok: false, error: "unavailable" };
    }
  });
