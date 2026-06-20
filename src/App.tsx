import { Outlet, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import LocaleSync from '@/components/LocaleSync';
import { localeFromPathname } from '@/lib/localePath';

// HelmetProvider is supplied by vite-react-ssg around RouterProvider
// (see node_modules/vite-react-ssg/dist/index.mjs). Don't nest a second one.
// Language is pre-set in main.tsx's setup hook; LocaleSync handles in-app
// route changes after mount.
export default function App() {
  const { pathname } = useLocation();
  const locale = localeFromPathname(pathname);
  return (
    <>
      <Helmet htmlAttributes={{ lang: locale }} />
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
      <LocaleSync />
    </>
  );
}
