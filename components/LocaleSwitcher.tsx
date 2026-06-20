'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onSwitch(next: Locale) {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div
      role="group"
      aria-label={t('label')}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'var(--font-mono)',
        fontSize: 11.5,
        letterSpacing: '0.04em',
        opacity: isPending ? 0.6 : 1,
      }}
    >
      {routing.locales.map((l, i) => {
        const active = l === locale;
        return (
          <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <button
              type="button"
              onClick={() => onSwitch(l)}
              aria-pressed={active}
              aria-label={l === 'fr' ? t('switchToFrench') : t('switchToEnglish')}
              style={{
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: active ? 'default' : 'pointer',
                color: active ? 'var(--on-dark)' : 'var(--on-dark-2)',
                fontWeight: active ? 700 : 500,
                fontFamily: 'inherit',
                fontSize: 'inherit',
                letterSpacing: 'inherit',
                textTransform: 'uppercase',
              }}
            >
              {t(l)}
            </button>
            {i < routing.locales.length - 1 && <span style={{ opacity: 0.4 }}>|</span>}
          </span>
        );
      })}
    </div>
  );
}
