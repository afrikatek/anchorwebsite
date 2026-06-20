import Link from 'next/link';

export const metadata = { title: 'Not found' };

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <section className="section" style={{ background: 'var(--bone)', minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
          <div className="wrap" style={{ textAlign: 'center' }}>
            <div className="eyebrow" style={{ justifyContent: 'center' }}><span className="tick" />404</div>
            <h1 className="h1" style={{ margin: '22px 0 12px' }}>This page isn&rsquo;t in the placement file.</h1>
            <p className="lead" style={{ margin: '0 auto 32px', maxWidth: 540 }}>
              The page you&rsquo;re looking for has moved or never existed. The underwriting desk is still
              open — head back home and try again.
            </p>
            <Link href="/" className="btn btn-primary">Return home</Link>
          </div>
        </section>
      </body>
    </html>
  );
}
