# Erun Consulting Group

Website for Erun Consulting Group, an economic research and analytics consultancy in British Columbia — Economics in Motion: analytics, automation and AI adoption at the intersection of economics and technology.
_Economics in Motion._

## Development

Requires [Bun](https://bun.sh) (or Node.js 22+ with npm).

```sh
bun install
bun run dev      # local dev server on http://localhost:8080
bun run build    # production build
bun run test     # unit tests
```

## Deployment

The site deploys to [Vercel](https://vercel.com). Import the repository and keep the
default settings: Vercel detects the build and serves the output from `.vercel/output`.
Every push to `main` triggers a new production deployment.

Environment variables (set in Vercel, see `.env.example`):

- `RESEND_API_KEY`: contact form.
- `GEMINI_API_KEY` (optional): the Lab HR Assistant. Without it the assistant answers offline by quoting the closest handbook section. `GEMINI_MODEL` overrides the default `gemini-2.5-flash`.

## Erun Lab

The homepage has a Lab section (`/#lab`, after About) with three working prototypes, one per service, all on sample data for a fictional company (Northwind Coastal Supply). `/lab` redirects there. The prototypes:

- `/lab/performance-dashboard`: KPIs, a six-month forecast and revenue mix.
- `/lab/monthly-report`: a generated monthly report with written commentary (prints to PDF).
- `/lab/hr-assistant`: an AI assistant grounded in sample policy documents, with citations.

Code lives in `src/routes/lab.*.tsx`, `src/components/lab/` and `src/lib/lab/`. The assistant runs through the `askLabAssistant` server function (`src/lib/lab/assistant.functions.ts`).

## Built with

- TanStack Start
- React and TypeScript
- Tailwind CSS
