import './globals.css';
import Link from 'next/link';
import MainNav from '@/components/MainNav';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl">
          <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
            <Link href="/" className="text-2xl font-semibold tracking-tight text-primary">SoilIQ</Link>
            <MainNav />
          </nav>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
