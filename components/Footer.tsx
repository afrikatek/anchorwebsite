import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const cols = [
  {
    headingKey: 'company',
    items: [
      { labelKey: 'companyAbout', href: '/about' },
      { labelKey: 'companyServices', href: '/services' },
      { labelKey: 'companyCapacity', href: '/capacity' },
      { labelKey: 'companyTeam', href: '/team' },
      { labelKey: 'companyInsights', href: '/insights' },
    ],
  },
  {
    headingKey: 'classes',
    items: [
      { labelKey: 'classProperty', href: '/classes' },
      { labelKey: 'classEngineering', href: '/classes' },
      { labelKey: 'classMarine', href: '/classes' },
      { labelKey: 'classLiability', href: '/classes' },
      { labelKey: 'classPV', href: '/classes' },
      { labelKey: 'classEnergyMotor', href: '/classes' },
    ],
  },
  {
    headingKey: 'engage',
    items: [
      { labelKey: 'engageSpeak', href: '/contact' },
      { labelKey: 'engageRequest', href: '/contact' },
      { labelKey: 'engageBroker', href: '/contact' },
      { labelKey: 'engageClaims', href: '/contact' },
    ],
  },
] as const;

export default function Footer() {
  const t = useTranslations('Footer');
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: 'var(--navy-950)', color: 'var(--on-dark-2)' }}>
      <div className="wrap" style={{ padding: '72px 64px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 48 }}>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-anchor-white.svg" alt={t('logoAlt')} style={{ height: 34 }} />
            <p className="small" style={{ color: 'var(--on-dark-3)', margin: '22px 0 0', maxWidth: 320, lineHeight: 1.6 }}>
              {t('description')}
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
                <Link
                  key={j}
                  href={it.href}
                  style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--on-dark-2)', textDecoration: 'none', padding: '6px 0' }}
                >
                  {t(it.labelKey)}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 56, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div className="mono" style={{ color: 'var(--on-dark-3)', letterSpacing: '0.04em' }}>
            {t('copyright', { year })}
          </div>
          <div style={{ display: 'flex', gap: 22 }}>
            <a href="#" className="small" style={{ color: 'var(--on-dark-3)', textDecoration: 'none' }}>{t('privacy')}</a>
            <a href="#" className="small" style={{ color: 'var(--on-dark-3)', textDecoration: 'none' }}>{t('terms')}</a>
            <a href="#" className="small" style={{ color: 'var(--on-dark-3)', textDecoration: 'none' }}>{t('regulatory')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
