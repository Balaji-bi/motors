'use client';

import Link from 'next/link';
import { Bike, Mail, Phone, Globe, MapPin, ArrowRight } from 'lucide-react';
import { PUBLIQWEBB } from '@/components/modals/LockedFeature';

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink-950 text-white">
      {/* Agency CTA */}
      <div className="section py-16">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand-700 via-brand-800 to-ink-900 p-8 sm:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative max-w-3xl">
            <h2 className="text-2xl font-black leading-tight sm:text-4xl">
              Need a complete dealership management system?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
              {PUBLIQWEBB.name} builds customised dealership management platforms with sales, inventory,
              employee management, revenue analytics, CRM, AI automation and WhatsApp integration.
            </p>
            <a
              href={`mailto:${PUBLIQWEBB.email}?subject=Dealership%20Management%20System%20Enquiry`}
              className="btn mt-7 bg-white text-ink-900 hover:bg-white/90"
            >
              Contact {PUBLIQWEBB.name} <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="section grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-ink-950">
                <Bike className="h-5 w-5" />
              </span>
              <span className="text-lg font-black">Tamil Motors</span>
            </div>
            <p className="mt-4 text-sm text-white/60">
              Two-Wheeler Sales &amp; Customer Services
            </p>
            <p className="mt-4 flex items-start gap-2 text-sm text-white/60">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
              Gandhipuram, Coimbatore, Tamil Nadu
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">Quick Links</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                ['/bikes', 'Bikes'],
                ['/test-drive', 'Test Drive'],
                ['/finance', 'Finance'],
                ['/insurance', 'Insurance'],
                ['/contact', 'Contact'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-white/70 transition hover:text-white">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">Management System</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/admin/login" className="text-white/70 transition hover:text-white">Employee Login</Link></li>
              <li><Link href="/admin/login" className="text-white/70 transition hover:text-white">Admin Login</Link></li>
              <li><Link href="/customer/login" className="text-white/70 transition hover:text-white">Customer Login</Link></li>
              <li><Link href="/services" className="text-white/70 transition hover:text-white">Services</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">Built By</h3>
            <p className="mt-4 text-sm font-bold">{PUBLIQWEBB.name}</p>
            <ul className="mt-3 space-y-2.5 text-sm">
              <li className="flex items-center gap-2 text-white/70"><Globe className="h-4 w-4 text-brand-400" />{PUBLIQWEBB.website}</li>
              <li>
                <a href={`mailto:${PUBLIQWEBB.email}`} className="flex items-center gap-2 text-white/70 transition hover:text-white">
                  <Mail className="h-4 w-4 text-brand-400" />{PUBLIQWEBB.email}
                </a>
              </li>
              <li>
                <a href={`tel:${PUBLIQWEBB.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-white/70 transition hover:text-white">
                  <Phone className="h-4 w-4 text-brand-400" />{PUBLIQWEBB.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="section flex flex-col gap-2 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Tamil Motors. Demonstration platform — figures and inventory shown are demo data.</p>
          <p>Powered by <span className="font-semibold text-white/80">{PUBLIQWEBB.name}</span></p>
        </div>
      </div>
    </footer>
  );
}
