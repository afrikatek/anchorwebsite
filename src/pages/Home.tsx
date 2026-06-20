import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import Hero from '@/components/Hero';
import TrustBand from '@/components/sections/TrustBand';
import About from '@/components/sections/About';
import Services from '@/components/sections/Services';
import Classes from '@/components/sections/Classes';
import Capacity from '@/components/sections/Capacity';
import Claims from '@/components/sections/Claims';
import Values from '@/components/sections/Values';
import Team from '@/components/sections/Team';
import InsightsTeaser from '@/components/sections/InsightsTeaser';
import ContactSection from '@/components/ContactSection';

export default function Home() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t('Pages.homeTitle')}</title>
        <meta name="description" content={t('Pages.homeDescription')} />
      </Helmet>
      <Hero />
      <TrustBand />
      <About />
      <Services />
      <Classes />
      <Capacity />
      <Claims />
      <Values />
      <Team />
      <InsightsTeaser />
      <ContactSection />
    </>
  );
}
