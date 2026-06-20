import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import PageHero from '@/components/PageHero';
import About from '@/components/sections/About';
import Values from '@/components/sections/Values';
import Team from '@/components/sections/Team';
import CTAStrip from '@/components/CTAStrip';

export default function AboutPage() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{`${t('Pages.aboutTitle')} — Anchor Risk Transfer`}</title>
      </Helmet>
      <PageHero
        crumb={t('Pages.aboutCrumb')}
        eyebrow={t('Pages.aboutHeroEyebrow')}
        imgKey="handshake"
        title={t('Pages.aboutHeroTitle')}
        sub={t('Pages.aboutHeroSub')}
      />
      <About />
      <Values />
      <Team />
      <CTAStrip sub={t('Pages.aboutCtaSub')} />
    </>
  );
}
