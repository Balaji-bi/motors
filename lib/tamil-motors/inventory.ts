'use client';

import { TM, createDoc, patchDoc, removeDoc } from '@/lib/firebase/firestore';
import { readWithFallback } from './store';
import { buildDemoDataset } from './demo-data';
import type { InventoryItem, StockStatus } from '@/types';

export async function getInventory() {
  return readWithFallback<InventoryItem>(TM.inventory, buildDemoDataset().inventory);
}

export async function addInventoryItem(data: Omit<InventoryItem, 'id'>) {
  return createDoc(TM.inventory, data);
}

export async function updateInventoryItem(id: string, data: Partial<InventoryItem>) {
  await patchDoc(TM.inventory, id, data as Record<string, unknown>);
}

export async function setStockStatus(id: string, stockStatus: StockStatus) {
  await patchDoc(TM.inventory, id, { stockStatus });
}

export async function deleteInventoryItem(id: string) {
  await removeDoc(TM.inventory, id);
}
