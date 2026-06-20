// Vercel Function (Node.js / Fluid Compute): POST /api/contact
// Validates a contact-form submission and emails it to CONTACT_TO via Resend.
//
// Required env vars (set per Vercel project environment):
//   RESEND_API_KEY        - server secret
//   TURNSTILE_SECRET_KEY  - server secret (omit to skip Turnstile verification locally)
//   CONTACT_TO            - recipient address, e.g. underwriting@anchorrisktransfer.com
//   CONTACT_FROM          - verified Resend sender, e.g. "Anchor Risk Transfer <site@anchorrisktransfer.com>"
//   ALLOWED_ORIGIN        - e.g. https://anchorrisktransfer.com (comma-separate to allow multiple)

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Why: `vercel dev` does not reliably inject `.env.local` into the function process
// when the same vars aren't registered on the project's Development scope. This loader
// fills the gap for local dev. It never overrides existing process.env values.
(function loadDotEnvLocal() {
  const path = join(process.cwd(), '.env.local');
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!m) continue;
    const [, key, raw] = m;
    if (process.env[key] !== undefined) continue;
    process.env[key] = raw.replace(/^"(.*)"$|^'(.*)'$/, (_match: string, a?: string, b?: string) => a ?? b ?? '');
  }
})();

const MAX_FIELD_LEN = {
  name: 120,
  company: 160,
  email: 200,
  classOfBusiness: 80,
  message: 5000,
};

const CONTROL_CHARS = /[\x00-\x1F\x7F]/g;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isEmail = (v: unknown): v is string =>
  typeof v === 'string' && EMAIL_RE.test(v) && v.length <= MAX_FIELD_LEN.email;

const clean = (v: unknown, max: number): string => {
  if (typeof v !== 'string') return '';
  const stripped = v.replace(CONTROL_CHARS, ' ').trim();
  return stripped.length > max ? stripped.slice(0, max) : stripped;
};

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};
const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);

async function verifyTurnstile(token: string, secret: string, ip: string) {
  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', token);
  if (ip) body.set('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return data?.success === true;
}

function originAllowed(origin: string, allowedCsv: string) {
  if (!origin || !allowedCsv) return false;
  const allowed = allowedCsv.split(',').map((s) => s.trim()).filter(Boolean);
  return allowed.includes(origin);
}

type Locale = 'en' | 'fr';

const labels: Record<Locale, {
  subject: (company: string) => string;
  heading: string;
  intro: string;
  name: string;
  company: string;
  email: string;
  classOfBusiness: string;
  message: string;
}> = {
  en: {
    subject: (company) => `New capacity request — ${company}`,
    heading: 'New capacity request',
    intro: 'A new submission was made via anchorrisktransfer.com.',
    name: 'Name',
    company: 'Company',
    email: 'Email',
    classOfBusiness: 'Class of business',
    message: 'Message',
  },
  fr: {
    subject: (company) => `Nouvelle demande de capacité — ${company}`,
    heading: 'Nouvelle demande de capacité',
    intro: 'Une nouvelle soumission a été reçue via anchorrisktransfer.com.',
    name: 'Nom',
    company: 'Société',
    email: 'E-mail',
    classOfBusiness: "Branche d'activité",
    message: 'Message',
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }

  const env = {
    RESEND_API_KEY: process.env.RESEND_API_KEY?.trim(),
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY?.trim(),
    CONTACT_TO: process.env.CONTACT_TO?.trim(),
    CONTACT_FROM: process.env.CONTACT_FROM?.trim(),
    ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN?.trim(),
  };

  const origin = (req.headers.origin as string) || '';
  if (env.ALLOWED_ORIGIN && !originAllowed(origin, env.ALLOWED_ORIGIN)) {
    return res.status(403).json({ ok: false, error: 'origin_not_allowed' });
  }

  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ ok: false, error: 'bad_request' });
  }

  // Honeypot: bots fill every field; humans don't see this one.
  if (clean(body.website, 1) !== '') {
    return res.status(200).json({ ok: true });
  }

  const localeRaw = clean(body.locale, 4).toLowerCase();
  const locale: Locale = localeRaw === 'fr' ? 'fr' : 'en';

  const fields = {
    name: clean(body.name, MAX_FIELD_LEN.name),
    company: clean(body.company, MAX_FIELD_LEN.company),
    email: clean(body.email, MAX_FIELD_LEN.email),
    classOfBusiness: clean(body.classOfBusiness, MAX_FIELD_LEN.classOfBusiness),
    message: clean(body.message, MAX_FIELD_LEN.message),
  };

  if (!fields.name || !fields.company || !fields.message || !isEmail(fields.email)) {
    return res.status(400).json({ ok: false, error: 'missing_or_invalid_fields' });
  }

  if (env.TURNSTILE_SECRET_KEY) {
    const token = clean(body['cf-turnstile-response'], 4000);
    const ip =
      (req.headers['cf-connecting-ip'] as string) ||
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      '';
    const ok = token && (await verifyTurnstile(token, env.TURNSTILE_SECRET_KEY, ip));
    if (!ok) return res.status(400).json({ ok: false, error: 'turnstile_failed' });
  }

  const L = labels[locale];
  const subject = L.subject(fields.company);

  const text = [
    `${L.name}: ${fields.name}`,
    `${L.company}: ${fields.company}`,
    `${L.email}: ${fields.email}`,
    `${L.classOfBusiness}: ${fields.classOfBusiness || '—'}`,
    '',
    `${L.message}:`,
    fields.message,
  ].join('\n');

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#0B1A29;line-height:1.6">
      <h2 style="color:#0A2540;margin:0 0 16px">${L.heading}</h2>
      <p style="margin:0 0 24px;color:#42535F">${L.intro}</p>
      <table style="border-collapse:collapse;width:100%;max-width:560px">
        <tbody>
          <tr><td style="padding:8px 0;color:#7E8C96;width:160px">${L.name}</td><td style="padding:8px 0"><strong>${escapeHtml(fields.name)}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#7E8C96">${L.company}</td><td style="padding:8px 0"><strong>${escapeHtml(fields.company)}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#7E8C96">${L.email}</td><td style="padding:8px 0"><a href="mailto:${escapeHtml(fields.email)}">${escapeHtml(fields.email)}</a></td></tr>
          ${fields.classOfBusiness ? `<tr><td style="padding:8px 0;color:#7E8C96">${L.classOfBusiness}</td><td style="padding:8px 0">${escapeHtml(fields.classOfBusiness)}</td></tr>` : ''}
        </tbody>
      </table>
      <h3 style="color:#0A2540;margin:28px 0 8px;font-size:15px;letter-spacing:0.04em;text-transform:uppercase">${L.message}</h3>
      <p style="margin:0;white-space:pre-wrap;color:#172838">${escapeHtml(fields.message)}</p>
    </div>
  `;

  if (!env.RESEND_API_KEY || !env.CONTACT_FROM || !env.CONTACT_TO) {
    console.error('Contact form misconfigured: missing RESEND_API_KEY / CONTACT_FROM / CONTACT_TO');
    return res.status(500).json({ ok: false, error: 'server_misconfigured' });
  }

  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO],
      reply_to: fields.email,
      subject,
      text,
      html,
    }),
  });

  if (!resendRes.ok) {
    const detail = await resendRes.text().catch(() => '');
    console.error('Resend failed', resendRes.status, detail);
    return res.status(502).json({ ok: false, error: 'send_failed' });
  }

  return res.status(200).json({ ok: true });
}
