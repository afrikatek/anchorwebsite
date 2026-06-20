import { getTranslations, setRequestLocale } from 'next-intl/server';
import PageHero from '@/components/PageHero';
import Services from '@/components/sections/Services';
import Claims from '@/components/sections/Claims';
import Capacity from '@/components/sections/Capacity';
import CTAStrip from '@/components/CTAStrip';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Pages' });
  return { title: t('servicesTitle') };
}

export default async function ServicesPage({
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
        crumb={t('servicesCrumb')}
        eyebrow={t('servicesHeroEyebrow')}
        imgKey="opsroom"
        title={t('servicesHeroTitle')}
        sub={t('servicesHeroSub')}
      />
      <Services />
      <Claims />
      <Capacity
        images={[
          { key: 'marinePort', altKey: 'imgTradeAlt', captionKey: 'imgTrade' },
          { key: 'safari', altKey: 'imgSubSaharanAlt', captionKey: 'imgSubSaharan' },
        ]}
      />
      <CTAStrip sub={t('servicesCtaSub')} />
    </>
  );
}
