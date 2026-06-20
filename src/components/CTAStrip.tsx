import { useTranslation } from 'react-i18next';
import LocaleLink from '@/components/LocaleLink';

type Props = { title?: string; sub?: string };

export default function CTAStrip({ title, sub }: Props) {
  const { t } = useTranslation();
  return (
    <section style={{ background: 'var(--navy-900)', color: 'var(--on-dark)' }}>
      <div className="wrap" style={{ padding: '64px 64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap' }}>
        <div style={{ maxWidth: 660 }}>
          <h2 className="h2" style={{ color: '#fff' }}>
            {title || (
              <>
                {t('CTAStrip.defaultTitleStart')}{' '}
                <span className="serif" style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--navy-200)' }}>
                  {t('CTAStrip.defaultTitleEnd')}
                </span>
              </>
            )}
          </h2>
          {sub && <p className="lead" style={{ color: 'var(--on-dark-2)', margin: '12px 0 0' }}>{sub}</p>}
        </div>
        <LocaleLink to="/contact" className="btn btn-light">{t('CTAStrip.cta')}</LocaleLink>
      </div>
    </section>
  );
}
