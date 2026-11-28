import { createServerFn } from "@tanstack/react-start";

import type { EnquiryResult } from "@/lib/contact.server";

export type { EnquiryResult };

/** JavaScript submit for the contact form. The no-JavaScript fallback is /api/contact. */
export const sendEnquiry = createServerFn({ method: "POST" })
  .validator((input: unknown) => input)
  .handler(async ({ data }): Promise<EnquiryResult> => {
    const { deliverEnquiry } = await import("@/lib/contact.server");
    return deliverEnquiry(data);
  });
