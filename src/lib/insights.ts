import fm from 'front-matter';
import { marked } from 'marked';
import type { ImageKey } from '@/lib/images';

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  tag: string;
  excerpt: string;
  hero: ImageKey | string;
  author?: string;
  readingMins: number;
};

export type Post = PostMeta & {
  content: string;
  html: string;
};

type FmResult = {
  attributes: {
    title?: string;
    date?: string | Date;
    tag?: string;
    excerpt?: string;
    hero?: string;
    author?: string;
  };
  body: string;
};

marked.setOptions({ gfm: true, breaks: false });

const modules = import.meta.glob('../content/insights/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function readingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

function toIsoDate(value: string | Date | undefined): string {
  if (!value) return '1970-01-01';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function fileToPost(path: string, raw: string): Post {
  const parsed = fm<FmResult['attributes']>(raw);
  const data = parsed.attributes;
  const slug = path.split('/').pop()!.replace(/\.md$/, '');
  return {
    slug,
    title: String(data.title ?? slug),
    date: toIsoDate(data.date),
    tag: String(data.tag ?? 'Insights'),
    excerpt: String(data.excerpt ?? ''),
    hero: String(data.hero ?? 'cityNight'),
    author: data.author ? String(data.author) : undefined,
    readingMins: readingMinutes(parsed.body),
    content: parsed.body,
    html: marked.parse(parsed.body) as string,
  };
}

const ALL_POSTS: Post[] = Object.entries(modules)
  .map(([path, raw]) => fileToPost(path, raw))
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function getAllPosts(): PostMeta[] {
  return ALL_POSTS.map(({ content: _c, html: _h, ...meta }) => {
    void _c;
    void _h;
    return meta;
  });
}

export function getPostBySlug(slug: string): Post | null {
  return ALL_POSTS.find((p) => p.slug === slug) ?? null;
}
