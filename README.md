# Anchor Risk Transfer — Website

Production website for **Anchor Risk Transfer Private Limited** — a licensed Underwriting Management Agency in Cybercity, Mauritius, serving the African and Indian Ocean reinsurance markets.

Built from the Claude Design high-fidelity prototype. Recreates every page in idiomatic Next.js with maintainable, typed React components.

## Stack

- **Next.js 15** (App Router) + **TypeScript** + **Tailwind CSS**
- **React 19** (server components for everything except the nav, contact form, and interactive cards)
- **MDX** for the Insights & News blog (`content/insights/*.mdx`)
- **Resend** for contact form delivery
- **Cloudflare Pages** for hosting (edge runtime via `@cloudflare/next-on-pages`)

---

## Part 1 — Running locally

### Prerequisites

- **Node.js 20 or 22 LTS** (this project was built on Node 24.16; anything ≥ 20 will work). Check with `node --version`.
- **npm** (ships with Node).
- No database — content is files on disk; submissions go straight to email.

### One-time setup

```bash
# 1. Install dependencies (~60 s on a cold cache)
npm install

# 2. Create your local env file from the template
cp .env.example .env.local

# 3. Fill in .env.local — see "Environment variables" below.
#    For first-run with no Resend account yet, you can leave RESEND_API_KEY blank;
#    every other route still works, only the contact form will return a 500.
```

### Run the dev server

```bash
npm run dev
# → http://localhost:3000
```

Routes you should hit and what to verify:

| URL | What to check |
| --- | --- |
| `/` | Hero, trust band, about, services (hover cards lift), classes grid (hover scales image), capacity, claims timeline, values, team, insights teaser (reads MDX), contact form section |
| `/about` | Page hero with breadcrumb + About + Values + Team |
| `/services` | Services + Claims + Capacity sections |
| `/classes` | Eight class cards |
| `/capacity` | Trust band + Capacity feature |
| `/team` | Team + Values |
| `/insights` | Featured card (newest MDX post) + recent list + archive grid (if > 5 posts) |
| `/insights/<slug>` | One per MDX file in `content/insights/`. Article body + related posts + CTA strip |
| `/contact` | Live form. Submit a test entry; if `RESEND_API_KEY` is set, an email lands in your `CONTACT_TO_EMAIL` inbox |
| `/some-nonsense` | Branded 404 page |

### Other npm scripts

```bash
npm run dev          # Next dev server with hot reload
npm run build        # Production Next.js build (Node runtime — useful for sanity-checking)
npm run start        # Run the production build (after `npm run build`)
npm run lint         # Next/ESLint
npm run pages:build  # Build for Cloudflare Pages (edge output in .vercel/output/static)
npm run preview      # Run the Cloudflare edge build locally via wrangler
npm run deploy       # Build + publish to Cloudflare Pages (requires `wrangler login`)
```

### Type-check

```bash
npx tsc --noEmit
```

Should output nothing. If it does, the offending file and line will be listed.

### Quick smoke test (with the dev server running)

```bash
# Every route should return 200
for path in / /about /services /classes /capacity /team /insights /contact; do
  curl -s -o /dev/null -w "%{http_code} $path\n" "http://localhost:3000$path"
done

# Contact API — validation works without a Resend key
curl -s -X POST -H "content-type: application/json" \
  -d '{}' http://localhost:3000/api/contact
# → {"error":"Required"}
```

### Environment variables

Defined in `.env.local` for development, in Cloudflare Pages settings for production:

| Variable | Required? | What it does | Example |
| --- | --- | --- | --- |
| `RESEND_API_KEY` | **Yes** (for the contact form) | Authenticates calls to Resend's API | `re_AbCd1234...` |
| `CONTACT_TO_EMAIL` | Optional | Inbox that receives contact submissions | `underwriting@anchorrisktransfer.com` (default if unset) |
| `CONTACT_FROM_EMAIL` | Optional | Sender address — must be on a domain you have **verified in Resend** | `site@anchorrisktransfer.com` (default if unset) |

A `.env.local` file is git-ignored. Never commit secrets.

### Resend setup (one time)

1. Sign up at <https://resend.com>.
2. Add and verify the `anchorrisktransfer.com` domain (or whichever domain `CONTACT_FROM_EMAIL` will use). Resend will ask you to add DNS records (SPF, DKIM, return-path) at your registrar — those typically propagate in minutes.
3. Create an API key under **API Keys** → "Sending access". Copy it into `.env.local` as `RESEND_API_KEY`.
4. While you wait for domain verification, you can test using Resend's sandbox sender `onboarding@resend.dev`. Set `CONTACT_FROM_EMAIL=onboarding@resend.dev` and `CONTACT_TO_EMAIL=<your own address>` — Resend will only deliver to addresses you own from the sandbox, which is fine for local development.

