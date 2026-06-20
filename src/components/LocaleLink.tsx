import { forwardRef } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { localePath, type Locale } from '@/lib/localePath';

type Props = Omit<LinkProps, 'to'> & {
  to: string;
  locale?: Locale;
};

const LocaleLink = forwardRef<HTMLAnchorElement, Props>(function LocaleLink(
  { to, locale, ...rest },
  ref,
) {
  const { i18n } = useTranslation();
  const active = locale ?? ((i18n.language === 'fr' ? 'fr' : 'en') as Locale);
  return <Link ref={ref} to={localePath(to, active)} {...rest} />;
});

export default LocaleLink;
