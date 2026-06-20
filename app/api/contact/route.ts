import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

const Payload = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  company: z.string().trim().min(1, 'Company is required').max(160),
  email: z.string().trim().email('Valid email required'),
  classOfBusiness: z.string().trim().min(1, 'Class of business is required').max(80),
  message: z.string().trim().min(1, 'Tell us about the risk').max(4000),
  locale: z.enum(['en', 'fr']).optional().default('en'),
  website: z.string().optional(), // honeypot
});

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!),
  );
}

const labels = {
  en: {
    subject: (company: string) => `New capacity request — ${company}`,
    heading: 'New capacity request',
    intro: 'A new submission was made via anchorrisktransfer.com.',
    name: 'Name',
    company: 'Company',
    email: 'Email',
    classOfBusiness: 'Class of business',
    message: 'Message',
  },
  fr: {
    subject: (company: string) => `Nouvelle demande de capacité — ${company}`,
    heading: 'Nouvelle demande de capacité',
    intro: 'Une nouvelle soumission a été reçue via anchorrisktransfer.com.',
    name: 'Nom',
    company: 'Société',
    email: 'E-mail',
    classOfBusiness: "Branche d'activité",
    message: 'Message',
  },
} as const;

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = Payload.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json({ error: first?.message ?? 'Invalid input' }, { status: 400 });
  }
  const data = parsed.data;

  // Honeypot tripped — accept silently so bots can't probe for the error
  if (data.website && data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? 'underwriting@anchorrisktransfer.com';
  const from = process.env.CONTACT_FROM_EMAIL ?? 'site@anchorrisktransfer.com';

  if (!apiKey) {
    console.error('RESEND_API_KEY is not configured');
    return NextResponse.json({ error: 'Email delivery is not configured' }, { status: 500 });
  }

  const L = labels[data.locale];
  const resend = new Resend(apiKey);
  const subject = L.subject(data.company);
  const html = `
    <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#0B1A29;line-height:1.6">
      <h2 style="color:#0A2540;margin:0 0 16px">${L.heading}</h2>
      <p style="margin:0 0 24px;color:#42535F">${L.intro}</p>
      <table style="border-collapse:collapse;width:100%;max-width:560px">
        <tbody>
          <tr><td style="padding:8px 0;color:#7E8C96;width:160px">${L.name}</td><td style="padding:8px 0"><strong>${esc(data.name)}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#7E8C96">${L.company}</td><td style="padding:8px 0"><strong>${esc(data.company)}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#7E8C96">${L.email}</td><td style="padding:8px 0"><a href="mailto:${esc(data.email)}">${esc(data.email)}</a></td></tr>
          <tr><td style="padding:8px 0;color:#7E8C96">${L.classOfBusiness}</td><td style="padding:8px 0">${esc(data.classOfBusiness)}</td></tr>
        </tbody>
      </table>
      <h3 style="color:#0A2540;margin:28px 0 8px;font-size:15px;letter-spacing:0.04em;text-transform:uppercase">${L.message}</h3>
      <p style="margin:0;white-space:pre-wrap;color:#172838">${esc(data.message)}</p>
    </div>
  `;

  try {
    const result = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject,
      html,
    });
    if (result.error) {
      console.error('Resend error', result.error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact submission failed', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 502 });
  }
}
