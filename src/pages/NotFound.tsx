import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import LocaleLink from '@/components/LocaleLink';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{`${t('Pages.notFoundTitle')} — Anchor Risk Transfer`}</title>
      </Helmet>
      <section className="section" style={{ background: 'var(--bone)', minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="wrap" style={{ textAlign: 'center' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}><span className="tick" />404</div>
          <h1 className="h1" style={{ margin: '22px 0 12px' }}>{t('Pages.notFoundHeading')}</h1>
          <p className="lead" style={{ margin: '0 auto 32px', maxWidth: 540 }}>
            {t('Pages.notFoundBody')}
          </p>
          <LocaleLink to="/" className="btn btn-primary">{t('Pages.notFoundCta')}</LocaleLink>
        </div>
      </section>
    </>
  );
}
