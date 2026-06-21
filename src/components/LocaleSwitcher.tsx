import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { LOCALES, type Locale, localeFromPathname, localePath, stripLocale } from '@/lib/localePath';

export default function LocaleSwitcher() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const current = localeFromPathname(pathname);

  function onSwitch(next: Locale) {
    if (next === current) return;
    // Flip the language synchronously so every useTranslation subscriber
    // re-renders in the new locale before the URL change reaches them.
    // Resources are pre-bundled in src/i18n.ts, so this resolves instantly.
    void i18n.changeLanguage(next);
    const bare = stripLocale(pathname);
    navigate(localePath(bare, next), { replace: true });
  }

  return (
    <div
      role="group"
      aria-label={t('LocaleSwitcher.label')}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'var(--font-mono)',
        fontSize: 11.5,
        letterSpacing: '0.04em',
      }}
    >
      {LOCALES.map((l, i) => {
        const active = l === current;
        return (
          <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <button
              type="button"
              onClick={() => onSwitch(l)}
              aria-pressed={active}
              aria-label={l === 'fr' ? t('LocaleSwitcher.switchToFrench') : t('LocaleSwitcher.switchToEnglish')}
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
              {t(`LocaleSwitcher.${l}`)}
            </button>
            {i < LOCALES.length - 1 && <span style={{ opacity: 0.4 }}>|</span>}
          </span>
        );
      })}
    </div>
  );
}
