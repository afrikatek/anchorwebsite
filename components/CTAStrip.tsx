import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

type Props = { title?: string; sub?: string };

export default function CTAStrip({ title, sub }: Props) {
  const t = useTranslations('CTAStrip');
  return (
    <section style={{ background: 'var(--navy-900)', color: 'var(--on-dark)' }}>
      <div className="wrap" style={{ padding: '64px 64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap' }}>
        <div style={{ maxWidth: 660 }}>
          <h2 className="h2" style={{ color: '#fff' }}>
            {title || (
              <>
                {t('defaultTitleStart')}{' '}
                <span className="serif" style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--navy-200)' }}>
                  {t('defaultTitleEnd')}
                </span>
              </>
            )}
          </h2>
          {sub && <p className="lead" style={{ color: 'var(--on-dark-2)', margin: '12px 0 0' }}>{sub}</p>}
        </div>
        <Link href="/contact" className="btn btn-light">{t('cta')}</Link>
      </div>
    </section>
  );
}
