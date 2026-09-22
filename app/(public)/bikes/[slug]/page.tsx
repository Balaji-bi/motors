import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Check, Palette, Boxes } from 'lucide-react';
import { STATIC_BIKES } from '@/lib/tamil-motors/demo-data';
import { BikeVisual, BikeCard } from '@/components/public/BikeCard';
import { StatusChip } from '@/components/ui';
import { inr } from '@/lib/utils';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return STATIC_BIKES.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const bike = STATIC_BIKES.find((b) => b.slug === slug);
  if (!bike) return { title: 'Bike not found' };
  const title = `${bike.brand} ${bike.model} — ${bike.variant}`;
  return {
    title,
    description: `${bike.brand} ${bike.model} at Tamil Motors Coimbatore. ${bike.engine}, ${bike.mileage}, ${bike.transmission}. Demo price ${inr(bike.price)}. Book a test ride.`,
    alternates: { canonical: `/bikes/${bike.slug}` },
    openGraph: { title: `${title} | Tamil Motors`, url: `/bikes/${bike.slug}` },
  };
}

export default async function BikeDetailPage({ params }: Params) {
  const { slug } = await params;
  const bike = STATIC_BIKES.find((b) => b.slug === slug);
  if (!bike) notFound();

  const related = STATIC_BIKES
    .filter((b) => b.category === bike.category && b.id !== bike.id)
    .slice(0, 3);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${bike.brand} ${bike.model}`,
    brand: { '@type': 'Brand', name: bike.brand },
    category: bike.category,
    description: bike.description,
    offers: {
      '@type': 'Offer',
      price: bike.price,
      priceCurrency: 'INR',
      availability: bike.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'AutoDealer', name: 'Tamil Motors' },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

      <div className="section pt-8">
        <Link href="/bikes" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 transition hover:text-ink-900">
          <ArrowLeft className="h-4 w-4" /> Back to catalog
        </Link>
      </div>

      <section className="section grid gap-10 py-10 lg:grid-cols-2">
        <div>
          <BikeVisual bike={bike} large className="h-[22rem] rounded-3xl sm:h-[26rem]" />
          <div className="mt-4 grid grid-cols-3 gap-3">
            {(bike.colors ?? [bike.color]).map((c) => (
              <div key={c} className="card flex items-center gap-2 px-3 py-3">
                <Palette className="h-4 w-4 shrink-0 text-brand-600" />
                <span className="truncate text-xs font-semibold text-ink-700">{c}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip bg-ink-100 text-ink-600">{bike.category}</span>
            <StatusChip value={bike.status} />
          </div>

          <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-brand-600">{bike.brand}</p>
          <h1 className="mt-2 text-4xl font-black leading-tight tracking-tight text-ink-900 sm:text-5xl">
            {bike.model}
          </h1>
          <p className="mt-2 text-base text-ink-500">{bike.variant}</p>

          <div className="mt-7 rounded-2xl border border-ink-200 bg-ink-50/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Demo showroom price</p>
            <p className="mt-1 text-3xl font-black text-ink-900">{inr(bike.price)}</p>
            <p className="mt-1 text-xs text-ink-500">
              Demo value shown for this demonstration platform. On-road price varies with registration,
              insurance and accessories.
            </p>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ['Engine', bike.engine],
              ['Mileage', bike.mileage],
              ['Fuel', bike.fuelType],
              ['Transmission', bike.transmission],
            ].map(([k, v]) => (
              <div key={k} className="card p-4">
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">{k}</dt>
                <dd className="mt-1.5 text-sm font-bold text-ink-900">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 flex items-center gap-2 rounded-xl border border-ink-200 px-4 py-3 text-sm text-ink-600">
            <Boxes className="h-4 w-4 text-brand-600" />
            <span className="font-bold text-ink-900">{bike.stock}</span> demo unit(s) available at the showroom
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Link href={`/test-drive?bike=${encodeURIComponent(`${bike.brand} ${bike.model}`)}`} className="btn-primary w-full">
              Book Test Ride
            </Link>
            <Link href={`/contact?subject=${encodeURIComponent(`Enquiry: ${bike.brand} ${bike.model}`)}`} className="btn-dark w-full">
              Enquire Now
            </Link>
            <Link href="/finance" className="btn-outline w-full">Check Finance</Link>
            <a href="tel:+919600376168" className="btn-outline w-full">Contact Sales</a>
          </div>
        </div>
      </section>

      {/* Features & specifications */}
      <section className="section grid gap-6 pb-16 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-lg font-bold text-ink-900">Features</h2>
          <ul className="mt-4 space-y-2.5">
            {(bike.features ?? []).map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-ink-700">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="card overflow-hidden">
          <h2 className="border-b border-ink-200 px-6 py-5 text-lg font-bold text-ink-900">Specifications</h2>
          <dl className="divide-y divide-ink-100">
            {Object.entries(bike.specs ?? {}).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-4 px-6 py-3">
                <dt className="text-sm text-ink-500">{k}</dt>
                <dd className="text-sm font-semibold text-ink-900">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {related.length ? (
        <section className="bg-ink-50/70 py-16">
          <div className="section">
            <h2 className="text-2xl font-black tracking-tight text-ink-900">More in {bike.category}</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((b) => <BikeCard key={b.id} bike={b} />)}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
