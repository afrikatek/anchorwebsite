import { useTranslations } from 'next-intl';
import { img, type ImageKey } from '@/lib/images';

const pointKeys = [
  { title: 'point1Title', body: 'point1Body' },
  { title: 'point2Title', body: 'point2Body' },
  { title: 'point3Title', body: 'point3Body' },
] as const;

const numberKeys = [
  { n: 'stat1Number', l: 'stat1Label' },
  { n: 'stat2Number', l: 'stat2Label' },
  { n: 'stat3Number', l: 'stat3Label' },
] as const;

type CapacityImage = { key: ImageKey; altKey: string; captionKey: string };

type Props = {
  images?: [CapacityImage, CapacityImage];
};

const defaultImages: [CapacityImage, CapacityImage] = [
  { key: 'coast', altKey: 'imgIndianOceanAlt', captionKey: 'imgIndianOcean' },
  { key: 'acacia', altKey: 'imgContinentalAlt', captionKey: 'imgContinental' },
];

export default function Capacity({ images = defaultImages }: Props = {}) {
  const t = useTranslations('Capacity');
  const [top, bottom] = images;
  return (
    <section id="capacity" style={{ background: 'var(--navy-900)', color: 'var(--on-dark)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', alignItems: 'stretch' }}>
        <div style={{ padding: '120px 64px 120px max(64px, calc((100vw - var(--maxw))/2 + 64px))' }}>
          <div className="eyebrow eyebrow--light"><span className="tick" />{t('eyebrow')}</div>
          <h2 className="h2" style={{ color: '#fff', margin: '22px 0 0', maxWidth: 540 }}>
            {t('title')}
          </h2>
          <p className="lead" style={{ color: 'var(--on-dark-2)', margin: '24px 0 44px', maxWidth: 520 }}>
            {t('lead')}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {pointKeys.map((p, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 32, padding: '24px 0', borderTop: '1px solid rgba(255,255,255,0.14)' }}>
                <div className="h4" style={{ color: 'var(--navy-200)', fontSize: 16 }}>{t(p.title)}</div>
                <div className="body" style={{ color: 'var(--on-dark-2)', margin: 0 }}>{t(p.body)}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 48, marginTop: 48, flexWrap: 'wrap' }}>
            {numberKeys.map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 38, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>{t(s.n)}</div>
                <div className="small" style={{ color: 'var(--on-dark-3)', marginTop: 8, maxWidth: 130 }}>{t(s.l)}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 0 }}>
          <div className="imgwrap" style={{ position: 'relative', minHeight: 280 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img(top.key, 1300)} alt={t(top.altKey)} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(10,37,64,0.55), transparent 40%)' }} />
            <div className="mono" style={{ position: 'absolute', bottom: 18, left: 22, color: '#fff', letterSpacing: '0.12em', background: 'rgba(6,23,38,0.45)', padding: '6px 12px', borderRadius: 6 }}>{t(top.captionKey)}</div>
          </div>
          <div className="imgwrap" style={{ position: 'relative', minHeight: 280 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img(bottom.key, 1300)} alt={t(bottom.altKey)} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(10,37,64,0.55), transparent 40%)' }} />
            <div className="mono" style={{ position: 'absolute', bottom: 18, left: 22, color: '#fff', letterSpacing: '0.12em', background: 'rgba(6,23,38,0.45)', padding: '6px 12px', borderRadius: 6 }}>{t(bottom.captionKey)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
