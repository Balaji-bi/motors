'use client';

import { TM, createDoc, patchDoc, removeDoc } from '@/lib/firebase/firestore';
import { readWithFallback } from './store';
import { buildDemoDataset } from './demo-data';
import type { Customer } from '@/types';

export async function getCustomers() {
  return readWithFallback<Customer>(TM.customers, buildDemoDataset().customers);
}

export async function getCustomer(id: string) {
  return (await getCustomers()).find((c) => c.id === id) ?? null;
}

export async function addCustomer(data: Omit<Customer, 'id'>) {
  return createDoc(TM.customers, data);
}

export async function updateCustomer(id: string, data: Partial<Customer>) {
  await patchDoc(TM.customers, id, data as Record<string, unknown>);
}

export async function deleteCustomer(id: string) {
  await removeDoc(TM.customers, id);
}
