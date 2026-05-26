import './globals.css';
import Link from 'next/link';
import { DM_Mono, Fraunces } from 'next/font/google';

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' });
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-dm-mono' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmMono.variable}`}>
      <body>
        <header className="border-b border-soil/20 bg-linen/90 backdrop-blur">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <Link href="/" className="font-heading text-2xl font-bold text-soil">SoilIQ</Link>
            <div className="flex gap-4 text-sm">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/analyze">Analyze</Link>
              <Link href="/farms">Farms</Link>
              <Link href="/recommendations">Recommendations</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
