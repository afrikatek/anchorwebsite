import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import LocaleLink from '@/components/LocaleLink';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import { stripLocale } from '@/lib/localePath';

const linkDefs = [
  { key: 'about', href: '/about', id: 'about' },
  { key: 'services', href: '/services', id: 'services' },
  { key: 'classes', href: '/classes', id: 'classes' },
  { key: 'capacity', href: '/capacity', id: 'capacity' },
  { key: 'insights', href: '/insights', id: 'insights' },
  { key: 'team', href: '/team', id: 'team' },
] as const;

export default function Nav() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const bare = stripLocale(pathname);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const f = () => setScrolled(window.scrollY > 8);
    f();
    window.addEventListener('scroll', f);
    return () => window.removeEventListener('scroll', f);
  }, []);

  const active = linkDefs.find((l) => bare === l.href || bare.startsWith(`${l.href}/`))?.id ?? '';

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      {/* utility bar */}
      <div style={{ background: 'var(--navy-950)', color: 'var(--on-dark-2)' }}>
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 38, fontSize: 12.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-sans)' }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--navy-400)', boxShadow: '0 0 8px var(--navy-400)' }} />
            <span style={{ color: 'var(--on-dark)' }}>{t('Nav.utilityLicense')}</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span style={{ opacity: 0.85 }}>{t('Nav.utilityLocation')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: 'var(--font-mono)', fontSize: 11.5, letterSpacing: '0.02em' }}>
            <a href="mailto:underwriting@anchorrisktransfer.com" style={{ color: 'var(--on-dark-2)', textDecoration: 'none' }}>
              underwriting@anchorrisktransfer.com
            </a>
            <span style={{ opacity: 0.4 }}>|</span>
            <span>{t('Nav.utilityRating')}</span>
            <span style={{ opacity: 0.4 }}>|</span>
            <LocaleSwitcher />
          </div>
        </div>
      </div>

      {/* main nav */}
      <nav
        style={{
          background: scrolled ? 'rgba(255,255,255,0.94)' : 'var(--paper)',
          backdropFilter: scrolled ? 'saturate(180%) blur(12px)' : 'none',
          borderBottom: '1px solid var(--line)',
          transition: 'background 200ms var(--ease)',
        }}
      >
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 76 }}>
          <LocaleLink to="/" style={{ display: 'flex', alignItems: 'center', gap: 13, textDecoration: 'none' }}>
            <img src="/brand/logo-anchor-navy.svg" alt={t('Nav.logoAlt')} style={{ height: 33 }} />
            <span style={{ width: 1, height: 26, background: 'var(--line-2)' }} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink-500)', lineHeight: 1.25, whiteSpace: 'pre-line' }}>
              {t('Nav.logoTagline')}
            </span>
          </LocaleLink>

          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {linkDefs.map((l) => {
              const on = active === l.id;
              return (
                <LocaleLink
                  key={l.id}
                  to={l.href}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 14,
                    textDecoration: 'none',
                    fontWeight: 500,
                    color: on ? 'var(--navy-800)' : 'var(--fg-1)',
                    padding: '9px 14px',
                    borderRadius: 6,
                    background: on ? 'var(--navy-50)' : 'transparent',
                    transition: 'background 120ms',
                  }}
                  onMouseEnter={(e) => {
                    if (!on) (e.currentTarget as HTMLElement).style.background = 'var(--navy-50)';
                  }}
                  onMouseLeave={(e) => {
                    if (!on) (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  {t(`Nav.${l.key}`)}
                </LocaleLink>
              );
            })}
          </div>

          <LocaleLink to="/contact" className="btn btn-primary" style={{ padding: '11px 20px', fontSize: 14 }}>
            {t('Nav.cta')}
          </LocaleLink>
        </div>
      </nav>
    </div>
  );
}
