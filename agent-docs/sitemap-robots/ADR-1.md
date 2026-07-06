# ADR-1: sitemap.xml and robots.txt via Next.js metadata file conventions

## Status
Accepted

## Context
The portfolio is a single-page Next.js 16 (App Router) site. `app/layout.tsx`
already exposes rich metadata (title template, description, OpenGraph, Twitter
card, `metadataBase`) all driven by the single source of truth in
`lib/site.ts` (`site.url`, `site.name`, `site.description`).

Two SEO/crawlability primitives are missing:

- **`sitemap.xml`** — tells search engines which URLs exist and when they last
  changed.
- **`robots.txt`** — tells crawlers what they may fetch and where the sitemap
  lives.

Now that the site carries real content (experience history, projects), these are
a low-effort, high-value addition. Google Search Console and other crawlers
expect both at well-known paths (`/sitemap.xml`, `/robots.txt`).

Next.js provides **first-class file conventions** for exactly this: an
`app/sitemap.ts` default export returning `MetadataRoute.Sitemap` and an
`app/robots.ts` default export returning `MetadataRoute.Robots`. The framework
serves them at the canonical paths, sets the correct `Content-Type`, and
statically generates them at build time. No custom route handler, no XML string
building, no extra dependency.

> ⚠️ This repo pins **Next 16.2.6**, and `AGENTS.md` warns that APIs may differ
> from training data. The implementer MUST read
> `node_modules/next/dist/docs/` for the current `MetadataRoute` shape and the
> sitemap/robots file conventions before writing code.

## Decision
Add `app/sitemap.ts` and `app/robots.ts` using Next.js's built-in metadata file
conventions, both deriving their base URL from `site.url` in `lib/site.ts` so the
single source of truth is preserved.

## Rationale
- **Single source of truth**: importing `site.url` means a domain change (or the
  `NEXT_PUBLIC_SITE_URL` production override) propagates to metadata, sitemap, and
  robots from one place — no drift.
- **Framework-native**: file conventions are the idiomatic, lowest-surface-area
  approach. They are statically generated, cached, and served at the exact paths
  crawlers expect, with zero runtime cost and zero new dependencies (SOLID: each
  file has one reason to change; KISS).
- **Single-page reality**: the app renders one route (`/`) with in-page anchors
  (`#work`, `#philosophy`, `#contact`, `#assistant`). The sitemap therefore lists
  exactly one URL — the root. URL fragments are **not** independent sitemap
  entries (they resolve to the same document and crawlers ignore fragments), so
  adding anchor rows would be noise, not coverage.
- **API protection**: `app/api/` (the chatbot endpoint) has no SEO value and
  should not be crawled or indexed, so robots disallows `/api/`.

## Consequences
- **Positive**
  - `/sitemap.xml` and `/robots.txt` served automatically; submittable to Search
    Console.
  - Domain/env changes stay centralized in `lib/site.ts`.
  - No new dependency, no custom XML, negligible build cost.
- **Negative / Risks**
  - Until `NEXT_PUBLIC_SITE_URL` is set in the production environment, `site.url`
    falls back to `https://portfolio.local`, so the emitted sitemap/robots URLs
    are placeholders. *Mitigation*: this is the same env contract `metadataBase`
    already relies on; document that `NEXT_PUBLIC_SITE_URL` must be set at deploy.
  - Next 16's `MetadataRoute` type or field names may differ from older docs.
    *Mitigation*: read `node_modules/next/dist/docs/` first (AGENTS.md rule).

## Alternatives Considered
- **Custom `app/sitemap.xml/route.ts` handler building XML by hand**: discarded —
  more code, manual `Content-Type`, easy to get the schema wrong, no framework
  caching/typing. The file convention exists to avoid exactly this.
- **A `next-sitemap` (or similar) package**: discarded — adds a dependency and a
  post-build step for a two-file, single-route site. Over-engineering (KISS).
- **Listing in-page anchors as separate sitemap URLs**: discarded — fragments are
  not distinct crawlable documents; would add noise without SEO benefit.
- **Static files in `public/` (`public/robots.txt`, `public/sitemap.xml`)**:
  discarded — cannot read `site.url`, so the domain would be hardcoded and drift
  from the `NEXT_PUBLIC_SITE_URL` override; defeats the single-source-of-truth goal.

## Review
Suggested review date: 2027-01-06 (+6 months) — or sooner if the site gains
independently routed pages (e.g. `/blog/*`, per-project case-study routes), at
which point the sitemap should enumerate those routes dynamically.
