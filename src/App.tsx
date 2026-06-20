import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import LocaleSync from '@/components/LocaleSync';
import { localeFromPathname } from '@/lib/localePath';

export default function App() {
  const { pathname } = useLocation();
  const locale = localeFromPathname(pathname);
  const { i18n } = useTranslation();
  // Sync language synchronously so the first render is in the correct locale (SSG-safe).
  if (i18n.language !== locale) {
    i18n.changeLanguage(locale);
  }

  return (
    <HelmetProvider>
      <Helmet htmlAttributes={{ lang: locale }} />
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
      <LocaleSync />
    </HelmetProvider>
  );
}
