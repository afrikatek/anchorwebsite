import { useTranslations } from 'next-intl';

const chipKeys = ['chip1', 'chip2', 'chip3', 'chip4'] as const;

export default function TrustBand() {
  const t = useTranslations('TrustBand');
  return (
    <section style={{ background: 'var(--navy-950)', color: 'var(--on-dark-2)' }}>
      <div className="wrap" style={{ padding: '34px 64px', display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 19, color: 'var(--on-dark)', maxWidth: 340, lineHeight: 1.4 }}>
          {t('lead')}
        </div>
        <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'flex-end' }}>
          {chipKeys.map((k) => (
            <span key={k} style={{
              fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: 'var(--on-dark)',
              border: '1px solid rgba(255,255,255,0.16)', borderRadius: 999, padding: '8px 16px',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: 3, background: 'var(--navy-300)' }} />{t(k)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
