import { useTranslation } from 'react-i18next';
import LocaleLink from '@/components/LocaleLink';

const cols = [
  {
    headingKey: 'Footer.company',
    items: [
      { labelKey: 'Footer.companyAbout', href: '/about' },
      { labelKey: 'Footer.companyServices', href: '/services' },
      { labelKey: 'Footer.companyCapacity', href: '/capacity' },
      { labelKey: 'Footer.companyTeam', href: '/team' },
      { labelKey: 'Footer.companyInsights', href: '/insights' },
    ],
  },
  {
    headingKey: 'Footer.classes',
    items: [
      { labelKey: 'Footer.classProperty', href: '/classes' },
      { labelKey: 'Footer.classEngineering', href: '/classes' },
      { labelKey: 'Footer.classMarine', href: '/classes' },
      { labelKey: 'Footer.classLiability', href: '/classes' },
      { labelKey: 'Footer.classPV', href: '/classes' },
      { labelKey: 'Footer.classEnergyMotor', href: '/classes' },
    ],
  },
  {
    headingKey: 'Footer.engage',
    items: [
      { labelKey: 'Footer.engageSpeak', href: '/contact' },
      { labelKey: 'Footer.engageRequest', href: '/contact' },
      { labelKey: 'Footer.engageBroker', href: '/contact' },
      { labelKey: 'Footer.engageClaims', href: '/contact' },
    ],
  },
] as const;

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: 'var(--navy-950)', color: 'var(--on-dark-2)' }}>
      <div className="wrap" style={{ padding: '72px 64px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 48 }}>
          <div>
            <img src="/brand/logo-anchor-white.svg" alt={t('Footer.logoAlt')} style={{ height: 34 }} />
            <p className="small" style={{ color: 'var(--on-dark-3)', margin: '22px 0 0', maxWidth: 320, lineHeight: 1.6 }}>
              {t('Footer.description')}
            </p>
            <a
              href="mailto:underwriting@anchorrisktransfer.com"
              className="mono"
              style={{ display: 'inline-block', color: 'var(--navy-300)', marginTop: 22, letterSpacing: '0.06em', textDecoration: 'none' }}
            >
              underwriting@anchorrisktransfer.com
            </a>
          </div>
          {cols.map((c, i) => (
            <div key={i}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--on-dark)', marginBottom: 18 }}>
                {t(c.headingKey)}
              </div>
              {c.items.map((it, j) => (
                <LocaleLink
                  key={j}
                  to={it.href}
                  style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--on-dark-2)', textDecoration: 'none', padding: '6px 0' }}
                >
                  {t(it.labelKey)}
                </LocaleLink>
              ))}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 56, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div className="mono" style={{ color: 'var(--on-dark-3)', letterSpacing: '0.04em' }}>
            {t('Footer.copyright', { year })}
          </div>
          <div style={{ display: 'flex', gap: 22 }}>
            <a href="#" className="small" style={{ color: 'var(--on-dark-3)', textDecoration: 'none' }}>{t('Footer.privacy')}</a>
            <a href="#" className="small" style={{ color: 'var(--on-dark-3)', textDecoration: 'none' }}>{t('Footer.terms')}</a>
            <a href="#" className="small" style={{ color: 'var(--on-dark-3)', textDecoration: 'none' }}>{t('Footer.regulatory')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
