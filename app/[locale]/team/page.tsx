import { getTranslations, setRequestLocale } from 'next-intl/server';
import PageHero from '@/components/PageHero';
import Team from '@/components/sections/Team';
import Values from '@/components/sections/Values';
import CTAStrip from '@/components/CTAStrip';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Pages' });
  return { title: t('teamTitle') };
}

export default async function TeamPage({
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
        crumb={t('teamCrumb')}
        eyebrow={t('teamHeroEyebrow')}
        imgKey="boardroom"
        title={t('teamHeroTitle')}
        sub={t('teamHeroSub')}
      />
      <Team />
      <Values />
      <CTAStrip sub={t('teamCtaSub')} />
    </>
  );
}
