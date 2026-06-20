import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import PageHero from '@/components/PageHero';
import Classes from '@/components/sections/Classes';
import CTAStrip from '@/components/CTAStrip';

export default function ClassesPage() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{`${t('Pages.classesTitle')} — Anchor Risk Transfer`}</title>
      </Helmet>
      <PageHero
        crumb={t('Pages.classesCrumb')}
        eyebrow={t('Pages.classesHeroEyebrow')}
        imgKey="property"
        title={t('Pages.classesHeroTitle')}
        sub={t('Pages.classesHeroSub')}
      />
      <Classes />
      <CTAStrip sub={t('Pages.classesCtaSub')} />
    </>
  );
}
