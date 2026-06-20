import { getTranslations, setRequestLocale } from 'next-intl/server';
import PageHero from '@/components/PageHero';
import About from '@/components/sections/About';
import Values from '@/components/sections/Values';
import Team from '@/components/sections/Team';
import CTAStrip from '@/components/CTAStrip';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Pages' });
  return { title: t('aboutTitle') };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Pages' });
  return (
    <>
      <PageHero
        crumb={t('aboutCrumb')}
        eyebrow={t('aboutHeroEyebrow')}
        imgKey="handshake"
        title={t('aboutHeroTitle')}
        sub={t('aboutHeroSub')}
      />
      <About />
      <Values />
      <Team />
      <CTAStrip sub={t('aboutCtaSub')} />
    </>
  );
}
