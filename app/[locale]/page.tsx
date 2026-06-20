import { setRequestLocale } from 'next-intl/server';
import Hero from '@/components/home/Hero';
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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
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
