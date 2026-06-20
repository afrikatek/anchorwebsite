import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { img } from '@/lib/images';

const statKeys = [
  { n: 'stat1Number', l: 'stat1Label' },
  { n: 'stat2Number', l: 'stat2Label' },
  { n: 'stat3Number', l: 'stat3Label' },
  { n: 'stat4Number', l: 'stat4Label' },
] as const;

export default function Hero() {
  const t = useTranslations('Hero');
  return (
    <section id="top" style={{ position: 'relative', background: 'var(--navy-900)', color: 'var(--on-dark)', overflow: 'hidden' }}>
      <div className="imgwrap" style={{ position: 'absolute', inset: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img('joburg', 2000)} alt={t('imageAlt')} style={{ opacity: 0.55 }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(6,23,38,0.96) 0%, rgba(10,37,64,0.82) 42%, rgba(10,37,64,0.30) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(6,23,38,0.85) 0%, transparent 36%)' }} />

      <div className="wrap" style={{ position: 'relative', paddingTop: 128, paddingBottom: 0 }}>
        <div style={{ maxWidth: 780 }}>
          <div className="eyebrow eyebrow--light"><span className="tick" />{t('eyebrow')}</div>
          <h1 className="display" style={{ color: '#fff', margin: '26px 0 0' }}>
            {t('titleLine1')}
            <br />
            <span className="serif" style={{ fontWeight: 400, fontStyle: 'italic', color: 'var(--navy-200)' }}>{t('titleLine2')}</span>
          </h1>
          <p className="lead" style={{ color: 'var(--on-dark-2)', maxWidth: 600, margin: '28px 0 0', fontSize: 23 }}>
            {t('lead')}
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 40, flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-light">{t('ctaPrimary')}</Link>
            <Link href="/services" className="btn btn-ghost-dark">{t('ctaSecondary')}</Link>
          </div>
        </div>

        <div style={{
          marginTop: 96, borderTop: '1px solid rgba(255,255,255,0.14)',
          display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))',
        }}>
          {statKeys.map((s, i) => (
            <div key={i} style={{ padding: '30px 28px 36px', borderLeft: i ? '1px solid rgba(255,255,255,0.10)' : 'none' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 40, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1 }}>{t(s.n)}</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--on-dark-2)', marginTop: 12, lineHeight: 1.45, maxWidth: 210 }}>{t(s.l)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
