import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { localeFromPathname } from '@/lib/localePath';

export default function LocaleSync() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const locale = localeFromPathname(pathname);

  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  return null;
}
