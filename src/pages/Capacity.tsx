import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import PageHero from '@/components/PageHero';
import Capacity from '@/components/sections/Capacity';
import TrustBand from '@/components/sections/TrustBand';
import CTAStrip from '@/components/CTAStrip';

export default function CapacityPage() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{`${t('Pages.capacityTitle')} — Anchor Risk Transfer`}</title>
      </Helmet>
      <PageHero
        crumb={t('Pages.capacityCrumb')}
        eyebrow={t('Pages.capacityHeroEyebrow')}
        imgKey="coast"
        title={t('Pages.capacityHeroTitle')}
        sub={t('Pages.capacityHeroSub')}
      />
      <TrustBand />
      <Capacity />
      <CTAStrip sub={t('Pages.capacityCtaSub')} />
    </>
  );
}
