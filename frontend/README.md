# Abraham Pose Senteu — Campaign & Professional Platform

Production-ready React + Vite + Tailwind + Lucide front-end for Abraham Pose Senteu's
dual-purpose personal platform:

1. **Professional positioning** — FinTech Engineer, AI Developer, Pwani University CS,
   5+ years at Equity Bank Kenya (Best Equitel Onboarding Officer, Coast Region).
2. **Magadi Ward MCA campaign** — Linda Mwananchi grassroots supporter database,
   IEBC voter portal hub, M-Pesa STK donation flow, blog & vlog engines.

## Stack

- Vite 5 · React 18 · TypeScript (strict)
- Tailwind CSS 3 with custom brand palette (canvas `#0F172A` + brand `#F59E0B`)
- `lucide-react` icons (tree-shaken, vendor-chunked)
- Zero runtime libraries beyond React + icons — bundle stays ultra-light for rural 3G

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173

## Production build

```bash
npm run build
npm run preview
```

The build emits to `frontend/dist/`. Vendor chunks (`react`, `lucide`) are split for
long-term browser caching.

## Sections

1. **Navbar + floating Social Matrix** — glassmorphism nav, vertical right-edge
   social strip (hidden on mobile).
2. **Hero** — split layout with typing subhead, pulsing primary CTA, outline secondary.
3. **Biography** — three chapters (Pwani / Equity / Magadi).
4. **Excellence Matrix** — tabbed Software & AI vs. Magadi Ward Blueprint.
5. **Supporter Registration** — animated counter, secure form, polling-centre dropdown.
6. **IEBC Voter Portal** — verification CTA → https://iebc.or.ke + Form C download.
7. **Darara FinTech Donation Portal** — preset amounts + M-Pesa STK push stub.
8. **Blog** — JSON-backed grid, single-article view, cross-post share matrix.
9. **Vlog** — video thumbnail grid (YouTube / Reels / TikTok).
10. **Footer** — executive references + location + copyright.

## API endpoints (stubbed)

The frontend POSTs to the following paths. Wire them up to your Flask/Node backend
when ready — the UI degrades gracefully if the endpoint returns 404:

- `POST /api/supporters` — `{ name, phone, village }`
- `POST /api/donate/mpesa-stk` — `{ phone, amount }`

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

## Deployment

Static SPA — deploy `dist/` to Cloudflare Pages, Vercel, Netlify, or behind nginx.
For the existing Flask backend in this repo, you can point Flask to serve `dist/`
as the static root and expose `/api/*` routes for supporter capture and M-Pesa STK.
