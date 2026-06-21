# Anchor Risk Transfer — Website

Production website for **Anchor Risk Transfer Private Limited** — a licensed Underwriting Management Agency in Cybercity, Mauritius, serving the African and Indian Ocean reinsurance markets.

Bilingual (English + French), statically pre-rendered, with a serverless contact form.

---

## Stack

- **React 19** + **Vite 7**, pre-rendered to static HTML via **`vite-react-ssg`**
- **React Router DOM v6** with manually-declared routes (one tree mounted at `/`, the same tree mounted at `/fr/`)
- **react-i18next** for EN/FR translations (`src/i18n/{en,fr}.json`)
- **react-helmet-async** for per-page `<title>` and meta
- Plain CSS with design tokens in `src/styles/globals.css` — no Tailwind, no CSS-in-JS
- **Markdown** for Insights articles (`src/content/insights/*.md`), parsed with `front-matter` + `marked`
- **Vercel Functions** (`api/contact.ts`, Node.js runtime) for contact form delivery via **Resend**
- **Cloudflare Turnstile** bot challenge on the contact form
- **TypeScript** throughout

This is the same stack used by [`assessprowebsite`](../assessprowebsite), so the two repos share build, deploy, and tooling conventions.

---

## Part 1 — Running locally

### Prerequisites

- **Node.js 20+** (developed on 24). Check with `node --version`.
- **npm** (ships with Node).
- **Vercel CLI** — only needed if you want to test the contact-form API locally. Install with `npm i -g vercel`.

### One-time setup

```bash
# 1. Install dependencies (~30 s on a cold cache)
npm install

# 2. Create your local env file from the template
cp .env.local.example .env.local

# 3. Fill in .env.local — see "Environment variables" below.
#    For dev work that doesn't touch the contact form, you can leave it untouched;
#    every other route still renders. Only /api/contact will fail.
```

### Run the dev server

```bash
npm run dev
# → http://localhost:3000
```

Vite serves an SPA in dev — fast HMR, no SSG. The `vite dev` server does **not** run the `api/contact.ts` function, so the contact form will fail with a network error. To exercise the form locally, stop `npm run dev` and use `vercel dev` instead (it serves on the same port — see next section).

### Run the dev server *with* the contact API

```bash
vercel dev
# → http://localhost:3000
#   (Vercel's dev runtime serves the Vite frontend AND the api/ Functions)
```

`vercel dev` reads `.env.local` automatically. Once it's running, you can submit the contact form end-to-end against your real Resend sandbox.

> First-time `vercel dev` users: it will prompt to link the directory to a Vercel project. Choose the existing `anchor-website` project (or create a new one).

### Other npm scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server (SPA, no API routes) |
| `npm run build` | Pre-render every route to static HTML in `dist/`, then run `scripts/postbuild.mjs` for the `<html lang="fr">` rewrites and `sitemap.xml` |
| `npm run preview` | Serve `dist/` as a static site for build verification (no API routes; use `vercel dev` after `vercel build` for that) |

### Smoke tests

With the dev server running on `http://localhost:3000`:

```bash
# Every route should return 200 in both locales
for path in / /fr /about /fr/about /services /fr/services /contact /fr/contact \
            /insights /fr/insights /classes /fr/classes /capacity /fr/capacity \
            /team /fr/team; do
  printf '%s → ' "$path"
  curl -s -o /dev/null -w '%{http_code}\n' "http://localhost:3000$path"
done
```

### Testing the contact form locally

The contact form has two layers — the React form (`src/components/ContactForm.tsx`) and the serverless function (`api/contact.ts`). Each is tested differently.

**Decide which dev server you need**

- **Form rendering + client validation only** → `npm run dev`. The `/contact` page loads. Submitting will fail with a network error because Vite doesn't serve `api/*`.
- **End-to-end form + Resend email** → `vercel dev`. This boots the Vite frontend AND the `api/contact.ts` function on the same `:3000` port. You can only run one at a time.

```bash
# Stop any running `npm run dev` first (kill the process).
vercel dev
# → first run prompts you to link to a Vercel project; pick `anchor-website`
# → http://localhost:3000
```

**One-time `.env.local` setup**

```bash
cp .env.local.example .env.local
```

Then fill in *at minimum*:

