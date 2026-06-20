// Post-build pass:
//   1. Force <html lang="fr"> on every prerendered file under dist/fr/.
//   2. Emit dist/sitemap.xml with both locales (EN at /, FR at /fr/) and hreflang alternates.
// vite-react-ssg prerenders against the static `index.html` shell (lang="en"), and
// react-helmet-async's htmlAttributes are applied at hydrate-time only — so the
// initial SSR HTML for /fr/* keeps lang="en" without this rewrite.

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const FR_DIR = join(DIST, 'fr');
const BASE = 'https://anchorrisktransfer.com';

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      out.push(...walk(full));
    } else if (full.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

// 1) lang attribute rewrite — every prerendered file whose URL begins with /fr
const frFiles = [join(DIST, 'fr.html'), ...walk(FR_DIR)];
let rewrites = 0;
for (const file of frFiles) {
  let html;
  try {
    html = readFileSync(file, 'utf8');
  } catch {
    continue;
  }
  const next = html.replace(/<html lang="en"/, '<html lang="fr"');
  if (next !== html) {
    writeFileSync(file, next);
    rewrites += 1;
  }
}
console.log(`[postbuild] rewrote <html lang> to "fr" on ${rewrites} files`);

// 2) sitemap.xml
const staticPaths = ['', '/about', '/services', '/classes', '/capacity', '/team', '/contact', '/insights'];

// Collect insights slugs from the prerendered dist/insights/ directory
const insightsDir = join(DIST, 'insights');
let insightPaths = [];
try {
  insightPaths = readdirSync(insightsDir)
    .filter((f) => f.endsWith('.html'))
    .map((f) => `/insights/${f.replace(/\.html$/, '')}`);
} catch {
  insightPaths = [];
}

const allPaths = [...staticPaths, ...insightPaths];

const entries = allPaths.map((path) => {
  const en = `${BASE}${path}`;
  const fr = `${BASE}/fr${path}`;
  return `  <url>
    <loc>${en}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>
    <xhtml:link rel="alternate" hreflang="fr" href="${fr}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${en}"/>
  </url>`;
}).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>
`;

writeFileSync(join(DIST, 'sitemap.xml'), sitemap);
console.log(`[postbuild] wrote dist/sitemap.xml with ${allPaths.length} URLs`);
