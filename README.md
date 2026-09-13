# CodiceSconto Admin Frontend

This application provides the administrative CMS dashboard for CodiceSconto. It connects to the unified backend service (`codice-sconto-backend`) via Next.js proxy rewrites and SSR fetch calls.

## Configuration

The admin frontend requires only one environment variable:
- `BACKEND_URL`: URL of the unified backend service (default: `http://localhost:4000`).

> [!IMPORTANT]
> `BACKEND_URL` is resolved at build time when `next.config.mjs` is evaluated. Any change to `BACKEND_URL` requires a rebuild (`npm run build`), not just a restart. Missing `BACKEND_URL` in production is a hard error at build time to prevent silent proxy failures.

## Development & Production

```bash
# Development
npm run dev

# Production Build
npm run build
npm run start
```
# coupons-site-admin
