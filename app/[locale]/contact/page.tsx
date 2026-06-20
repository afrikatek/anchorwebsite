import { getTranslations, setRequestLocale } from 'next-intl/server';
import PageHero from '@/components/PageHero';
import ContactSection from '@/components/ContactSection';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Pages' });
  return { title: t('contactTitle') };
}

export default async function ContactPage({
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
        crumb={t('contactCrumb')}
        eyebrow={t('contactHeroEyebrow')}
        imgKey="cityNight"
        title={t('contactHeroTitle')}
        sub={t('contactHeroSub')}
      />
      <ContactSection bgKey="corridor" />
    </>
  );
}
