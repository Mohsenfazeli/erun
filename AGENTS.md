## Website architecture
- The homepage stays a single snap-scrolling page in the index route with section anchors (home, expertise, approach, about, contact).
- Inner pages are their own routes wrapped in `PageShell` (`src/components/site-chrome.tsx`), which reuses the homepage header and footer and ends with the consultation call to action. Their navigation links back to homepage sections with `/#id`.
- Service pages live at `/services/<slug>`; their copy is in `src/lib/services.ts` and they share `ServicePage`. Keep claims general: no client names, statistics or results that are not verified.
- "Book a consultation" always leads to the homepage contact form (`/#contact`); there is no calendar booking.
- Load Three.js inside the visual component's browser effect and dispose all scene resources on unmount, keeping SSR browser-safe.
- Contact enquiries go through the `sendEnquiry` server function (Resend API, key in `RESEND_API_KEY`); never imply an unsent enquiry was delivered, and never commit secrets.
- The Lab lives at `/lab` (one screen, no scroll) with prototypes at `/lab/<slug>`; copy and slugs are in `src/lib/lab/products.ts`, and prototype pages share `LabProductPage`. All Lab data is sample data for a fictional company: label it as such and never present it as real figures.
- The Lab HR Assistant goes through the `askLabAssistant` server function; Gemini is called from `src/lib/lab/assistant.server.ts` with `GEMINI_API_KEY`, and it must keep working offline (handbook quotes) when the key is missing or the call fails.
