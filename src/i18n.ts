import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './i18n/en.json';
import fr from './i18n/fr.json';
import { DEFAULT_LOCALE, LOCALES } from './lib/localePath';

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        fr: { translation: fr },
      },
      lng: DEFAULT_LOCALE,
      fallbackLng: DEFAULT_LOCALE,
      supportedLngs: [...LOCALES],
      interpolation: { escapeValue: false },
      returnNull: false,
      react: { useSuspense: false },
    });
}

export default i18n;
