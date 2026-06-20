import { useTranslations } from 'next-intl';
import { img } from '@/lib/images';

const roleKeys = [
  { title: 'r1Title', body: 'r1Body' },
  { title: 'r2Title', body: 'r2Body' },
  { title: 'r3Title', body: 'r3Body' },
  { title: 'r4Title', body: 'r4Body' },
] as const;

export default function Team() {
  const t = useTranslations('Team');
  return (
    <section id="team" className="section" style={{ background: 'var(--paper)' }}>
      <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 80, alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <div className="imgwrap" style={{ aspectRatio: '5/4', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img('boardroom', 1200)} alt={t('imageAlt')} />
          </div>
          <div style={{
            position: 'absolute', bottom: -26, right: -26, background: 'var(--navy-900)', color: '#fff',
            borderRadius: 'var(--radius)', padding: '22px 26px', boxShadow: 'var(--shadow-lg)',
          }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 44, letterSpacing: '-0.02em', lineHeight: 1 }}>
              {t('badgeYears')}<span style={{ fontSize: 24 }}>{t('badgePlus')}</span>
            </div>
            <div className="small" style={{ color: 'var(--on-dark-2)', marginTop: 6, maxWidth: 150 }}>{t('badgeNote')}</div>
          </div>
        </div>

        <div>
          <div className="eyebrow"><span className="tick" />{t('eyebrow')}</div>
          <h2 className="h2" style={{ margin: '22px 0 0' }}>{t('title')}</h2>
          <p className="lead" style={{ margin: '24px 0 0', maxWidth: 540 }}>
            {t('lead')}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 40 }}>
            {roleKeys.map((p, i) => {
              const title = t(p.title);
              const initials = title
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2);
              return (
                <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '18px 0', borderTop: '1px solid var(--line)' }}>
                  <div style={{ width: 40, height: 40, flexShrink: 0, borderRadius: 999, border: '1.5px solid var(--navy-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-700)', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14 }}>
                    {initials}
                  </div>
                  <div>
                    <div className="h4" style={{ fontSize: 16 }}>{title}</div>
                    <div className="small" style={{ marginTop: 3 }}>{t(p.body)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
