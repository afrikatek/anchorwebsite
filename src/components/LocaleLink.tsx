import { forwardRef } from 'react';
import { Link, type LinkProps, useLocation } from 'react-router-dom';
import { localeFromPathname, localePath, type Locale } from '@/lib/localePath';

type Props = Omit<LinkProps, 'to'> & {
  to: string;
  locale?: Locale;
};

// Locale is derived from the URL, not from i18n.language. The URL is the
// single source of truth: it's stable across renders, can't lag behind
// state updates, and the prerendered SSG HTML already reflects it.
const LocaleLink = forwardRef<HTMLAnchorElement, Props>(function LocaleLink(
  { to, locale, ...rest },
  ref,
) {
  const { pathname } = useLocation();
  const active = locale ?? localeFromPathname(pathname);
  return <Link ref={ref} to={localePath(to, active)} {...rest} />;
});

export default LocaleLink;
