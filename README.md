# Oscar Menéndez García — Portfolio

Minimalist personal portfolio built with **Next.js 16 App Router**, **TypeScript**, and **Tailwind CSS v4**. Single-page layout with smooth scroll navigation.

## Stack

- **Framework:** Next.js 16 (App Router, Server Components)
- **Language:** TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS v4 (CSS-first `@theme` tokens in `globals.css`)
- **Fonts:** Inter (sans) + JetBrains Mono — self-hosted via `next/font/google`
- **Deploy:** Vercel (zero-config)

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Copy env vars and fill in your values
cp .env.example .env.local

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — edits to `app/` and `components/` hot-reload automatically.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | No | Canonical URL (e.g. `https://oscar.dev`). Defaults to `https://portfolio.local`. |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Future | Google Gemini API key for the AI chatbot feature (not yet implemented). |

Copy `.env.example` to `.env.local` and set the values. **Never commit `.env.local`.**

## Production Build

```bash
npm run build   # exits 0 on success; prints route sizes
npm run start   # serves the production build locally
```

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/oscarmenendezgarcia/portfolio)

1. Connect the repository in the [Vercel dashboard](https://vercel.com/new).
2. Add `NEXT_PUBLIC_SITE_URL` as an environment variable (Production + Preview).
3. Push to `main` — Vercel builds and deploys automatically.

## Project Structure

```
portfolio/
├── app/
│   ├── layout.tsx          # Root layout: fonts, metadata, header, main
│   ├── page.tsx            # Single page: Hero → Work → Writing → Philosophy → Contact
│   ├── globals.css         # Tailwind v4 @theme tokens + base resets + scroll-behavior
│   └── icon.svg            # Favicon source (monogram)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx      # Fixed top navigation
│   │   └── Footer.tsx      # Copyright footer
│   └── sections/
│       ├── Hero.tsx        # Name, tagline, CV download
│       ├── Work.tsx        # Project cards grid
│       ├── Writing.tsx     # Article list
│       ├── Philosophy.tsx  # Principles
│       └── Contact.tsx     # Social links
├── lib/
│   └── site.ts             # Single source of truth: name, nav, socials, metadata
└── public/
    ├── cv.pdf              # CV download (replace with real file)
    └── og.png              # Open Graph image 1200×630 (replace with branded image)
```

## Design System

All tokens are in `app/globals.css` under `@theme`:

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#0a0a0a` | Page background |
| `--color-surface` | `#1a1a1a` | Cards, elevated areas |
| `--color-text-primary` | `#f5f5f5` | Body text |
| `--color-text-secondary` | `#999999` | Meta, secondary text |
| `--color-accent` | `#d4af37` | Links, CTAs |
| `--color-border` | `#333333` | Dividers, card borders |
