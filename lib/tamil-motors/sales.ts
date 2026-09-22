'use client';

import { TM, createDoc, patchDoc, removeDoc } from '@/lib/firebase/firestore';
import { readWithFallback } from './store';
import { buildDemoDataset } from './demo-data';
import type { Sale } from '@/types';

export async function getSales() {
  return readWithFallback<Sale>(TM.sales, buildDemoDataset().sales);
}

export async function addSale(data: Omit<Sale, 'id'>) {
  return createDoc(TM.sales, data);
}

export async function updateSale(id: string, data: Partial<Sale>) {
  await patchDoc(TM.sales, id, data as Record<string, unknown>);
}

export async function deleteSale(id: string) {
  await removeDoc(TM.sales, id);
}

/** Pricing maths used by the New Sale workflow. */
export function computeFinalAmount(input: {
  basePrice: number; accessoriesAmount: number; discount: number;
  insuranceAmount: number; registrationAmount: number;
  financeCharges: number; otherCharges: number;
}) {
  return (
    input.basePrice + input.accessoriesAmount + input.insuranceAmount +
    input.registrationAmount + input.financeCharges + input.otherCharges - input.discount
  );
}
