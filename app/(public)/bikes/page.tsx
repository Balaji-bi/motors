import type { Metadata } from 'next';
import { BikesBrowser } from '@/components/public/BikesBrowser';

export const metadata: Metadata = {
  title: 'Bike Catalog — Commuter, Scooter, Sports, Premium & Electric',
  description:
    'Browse the Tamil Motors demo showroom catalog. Filter two-wheelers by category, brand and price, and book a test ride at our Coimbatore showroom.',
  alternates: { canonical: '/bikes' },
  openGraph: { title: 'Bike Catalog | Tamil Motors', url: '/bikes' },
};

export default function BikesPage() {
  return (
    <>
      <section className="border-b border-ink-200 bg-ink-50/60">
        <div className="section py-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Showroom</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-ink-900 sm:text-5xl">Bike Catalog</h1>
          <p className="mt-4 max-w-2xl text-base text-ink-500">
            Commuter, scooter, sports, premium and electric two-wheelers. Prices, mileage and availability
            shown here are demo inventory values for this demonstration platform.
          </p>
        </div>
      </section>

      <section className="section py-12">
        <BikesBrowser />
      </section>
    </>
  );
}
