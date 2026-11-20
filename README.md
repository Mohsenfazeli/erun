# Erun Consulting Group

Website for Erun Consulting Group — data analytics, automation and AI implementation.
_Turning complexity into clarity._

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

## Built with

- TanStack Start
- React and TypeScript
- Tailwind CSS
- Three.js
