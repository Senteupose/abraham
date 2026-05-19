# Abraham Pose Senteu — Campaign & Professional Platform

Production-ready **Next.js 15 (App Router)** + Tailwind + lucide-react platform
covering Abraham Pose Senteu's dual mandate:

1. **Professional positioning** — FinTech Engineer, AI Developer, Pwani University CS,
   5+ years at Equity Bank Kenya (Best Equitel Onboarding Officer, Coast Region).
2. **Magadi Ward MCA campaign** — Linda Mwananchi grassroots supporter database,
   IEBC voter portal hub, M-Pesa STK donation flow, blog & vlog engines.

## Stack

- Next.js 15 · React 19 · TypeScript (strict)
- Tailwind CSS 3 with custom brand palette (canvas `#0F172A` + brand `#F59E0B`)
- `lucide-react` icons (auto tree-shaken via `optimizePackageImports`)
- Edge-runtime API Route Handlers for `/api/supporters` and `/api/donate/mpesa-stk`
- Security headers (CSP-adjacent: X-Frame-Options DENY, X-Content-Type-Options
  nosniff, strict referrer policy, locked-down Permissions-Policy)

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:3000

## Production build

```bash
npm run build
npm run start
```

Latest production build: **118 kB First Load JS** for `/` — fast enough for rural
3G in Magadi Ward.

## Deploy to Vercel

Zero-config. Point Vercel at this repo and set the **Root Directory** to
`frontend/` (Project Settings → General → Root Directory). Framework preset is
auto-detected as Next.js. No `vercel.json` needed.

If your Vercel project is currently failing with
`FUNCTION_INVOCATION_FAILED` because Vercel tried to run the Flask `app.py` at
the repo root, the fix is to point Root Directory at `frontend/`. The legacy
Flask app should be deployed separately to a long-lived host (Render / Railway /
Fly.io) where SQLite has persistent storage.

## Sections

1. **Navbar + floating Social Matrix** — glassmorphism nav, vertical right-edge
   social strip (hidden on mobile).
2. **Hero** — split layout with typing subhead, pulsing primary CTA, outline secondary.
3. **Biography** — three chapters (Pwani / Equity / Magadi).
4. **Excellence Matrix** — tabbed Software & AI vs. Magadi Ward Blueprint.
5. **Supporter Registration** — animated counter, secure form, polling-centre dropdown.
6. **IEBC Voter Portal** — verification CTA → https://iebc.or.ke + Form C download.
7. **Darara FinTech Donation Portal** — preset amounts + M-Pesa STK push call.
8. **Blog** — JSON-backed grid, single-article view, cross-post share matrix.
9. **Vlog** — video thumbnail grid (YouTube / Reels / TikTok).
10. **Footer** — executive references + location + copyright.

## API endpoints

Both routes run on the **Edge runtime** (fast cold-start, low cost) and ship
input validation today. Persistence and Daraja v2 wiring are the next steps.

### `POST /api/supporters`

```json
{ "name": "Naserian Lemayian", "phone": "0712345678", "village": "Shompole" }
```

- Rejects payloads > 4 KB.
- Validates name regex, Kenyan phone (`07XX` / `01XX` / `+254`), and the polling
  centre against a fixed allow-list.
- Returns `{ ok: true, message, next }`. **Does not persist yet** — wire Vercel
  KV, Supabase, or Postgres before going live.

### `POST /api/donate/mpesa-stk`

```json
{ "phone": "0712345678", "amount": 500 }
```

- Rejects payloads > 1 KB.
- Validates phone + amount (KES 10 – 1,000,000).
- Normalises phone to MSISDN (`254XXXXXXXXX`) and returns a synthetic
  `checkoutRequestId` plus a masked MSISDN echo. **Does not call Daraja yet** —
  drop in `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, `MPESA_PASSKEY`,
  `MPESA_SHORTCODE`, and call the Safaricom Daraja v2 STK push endpoint from
  here.

## Required assets to drop in

- `public/hero-magadi.jpg` — authoritative photo with Ilmeguaraa age-set / village elders.
- `public/vlog/*.jpg` — 6 video thumbnails referenced in `VlogEngine.tsx`.
- `public/forms/IEBC-Form-C-Voter-Transfer.pdf` — official IEBC voter transfer form.

Missing images degrade gracefully (hero falls back to a styled placeholder; vlog
thumbs fall back to the gradient overlay).

## Editing the blog

Add entries to `src/data/blogPosts.ts`. The grid and individual article view pick
them up automatically. Categories are typed (`Tech`, `Campaign Update`, `Oversight`,
`Strategy`) and each gets a coloured pill.

## Branding tokens

| Token              | Hex      | Tailwind class       |
|--------------------|----------|----------------------|
| Canvas (bg)        | `#0F172A`| `bg-canvas`          |
| Panel              | `#111C32`| `bg-panel`           |
| Brand (primary)    | `#F59E0B`| `bg-brand / text-brand` |
| Brand soft         | `#FBBF24`| `text-brand-soft`    |
| Ink                | `#E2E8F0`| `text-ink`           |
| Ink dim            | `#94A3B8`| `text-ink-dim`       |

## Compliance

- Data Protection Act (Kenya, 2019) — Section 26 notice rendered with the supporter form.
- Election Offences Act (2016) — footer banner.
- All outbound social links use `rel="noopener noreferrer"`.
- Strict security headers via `next.config.mjs`.
