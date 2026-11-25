## Website architecture
- Keep this explicitly single-page website in the index route with section anchors, because the brief requires vertical section snapping.
- Load Three.js inside the visual component's browser effect and dispose all scene resources on unmount, keeping SSR browser-safe.
- Contact enquiries go through the `sendEnquiry` server function (Resend API, key in `RESEND_API_KEY`); never imply an unsent enquiry was delivered, and never commit secrets.
