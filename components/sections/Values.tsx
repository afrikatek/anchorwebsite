import { useTranslations } from 'next-intl';

const valueKeys = [
  { title: 'v1Title', body: 'v1Body' },
  { title: 'v2Title', body: 'v2Body' },
  { title: 'v3Title', body: 'v3Body' },
  { title: 'v4Title', body: 'v4Body' },
  { title: 'v5Title', body: 'v5Body' },
  { title: 'v6Title', body: 'v6Body' },
  { title: 'v7Title', body: 'v7Body' },
] as const;

export default function Values() {
  const t = useTranslations('Values');
  return (
    <section className="section" style={{ background: 'var(--bone)' }}>
      <div className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'end', marginBottom: 56 }}>
          <div>
            <div className="eyebrow"><span className="tick" />{t('eyebrow')}</div>
            <h2 className="h2" style={{ margin: '22px 0 0' }}>{t('title')}</h2>
          </div>
          <p className="lead" style={{ maxWidth: 500, margin: 0 }}>
            {t('lead')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 16 }}>
          {valueKeys.map((v, i) => (
            <div key={i} style={{
              background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--radius)',
              padding: '26px 24px 28px', minHeight: 150, display: 'flex', flexDirection: 'column',
            }}>
              <div className="mono" style={{ color: 'var(--ink-300)' }}>{String(i + 1).padStart(2, '0')}</div>
              <h3 className="h4" style={{ margin: '16px 0 8px', color: 'var(--navy-800)' }}>{t(v.title)}</h3>
              <p className="small" style={{ margin: 0 }}>{t(v.body)}</p>
            </div>
          ))}
          <div style={{
            background: 'var(--navy-900)', borderRadius: 'var(--radius)', padding: '26px 24px',
            display: 'flex', alignItems: 'flex-end', minHeight: 150,
          }}>
            <div className="serif" style={{ fontStyle: 'italic', fontSize: 20, lineHeight: 1.35, color: '#fff' }}>
              {t('tagline')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
