export type Locale = 'en' | 'fr';

export const LOCALES: readonly Locale[] = ['en', 'fr'] as const;
export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(value: string | undefined | null): value is Locale {
  return value === 'en' || value === 'fr';
}

export function localePath(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean;
  if (clean === '/') return `/${locale}`;
  return `/${locale}${clean}`;
}

export function localeFromPathname(pathname: string): Locale {
  if (pathname === '/fr' || pathname.startsWith('/fr/')) return 'fr';
  return 'en';
}

export function stripLocale(pathname: string): string {
  if (pathname === '/fr') return '/';
  if (pathname.startsWith('/fr/')) return pathname.slice(3) || '/';
  return pathname || '/';
}
