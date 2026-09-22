/**
 * Seeds the Tamil Motors demo dataset into Firestore using the Firebase Admin SDK,
 * and provisions the demo admin + customer auth accounts.
 *
 *   npm run seed          # seed only if empty
 *   npm run seed -- --force   # re-seed (deletes tamilMotors_* docs first)
 *
 * SAFETY: this script refuses to touch any collection whose name does not start
 * with `tamilMotors_`, so the Driving School demo in the same project is never
 * read, renamed, overwritten or deleted.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { cert, getApps, initializeApp, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { buildDemoDataset } from '../lib/tamil-motors/demo-data';

loadEnv({ path: '.env.local' });

const PREFIX = 'tamilMotors_';

/** Hard guard — nothing outside the Tamil Motors namespace is ever addressable. */
function safeCollection(db: Firestore, name: string) {
  if (!name.startsWith(PREFIX)) {
    throw new Error(`Refusing to access "${name}" — only ${PREFIX}* collections are allowed.`);
  }
  return db.collection(name);
}

const TM = {
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

function initAdmin() {
  const keyPath = process.env.FIREBASE_ADMIN_CREDENTIALS;
  if (!keyPath) throw new Error('FIREBASE_ADMIN_CREDENTIALS is not set in .env.local');
  // The key file is read here and never printed.
  const serviceAccount = JSON.parse(readFileSync(resolve(keyPath), 'utf8')) as ServiceAccount;
  if (!getApps().length) initializeApp({ credential: cert(serviceAccount) });
  const db = getFirestore();
  // Optional fields in the demo dataset (e.g. purchasedBikeId) may be undefined.
  db.settings({ ignoreUndefinedProperties: true });
  return { db, auth: getAuth() };
}

async function writeAll(db: Firestore, name: string, rows: readonly { id: string }[]) {
  const col = safeCollection(db, name);
  const now = new Date();
  for (let i = 0; i < rows.length; i += 400) {
    const batch = db.batch();
    for (const { id, ...rest } of rows.slice(i, i + 400)) {
      batch.set(col.doc(id), { ...rest, createdAt: now, updatedAt: now });
    }
    await batch.commit();
  }
  console.log(`  ✓ ${name.padEnd(28)} ${String(rows.length).padStart(3)} documents`);
}

async function clearCollection(db: Firestore, name: string) {
  const col = safeCollection(db, name);
  const snap = await col.get();
  for (let i = 0; i < snap.docs.length; i += 400) {
    const batch = db.batch();
    snap.docs.slice(i, i + 400).forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }
  return snap.size;
}

async function ensureUser(
  auth: ReturnType<typeof getAuth>,
  db: Firestore,
  email: string,
  password: string,
  name: string,
  role: string,
  customerId?: string,
) {
  let uid: string;
  try {
    const existing = await auth.getUserByEmail(email);
    uid = existing.uid;
    console.log(`  · ${email} already exists (${uid})`);
  } catch {
    const created = await auth.createUser({ email, password, displayName: name, emailVerified: true });
    uid = created.uid;
    console.log(`  ✓ created auth user ${email} (${uid})`);
  }
  // Custom claim drives server-side rule checks without an extra document read.
  await auth.setCustomUserClaims(uid, { role, tenant: 'tamilMotors' });
  // `customerId` is what the security rules use to scope a customer to their
  // own sales, bookings, payments and policies.
  await safeCollection(db, TM.users).doc(uid).set(
    { uid, email, name, role, ...(customerId ? { customerId } : {}), updatedAt: new Date() },
    { merge: true },
  );
  return uid;
}

async function main() {
  const force = process.argv.includes('--force');
  const { db, auth } = initAdmin();

  console.log('\nTamil Motors — Firestore seed');
  console.log('─'.repeat(60));

  const existing = await safeCollection(db, TM.sales).limit(1).get();
  if (!existing.empty && !force) {
    console.log('Demo data already initialized. Nothing was written or duplicated.');
    console.log('Re-run with `npm run seed -- --force` to rebuild the dataset.\n');
    return;
  }

  if (force && !existing.empty) {
    console.log('\nClearing existing Tamil Motors collections…');
    for (const name of Object.values(TM)) {
      if (name === TM.users) continue; // preserve auth-linked profiles
      const n = await clearCollection(db, name);
      if (n) console.log(`  · cleared ${name} (${n} docs)`);
    }
  }

  const d = buildDemoDataset();

  console.log('\nWriting demo dataset…');
  await writeAll(db, TM.bikes, d.bikes);
  await writeAll(db, TM.employees, d.employees);
  await writeAll(db, TM.customers, d.customers);
  await writeAll(db, TM.inventory, d.inventory);
  await writeAll(db, TM.sales, d.sales);
  await writeAll(db, TM.testDrives, d.testDrives);
  await writeAll(db, TM.bookings, d.bookings);
  await writeAll(db, TM.payments, d.payments);
  await writeAll(db, TM.finance, d.finance);
  await writeAll(db, TM.insurance, d.insurance);
  await writeAll(db, TM.expenses, d.expenses);
  await writeAll(db, TM.notifications, d.notifications);
  await writeAll(db, TM.followups, d.followups);

  await safeCollection(db, TM.settings).doc('dealership').set({
    businessName: 'Tamil Motors',
    businessType: 'Two-wheeler dealership',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    phone: '+91 96003 76168',
    branches: ['Coimbatore — Gandhipuram', 'Coimbatore — Peelamedu', 'Tiruppur', 'Erode'],
    technologyPartner: 'PubliqWebb Tech',
    seededAt: new Date(),
  });
  console.log(`  ✓ ${TM.settings.padEnd(28)}   1 document`);

  console.log('\nProvisioning demo accounts…');
  await ensureUser(
    auth, db,
    process.env.TM_ADMIN_EMAIL ?? 'tamilmotors@admin.com',
    process.env.TM_ADMIN_PASSWORD ?? 'Tamil@motors',
    'Tamil Motors Admin', 'admin',
  );

  // Link the demo customer login to a real customer record so the portal has data.
  const customerEmail = process.env.TM_CUSTOMER_EMAIL ?? 'arun.kumar@tamilmotors.demo';
  const buyer = d.customers.find((c) => c.status === 'customer');

  await ensureUser(
    auth, db, customerEmail,
    process.env.TM_CUSTOMER_PASSWORD ?? 'Customer@123',
    'Arun Kumar', 'customer', buyer?.id,
  );

  if (buyer) {
    // Align the dealership record with the auth account so the customer portal
    // resolves a real profile, purchase history and vehicle.
    await safeCollection(db, TM.customers).doc(buyer.id).set(
      { name: 'Arun Kumar', email: customerEmail, updatedAt: new Date() },
      { merge: true },
    );
    for (const col of [TM.sales, TM.bookings, TM.payments] as const) {
      const snap = await safeCollection(db, col).where('customerId', '==', buyer.id).get();
      const batch = db.batch();
      snap.docs.forEach((doc) => batch.update(doc.ref, { customerName: 'Arun Kumar' }));
      if (snap.size) await batch.commit();
    }
    const tdSnap = await safeCollection(db, TM.testDrives).where('email', '==', buyer.email).get();
    const tdBatch = db.batch();
    tdSnap.docs.forEach((doc) => tdBatch.update(doc.ref, { name: 'Arun Kumar', email: customerEmail }));
    if (tdSnap.size) await tdBatch.commit();

    console.log(`  ✓ linked ${customerEmail} to customer record ${buyer.id} (Arun Kumar)`);
  }

  console.log('\n─'.repeat(60));
  console.log('Seed complete. Driving School collections were never accessed.\n');
}

main().catch((err) => {
  console.error('\nSeed failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
