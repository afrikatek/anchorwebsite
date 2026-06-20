'use client';

import { useTranslations } from 'next-intl';
import { type ReactNode, useState } from 'react';

type ServiceDef = { n: string; titleKey: string; bodyKey: string; tagKey: string; icon: ReactNode };

const services: ServiceDef[] = [
  {
    n: '01',
    titleKey: 's1Title',
    bodyKey: 's1Body',
    tagKey: 's1Tag',
    icon: <g><rect x="5" y="7" width="22" height="18" rx="2" /><path d="M5 13h22M11 19h10" /></g>,
  },
  {
    n: '02',
    titleKey: 's2Title',
    bodyKey: 's2Body',
    tagKey: 's2Tag',
    icon: <g><circle cx="16" cy="16" r="11" /><path d="M16 8v8l6 4" /></g>,
  },
  {
    n: '03',
    titleKey: 's3Title',
    bodyKey: 's3Body',
    tagKey: 's3Tag',
    icon: <g><path d="M5 24l7-8 5 5 10-12" /><path d="M27 9v6M27 9h-6" /></g>,
  },
  {
    n: '04',
    titleKey: 's4Title',
    bodyKey: 's4Body',
    tagKey: 's4Tag',
    icon: <g><path d="M16 5l11 6-11 6L5 11l11-6z" /><path d="M9 14v6c0 2 4 4 7 4s7-2 7-4v-6" /></g>,
  },
];

function ServiceCard({ s }: { s: ServiceDef }) {
  const t = useTranslations('Services');
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--bone)',
        border: `1px solid ${hover ? 'var(--navy-200)' : 'var(--line)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '38px 40px',
        display: 'flex',
        gap: 28,
        transition: 'all 200ms var(--ease)',
        boxShadow: hover ? 'var(--shadow-md)' : 'none',
        transform: hover ? 'translateY(-3px)' : 'translateY(0)',
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <div style={{ width: 54, height: 54, borderRadius: 12, background: 'var(--navy-900)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {s.icon}
          </svg>
        </div>
        <div className="mono" style={{ color: 'var(--ink-300)', marginTop: 16, textAlign: 'center' }}>{s.n}</div>
      </div>
      <div>
        <h3 className="h3" style={{ marginBottom: 12 }}>{t(s.titleKey)}</h3>
        <p className="body" style={{ margin: 0 }}>{t(s.bodyKey)}</p>
        <div style={{ marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--navy-500)' }} />
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 500, color: 'var(--fg-1)' }}>{t(s.tagKey)}</span>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const t = useTranslations('Services');
  return (
    <section id="services" className="section" style={{ background: 'var(--paper)' }}>
      <div className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'end', marginBottom: 64 }}>
          <div>
            <div className="eyebrow"><span className="tick" />{t('eyebrow')}</div>
            <h2 className="h2" style={{ margin: '22px 0 0' }}>{t('title')}</h2>
          </div>
          <p className="body-lg" style={{ maxWidth: 500 }}>
            {t('lead')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {services.map((s, i) => (
            <ServiceCard key={i} s={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
