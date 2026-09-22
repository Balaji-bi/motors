'use client';

import { collection, getDocs, query, where, limit, type DocumentData } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db } from '@/lib/firebase/config';
import { TM, getOne } from '@/lib/firebase/firestore';
import type {
  AppUser, Bike, Booking, Customer, InsuranceRecord, Payment, Sale, TestDrive,
} from '@/types';

/**
 * The customer portal reads ONLY the rows that belong to the signed-in user.
 * Security rules reject an unscoped read of these collections for a customer,
 * so every query here carries a `where` clause that matches the rule.
 */
async function scoped<T>(name: string, field: string, value: string): Promise<T[]> {
  try {
    const snap = await getDocs(query(collection(db, name), where(field, '==', value)));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as DocumentData) })) as T[];
  } catch {
    return [];
  }
}

export type PortalData = {
  profile: Customer | null;
  testDrives: TestDrive[];
  sales: Sale[];
  bookings: Booking[];
  payments: Payment[];
  insurance: InsuranceRecord[];
  bike: Bike | null;
};

export const EMPTY_PORTAL: PortalData = {
  profile: null, testDrives: [], sales: [], bookings: [],
  payments: [], insurance: [], bike: null,
};

export async function loadCustomerPortal(user: User): Promise<PortalData> {
  const email = (user.email ?? '').toLowerCase();
  if (!email) return EMPTY_PORTAL;

  // The user profile carries the dealership customer id set by the sales team.
  const account = await getOne<AppUser & { customerId?: string }>(TM.users, user.uid).catch(() => null);

  let profile: Customer | null = null;
  if (account?.customerId) {
    profile = await getOne<Customer>(TM.customers, account.customerId).catch(() => null);
  }
  if (!profile) {
    // Fall back to matching on email — permitted by the rules via tmOwnsByEmail().
    try {
      const snap = await getDocs(
        query(collection(db, TM.customers), where('email', '==', user.email), limit(1)),
      );
      if (!snap.empty) profile = { id: snap.docs[0].id, ...(snap.docs[0].data() as DocumentData) } as Customer;
    } catch { /* rules may deny; portal falls back to its empty state */ }
  }

  const testDrives = await scoped<TestDrive>(TM.testDrives, 'email', user.email ?? '');

  if (!profile) return { ...EMPTY_PORTAL, testDrives };

  const [sales, bookings, payments, insurance] = await Promise.all([
    scoped<Sale>(TM.sales, 'customerId', profile.id),
    scoped<Booking>(TM.bookings, 'customerId', profile.id),
    scoped<Payment>(TM.payments, 'customerId', profile.id),
    scoped<InsuranceRecord>(TM.insurance, 'customerId', profile.id),
  ]);

  // The bike catalog is publicly readable, so a direct lookup is fine.
  const bike = profile.purchasedBikeId
    ? await getOne<Bike>(TM.bikes, profile.purchasedBikeId).catch(() => null)
    : null;

  return { profile, testDrives, sales, bookings, payments, insurance, bike };
}
