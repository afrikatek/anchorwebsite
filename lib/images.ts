// Curated, verified Unsplash library for Anchor Risk Transfer.
// Ported from the prototype's site/components/images.js.

export const IMG = {
  joburg: '1577948000111-9c970dfe3743',
  capetown: '1580060839134-75a5edca2e99',
  skyline: '1449824913935-59a10b8d2000',
  cityNight: '1480714378408-67cf0d13bc1b',
  handshake: '1521791136064-7986c2920216',
  partners: '1600880292203-757bb62b4baf',
  boardroom: '1542744173-8e7e53415bb0',
  opsroom: '1573164713988-8665fc963095',
  signing: '1454165804606-c3d57bc86b40',
  corridor: '1497366216548-37526070297c',
  coast: '1505228395891-9a51e7e86bf6',
  acacia: '1547471080-7cc2caa01a7e',
  safari: '1516426122078-c23e76319801',
  reef: '1544551763-46a013bb70d5',
  property: '1486406146926-c627a92ad1ab',
  engineering: '1503387762-592deb58ef4e',
  marinePort: '1494412574643-ff11b0a5c1c3',
  marineShip: '1605745341112-85968b19335b',
  liability: '1454165804606-c3d57bc86b40',
  energy: '1466611653911-95081537e5b7',
  motor: '1601584115197-04ecc0da31d7',
  civic: '1529107386315-e1a2ed48a620',
} as const;

export type ImageKey = keyof typeof IMG;

export function img(key: ImageKey | string, w: number = 1400): string {
  const id = (IMG as Record<string, string>)[key] || IMG.skyline;
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`;
}