```bash
# Required for /api/contact to send mail
RESEND_API_KEY=re_xxxxxxxxxxxx           # https://resend.com/api-keys
CONTACT_TO=your-inbox@example.com         # any address you can read while testing
CONTACT_FROM=Anchor Test <onboarding@resend.dev>   # use resend.dev sandbox sender until your domain is verified
ALLOWED_ORIGIN=http://localhost:3000     # required, no comma

# Recommended: leave Turnstile blank locally so the form submit isn't gated
VITE_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

> The Resend onboarding sender `onboarding@resend.dev` works without any domain verification — use it while you're wiring the form. Switch to `site@anchorrisktransfer.com` only after you've verified `anchorrisktransfer.com` in the Resend dashboard.

**Test the API directly (with `vercel dev` running)**

```bash
# 1. Missing fields → 400 missing_or_invalid_fields
curl -i -X POST http://localhost:3000/api/contact \
  -H 'content-type: application/json' -H 'origin: http://localhost:3000' \
  -d '{}'

# 2. Honeypot tripped → 200 silent accept (bots don't learn anything)
curl -i -X POST http://localhost:3000/api/contact \
  -H 'content-type: application/json' -H 'origin: http://localhost:3000' \
  -d '{"name":"Bot","company":"Acme","email":"a@b.co","classOfBusiness":"Property","message":"hi","website":"http://spam"}'

# 3. Good payload → 200 ok, email arrives at CONTACT_TO
curl -i -X POST http://localhost:3000/api/contact \
  -H 'content-type: application/json' -H 'origin: http://localhost:3000' \
  -d '{"name":"You","company":"Acme Re","email":"you@example.com","classOfBusiness":"Property","message":"Real local test","locale":"en"}'

# 4. French locale → email subject + body labels in French
curl -i -X POST http://localhost:3000/api/contact \
  -H 'content-type: application/json' -H 'origin: http://localhost:3000' \
  -d '{"name":"Vous","company":"Acme Re","email":"vous@example.com","classOfBusiness":"Property","message":"Test local","locale":"fr"}'
```

The `-H 'origin: http://localhost:3000'` header matters: the function checks the `Origin` against `ALLOWED_ORIGIN` and returns `403 origin_not_allowed` without it.

**Test the form end-to-end in the browser**

1. `vercel dev` running on `:3000`.
2. Visit `http://localhost:3000/contact`. Fill in name, company, work email, class, message.
3. Submit. The button shows "Sending…", then "Thank you — message received." on success.
4. Check the inbox at `CONTACT_TO` — the email arrives within 1–2 seconds.
5. Repeat on `/fr/contact` — confirm the email subject is "Nouvelle demande de capacité — …" and the field labels are French.

**Inspecting what the function actually did**

`vercel dev`'s terminal prints every request and any `console.log/error` from `api/contact.ts`. Errors that surface here:

- `RESEND_API_KEY is not configured` — your `.env.local` is missing the key, or `vercel dev` didn't pick it up. Restart `vercel dev`.
- `Resend failed 422 …` — usually domain not verified. Use `onboarding@resend.dev` as `CONTACT_FROM` until you verify `anchorrisktransfer.com`.
- `Resend failed 403 …` — the key is for a different team/scope.

> If you set `TURNSTILE_SECRET_KEY` locally, requests fail with `turnstile_failed` unless you include a real `cf-turnstile-response` token. Leave the secret blank locally so the form submit doesn't need a challenge token.

### Debugging the site locally

The site is a Vite + React 19 SPA with `vite-react-ssg` for static prerender. Debugging breaks into three layers — pick the one matching what you're seeing.

**Layer 1: page is blank in the browser**

This is almost always a JavaScript error that crashes the React tree mount. The dev server still returns 200 because Vite serves the SPA shell. To diagnose:

1. Open DevTools (`Cmd+Opt+I` on macOS) → **Console** tab. Look for any red message. The first red line is the bug.
2. **Look at the Network tab → all** filter. Any 404s on `/src/...` or `/node_modules/.vite/deps/...` mean a module path is wrong.
3. Open DevTools → **Elements** → inspect `<div id="root">`. If it shows `<!--app-html-->` (a comment, not real DOM), React never mounted. The console error tells you why.

Frequent causes seen on this project:
- `Found a route id collision on id "0-0"` → `src/routes.tsx` is spreading the same route-objects array twice. Use the `buildLocaleChildren()` factory there, not a shared `const`.
- `Cannot find module '@/...'` → tsconfig/vite alias broke. Check `vite.config.ts` `resolve.alias` and `tsconfig.json` `paths`.
- A hook calling `useNavigate`/`useLocation` outside the `<RouterProvider>` tree. Make sure the component is rendered inside `App.tsx`'s `<Outlet/>`.

**Layer 2: page renders but interactions don't work** (links, buttons, locale switcher)

Means React mounted but something is racing or has stale state.

