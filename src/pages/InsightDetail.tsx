import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import LocaleLink from '@/components/LocaleLink';
import PageHero from '@/components/PageHero';
import CTAStrip from '@/components/CTAStrip';
import { getAllPosts, getPostBySlug } from '@/lib/insights';
import { img, type ImageKey } from '@/lib/images';
import NotFound from '@/pages/NotFound';

function fmtDate(iso: string, locale: string) {
  const tag = locale === 'fr' ? 'fr-FR' : 'en-GB';
  return new Date(iso).toLocaleDateString(tag, { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function InsightDetail() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : null;

  if (!post) return <NotFound />;

  const all = getAllPosts();
  const related = all.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <Helmet>
        <title>{`${post.title} — Anchor Risk Transfer`}</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>
      <PageHero
        crumb={post.tag}
        eyebrow={post.tag.toUpperCase()}
        imgKey={post.hero as ImageKey}
        title={post.title}
        sub={post.excerpt}
      />

      <section className="section" style={{ background: 'var(--paper)' }}>
        <div className="wrap" style={{ maxWidth: 820 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', paddingBottom: 28, borderBottom: '1px solid var(--line)', marginBottom: 40 }}>
            <span className="mono" style={{ color: 'var(--fg-3)' }}>{fmtDate(post.date, locale)}</span>
            <span style={{ width: 3, height: 3, borderRadius: 2, background: 'var(--ink-300)' }} />
            <span className="mono" style={{ color: 'var(--accent)' }}>{post.tag.toUpperCase()}</span>
            <span style={{ width: 3, height: 3, borderRadius: 2, background: 'var(--ink-300)' }} />
            <span className="mono" style={{ color: 'var(--fg-3)' }}>{post.readingMins} {t('Pages.insightMinRead')}</span>
            {post.author && (
              <>
                <span style={{ width: 3, height: 3, borderRadius: 2, background: 'var(--ink-300)' }} />
                <span className="mono" style={{ color: 'var(--fg-3)' }}>{t('Pages.insightBy')} {post.author.toUpperCase()}</span>
              </>
            )}
          </div>

          <article className="prose-anchor" dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="section" style={{ background: 'var(--bone)' }}>
          <div className="wrap">
            <div className="eyebrow"><span className="tick" />{t('Pages.insightRelated')}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 24, marginTop: 32 }}>
              {related.map((p) => (
                <LocaleLink
                  key={p.slug}
                  to={`/insights/${p.slug}`}
                  style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', overflow: 'hidden', textDecoration: 'none', display: 'block' }}
                >
                  <div className="imgwrap" style={{ aspectRatio: '16/10', position: 'relative' }}>
                    <img src={img(p.hero, 700)} alt="" />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(6,23,38,0.5), transparent 60%)' }} />
                  </div>
                  <div style={{ padding: 24 }}>
                    <div className="mono" style={{ color: 'var(--accent)' }}>{p.tag.toUpperCase()}</div>
                    <div className="h4" style={{ marginTop: 12 }}>{p.title}</div>
                    <div className="mono" style={{ marginTop: 14, color: 'var(--fg-3)' }}>{fmtDate(p.date, locale)} · {p.readingMins} {t('Pages.insightMin')}</div>
                  </div>
                </LocaleLink>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTAStrip sub={t('Pages.insightDetailCtaSub')} />
    </>
  );
}
