import { useTranslation } from 'react-i18next';
import LocaleLink from '@/components/LocaleLink';
import { img } from '@/lib/images';
import { getAllPosts } from '@/lib/insights';

function fmtDate(iso: string, locale: string) {
  const tag = locale === 'fr' ? 'fr-FR' : 'en-GB';
  return new Date(iso).toLocaleDateString(tag, { month: 'short', year: 'numeric' }).toUpperCase();
}

export default function InsightsTeaser() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const posts = getAllPosts();
  if (posts.length === 0) {
    return null;
  }
  const featured = posts[0];
  const rest = posts.slice(1, 5);

  return (
    <section id="insights" className="section" style={{ background: 'var(--bone)' }}>
      <div className="wrap">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 44, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="eyebrow"><span className="tick" />{t('InsightsTeaser.eyebrow')}</div>
            <h2 className="h2" style={{ margin: '22px 0 0' }}>{t('InsightsTeaser.title')}</h2>
          </div>
          <LocaleLink to="/insights" className="link">{t('InsightsTeaser.viewAll')}</LocaleLink>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 32 }}>
          <LocaleLink
            to={`/insights/${featured.slug}`}
            style={{ textDecoration: 'none', borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative', minHeight: 440, display: 'block' }}
          >
            <div className="imgwrap" style={{ position: 'absolute', inset: 0 }}>
              <img src={img(featured.hero, 1400)} alt="" style={{ transition: 'transform 700ms var(--ease)' }} />
            </div>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(6,23,38,0.92) 8%, rgba(6,23,38,0.25) 60%)' }} />
            <div style={{ position: 'relative', height: '100%', minHeight: 440, padding: 44, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', color: '#fff' }}>
              <div className="eyebrow eyebrow--light" style={{ color: 'var(--navy-200)' }}>
                <span className="tick" />{t('InsightsTeaser.featured')} · {fmtDate(featured.date, locale)}
              </div>
              <h3 className="h2" style={{ color: '#fff', margin: '18px 0 14px', fontSize: 36, maxWidth: 560 }}>
                {featured.title}
              </h3>
              <p className="body" style={{ color: 'var(--on-dark-2)', maxWidth: 520, margin: '0 0 20px' }}>
                {featured.excerpt}
              </p>
              <span className="mono" style={{ color: 'var(--navy-200)', letterSpacing: '0.1em' }}>
                {t('InsightsTeaser.minRead', { n: featured.readingMins })}
              </span>
            </div>
          </LocaleLink>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {rest.map((b, i) => (
              <LocaleLink
                key={b.slug}
                to={`/insights/${b.slug}`}
                style={{ display: 'block', padding: '22px 0', borderBottom: i < rest.length - 1 ? '1px solid var(--line)' : 'none', textDecoration: 'none', transition: 'transform 200ms var(--ease)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span className="mono" style={{ color: 'var(--fg-3)' }}>{fmtDate(b.date, locale)}</span>
                  <span style={{ width: 3, height: 3, borderRadius: 2, background: 'var(--ink-300)' }} />
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--accent)' }}>{b.tag}</span>
                  <span style={{ width: 3, height: 3, borderRadius: 2, background: 'var(--ink-300)' }} />
                  <span className="small" style={{ color: 'var(--fg-3)' }}>{t('InsightsTeaser.minShort', { n: b.readingMins })}</span>
                </div>
                <div className="h4" style={{ fontSize: 19, lineHeight: 1.3 }}>{b.title}</div>
              </LocaleLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
