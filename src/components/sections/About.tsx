import { useTranslation } from 'react-i18next';
import { img } from '@/lib/images';

const mandateKeys = [
  { title: 'About.mandate1Title', sub: 'About.mandate1Sub' },
  { title: 'About.mandate2Title', sub: 'About.mandate2Sub' },
  { title: 'About.mandate3Title', sub: 'About.mandate3Sub' },
] as const;

export default function About() {
  const { t } = useTranslation();
  return (
    <section id="about" className="section" style={{ background: 'var(--bone)' }}>
      <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
        <div>
          <div className="eyebrow"><span className="tick" />{t('About.eyebrow')}</div>
          <h2 className="h2" style={{ margin: '22px 0 0', color: 'var(--fg-1)' }}>
            {t('About.title')}
          </h2>
          <p className="lead" style={{ margin: '26px 0 0' }}>
            {t('About.lead')}
          </p>
          <p className="body-lg" style={{ margin: '22px 0 0' }}>
            {t('About.body')}
          </p>
          <div style={{ display: 'flex', gap: 40, marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--line)', flexWrap: 'wrap' }}>
            {mandateKeys.map((m, i) => (
              <div key={i}>
                <div className="h4" style={{ color: 'var(--navy-700)' }}>{t(m.title)}</div>
                <div className="small" style={{ color: 'var(--fg-3)', marginTop: 2 }}>{t(m.sub)}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <div className="imgwrap" style={{ aspectRatio: '4/5', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}>
            <img src={img('handshake', 1100)} alt={t('About.imageAlt')} />
          </div>
          <div style={{
            position: 'absolute', bottom: -28, left: -28, background: 'var(--paper)',
            borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)', padding: '20px 24px',
            border: '1px solid var(--line)', maxWidth: 270,
          }}>
            <div className="mono" style={{ color: 'var(--accent)', letterSpacing: '0.12em' }}>{t('About.headOffice')}</div>
            <div className="h4" style={{ marginTop: 8, color: 'var(--fg-1)' }}>{t('About.headOfficeCity')}</div>
            <div className="small" style={{ marginTop: 4 }}>{t('About.headOfficeNote')}</div>
          </div>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 96, height: 96, borderTop: '2px solid var(--navy-300)', borderRight: '2px solid var(--navy-300)', borderRadius: '0 16px 0 0', opacity: 0.6 }} />
        </div>
      </div>
    </section>
  );
}
