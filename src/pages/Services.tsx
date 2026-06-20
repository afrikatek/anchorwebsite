import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import PageHero from '@/components/PageHero';
import Services from '@/components/sections/Services';
import Claims from '@/components/sections/Claims';
import Capacity from '@/components/sections/Capacity';
import CTAStrip from '@/components/CTAStrip';

export default function ServicesPage() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{`${t('Pages.servicesTitle')} — Anchor Risk Transfer`}</title>
      </Helmet>
      <PageHero
        crumb={t('Pages.servicesCrumb')}
        eyebrow={t('Pages.servicesHeroEyebrow')}
        imgKey="opsroom"
        title={t('Pages.servicesHeroTitle')}
        sub={t('Pages.servicesHeroSub')}
      />
      <Services />
      <Claims />
      <Capacity
        images={[
          { key: 'marinePort', altKey: 'Capacity.imgTradeAlt', captionKey: 'Capacity.imgTrade' },
          { key: 'safari', altKey: 'Capacity.imgSubSaharanAlt', captionKey: 'Capacity.imgSubSaharan' },
        ]}
      />
      <CTAStrip sub={t('Pages.servicesCtaSub')} />
    </>
  );
}
