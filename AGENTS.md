## Website architecture
- Keep this explicitly single-page website in the index route with section anchors, because the brief requires vertical section snapping.
- Load Three.js inside the visual component's browser effect and dispose all scene resources on unmount, keeping SSR browser-safe.
- Keep contact enquiries client-side until real delivery details are supplied; never imply an unsent enquiry was delivered.
