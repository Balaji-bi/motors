'use client';

import { listAll, TM, type TMCollection } from '@/lib/firebase/firestore';

/** Collections that fell back to local demo data during this page load. */
export const fallbackLog = new Set<string>();

/**
 * Reads a Tamil Motors collection. If Firestore is unreachable or the read is
 * refused, the locally generated demo dataset is returned so no screen renders
 * empty — but the collection is recorded in `fallbackLog` and warned about, so
 * a permissions regression is visible rather than silently masked by fake data.
 */
export async function readWithFallback<T>(name: TMCollection, fallback: T[]): Promise<T[]> {
  try {
    const rows = await listAll<T>(name);
    if (rows.length) {
      fallbackLog.delete(name);
      return rows;
    }
    fallbackLog.add(name);
    return fallback;
  } catch (err) {
    fallbackLog.add(name);
    console.warn(
      `[Tamil Motors] Firestore read of "${name}" failed — showing local demo data instead.`,
      err,
    );
    return fallback;
  }
}

export { TM };
