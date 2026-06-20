import { getTranslations, setRequestLocale } from 'next-intl/server';
import PageHero from '@/components/PageHero';
import Classes from '@/components/sections/Classes';
import CTAStrip from '@/components/CTAStrip';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Pages' });
  return { title: t('classesTitle') };
}

export default async function ClassesPage({
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
        crumb={t('classesCrumb')}
        eyebrow={t('classesHeroEyebrow')}
        imgKey="property"
        title={t('classesHeroTitle')}
        sub={t('classesHeroSub')}
      />
      <Classes />
      <CTAStrip sub={t('classesCtaSub')} />
    </>
  );
}
