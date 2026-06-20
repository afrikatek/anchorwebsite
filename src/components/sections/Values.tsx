import { useTranslation } from 'react-i18next';

const valueKeys = [
  { title: 'Values.v1Title', body: 'Values.v1Body' },
  { title: 'Values.v2Title', body: 'Values.v2Body' },
  { title: 'Values.v3Title', body: 'Values.v3Body' },
  { title: 'Values.v4Title', body: 'Values.v4Body' },
  { title: 'Values.v5Title', body: 'Values.v5Body' },
  { title: 'Values.v6Title', body: 'Values.v6Body' },
  { title: 'Values.v7Title', body: 'Values.v7Body' },
] as const;

export default function Values() {
  const { t } = useTranslation();
  return (
    <section className="section" style={{ background: 'var(--bone)' }}>
      <div className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'end', marginBottom: 56 }}>
          <div>
            <div className="eyebrow"><span className="tick" />{t('Values.eyebrow')}</div>
            <h2 className="h2" style={{ margin: '22px 0 0' }}>{t('Values.title')}</h2>
          </div>
          <p className="lead" style={{ maxWidth: 500, margin: 0 }}>
            {t('Values.lead')}
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
              {t('Values.tagline')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
