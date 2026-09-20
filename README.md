# Admission Pitara (repo: School-Finder)

School discovery, verified fee breakdowns and admission information for Greater Noida,
Greater Noida West and Noida Extension. The product name is **Admission Pitara**; the
GitHub repository is named `School-Finder` and the root npm package is `school-website`.

## Stack

- Next.js (App Router) + React + Tailwind CSS
- MongoDB (optional in development, see `.env.example`)
- Package manager: **bun** (`bun.lock` is the only lockfile)

## Getting started

```bash
bun install
cp .env.example .env      # then fill in the values you need
bun run dev               # http://localhost:3000
```

## Scripts

| Script | What it does |
| --- | --- |
| `bun run dev` / `build` / `start` | Next.js dev server, production build, production server |
| `bun run lint` | Typecheck **and** the validation suite (what CI currently calls) |
| `bun run typecheck` | TypeScript check only (`tsc --noEmit`) |
| `bun run test` (alias `validate`) | Runs the full data/security validation suite (`scripts/run-validations.js`) |
| `bun run test:shapes`, `test:fees`, … | Run a single validator |

CI (`.github/workflows/`) runs typecheck, build and the validation
suite.

## Project layout

- `src/` – the Next.js app. **Production API routes live in `src/app/api/`.**
- `data/schools.json` – canonical school dataset (`data/schoolsData.ts` wraps it for the app).
- `scripts/` – data maintenance scripts and the `validate-*.js` validators. Only the
  validators listed in `scripts/run-validations.js` are part of the suite; the others
  (`validate-final.js`, `validate-phase8.js`, `validate-search-map.js`) are legacy.
- `public/` – static assets, including the original static HTML school pages, which are
  redirected to the new URLs via `data/legacyUrlMap.json`.
- `school-website-backend/` – **legacy Express prototype, not used in production** (see its
  README). It keeps mirrored copies of the school data; refresh them after editing
  `data/schools.json` with `node scripts/sync-backend-data.js` and by copying
  `data/schools.json` to `school-website-backend/data/schools.json`.

## Data conventions

- Unknown coordinates are stored as `{ "lat": null, "lng": null }` (never guessed); such schools
  are simply left off the map.
- Undisclosed text fields are empty strings or "Not publicly verified" and the UI shows a
  fallback message; fee ranges that can't be a single number go in `fees.estimatedFirstYearText`
  with `fees.estimatedFirstYear` set to `null`.
- `fees.verificationStatus` says where fee data came from (e.g. `verified_from_source`,
  `user_supplied`, `user_supplied_latest`, `not_publicly_verified`). Don't upgrade a status
  without a source.

## Environment

See `.env.example`. `NEXT_PUBLIC_SITE_URL` (falls back to `NEXT_PUBLIC_APP_URL`) sets the
public URL used for SEO; `MONGODB_URI` is accepted as an alias of `MONGO_URI` and
`ADMIN_PASSWORD` as an alias of `ADMIN_INITIAL_PASSWORD`.