### Authoring a blog post (Insights & News)

The blog reads MDX files at build/render time from `content/insights/`. Filename → URL slug.

Create `content/insights/2027-01-my-new-brief.mdx`:

```mdx
---
title: Your headline here
date: 2027-01-15            # YYYY-MM-DD — controls sort order (newest first)
tag: Property               # Category chip — Property, Regulation, PV&T, Energy, etc.
excerpt: One-line summary shown on cards.
hero: cityNight             # Image key from lib/images.ts
author: Anchor Underwriting Desk
---

# Optional heading (auto-slugged for anchor links)

Markdown / MDX body. Standard markdown works:

- bullet
- bullet

> Block quotes render as serif pull-quotes in brand styling.

[Links use brand styling automatically.](mailto:underwriting@anchorrisktransfer.com)
```

Frontmatter fields:

| Field | Required | Notes |
| --- | --- | --- |
| `title` | Yes | Used as `<h1>` and `<title>` |
| `date` | Yes | ISO date — drives sort order |
| `tag` | Yes | Short category label |
| `excerpt` | Yes | 1–2 sentence summary, shows on cards and as sub-headline |
| `hero` | Yes | One of the keys in `lib/images.ts` (Unsplash photo) |
| `author` | No | Optional byline |

Reading time is computed automatically from the body.

The newest post becomes the **featured card** on `/insights` and the home page teaser. No commands to run — save the file, refresh.

---

## Part 2 — Production deployment to Cloudflare Pages

Cloudflare Pages serves the site from their global edge network. The contact API runs on Cloudflare Workers (edge runtime). MDX content is rendered on the edge as well — there is no Node server, no database, no separate API host.

### One-time setup

#### Step 1 — Create the Cloudflare Pages project

You can either connect a GitHub repo (recommended — gets you preview deploys per branch and atomic rollbacks) or upload directly via wrangler.

**Option A — GitHub-connected (recommended).**

1. Push this repo to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit — Anchor website"
   git branch -M main
   git remote add origin git@github.com:<your-org>/<repo>.git
   git push -u origin main
   ```
2. Sign in to <https://dash.cloudflare.com/> → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Pick the repo. Cloudflare auto-detects Next.js but **override the build command** to use the `next-on-pages` adapter:
   - **Framework preset:** `Next.js`
   - **Build command:** `npm run pages:build`
   - **Build output directory:** `.vercel/output/static`
   - **Node version:** `20` (set under **Settings → Environment variables**: `NODE_VERSION=20`)
4. Click **Save and Deploy**. First build takes ~3–5 minutes.

**Option B — Direct upload via wrangler (no GitHub).**

```bash
# Authenticate the CLI (opens browser to Cloudflare)
npx wrangler login

# Create the project on first push
npx wrangler pages project create anchor-website --production-branch main

# Build and deploy
npm run deploy
```

#### Step 2 — Set production environment variables

In the Cloudflare dashboard → your Pages project → **Settings → Environment variables → Production**:

| Name | Value | Encrypt? |
| --- | --- | --- |
| `RESEND_API_KEY` | Your Resend production key | **Yes** (encrypted) |
| `CONTACT_TO_EMAIL` | `underwriting@anchorrisktransfer.com` | No |
| `CONTACT_FROM_EMAIL` | `site@anchorrisktransfer.com` (verified domain sender) | No |
| `NODE_VERSION` | `20` | No |

Save and trigger a redeploy ("Deployments → ... → Retry deployment") so the env vars are picked up.

Also set the **Preview** environment vars (often pointing at a separate Resend test key + a personal `CONTACT_TO_EMAIL`) so preview branches don't fire emails to the live underwriting inbox.

#### Step 3 — Attach the custom domain

In the Pages project → **Custom domains** → **Set up a custom domain** → enter `anchorrisktransfer.com` (and `www.anchorrisktransfer.com`).

- If the domain is already on Cloudflare DNS, Cloudflare wires up the CNAME automatically.
- If the domain is elsewhere, follow the prompt to add a CNAME pointing at `<project>.pages.dev`.
- HTTPS is provisioned automatically (Let's Encrypt via Cloudflare).

### Day-to-day deployment

With GitHub-connected:

```bash
# Make changes locally, test with npm run dev
git checkout -b feature/<thing>
git add .
git commit -m "Add: ..."
git push -u origin feature/<thing>
# → Cloudflare auto-builds a preview deploy at https://<branch>.anchor-website.pages.dev

