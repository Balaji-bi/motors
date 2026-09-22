'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Bike, Phone, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/bikes', label: 'Bikes' },
  { href: '/services', label: 'Services' },
  { href: '/finance', label: 'Finance' },
  { href: '/insurance', label: 'Insurance' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => { setOpen(false); }, [pathname]);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={cn(
      'sticky top-0 z-50 border-b transition',
      scrolled ? 'border-ink-200 bg-white/90 backdrop-blur-xl' : 'border-transparent bg-white',
    )}>
      <div className="section flex h-16 items-center justify-between gap-4 sm:h-18">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink-950 text-white">
            <Bike className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-black tracking-tight text-ink-900">Tamil Motors</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-600">Coimbatore</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-lg px-3.5 py-2 text-sm font-semibold transition',
                  active ? 'bg-ink-100 text-ink-900' : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/customer/login" className="btn-ghost text-sm">Customer Login</Link>
          <Link href="/test-drive" className="btn-primary">Book a Test Ride</Link>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-xl border border-ink-200 text-ink-700 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-ink-200 bg-white lg:hidden">
          <div className="section space-y-1 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl px-3 py-3 text-sm font-semibold text-ink-700 hover:bg-ink-50"
              >
                {item.label}
              </Link>
            ))}
            <div className="grid gap-2 pt-3">
              <Link href="/test-drive" className="btn-primary w-full">Book a Test Ride</Link>
              <Link href="/customer/login" className="btn-outline w-full">Customer Login</Link>
              <Link href="/admin/login" className="btn-ghost w-full">
                <ShieldCheck className="h-4 w-4" /> Admin Login
              </Link>
              <a href="tel:+919600376168" className="btn-ghost w-full">
                <Phone className="h-4 w-4" /> Call the showroom
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
