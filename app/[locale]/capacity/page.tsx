import { getTranslations, setRequestLocale } from 'next-intl/server';
import PageHero from '@/components/PageHero';
import Capacity from '@/components/sections/Capacity';
import TrustBand from '@/components/sections/TrustBand';
import CTAStrip from '@/components/CTAStrip';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Pages' });
  return { title: t('capacityTitle') };
}

export default async function CapacityPage({
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
        crumb={t('capacityCrumb')}
        eyebrow={t('capacityHeroEyebrow')}
        imgKey="coast"
        title={t('capacityHeroTitle')}
        sub={t('capacityHeroSub')}
      />
      <TrustBand />
      <Capacity />
      <CTAStrip sub={t('capacityCtaSub')} />
    </>
  );
}
