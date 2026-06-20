import { useTranslation } from 'react-i18next';
import ContactForm from '@/components/ContactForm';
import { img, type ImageKey } from '@/lib/images';

type Props = { bgKey?: ImageKey };

export default function ContactSection({ bgKey = 'capetown' }: Props = {}) {
  const { t } = useTranslation();
  return (
    <section id="contact" style={{ background: 'var(--navy-900)', color: 'var(--on-dark)', position: 'relative', overflow: 'hidden' }}>
      <div className="imgwrap" style={{ position: 'absolute', inset: 0 }}>
        <img src={img(bgKey, 1800)} alt="" style={{ opacity: 0.22 }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(6,23,38,0.96), rgba(10,37,64,0.86))' }} />

      <div className="wrap" style={{ position: 'relative', padding: '110px 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 72, alignItems: 'flex-start' }}>
          <div>
            <div className="eyebrow eyebrow--light"><span className="tick" />{t('ContactSection.eyebrow')}</div>
            <h2 className="h1" style={{ color: '#fff', margin: '22px 0 0', maxWidth: 540 }}>
              {t('ContactSection.titleStart')}{' '}
              <span className="serif" style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--navy-200)' }}>
                {t('ContactSection.titleEnd')}
              </span>
            </h2>
            <p className="lead" style={{ color: 'var(--on-dark-2)', margin: '24px 0 48px', maxWidth: 480 }}>
              {t('ContactSection.lead')}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, maxWidth: 540 }}>
              <div style={{ paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.16)' }}>
                <div className="mono" style={{ color: 'var(--navy-200)', letterSpacing: '0.12em', marginBottom: 10 }}>{t('ContactSection.headOffice')}</div>
                <div className="body" style={{ color: 'var(--on-dark)', margin: 0, fontSize: 15, whiteSpace: 'pre-line' }}>
                  {t('ContactSection.address')}
                </div>
              </div>
              <div style={{ paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.16)' }}>
                <div className="mono" style={{ color: 'var(--navy-200)', letterSpacing: '0.12em', marginBottom: 10 }}>{t('ContactSection.underwriting')}</div>
                <a href="mailto:underwriting@anchorrisktransfer.com" style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--on-dark)', textDecoration: 'none', wordBreak: 'break-word' }}>
                  underwriting@anchorrisktransfer.com
                </a>
                <div className="small" style={{ color: 'var(--on-dark-3)', marginTop: 10 }}>
                  {t('ContactSection.underwritingNote')}
                </div>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
