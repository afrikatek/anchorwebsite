import { type FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? '';

const classOptions = [
  { value: 'Property', key: 'ContactForm.classProperty' },
  { value: 'Engineering', key: 'ContactForm.classEngineering' },
  { value: 'Marine', key: 'ContactForm.classMarine' },
  { value: 'Liability', key: 'ContactForm.classLiability' },
  { value: 'Political Violence & Terrorism', key: 'ContactForm.classPV' },
  { value: 'Miscellaneous Accident', key: 'ContactForm.classMisc' },
  { value: 'Energy', key: 'ContactForm.classEnergy' },
  { value: 'Motor', key: 'ContactForm.classMotor' },
] as const;

const inputStyle: React.CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontSize: 14,
  color: '#fff',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.16)',
  borderRadius: 8,
  padding: '13px 15px',
  outline: 'none',
  width: '100%',
};

declare global {
  interface Window {
    turnstile?: { reset: () => void };
  }
}

function useTurnstileScript() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!TURNSTILE_SITE_KEY) return;
    if (document.querySelector(`script[src="${TURNSTILE_SRC}"]`)) return;
    const s = document.createElement('script');
    s.src = TURNSTILE_SRC;
    s.async = true;
    s.defer = true;
    document.head.appendChild(s);
  }, []);
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm() {
  const { t, i18n } = useTranslation();
  useTurnstileScript();
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus('submitting');
    setError(null);

    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') ?? ''),
      company: String(data.get('company') ?? ''),
      email: String(data.get('email') ?? ''),
      classOfBusiness: String(data.get('classOfBusiness') ?? ''),
      message: String(data.get('message') ?? ''),
      locale: i18n.language === 'fr' ? 'fr' : 'en',
      website: String(data.get('website') ?? ''),
      'cf-turnstile-response': String(data.get('cf-turnstile-response') ?? ''),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !body.ok) {
        throw new Error(body.error ?? t('ContactForm.errorGeneric'));
      }
      setStatus('success');
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('ContactForm.errorGeneric'));
      setStatus('error');
    } finally {
      if (typeof window !== 'undefined' && window.turnstile) {
        try {
          window.turnstile.reset();
        } catch {
          /* ignore */
        }
      }
    }
  }

  if (status === 'success') {
    return (
      <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 'var(--radius-lg)', padding: 40, backdropFilter: 'blur(4px)', minHeight: 380, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="h4" style={{ color: '#fff', marginBottom: 12 }}>{t('ContactForm.successTitle')}</div>
        <p className="body" style={{ color: 'var(--on-dark-2)', margin: 0 }}>
          {t('ContactForm.successBody', { email: 'underwriting@anchorrisktransfer.com' })
            .split('underwriting@anchorrisktransfer.com')
            .reduce<React.ReactNode[]>((acc, chunk, i, arr) => {
              acc.push(chunk);
              if (i < arr.length - 1) {
                acc.push(
                  <a key={i} href="mailto:underwriting@anchorrisktransfer.com" style={{ color: 'var(--navy-200)' }}>
                    underwriting@anchorrisktransfer.com
                  </a>,
                );
              }
              return acc;
            }, [])}
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 'var(--radius-lg)', padding: 32, backdropFilter: 'blur(4px)' }}>
      <div className="h4" style={{ color: '#fff', marginBottom: 20 }}>{t('ContactForm.title')}</div>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* honeypot — hidden from humans, bots may fill it */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, opacity: 0 }}
          aria-hidden="true"
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <input name="name" required placeholder={t('ContactForm.name')} style={inputStyle} />
          <input name="company" required placeholder={t('ContactForm.company')} style={inputStyle} />
        </div>
        <input name="email" type="email" required placeholder={t('ContactForm.email')} style={inputStyle} />
        <select name="classOfBusiness" required defaultValue="" style={{ ...inputStyle, color: 'var(--on-dark-2)' }}>
          <option value="" disabled>{t('ContactForm.classOfBusiness')}</option>
          {classOptions.map((c) => (
            <option key={c.value} value={c.value}>{t(c.key)}</option>
          ))}
        </select>
        <textarea name="message" required placeholder={t('ContactForm.message')} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />

        {TURNSTILE_SITE_KEY && (
          <div
            className="cf-turnstile"
            data-sitekey={TURNSTILE_SITE_KEY}
            data-theme="dark"
            data-size="flexible"
            style={{ margin: '4px 0' }}
          />
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="btn btn-light"
          style={{ justifyContent: 'center', marginTop: 6, opacity: status === 'submitting' ? 0.7 : 1, cursor: status === 'submitting' ? 'wait' : 'pointer' }}
        >
          {status === 'submitting' ? t('ContactForm.submitting') : t('ContactForm.submit')}
        </button>
        {error && (
          <div className="small" style={{ color: '#ffb4b4', textAlign: 'center' }}>{error}</div>
        )}
        <div className="small" style={{ color: 'var(--on-dark-3)', textAlign: 'center' }}>
          {t('ContactForm.footnote')}
        </div>
      </form>
    </div>
  );
}
