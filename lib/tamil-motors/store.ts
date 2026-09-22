'use client';

import { listAll, TM, type TMCollection } from '@/lib/firebase/firestore';

/**
 * Reads a Tamil Motors collection and, when Firestore has not been seeded yet
 * (or is unreachable in the demo environment), falls back to the locally
 * generated demo dataset so no screen ever renders empty or broken.
 */
export async function readWithFallback<T>(name: TMCollection, fallback: T[]): Promise<T[]> {
  try {
    const rows = await listAll<T>(name);
    return rows.length ? rows : fallback;
  } catch {
    return fallback;
  }
}

export { TM };
