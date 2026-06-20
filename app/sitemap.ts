import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getAllPosts } from '@/lib/insights';

const BASE = 'https://anchorrisktransfer.com';

const staticPaths = ['', '/about', '/services', '/classes', '/capacity', '/team', '/contact', '/insights'];

function localePath(locale: string, path: string) {
  if (locale === routing.defaultLocale) {
    return `${BASE}${path}`;
  }
  return `${BASE}/${locale}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const entries: MetadataRoute.Sitemap = [];

  for (const path of staticPaths) {
    entries.push({
      url: localePath(routing.defaultLocale, path),
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, localePath(l, path)])),
      },
    });
  }

  for (const post of posts) {
    const path = `/insights/${post.slug}`;
    entries.push({
      url: localePath(routing.defaultLocale, path),
      lastModified: post.date,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, localePath(l, path)])),
      },
    });
  }

  return entries;
}