1. DevTools → **Console** while you click. Errors during a click point straight at the handler.
2. Use **React DevTools** (https://react.dev/link/react-devtools) → Components tab. Click the LocaleSwitcher button — find the `LocaleSwitcher` component in the tree, check its `props`/`state`/`hooks`. If `current` is stuck on `"en"` while URL is `/fr`, the hook isn't seeing the URL change.
3. In the Console, type `__VITE_REACT_SSG_CONTEXT__` — this is the live data router. `__VITE_REACT_SSG_CONTEXT__.router.state.location.pathname` should match the URL bar.

**Layer 3: production build differs from dev**

```bash
rm -rf dist && npm run build
npm run preview
# → http://localhost:3000 — serves dist/ as static files exactly like Vercel will
```

If dev works but `npm run preview` doesn't, the bug is in the SSG render path (look at `src/main.tsx`'s setup hook and `scripts/postbuild.mjs`). If `preview` works but the live Vercel deploy doesn't, the bug is in Vercel routing — check `vercel.json` is present at the repo root.

**A reusable headless test**

When you suspect a regression but can't tell what broke, write this once and re-use it. It launches the system Chrome via Playwright, captures every console + page error, and prints a clean diff.

```bash
npm install --save-dev --no-save playwright-core
```

Save as `dev-smoke.mjs` at the repo root:

```js
import { chromium } from 'playwright-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
page.on('console', (m) => { if (m.type() === 'error') console.log('console.error:', m.text()); });
await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('h1', { timeout: 8000 }).catch(() => console.log('no <h1> — React did not mount'));
const before = await page.locator('h1').first().textContent();
console.log('EN heading:', before);
await page.locator('button[aria-label*="French"]').click();
await page.waitForTimeout(600);
const after = await page.locator('h1').first().textContent();
console.log('FR heading:', after);
console.log('Toggle works:', before !== after);
await browser.close();
```

Run with the dev server up:

```bash
npm run dev &        # in one terminal
node dev-smoke.mjs   # in another
```

Any `PAGEERROR` or `console.error` line that prints is the actual cause of whatever you're seeing — much faster than guessing.

**Clearing Vite/HMR caches**

If HMR gets confused (rare, but happens after big route changes):

```bash
rm -rf node_modules/.vite dist .vite
npm run dev
```

### Build + locally verify the production output

```bash
npm run build
npm run preview
# → http://localhost:3000 — serves dist/ as static files
```

Inspect a few prerendered files:

```bash
# <html lang> is correct per locale
grep -oE '<html lang="[a-z]+"' dist/index.html dist/fr.html dist/about.html dist/fr/about.html

# Sitemap was generated
head -20 dist/sitemap.xml
```

### Environment variables

All env vars live in `.env.local` (gitignored). Template at `.env.local.example`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | ✅ (server) | Resend API key. Get one at https://resend.com/api-keys. |
| `CONTACT_TO` | ✅ (server) | Inbox that receives form submissions (e.g. `underwriting@anchorrisktransfer.com`). |
| `CONTACT_FROM` | ✅ (server) | Verified Resend sender, format `"Display Name <site@anchorrisktransfer.com>"`. Domain must be verified in Resend. |
| `ALLOWED_ORIGIN` | ✅ (server) | Comma-separated origins permitted to POST. Set `http://localhost:3000,https://anchorrisktransfer.com` for full coverage. |
| `VITE_TURNSTILE_SITE_KEY` | ⚙️ (client) | Cloudflare Turnstile site key. Exposed to the browser by Vite (`VITE_` prefix). Leave blank to hide the widget. |
| `TURNSTILE_SECRET_KEY` | ⚙️ (server) | Cloudflare Turnstile secret. If set, the API verifies tokens; if blank, verification is skipped. |

Get Turnstile keys at https://dash.cloudflare.com → Turnstile → Add site → choose **Managed** challenge.

> `VITE_` is required for any var that needs to be inlined into the client bundle. Server-only secrets (Resend key, Turnstile secret) must **not** have that prefix.

### Adding a new insight (blog post)

1. Create `src/content/insights/YYYY-MM-<slug>.md`:

   ```markdown
   ---
   title: Your headline goes here
   date: 2026-12-01
   tag: Property
   excerpt: One-paragraph teaser that appears on the listing page and as the meta description.
   hero: property         # any key from src/lib/images.ts
   author: Anchor Underwriting
   ---

   ## Section heading

   Body markdown. GitHub-flavoured. `inline code`, **bold**, [links](https://example.com) — all supported.

   > Block quotes render with the navy left border.

   - Lists
   - Work
   - Too
   ```

