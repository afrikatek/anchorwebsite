import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { Link } from '@/i18n/navigation';
import PageHero from '@/components/PageHero';
import CTAStrip from '@/components/CTAStrip';
import { routing } from '@/i18n/routing';
import { getAllPosts, getPostBySlug } from '@/lib/insights';
import { img, type ImageKey } from '@/lib/images';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return routing.locales.flatMap((locale) => posts.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'Pages' });
  const post = await getPostBySlug(slug);
  if (!post) return { title: t('insightNotFound') };
  return { title: post.title, description: post.excerpt };
}

function fmtDate(iso: string, locale: string) {
  const tag = locale === 'fr' ? 'fr-FR' : 'en-GB';
  return new Date(iso).toLocaleDateString(tag, { day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function InsightPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Pages' });

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const all = await getAllPosts();
  const related = all.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
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
            <span className="mono" style={{ color: 'var(--fg-3)' }}>{post.readingMins} {t('insightMinRead')}</span>
            {post.author && (
              <>
                <span style={{ width: 3, height: 3, borderRadius: 2, background: 'var(--ink-300)' }} />
                <span className="mono" style={{ color: 'var(--fg-3)' }}>{t('insightBy')} {post.author.toUpperCase()}</span>
              </>
            )}
          </div>

          <article className="prose-anchor">
            <MDXRemote
              source={post.content}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }}
            />
          </article>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section" style={{ background: 'var(--bone)' }}>
          <div className="wrap">
            <div className="eyebrow"><span className="tick" />{t('insightRelated')}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 24, marginTop: 32 }}>
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/insights/${p.slug}`}
                  style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', overflow: 'hidden', textDecoration: 'none', display: 'block' }}
                >
                  <div className="imgwrap" style={{ aspectRatio: '16/10', position: 'relative' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img(p.hero, 700)} alt="" />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(6,23,38,0.5), transparent 60%)' }} />
                  </div>
                  <div style={{ padding: 24 }}>
                    <div className="mono" style={{ color: 'var(--accent)' }}>{p.tag.toUpperCase()}</div>
                    <div className="h4" style={{ marginTop: 12 }}>{p.title}</div>
                    <div className="mono" style={{ marginTop: 14, color: 'var(--fg-3)' }}>{fmtDate(p.date, locale)} · {p.readingMins} {t('insightMin')}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTAStrip sub={t('insightDetailCtaSub')} />
    </>
  );
}
