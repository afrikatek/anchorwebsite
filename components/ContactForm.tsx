'use client';

import { useLocale, useTranslations } from 'next-intl';
import { type FormEvent, useState } from 'react';

const classOptions = [
  { value: 'Property', key: 'classProperty' },
  { value: 'Engineering', key: 'classEngineering' },
  { value: 'Marine', key: 'classMarine' },
  { value: 'Liability', key: 'classLiability' },
  { value: 'Political Violence & Terrorism', key: 'classPV' },
  { value: 'Miscellaneous Accident', key: 'classMisc' },
  { value: 'Energy', key: 'classEnergy' },
  { value: 'Motor', key: 'classMotor' },
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

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm() {
  const t = useTranslations('ContactForm');
  const locale = useLocale();
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setError(null);

    const data = new FormData(e.currentTarget);
    const payload = {
      name: String(data.get('name') ?? ''),
      company: String(data.get('company') ?? ''),
      email: String(data.get('email') ?? ''),
      classOfBusiness: String(data.get('classOfBusiness') ?? ''),
      message: String(data.get('message') ?? ''),
      locale,
      // honeypot
      website: String(data.get('website') ?? ''),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? t('errorGeneric'));
      }
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorGeneric'));
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 'var(--radius-lg)', padding: 40, backdropFilter: 'blur(4px)', minHeight: 380, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="h4" style={{ color: '#fff', marginBottom: 12 }}>{t('successTitle')}</div>
        <p className="body" style={{ color: 'var(--on-dark-2)', margin: 0 }}>
          {t.rich('successBody', {
            email: () => (
              <a href="mailto:underwriting@anchorrisktransfer.com" style={{ color: 'var(--navy-200)' }}>
                underwriting@anchorrisktransfer.com
              </a>
            ),
          })}
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 'var(--radius-lg)', padding: 32, backdropFilter: 'blur(4px)' }}>
      <div className="h4" style={{ color: '#fff', marginBottom: 20 }}>{t('title')}</div>
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
          <input name="name" required placeholder={t('name')} style={inputStyle} />
          <input name="company" required placeholder={t('company')} style={inputStyle} />
        </div>
        <input name="email" type="email" required placeholder={t('email')} style={inputStyle} />
        <select name="classOfBusiness" required defaultValue="" style={{ ...inputStyle, color: 'var(--on-dark-2)' }}>
          <option value="" disabled>{t('classOfBusiness')}</option>
          {classOptions.map((c) => (
            <option key={c.value} value={c.value}>{t(c.key)}</option>
          ))}
        </select>
        <textarea name="message" required placeholder={t('message')} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="btn btn-light"
          style={{ justifyContent: 'center', marginTop: 6, opacity: status === 'submitting' ? 0.7 : 1, cursor: status === 'submitting' ? 'wait' : 'pointer' }}
        >
          {status === 'submitting' ? t('submitting') : t('submit')}
        </button>
        {error && (
          <div className="small" style={{ color: '#ffb4b4', textAlign: 'center' }}>{error}</div>
        )}
        <div className="small" style={{ color: 'var(--on-dark-3)', textAlign: 'center' }}>
          {t('footnote')}
        </div>
      </form>
    </div>
  );
}