# When the preview looks good:
gh pr create   # or open a PR in the GitHub UI
# Merge to main → Cloudflare auto-deploys to https://anchorrisktransfer.com
```

Without GitHub (direct from your machine):

```bash
git pull
npm install        # if dependencies changed
npm run deploy     # build + push to Cloudflare Pages
```

### Rollback

If a deploy goes wrong, in the dashboard → **Deployments**, find the last good build and click **Rollback to this deployment**. Takes ~10 seconds.

### Publishing a new blog post

```bash
git checkout -b post/<short-slug>
# Create content/insights/YYYY-MM-<slug>.mdx (see "Authoring a blog post" above)
git add content/insights/YYYY-MM-<slug>.mdx
git commit -m "Insight: <title>"
git push -u origin post/<short-slug>
# Open PR → review the preview deploy → merge to main
```

Cloudflare rebuilds the static blog list and detail pages automatically.

### Local testing of the edge build (catch Workers-incompatibility before deploy)

```bash
npm run pages:build    # writes .vercel/output/static
npm run preview        # runs the edge bundle at http://localhost:8788
```

Hit every route and submit the contact form. If something works in `npm run dev` but breaks here, it's a Node-only API leaking into the edge bundle — common culprits are `fs`, `process.cwd()` deep paths, or non-edge-compatible libraries. The contact API explicitly declares `export const runtime = 'edge'`; the rest of the site is pure render so it ports cleanly.

### Monitoring

- **Build logs:** Cloudflare Pages dashboard → Deployments → click a deployment → **View build logs**.
- **Live function logs:** Cloudflare Pages → your project → **Functions → Real-time logs**. This shows `console.log` / `console.error` from the contact API and any runtime errors.
- **Resend deliverability:** <https://resend.com/emails> — view every sent email, replies, bounces, and complaints.

---

## Project structure

```
app/
├─ layout.tsx                Root layout — Nav, Footer, fonts, brand.css
├─ page.tsx                  Home
├─ about/page.tsx
├─ services/page.tsx
├─ classes/page.tsx
├─ capacity/page.tsx
├─ team/page.tsx
├─ insights/
│  ├─ page.tsx               Blog list (featured + recent + archive)
│  └─ [slug]/page.tsx        MDX article (generateStaticParams from filesystem)
├─ contact/page.tsx          Contact form on its own route
├─ api/contact/route.ts      Edge runtime — zod validation, honeypot, Resend
└─ not-found.tsx             Branded 404

components/
├─ Nav.tsx                   Sticky utility bar + main nav (client)
├─ Footer.tsx                Five-column footer
├─ PageHero.tsx              Inner-page navy hero w/ breadcrumb
├─ CTAStrip.tsx              Dark CTA band
├─ ContactForm.tsx           Live form, posts to /api/contact (client)
├─ ContactSection.tsx        Form + address block wrapper
├─ home/Hero.tsx             Home full-bleed hero
└─ sections/
   ├─ TrustBand.tsx
   ├─ About.tsx
   ├─ Services.tsx           Hover-lift cards (client)
   ├─ Classes.tsx            Hover-scale image cards (client)
   ├─ Capacity.tsx
   ├─ Claims.tsx             Four-step timeline
   ├─ Values.tsx
   ├─ Team.tsx
   └─ InsightsTeaser.tsx     Featured + recent — reads MDX

content/insights/             MDX blog posts (frontmatter + body)

lib/
├─ insights.ts                MDX loader — list + by-slug
└─ images.ts                  Typed Unsplash URL builder

public/
├─ fonts/                     EB Garamond + Google Sans TTFs
└─ brand/                     Anchor logo SVGs

styles/globals.css            CSS vars, @font-face, prose styles, mobile rules

next.config.mjs               MDX, images.unsplash.com allowlist
tailwind.config.ts            Brand palette + font families
wrangler.toml                 Cloudflare Pages config
```

## Brand reference

- **Navy** `#0A2540` (full scale 50–950 in `tailwind.config.ts` and as `--navy-*` CSS variables)
- **Silver** `#C4C9CF`
- **Typography**: Google Sans (sans) for headlines and UI · EB Garamond (serif italic) for editorial accents · JetBrains Mono for eyebrows/dates
- **Tokens**: see `:root` block in `styles/globals.css`

## What's not yet built

- The print/PDF **company profile brochure** (`Anchor Company Profile.html` from the design bundle).
- Newsletter signup integration on the Insights page.
- Search across insights posts.
- A non-technical admin UI for blog posts (current model is "edit MDX, open a PR").

Open an issue or talk to the team if you want any of these scoped in.
