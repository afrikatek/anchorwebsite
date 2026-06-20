import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('Pages');
  return (
    <section className="section" style={{ background: 'var(--bone)', minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
      <div className="wrap" style={{ textAlign: 'center' }}>
        <div className="eyebrow" style={{ justifyContent: 'center' }}><span className="tick" />404</div>
        <h1 className="h1" style={{ margin: '22px 0 12px' }}>{t('notFoundHeading')}</h1>
        <p className="lead" style={{ margin: '0 auto 32px', maxWidth: 540 }}>
          {t('notFoundBody')}
        </p>
        <Link href="/" className="btn btn-primary">{t('notFoundCta')}</Link>
      </div>
    </section>
  );
}
