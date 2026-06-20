import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
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
};

const INSIGHTS_DIR = path.join(process.cwd(), 'content', 'insights');

async function readAllFiles(): Promise<string[]> {
  try {
    const entries = await fs.readdir(INSIGHTS_DIR);
    return entries.filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));
  } catch {
    return [];
  }
}

function parseFile(file: string, raw: string): Post {
  const { data, content } = matter(raw);
  const slug = file.replace(/\.mdx?$/, '');
  const stats = readingTime(content);
  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? '1970-01-01'),
    tag: String(data.tag ?? 'Insights'),
    excerpt: String(data.excerpt ?? ''),
    hero: String(data.hero ?? 'cityNight'),
    author: data.author ? String(data.author) : undefined,
    readingMins: Math.max(1, Math.round(stats.minutes)),
    content,
  };
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const files = await readAllFiles();
  const posts = await Promise.all(
    files.map(async (f) => {
      const raw = await fs.readFile(path.join(INSIGHTS_DIR, f), 'utf8');
      const { content: _content, ...meta } = parseFile(f, raw);
      void _content;
      return meta;
    }),
  );
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const files = await readAllFiles();
  const file = files.find((f) => f.replace(/\.mdx?$/, '') === slug);
  if (!file) return null;
  const raw = await fs.readFile(path.join(INSIGHTS_DIR, file), 'utf8');
  return parseFile(file, raw);
}
