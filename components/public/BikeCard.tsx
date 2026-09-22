'use client';

import Link from 'next/link';
import { Bike as BikeIcon, Fuel, Gauge, Settings2, ArrowRight } from 'lucide-react';
import { inr, cn } from '@/lib/utils';
import { StatusChip } from '@/components/ui';
import type { Bike } from '@/types';

const GRADIENTS = [
  'from-rose-500/90 via-rose-600 to-ink-900',
  'from-sky-500/90 via-sky-700 to-ink-900',
  'from-amber-500/90 via-orange-600 to-ink-900',
  'from-emerald-500/90 via-emerald-700 to-ink-900',
  'from-violet-500/90 via-violet-700 to-ink-900',
  'from-slate-500/90 via-slate-700 to-ink-950',
];

export function BikeVisual({ bike, className, large = false }: { bike: Bike; className?: string; large?: boolean }) {
  const hash = (bike.brand + bike.model).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const gradient = GRADIENTS[hash % GRADIENTS.length];
  return (
    <div className={cn('relative overflow-hidden bg-gradient-to-br text-white', gradient, className)}>
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-14 -left-10 h-44 w-44 rounded-full bg-black/20 blur-2xl" />
      {bike.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={bike.imageUrl} alt={`${bike.brand} ${bike.model}`} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="relative flex h-full flex-col justify-between p-5">
          <span className="chip bg-white/15 text-white ring-1 ring-white/25">{bike.category}</span>
          <div>
            <BikeIcon className={cn('opacity-90', large ? 'h-20 w-20' : 'h-12 w-12')} strokeWidth={1.25} />
            <p className={cn('mt-2 font-black leading-none tracking-tight', large ? 'text-3xl' : 'text-lg')}>
              {bike.model}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">{bike.brand}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function BikeCard({ bike }: { bike: Bike }) {
  return (
    <Link
      href={`/bikes/${bike.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <BikeVisual bike={bike} className="h-48 shrink-0" />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-600">{bike.brand}</p>
            <h3 className="mt-1 text-base font-bold leading-snug text-ink-900">{bike.model}</h3>
            <p className="text-xs text-ink-500">{bike.variant}</p>
          </div>
          <StatusChip value={bike.status} />
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-2 border-y border-ink-100 py-3 text-center">
          <div>
            <dt className="flex items-center justify-center text-ink-400"><Settings2 className="h-3.5 w-3.5" /></dt>
            <dd className="mt-1 text-[11px] font-semibold text-ink-700">{bike.engine}</dd>
          </div>
          <div>
            <dt className="flex items-center justify-center text-ink-400"><Gauge className="h-3.5 w-3.5" /></dt>
            <dd className="mt-1 text-[11px] font-semibold text-ink-700">{bike.mileage}</dd>
          </div>
          <div>
            <dt className="flex items-center justify-center text-ink-400"><Fuel className="h-3.5 w-3.5" /></dt>
            <dd className="mt-1 text-[11px] font-semibold text-ink-700">{bike.fuelType}</dd>
          </div>
        </dl>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">Demo price</p>
            <p className="text-xl font-black text-ink-900">{inr(bike.price)}</p>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
            View <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
