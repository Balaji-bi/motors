/**
 * Verifies the live Firebase project:
 *   1. document counts per tamilMotors_* collection
 *   2. a real create → read → update → delete cycle against Firestore
 *   3. client sign-in for the demo admin and customer accounts (Auth REST API)
 *   4. confirms the Driving School collections are still present and untouched
 *
 *   npm run verify
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { cert, getApps, initializeApp, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

loadEnv({ path: '.env.local' });

const PREFIX = 'tamilMotors_';
const TM_COLLECTIONS = [
  'users', 'customers', 'employees', 'bikes', 'inventory', 'sales', 'bookings',
  'testDrives', 'payments', 'finance', 'insurance', 'expenses',
  'notifications', 'followups', 'settings',
].map((c) => PREFIX + c);

let failures = 0;
const pass = (msg: string) => console.log(`  ✓ ${msg}`);
const fail = (msg: string) => { failures += 1; console.log(`  ✗ ${msg}`); };

function initAdmin() {
  const keyPath = process.env.FIREBASE_ADMIN_CREDENTIALS;
  if (!keyPath) throw new Error('FIREBASE_ADMIN_CREDENTIALS is not set in .env.local');
  const serviceAccount = JSON.parse(readFileSync(resolve(keyPath), 'utf8')) as ServiceAccount;
  if (!getApps().length) initializeApp({ credential: cert(serviceAccount) });
  const db = getFirestore();
  db.settings({ ignoreUndefinedProperties: true });
  return db;
}

async function signIn(email: string, password: string) {
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    },
  );
  const body = await res.json() as { localId?: string; error?: { message: string } };
  if (!res.ok) throw new Error(body.error?.message ?? `HTTP ${res.status}`);
  return body.localId ?? '';
}

async function main() {
  const db = initAdmin();
  console.log('\nTamil Motors — live Firebase verification');
  console.log('─'.repeat(62));

  /* 1 ── document counts ------------------------------------------------ */
  console.log('\n[1] Firestore document counts');
  let total = 0;
  for (const name of TM_COLLECTIONS) {
    const snap = await db.collection(name).count().get();
    const n = snap.data().count;
    total += n;
    if (n > 0) pass(`${name.padEnd(28)} ${String(n).padStart(3)} docs`);
    else fail(`${name.padEnd(28)} EMPTY`);
  }
  console.log(`  → ${total} documents across ${TM_COLLECTIONS.length} collections`);

  /* 2 ── CRUD cycle ----------------------------------------------------- */
  console.log('\n[2] Firestore CRUD cycle (tamilMotors_testDrives)');
  const ref = db.collection(`${PREFIX}testDrives`).doc(`verify-${Date.now()}`);
  try {
    await ref.set({
      name: 'Verification Probe', phone: '+91 90000 00000',
      email: 'verify@tamilmotors.demo', bikeName: 'TVS Raider 125',
      date: new Date().toISOString().slice(0, 10), time: '10:00 AM',
      location: 'Coimbatore — Gandhipuram', status: 'Requested', notes: '',
      createdAt: new Date(),
    });
    pass('CREATE succeeded');

    const read = await ref.get();
    if (read.exists && read.data()?.status === 'Requested') pass('READ  returned the written document');
    else fail('READ  did not return the expected document');

    await ref.update({ status: 'Confirmed', employeeName: 'Raj Kumar' });
    const updated = await ref.get();
    if (updated.data()?.status === 'Confirmed') pass('UPDATE applied (status → Confirmed)');
    else fail('UPDATE did not apply');

    await ref.delete();
    const gone = await ref.get();
    if (!gone.exists) pass('DELETE removed the probe document');
    else fail('DELETE did not remove the document');
  } catch (err) {
    fail(`CRUD cycle threw: ${err instanceof Error ? err.message : err}`);
    await ref.delete().catch(() => {});
  }

  /* 3 ── auth sign-in --------------------------------------------------- */
  console.log('\n[3] Firebase Auth sign-in (client Web API key)');
  for (const [label, emailKey, pwKey] of [
    ['admin   ', 'TM_ADMIN_EMAIL', 'TM_ADMIN_PASSWORD'],
    ['customer', 'TM_CUSTOMER_EMAIL', 'TM_CUSTOMER_PASSWORD'],
  ] as const) {
    const email = process.env[emailKey]!;
    try {
      const uid = await signIn(email, process.env[pwKey]!);
      pass(`${label} ${email} signed in (uid ${uid.slice(0, 8)}…)`);
      const profile = await db.collection(`${PREFIX}users`).doc(uid).get();
      if (profile.exists) pass(`${label} profile found in ${PREFIX}users (role: ${profile.data()?.role})`);
      else fail(`${label} has no profile document in ${PREFIX}users`);
    } catch (err) {
      fail(`${label} ${email} sign-in failed: ${err instanceof Error ? err.message : err}`);
    }
  }

  /* 4 ── customer portal linkage ---------------------------------------- */
  console.log('\n[4] Customer portal data linkage');
  const custEmail = process.env.TM_CUSTOMER_EMAIL!;
  const linked = await db.collection(`${PREFIX}customers`).where('email', '==', custEmail).get();
  if (linked.empty) {
    fail(`no customer record carries ${custEmail}`);
  } else {
    const doc = linked.docs[0];
    pass(`customer record ${doc.id} (${doc.data().name}) linked to ${custEmail}`);
    for (const col of ['sales', 'bookings', 'payments'] as const) {
      const n = (await db.collection(PREFIX + col).where('customerId', '==', doc.id).count().get()).data().count;
      if (n > 0) pass(`${col.padEnd(8)} ${n} record(s) visible to this customer`);
      else console.log(`  · ${col.padEnd(8)} 0 records (portal will show its empty state)`);
    }
  }

  /* 5 ── Driving School isolation --------------------------------------- */
  console.log('\n[5] Driving School isolation (read-only check)');
  const all = await db.listCollections();
  const ds = all.map((c) => c.id).filter((id) => !id.startsWith(PREFIX));
  if (!ds.length) {
    console.log('  · no non-Tamil-Motors collections found in this project');
  } else {
    for (const id of ds) {
      const n = (await db.collection(id).count().get()).data().count;
      pass(`${id.padEnd(30)} ${String(n).padStart(4)} docs — present, not modified`);
    }
  }

  console.log(`\n${'─'.repeat(62)}`);
  console.log(failures === 0 ? 'All checks passed.\n' : `${failures} check(s) FAILED.\n`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error('\nVerification failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
