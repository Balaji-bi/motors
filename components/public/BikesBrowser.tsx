'use client';

import * as React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { BikeCard } from './BikeCard';
import { SearchInput, Select, EmptyState } from '@/components/ui';
import { STATIC_BIKES } from '@/lib/tamil-motors/demo-data';
import { cn } from '@/lib/utils';
import type { Bike } from '@/types';

const CATEGORIES = ['All', 'Commuter', 'Scooter', 'Sports', 'Premium', 'Electric'] as const;

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'brand', label: 'Brand A–Z' },
];

export function BikesBrowser({ bikes = STATIC_BIKES }: { bikes?: Bike[] }) {
  const [category, setCategory] = React.useState<string>('All');
  const [search, setSearch] = React.useState('');
  const [brand, setBrand] = React.useState('All');
  const [sort, setSort] = React.useState('featured');

  const brands = React.useMemo(
    () => ['All', ...Array.from(new Set(bikes.map((b) => b.brand))).sort()],
    [bikes],
  );

  const results = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = bikes.filter((b) => {
      const matchesCategory = category === 'All' || b.category === category;
      const matchesBrand = brand === 'All' || b.brand === brand;
      const matchesSearch = !q ||
        `${b.brand} ${b.model} ${b.variant} ${b.category}`.toLowerCase().includes(q);
      return matchesCategory && matchesBrand && matchesSearch;
    });
    if (sort === 'price-asc') rows = [...rows].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') rows = [...rows].sort((a, b) => b.price - a.price);
    if (sort === 'brand') rows = [...rows].sort((a, b) => a.brand.localeCompare(b.brand));
    return rows;
  }, [bikes, category, brand, search, sort]);

  return (
    <div>
      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-semibold transition',
              category === c
                ? 'bg-ink-950 text-white shadow-sm'
                : 'border border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:text-ink-900',
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="mt-5 grid gap-3 rounded-2xl border border-ink-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-[1fr_200px_200px]">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by brand, model or variant…" />
        <Select
          ariaLabel="Filter by brand"
          value={brand}
          onChange={setBrand}
          options={brands.map((b) => ({ value: b, label: b === 'All' ? 'All brands' : b }))}
        />
        <Select ariaLabel="Sort bikes" value={sort} onChange={setSort} options={SORTS} />
      </div>

      <div className="mt-6 flex items-center gap-2 text-sm text-ink-500">
        <SlidersHorizontal className="h-4 w-4" />
        Showing <span className="font-bold text-ink-900">{results.length}</span> of {bikes.length} demo models
      </div>

      {results.length ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((bike) => <BikeCard key={bike.id} bike={bike} />)}
        </div>
      ) : (
        <div className="mt-6 card">
          <EmptyState
            title="No bikes match those filters"
            message="Try a different category, brand or search term to see more of the demo line-up."
          />
        </div>
      )}
    </div>
  );
}
