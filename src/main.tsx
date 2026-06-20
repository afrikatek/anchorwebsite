import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './routes';
import i18n from './i18n';
import { localeFromPathname } from './lib/localePath';
import './styles/globals.css';

// The second argument to ViteReactSSG runs before the React tree mounts —
// both during SSG build (per route) and on initial client render. We use it
// to pre-set i18n.language from the URL so the very first render is in the
// correct locale (no FOUC, SSG output is consistent with the body content).
export const createRoot = ViteReactSSG({ routes }, async (ctx) => {
  const pathname =
    ctx.routePath ?? (typeof window !== 'undefined' ? window.location.pathname : '/');
  const locale = localeFromPathname(pathname);
  if (i18n.language !== locale) {
    await i18n.changeLanguage(locale);
  }
});
