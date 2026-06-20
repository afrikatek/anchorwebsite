import { useTranslations } from 'next-intl';

const stepKeys = [
  { n: '01', title: 'step1Title', body: 'step1Body' },
  { n: '02', title: 'step2Title', body: 'step2Body' },
  { n: '03', title: 'step3Title', body: 'step3Body' },
  { n: '04', title: 'step4Title', body: 'step4Body' },
] as const;

export default function Claims() {
  const t = useTranslations('Claims');
  return (
    <section id="claims" className="section" style={{ background: 'var(--paper)' }}>
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

        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: 15, left: '6%', right: '6%', height: 1, background: 'var(--line-2)' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 28 }}>
            {stepKeys.map((s) => (
              <div key={s.n} style={{ position: 'relative' }}>
                <div style={{ width: 30, height: 30, borderRadius: 15, background: 'var(--navy-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 4, background: '#fff' }} />
                </div>
                <div className="mono" style={{ color: 'var(--accent)', marginTop: 20 }}>{s.n}</div>
                <h3 className="h4" style={{ margin: '8px 0 10px' }}>{t(s.title)}</h3>
                <p className="body" style={{ margin: 0, fontSize: 15 }}>{t(s.body)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
