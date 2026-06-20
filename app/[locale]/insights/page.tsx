import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import PageHero from '@/components/PageHero';
import CTAStrip from '@/components/CTAStrip';
import { getAllPosts } from '@/lib/insights';
import { img } from '@/lib/images';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Pages' });
  return { title: t('insightsTitle') };
}

function fmtDate(iso: string, locale: string) {
  const tag = locale === 'fr' ? 'fr-FR' : 'en-GB';
  return new Date(iso).toLocaleDateString(tag, { month: 'short', year: 'numeric' }).toUpperCase();
}

export default async function InsightsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Pages' });
  const tFeat = await getTranslations({ locale, namespace: 'InsightsTeaser' });

  const posts = await getAllPosts();
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <>
      <PageHero
        crumb={t('insightsCrumb')}
        eyebrow={t('insightsHeroEyebrow')}
        imgKey="cityNight"
        title={t('insightsHeroTitle')}
        sub={t('insightsHeroSub')}
      />

      <section className="section" style={{ background: 'var(--bone)' }}>
        <div className="wrap">
          {locale === 'fr' && (
            <div
              style={{
                background: 'var(--paper)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius)',
                padding: '14px 20px',
                marginBottom: 32,
                color: 'var(--fg-2)',
                fontFamily: 'var(--font-sans)',
                fontSize: 14,
              }}
            >
              {t('insightsFrenchNotice')}
            </div>
          )}
          {featured && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 32, marginBottom: 56 }}>
              <Link
                href={`/insights/${featured.slug}`}
                style={{ textDecoration: 'none', borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative', minHeight: 460, display: 'block' }}
              >
                <div className="imgwrap" style={{ position: 'absolute', inset: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img(featured.hero, 1400)} alt="" />
                </div>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(6,23,38,0.92) 8%, rgba(6,23,38,0.25) 60%)' }} />
                <div style={{ position: 'relative', height: '100%', minHeight: 460, padding: 44, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', color: '#fff' }}>
                  <div className="eyebrow eyebrow--light" style={{ color: 'var(--navy-200)' }}>
                    <span className="tick" />{tFeat('featured')} · {fmtDate(featured.date, locale)}
                  </div>
                  <h3 className="h2" style={{ color: '#fff', margin: '18px 0 14px', fontSize: 36, maxWidth: 560 }}>{featured.title}</h3>
                  <p className="body" style={{ color: 'var(--on-dark-2)', maxWidth: 520, margin: '0 0 20px' }}>{featured.excerpt}</p>
                  <span className="mono" style={{ color: 'var(--navy-200)', letterSpacing: '0.1em' }}>{tFeat('minRead', { n: featured.readingMins })}</span>
                </div>
              </Link>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="eyebrow"><span className="tick" />{t('insightsLatest')}</div>
                <div style={{ marginTop: 18 }}>
                  {rest.slice(0, 4).map((b, i) => (
                    <Link
                      key={b.slug}
                      href={`/insights/${b.slug}`}
                      style={{ display: 'block', padding: '20px 0', borderBottom: i < 3 ? '1px solid var(--line)' : 'none', textDecoration: 'none' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                        <span className="mono" style={{ color: 'var(--fg-3)' }}>{fmtDate(b.date, locale)}</span>
                        <span style={{ width: 3, height: 3, borderRadius: 2, background: 'var(--ink-300)' }} />
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--accent)' }}>{b.tag}</span>
                      </div>
                      <div className="h4" style={{ fontSize: 18, lineHeight: 1.3 }}>{b.title}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {rest.length > 4 && (
            <>
              <div className="eyebrow" style={{ marginBottom: 24 }}><span className="tick" />{t('insightsArchive')}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 24 }}>
                {rest.slice(4).map((p) => (
                  <Link
                    key={p.slug}
                    href={`/insights/${p.slug}`}
                    style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: 24, textDecoration: 'none', display: 'block' }}
                  >
                    <div className="mono" style={{ color: 'var(--accent)' }}>{p.tag.toUpperCase()}</div>
                    <div className="h4" style={{ marginTop: 12 }}>{p.title}</div>
                    <p className="small" style={{ marginTop: 10 }}>{p.excerpt}</p>
                    <div className="mono" style={{ marginTop: 18, color: 'var(--fg-3)' }}>{fmtDate(p.date, locale)} · {p.readingMins} {t('insightMin')}</div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {posts.length === 0 && (
            <p className="lead">{t('insightsEmpty')}</p>
          )}
        </div>
      </section>

      <CTAStrip
        title={t('insightsCtaTitle')}
        sub={t('insightsCtaSub')}
      />
    </>
  );
}
