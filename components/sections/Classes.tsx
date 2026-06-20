'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { img, type ImageKey } from '@/lib/images';

type ClassDef = { n: string; nameKey: string; itemsKey: string; key: ImageKey };

const classes: ClassDef[] = [
  { n: '01', nameKey: 'c1Name', itemsKey: 'c1Items', key: 'property' },
  { n: '02', nameKey: 'c2Name', itemsKey: 'c2Items', key: 'engineering' },
  { n: '03', nameKey: 'c3Name', itemsKey: 'c3Items', key: 'marineShip' },
  { n: '04', nameKey: 'c4Name', itemsKey: 'c4Items', key: 'liability' },
  { n: '05', nameKey: 'c5Name', itemsKey: 'c5Items', key: 'civic' },
  { n: '06', nameKey: 'c6Name', itemsKey: 'c6Items', key: 'corridor' },
  { n: '07', nameKey: 'c7Name', itemsKey: 'c7Items', key: 'energy' },
  { n: '08', nameKey: 'c8Name', itemsKey: 'c8Items', key: 'motor' },
];

function ClassCard({ c }: { c: ClassDef }) {
  const t = useTranslations('Classes');
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--paper)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        transition: 'all 220ms var(--ease)',
        boxShadow: hover ? 'var(--shadow-lg)' : 'none',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
      }}
    >
      <div className="imgwrap" style={{ aspectRatio: '16/11', position: 'relative' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img(c.key, 700)}
          alt={t(c.nameKey)}
          style={{ transition: 'transform 600ms var(--ease)', transform: hover ? 'scale(1.06)' : 'scale(1)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(6,23,38,0.78) 0%, rgba(6,23,38,0.05) 55%)' }} />
        <div className="mono" style={{ position: 'absolute', top: 12, left: 14, color: 'rgba(255,255,255,0.8)' }}>{c.n}</div>
        <h3 className="h4" style={{ position: 'absolute', left: 16, right: 16, bottom: 14, color: '#fff', fontSize: 19 }}>{t(c.nameKey)}</h3>
      </div>
      <div style={{ padding: '16px 18px 20px' }}>
        <p className="small" style={{ color: 'var(--fg-2)', lineHeight: 1.55, margin: 0 }}>{t(c.itemsKey)}</p>
      </div>
    </div>
  );
}

export default function Classes() {
  const t = useTranslations('Classes');
  return (
    <section id="classes" className="section" style={{ background: 'var(--bone)' }}>
      <div className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'end', marginBottom: 56 }}>
          <div>
            <div className="eyebrow"><span className="tick" />{t('eyebrow')}</div>
            <h2 className="h2" style={{ margin: '22px 0 0' }}>{t('title')}</h2>
          </div>
          <p className="body-lg" style={{ maxWidth: 500 }}>
            {t('lead')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 20 }}>
          {classes.map((c) => (
            <ClassCard key={c.n} c={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