2. `npm run dev`, navigate to `/insights/YYYY-MM-<slug>` — the article appears immediately (Vite re-globs on save).

3. `npm run build` regenerates the static HTML and includes the new slug in the sitemap. The article is rendered in both `/insights/…` and `/fr/insights/…` (English copy under the French shell — the marketing site is bilingual; long-form articles aren't yet translated).

### Updating UI/marketing copy

All visible UI strings live in `src/i18n/en.json` and `src/i18n/fr.json`. Find the relevant key (namespaces are by component: `Nav.*`, `Footer.*`, `Hero.*`, etc.), edit both files in parallel, and the site updates on HMR.

Interpolation uses i18next's `{{var}}` syntax — e.g. `"copyright": "© {{year}} ..."`.

---

## Part 2 — Production deployment to Vercel

The repo includes a small `vercel.json` at the root:

```json
{
  "cleanUrls": true,
  "trailingSlash": false
}
```

`cleanUrls: true` tells Vercel to serve `dist/about.html` when the visitor requests `/about` (and `dist/fr/about.html` for `/fr/about`). Without it, Vercel's framework auto-detect can't reliably map the prerendered `*.html` files to clean URLs — every nav click returns a blank/404 page. Leave the file in place.

### One-time setup

```bash
# 1. Install the Vercel CLI globally
npm install -g vercel

# 2. Log in
vercel login

# 3. Link this directory to a Vercel project
vercel link
#   → choose "Create a new project" the first time, or pick an existing one.
#     Framework: Other (Vercel autodetects Vite). Build command: npm run build.
#     Output directory: dist
```

After `vercel link`, the project's ID is written to `.vercel/project.json` (gitignored).

### Set production environment variables

Run each command — `vercel env add` will prompt for the value and which environments to apply it to (production, preview, development):

```bash
vercel env add RESEND_API_KEY
vercel env add CONTACT_TO
vercel env add CONTACT_FROM
vercel env add ALLOWED_ORIGIN
vercel env add VITE_TURNSTILE_SITE_KEY
vercel env add TURNSTILE_SECRET_KEY
```

Suggested values:

| Variable | Production value |
| --- | --- |
| `CONTACT_TO` | `underwriting@anchorrisktransfer.com` |
| `CONTACT_FROM` | `Anchor Risk Transfer <site@anchorrisktransfer.com>` |
| `ALLOWED_ORIGIN` | `https://anchorrisktransfer.com,https://www.anchorrisktransfer.com` |
| `RESEND_API_KEY` | Server secret from https://resend.com/api-keys |
| `VITE_TURNSTILE_SITE_KEY` | Site key from Cloudflare Turnstile |
| `TURNSTILE_SECRET_KEY` | Secret from Cloudflare Turnstile |

After changing env vars, redeploy to pick them up:

```bash
vercel deploy --prod
```

You can also sync the prod env vars down to local for parity:

```bash
vercel env pull .env.local
```

### Verify your Resend sender domain

1. https://resend.com/domains → Add Domain → `anchorrisktransfer.com`.
2. Add the DNS records (SPF, DKIM, DMARC) shown by Resend to your domain registrar.
3. Wait for verification — usually a few minutes.
4. Set `CONTACT_FROM` to use an address on that verified domain.

### Day-to-day deployment

```bash
# Push a preview deploy (no production traffic yet)
vercel deploy

# Output looks like:
#   ✅  Production: https://anchor-website-xyz.vercel.app [copied to clipboard] [...]

# When the preview looks good, promote to production
vercel deploy --prod
# → https://anchorrisktransfer.com
```

Alternatively, connect the GitHub repo to Vercel and every PR auto-builds a preview URL; merges to `main` auto-deploy to production. This is the recommended setup (Project → Settings → Git → Connect Git Repository).

### Attach the custom domain

1. https://vercel.com/[your-team]/anchor-website/settings/domains
2. Add `anchorrisktransfer.com` and `www.anchorrisktransfer.com`.
3. Update DNS at your registrar to match the records Vercel shows (typically an `A` record for the apex and a `CNAME` for `www`).
4. Wait for SSL provisioning (a few minutes).

### Rollback

```bash
# List recent production deploys
vercel ls --prod

# Promote any earlier deploy to production
vercel promote <deployment-url>
```

### Monitor

- Function logs: https://vercel.com/[your-team]/anchor-website/logs (filter by `/api/contact` to see contact form invocations and Resend errors).
- Build logs: https://vercel.com/[your-team]/anchor-website/deployments.

---

## Project structure

```
anchorwebsite/
├── api/
│   └── contact.ts                  Vercel Function: Resend + Turnstile + locale-aware email
├── public/
│   ├── brand/                      Logo SVGs
│   └── fonts/                      EB Garamond + Google Sans .ttf files
├── scripts/
│   └── postbuild.mjs               Rewrites <html lang="fr"> on dist/fr/*, emits sitemap.xml
├── src/
│   ├── main.tsx                    Vite entry — ViteReactSSG({ routes })
│   ├── App.tsx                     Top-level route: Helmet, Nav, <Outlet/>, Footer, ScrollToTop, LocaleSync
│   ├── routes.tsx                  EN routes at /, FR routes at /fr/, both share the same Page components
│   ├── i18n.ts                     i18next init with en/fr JSON dictionaries
│   ├── styles/globals.css          Design tokens + base reset + typography + component classes
│   ├── i18n/
│   │   ├── en.json                 English UI copy
│   │   └── fr.json                 French UI copy
│   ├── lib/
│   │   ├── images.ts               Unsplash image keys
│   │   ├── insights.ts             Markdown loader via import.meta.glob
│   │   └── localePath.ts           localePath/stripLocale/isLocale helpers
│   ├── content/
│   │   └── insights/*.md           Long-form articles with YAML frontmatter
│   ├── components/
│   │   ├── Nav.tsx, Footer.tsx, PageHero.tsx, CTAStrip.tsx, Hero.tsx
│   │   ├── LocaleLink.tsx          react-router Link that auto-prepends /fr
│   │   ├── LocaleSwitcher.tsx      EN/FR toggle in the utility bar
│   │   ├── LocaleSync.tsx          Calls i18n.changeLanguage on route change
│   │   ├── ScrollToTop.tsx         Resets scroll on navigation
│   │   ├── ContactForm.tsx         Form + Turnstile widget + POST /api/contact
│   │   ├── ContactSection.tsx      Wrapper used on home + /contact pages
│   │   └── sections/               About, Capacity, Claims, Classes, InsightsTeaser, Services, Team, TrustBand, Values
│   └── pages/
│       ├── Home.tsx, About.tsx, Services.tsx, Classes.tsx, Capacity.tsx,
│       ├── Team.tsx, Contact.tsx, Insights.tsx, InsightDetail.tsx, NotFound.tsx
├── index.html                      Vite HTML entry (Google Fonts preconnect, favicon, OG defaults)
├── vite.config.ts                  Vite + @vitejs/plugin-react; @/* alias
├── tsconfig.json                   Bundler-mode TypeScript
└── package.json                    Scripts: dev / build / preview
```

---

## Bilingual routing — how it works

- The route tree is declared **once** as `baseChildren` in `src/routes.tsx`, then mounted both at `/` (English) and at `/fr/` (French).
- `App.tsx` reads the current pathname; if it starts with `/fr`, it calls `i18n.changeLanguage('fr')` synchronously so the first render is in the right language (important for SSG output).
- Every internal link in the codebase uses `<LocaleLink to="/about">` — it automatically becomes `/about` in English context and `/fr/about` in French context.
- The EN/FR switcher reads the current path, strips the locale prefix, then navigates to the same logical page under the other locale (so `/services` ↔ `/fr/services`).
- Pre-rendering produces a separate static HTML file for every (route × locale) combination, each with the correct `<html lang>` attribute and translated copy already baked in.

---

## Troubleshooting

- **`vercel dev` says "no .vercel directory"** → run `vercel link` once.
- **Contact form returns 403 `origin_not_allowed`** → `ALLOWED_ORIGIN` doesn't include the host you're submitting from. Add it (comma-separated).
- **Contact form returns 500 `server_misconfigured`** → one of `RESEND_API_KEY` / `CONTACT_FROM` / `CONTACT_TO` is missing.
- **Email arrives but reply-to is wrong** → expected. We set `reply_to` to the visitor's email, so hitting Reply in your inbox goes to them, not back to the site.
- **Turnstile widget doesn't appear** → `VITE_TURNSTILE_SITE_KEY` is blank or invalid. The form intentionally hides the widget when the site key isn't set (useful for env-less local dev).
- **French page shows English `<html lang="en">`** → `npm run build` runs `scripts/postbuild.mjs` after Vite which patches this. If you skipped the postbuild step (e.g. ran `vite-react-ssg build` directly), rerun `npm run build` or `node scripts/postbuild.mjs`.
- **HMR not picking up a new insight** → restart `npm run dev` once. `import.meta.glob` discovers files at module-graph build time.

---

## License

Proprietary — © Anchor Risk Transfer Private Limited.
