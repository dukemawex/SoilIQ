'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/analyze', label: 'Analyze' },
  { href: '/farms', label: 'Farms' },
  { href: '/recommendations', label: 'Recommendations' }
];

export default function MainNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {links.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-3 py-1.5 font-medium transition-all duration-200 ${
              active
                ? 'border border-primary/20 bg-primary/10 text-primary shadow-sm'
                : 'text-slate-600 hover:bg-white/80 hover:text-primary'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
