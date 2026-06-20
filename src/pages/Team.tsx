import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import PageHero from '@/components/PageHero';
import Team from '@/components/sections/Team';
import Values from '@/components/sections/Values';
import CTAStrip from '@/components/CTAStrip';

export default function TeamPage() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{`${t('Pages.teamTitle')} — Anchor Risk Transfer`}</title>
      </Helmet>
      <PageHero
        crumb={t('Pages.teamCrumb')}
        eyebrow={t('Pages.teamHeroEyebrow')}
        imgKey="boardroom"
        title={t('Pages.teamHeroTitle')}
        sub={t('Pages.teamHeroSub')}
      />
      <Team />
      <Values />
      <CTAStrip sub={t('Pages.teamCtaSub')} />
    </>
  );
}
