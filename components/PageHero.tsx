import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { img, type ImageKey } from '@/lib/images';

type Props = {
  eyebrow: string;
  title: string;
  sub?: string;
  imgKey: ImageKey;
  crumb: string;
};

export default function PageHero({ eyebrow, title, sub, imgKey, crumb }: Props) {
  const t = useTranslations('PageHero');
  return (
    <section style={{ position: 'relative', background: 'var(--navy-900)', color: 'var(--on-dark)', overflow: 'hidden' }}>
      <div className="imgwrap" style={{ position: 'absolute', inset: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img(imgKey, 2000)} alt="" style={{ opacity: 0.4 }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(6,23,38,0.95) 0%, rgba(10,37,64,0.74) 70%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(6,23,38,0.7), transparent 50%)' }} />
      <div className="wrap" style={{ position: 'relative', paddingTop: 80, paddingBottom: 76 }}>
        <div className="mono" style={{ color: 'var(--navy-300)', letterSpacing: '0.1em', marginBottom: 22 }}>
          <Link href="/" style={{ color: 'var(--navy-300)', textDecoration: 'none' }}>{t('home')}</Link>
          <span style={{ opacity: 0.5, margin: '0 8px' }}>/</span>
          <span style={{ color: 'var(--on-dark)' }}>{crumb}</span>
        </div>
        <div className="eyebrow eyebrow--light"><span className="tick" />{eyebrow}</div>
        <h1 className="h1" style={{ color: '#fff', margin: '18px 0 0', maxWidth: 760 }}>{title}</h1>
        {sub && <p className="lead" style={{ color: 'var(--on-dark-2)', margin: '22px 0 0', maxWidth: 600 }}>{sub}</p>}
      </div>
    </section>
  );
}
