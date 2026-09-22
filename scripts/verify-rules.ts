/**
 * Exercises the deployed security rules with the real client SDK, as three
 * different principals. Every expectation is asserted, so a regression in
 * either the Tamil Motors or Driving School rules shows up as a failure.
 *
 *   npx tsx scripts/verify-rules.ts
 */
import { config as loadEnv } from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import {
  getFirestore, collection, getDocs, doc, getDoc, setDoc, deleteDoc,
  query, where, limit,
} from 'firebase/firestore';

loadEnv({ path: '.env.local' });

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
});
const auth = getAuth(app);
const db = getFirestore(app);

let failures = 0;
function record(ok: boolean, label: string, detail = '') {
  if (ok) console.log(`  ✓ ${label}`);
  else { failures += 1; console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`); }
}

/** Asserts an operation is permitted. */
async function allow(label: string, op: () => Promise<unknown>) {
  try { await op(); record(true, `ALLOW  ${label}`); }
  catch (e) { record(false, `ALLOW  ${label}`, (e as Error).message.split('\n')[0]); }
}

/** Asserts an operation is refused by the rules. */
async function deny(label: string, op: () => Promise<unknown>) {
  try {
    await op();
    record(false, `DENY   ${label}`, 'operation unexpectedly SUCCEEDED');
  } catch (e) {
    const msg = (e as Error).message;
    record(/permission|insufficient|PERMISSION_DENIED/i.test(msg), `DENY   ${label}`, msg.split('\n')[0]);
  }
}

const readAll = (name: string) => () => getDocs(collection(db, name));
const readWhere = (name: string, field: string, value: string) => () =>
  getDocs(query(collection(db, name), where(field, '==', value), limit(20)));

async function main() {
  console.log('\nTamil Motors — security rule verification (client SDK)');
  console.log('─'.repeat(62));

  /* ── anonymous ────────────────────────────────────────────────────── */
  console.log('\n[anonymous visitor]');
  await allow('read tamilMotors_bikes (public catalog)', readAll('tamilMotors_bikes'));
  await allow('read tamilMotors_settings (public)', readAll('tamilMotors_settings'));
  await deny('read tamilMotors_customers', readAll('tamilMotors_customers'));
  await deny('read tamilMotors_sales', readAll('tamilMotors_sales'));
  await deny('read tamilMotors_employees', readAll('tamilMotors_employees'));
  await deny('read tamilMotors_payments', readAll('tamilMotors_payments'));
  await deny('read tamilMotors_testDrives', readAll('tamilMotors_testDrives'));
  await deny('write tamilMotors_bikes (price tampering)', () =>
    setDoc(doc(db, 'tamilMotors_bikes', 'bike-01'), { price: 1 }, { merge: true }));
  await deny('read Driving School students', readAll('students'));

  // The public forms must still work.
  const tdId = `rules-probe-td-${Date.now()}`;
  await allow('create tamilMotors_testDrives (public booking form)', () =>
    setDoc(doc(db, 'tamilMotors_testDrives', tdId), {
      name: 'Rules Probe', phone: '+919000000000', email: 'probe@tamilmotors.demo',
      bikeName: 'TVS Raider 125', date: '2026-10-01', time: '10:00 AM',
      location: 'Coimbatore — Gandhipuram', status: 'Requested', notes: '',
    }));
  await deny('create test drive already marked Confirmed', () =>
    setDoc(doc(db, 'tamilMotors_testDrives', `${tdId}-x`), {
      name: 'Rules Probe', phone: '+919000000000', status: 'Confirmed',
    }));

  const leadId = `rules-probe-lead-${Date.now()}`;
  await allow('create tamilMotors_customers as lead (enquiry form)', () =>
    setDoc(doc(db, 'tamilMotors_customers', leadId), {
      name: 'Rules Probe', phone: '+919000000000', email: 'probe@tamilmotors.demo',
      address: '', city: 'Coimbatore', status: 'lead',
    }));
  await deny('create customer with status=customer (privilege escalation)', () =>
    setDoc(doc(db, 'tamilMotors_customers', `${leadId}-x`), {
      name: 'Rules Probe', phone: '+919000000000', status: 'customer',
    }));

  /* ── customer ─────────────────────────────────────────────────────── */
  console.log('\n[signed-in customer]');
  await signInWithEmailAndPassword(auth, process.env.TM_CUSTOMER_EMAIL!, process.env.TM_CUSTOMER_PASSWORD!);
  const custUid = auth.currentUser!.uid;
  const accountSnap = await getDoc(doc(db, 'tamilMotors_users', custUid));
  const customerId = accountSnap.data()?.customerId as string | undefined;
  record(Boolean(customerId), `profile carries customerId (${customerId ?? 'MISSING'})`);

  await allow('read own tamilMotors_users profile', () => getDoc(doc(db, 'tamilMotors_users', custUid)));
  await allow('read own customer record', () => getDoc(doc(db, 'tamilMotors_customers', customerId!)));
  await allow('read own sales (scoped query)', readWhere('tamilMotors_sales', 'customerId', customerId!));
  await allow('read own bookings (scoped query)', readWhere('tamilMotors_bookings', 'customerId', customerId!));
  await allow('read own payments (scoped query)', readWhere('tamilMotors_payments', 'customerId', customerId!));
  await allow('read own insurance (scoped query)', readWhere('tamilMotors_insurance', 'customerId', customerId!));
  await allow('read own test drives (scoped by email)', readWhere('tamilMotors_testDrives', 'email', process.env.TM_CUSTOMER_EMAIL!));
  await allow('read public bike catalog', readAll('tamilMotors_bikes'));

  await deny('read ALL sales (unscoped)', readAll('tamilMotors_sales'));
  await deny('read ALL customers (unscoped)', readAll('tamilMotors_customers'));
  await deny('read tamilMotors_employees', readAll('tamilMotors_employees'));
  await deny('read tamilMotors_inventory', readAll('tamilMotors_inventory'));
  await deny('read tamilMotors_expenses', readAll('tamilMotors_expenses'));
  await deny("read another customer's record", () => getDoc(doc(db, 'tamilMotors_customers', 'cust-01')));
  await deny('self-promote to admin', () =>
    setDoc(doc(db, 'tamilMotors_users', custUid), { role: 'admin' }, { merge: true }));
  await deny('edit own sale record', () =>
    setDoc(doc(db, 'tamilMotors_sales', 'sale-001'), { finalAmount: 1 }, { merge: true }));
  await deny('read Driving School students', readAll('students'));

  /* ── admin ────────────────────────────────────────────────────────── */
  console.log('\n[signed-in dealership admin]');
  await signOut(auth);
  await signInWithEmailAndPassword(auth, process.env.TM_ADMIN_EMAIL!, process.env.TM_ADMIN_PASSWORD!);

  for (const c of [
    'customers', 'employees', 'sales', 'inventory', 'bookings',
    'testDrives', 'payments', 'finance', 'insurance', 'expenses',
    'notifications', 'followups',
  ]) {
    await allow(`read tamilMotors_${c}`, readAll(`tamilMotors_${c}`));
  }

  const probeId = `rules-probe-inv-${Date.now()}`;
  await allow('create inventory item', () =>
    setDoc(doc(db, 'tamilMotors_inventory', probeId), {
      bikeId: 'bike-01', brand: 'TVS', model: 'Raider 125', variant: 'Probe',
      color: 'Racing Red', vehicleNumber: 'TN 37 ZZ 0000', engineNumber: 'PROBE',
      chassisNumber: 'PROBE', purchasePrice: 1, sellingPrice: 1,
      stockStatus: 'Available', location: 'Coimbatore — Gandhipuram',
    }));
  await allow('update inventory stock status', () =>
    setDoc(doc(db, 'tamilMotors_inventory', probeId), { stockStatus: 'Reserved' }, { merge: true }));
  await allow('delete inventory item', () => deleteDoc(doc(db, 'tamilMotors_inventory', probeId)));
  await allow('update a bike price', () =>
    setDoc(doc(db, 'tamilMotors_bikes', 'bike-01'), { updatedAt: new Date() }, { merge: true }));

  // The write UIs added to Test Drives and Bookings must actually work.
  await allow('change a test drive status (Test Drives module)', () =>
    setDoc(doc(db, 'tamilMotors_testDrives', 'td-001'), { status: 'Confirmed' }, { merge: true }));
  await allow('change a booking delivery status (Bookings module)', () =>
    setDoc(doc(db, 'tamilMotors_bookings', 'bk-001'), { deliveryStatus: 'Ready for Delivery' }, { merge: true }));
  await allow('change a booking payment status (Bookings module)', () =>
    setDoc(doc(db, 'tamilMotors_bookings', 'bk-001'), { paymentStatus: 'partial' }, { merge: true }));
  await allow('adjust model stock (Bike Models view)', () =>
    setDoc(doc(db, 'tamilMotors_bikes', 'bike-02'), { stock: 7, status: 'available' }, { merge: true }));
  await allow('record a sale (New Sale wizard)', () =>
    setDoc(doc(db, 'tamilMotors_sales', 'rules-probe-sale'), {
      saleCode: 'TM-S-PROBE', customerId: 'cust-01', customerName: 'Rules Probe',
      bikeId: 'bike-01', bikeName: 'TVS Raider 125', employeeId: 'emp-02',
      employeeName: 'Praveen S', basePrice: 1, accessoriesAmount: 0, discount: 0,
      insuranceAmount: 0, registrationAmount: 0, financeCharges: 0, otherCharges: 0,
      finalAmount: 1, paymentMethod: 'Cash', paymentStatus: 'paid',
      saleStatus: 'Confirmed', saleDate: '2026-09-23',
    }));
  await allow('clean up probe sale', () => deleteDoc(doc(db, 'tamilMotors_sales', 'rules-probe-sale')));

  // Clean up the anonymous probes.
  await allow('clean up probe test drive', () => deleteDoc(doc(db, 'tamilMotors_testDrives', tdId)));
  await allow('clean up probe lead', () => deleteDoc(doc(db, 'tamilMotors_customers', leadId)));

  /* ── Driving School isolation ─────────────────────────────────────── */
  console.log('\n[Driving School isolation — dealership admin must NOT reach it]');
  await deny('read Driving School students', readAll('students'));
  await deny('write Driving School students', () =>
    setDoc(doc(db, 'students', 'probe'), { name: 'probe' }, { merge: true }));
  await deny('read Driving School instructors as write', () =>
    setDoc(doc(db, 'instructors', 'probe'), { name: 'probe' }, { merge: true }));

  await signOut(auth);
  console.log(`\n${'─'.repeat(62)}`);
  console.log(failures === 0 ? 'All rule expectations held.\n' : `${failures} expectation(s) FAILED.\n`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => { console.error('\nRule verification crashed:', e); process.exit(1); });
