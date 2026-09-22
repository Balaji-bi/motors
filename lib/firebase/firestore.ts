import {
  collection, doc, getDocs, getDoc, addDoc, setDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp, writeBatch,
  type QueryConstraint, type DocumentData,
} from 'firebase/firestore';
import { db } from './config';

/** Every Tamil Motors collection is namespaced so it cannot collide with the
 *  Driving School demo living in the same Firebase project. */
export const TM = {
  users: 'tamilMotors_users',
  customers: 'tamilMotors_customers',
  employees: 'tamilMotors_employees',
  bikes: 'tamilMotors_bikes',
  inventory: 'tamilMotors_inventory',
  sales: 'tamilMotors_sales',
  bookings: 'tamilMotors_bookings',
  testDrives: 'tamilMotors_testDrives',
  payments: 'tamilMotors_payments',
  finance: 'tamilMotors_finance',
  insurance: 'tamilMotors_insurance',
  expenses: 'tamilMotors_expenses',
  notifications: 'tamilMotors_notifications',
  followups: 'tamilMotors_followups',
  settings: 'tamilMotors_settings',
} as const;

export type TMCollection = (typeof TM)[keyof typeof TM];

export async function listAll<T>(name: TMCollection, ...constraints: QueryConstraint[]): Promise<T[]> {
  const snap = await getDocs(
    constraints.length ? query(collection(db, name), ...constraints) : collection(db, name),
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as DocumentData) })) as T[];
}

export async function getOne<T>(name: TMCollection, id: string): Promise<T | null> {
  const snap = await getDoc(doc(db, name, id));
  return snap.exists() ? ({ id: snap.id, ...(snap.data() as DocumentData) } as T) : null;
}

export async function createDoc(name: TMCollection, data: Record<string, unknown>) {
  const ref = await addDoc(collection(db, name), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function upsertDoc(name: TMCollection, id: string, data: Record<string, unknown>) {
  await setDoc(doc(db, name, id), { ...data, updatedAt: serverTimestamp() }, { merge: true });
  return id;
}

export async function patchDoc(name: TMCollection, id: string, data: Record<string, unknown>) {
  await updateDoc(doc(db, name, id), { ...data, updatedAt: serverTimestamp() });
}

export async function removeDoc(name: TMCollection, id: string) {
  await deleteDoc(doc(db, name, id));
}

/** Cheap existence probe used by the demo-data initializer. */
export async function hasAnyDocs(name: TMCollection) {
  const snap = await getDocs(query(collection(db, name), limit(1)));
  return !snap.empty;
}

/** Seeds documents in chunks of 400 (Firestore batch limit is 500). */
export async function batchSeed(name: TMCollection, rows: readonly object[]) {
  for (let i = 0; i < rows.length; i += 400) {
    const batch = writeBatch(db);
    for (const row of rows.slice(i, i + 400)) {
      const { id, ...rest } = row as { id?: string };
      const ref = id ? doc(db, name, id) : doc(collection(db, name));
      batch.set(ref, { ...rest, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    }
    await batch.commit();
  }
}

export { where, orderBy, limit, serverTimestamp };
