import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import PageHero from '@/components/PageHero';
import ContactSection from '@/components/ContactSection';

export default function ContactPage() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{`${t('Pages.contactTitle')} — Anchor Risk Transfer`}</title>
      </Helmet>
      <PageHero
        crumb={t('Pages.contactCrumb')}
        eyebrow={t('Pages.contactHeroEyebrow')}
        imgKey="cityNight"
        title={t('Pages.contactHeroTitle')}
        sub={t('Pages.contactHeroSub')}
      />
      <ContactSection bgKey="corridor" />
    </>
  );
}
