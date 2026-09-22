'use client';

import { TM, createDoc, patchDoc, removeDoc, getOne } from '@/lib/firebase/firestore';
import { readWithFallback } from './store';
import { buildBikes } from './demo-data';
import type { Bike } from '@/types';

export async function getBikes() {
  return readWithFallback<Bike>(TM.bikes, buildBikes());
}

export async function getBikeBySlug(slug: string) {
  const bikes = await getBikes();
  return bikes.find((b) => b.slug === slug) ?? null;
}

export async function getBike(id: string) {
  return (await getOne<Bike>(TM.bikes, id)) ?? buildBikes().find((b) => b.id === id) ?? null;
}

export function stockStatus(stock: number): Bike['status'] {
  if (stock <= 0) return 'out_of_stock';
  if (stock <= 3) return 'low_stock';
  return 'available';
}

export async function addBike(data: Omit<Bike, 'id'>) {
  return createDoc(TM.bikes, { ...data, status: stockStatus(data.stock) });
}

export async function updateBike(id: string, data: Partial<Bike>) {
  const next = data.stock !== undefined ? { ...data, status: stockStatus(data.stock) } : data;
  await patchDoc(TM.bikes, id, next as Record<string, unknown>);
}

export async function deleteBike(id: string) {
  await removeDoc(TM.bikes, id);
}
