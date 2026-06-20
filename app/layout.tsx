import '@/styles/globals.css';

type Props = {
  children: React.ReactNode;
};

// The locale layout renders <html> with the correct lang attribute; this root
// only exists to satisfy Next.js requirements for files outside [locale].
export default function RootLayout({ children }: Props) {
  return children;
}
