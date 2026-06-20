'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import LocaleSwitcher from '@/components/LocaleSwitcher';

const linkDefs = [
  { key: 'about', href: '/about', id: 'about' },
  { key: 'services', href: '/services', id: 'services' },
  { key: 'classes', href: '/classes', id: 'classes' },
  { key: 'capacity', href: '/capacity', id: 'capacity' },
  { key: 'insights', href: '/insights', id: 'insights' },
  { key: 'team', href: '/team', id: 'team' },
] as const;

export default function Nav() {
  const t = useTranslations('Nav');
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', f);
    return () => window.removeEventListener('scroll', f);
  }, []);

  const active = linkDefs.find((l) => pathname?.startsWith(l.href))?.id ?? '';

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      {/* utility bar */}
      <div style={{ background: 'var(--navy-950)', color: 'var(--on-dark-2)' }}>
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 38, fontSize: 12.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-sans)' }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--navy-400)', boxShadow: '0 0 8px var(--navy-400)' }} />
            <span style={{ color: 'var(--on-dark)' }}>{t('utilityLicense')}</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span style={{ opacity: 0.85 }}>{t('utilityLocation')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: 'var(--font-mono)', fontSize: 11.5, letterSpacing: '0.02em' }}>
            <a href="mailto:underwriting@anchorrisktransfer.com" style={{ color: 'var(--on-dark-2)', textDecoration: 'none' }}>
              underwriting@anchorrisktransfer.com
            </a>
            <span style={{ opacity: 0.4 }}>|</span>
            <span>{t('utilityRating')}</span>
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
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 13, textDecoration: 'none' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-anchor-navy.svg" alt={t('logoAlt')} style={{ height: 33 }} />
            <span style={{ width: 1, height: 26, background: 'var(--line-2)' }} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink-500)', lineHeight: 1.25, whiteSpace: 'pre-line' }}>
              {t('logoTagline')}
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {linkDefs.map((l) => {
              const on = active === l.id;
              return (
                <Link
                  key={l.id}
                  href={l.href}
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
                  {t(l.key)}
                </Link>
              );
            })}
          </div>

          <Link href="/contact" className="btn btn-primary" style={{ padding: '11px 20px', fontSize: 14 }}>
            {t('cta')}
          </Link>
        </div>
      </nav>
    </div>
  );
}
