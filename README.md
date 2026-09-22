# Tamil Motors — Dealership Management Platform

A two-wheeler dealership demo platform for **Tamil Motors** (Coimbatore, Tamil Nadu),
built by **PubliqWebb Tech**. It has a public showroom website and an internal
dealership management system sharing one Next.js app.

Next.js 15 (App Router) · TypeScript · Tailwind CSS · Firebase Auth/Firestore · Recharts · Lucide

---

## Quick start

```bash
npm install
cp .env.example .env.local     # already provided as .env.local in this checkout
npm run dev                    # http://localhost:3000
```

### Demo accounts

| Role | Email | Password | Lands on |
|---|---|---|---|
| Administrator | `tamilmotors@admin.com` | `Tamil@motors` | `/admin/dashboard` |
| Customer | `arun.kumar@tamilmotors.demo` | `Customer@123` | `/customer/dashboard` |

Both accounts exist in Firebase Auth, carry a `role` custom claim, and have a
profile document in `tamilMotors_users`. The customer account is linked to
customer record `cust-04`, so the portal shows real sales, bookings and payments.

---

## Firebase

This project **shares** a Firebase project with the existing Driving School demo
(`driving-school-publiqwebb`). The two never touch each other's data:

* Tamil Motors reads/writes only `tamilMotors_*` collections.
* The Driving School collections are unprefixed (`students`, `classes`, `payments`…)
  and are left exactly as they were.
* The seed script hard-refuses any collection name that does not start with
  `tamilMotors_`, so a mistake cannot reach the other tenant.

### Collections

```
tamilMotors_users          tamilMotors_customers      tamilMotors_employees
tamilMotors_bikes          tamilMotors_inventory      tamilMotors_sales
tamilMotors_bookings       tamilMotors_testDrives     tamilMotors_payments
tamilMotors_finance        tamilMotors_insurance      tamilMotors_expenses
tamilMotors_notifications  tamilMotors_followups      tamilMotors_settings
```

### Environment

`.env.local` holds the Firebase Web SDK config (public by design — it ships to the
browser) plus **server-only** values that must never be prefixed with `NEXT_PUBLIC_`:

```
FIREBASE_ADMIN_CREDENTIALS=./driving-school-publiqwebb-firebase-adminsdk-fbsvc-*.json
TM_ADMIN_EMAIL / TM_ADMIN_PASSWORD
TM_CUSTOMER_EMAIL / TM_CUSTOMER_PASSWORD
```

The service-account key file and `.env.local` are both gitignored.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build (raises the Node heap — the default is too small for this app) |
| `npm run lint` | ESLint |
| `npm run seed` | Seeds the demo dataset; **skips** if data already exists |
| `npm run seed -- --force` | Clears `tamilMotors_*` and rebuilds the dataset from scratch |
| `npm run verify` | Live check: document counts, a real CRUD cycle, auth sign-in, portal linkage, Driving School isolation |
| `npm run verify:rules` | Exercises the deployed security rules as anonymous / customer / admin |
| `npm run rules:pull` | Downloads the live ruleset to `firestore.rules.live` |
| `npm run rules:deploy` | Publishes `firestore.rules` to the project |

### Demo dataset

25 bike models · 15 employees · 30 customers · 50 inventory units · 60 sales ·
40 test drives · 30 bookings · 60 payments · 20 finance applications ·
30 insurance policies · 40 expenses · notifications · follow-ups — **446 documents**.

It is generated from a seeded PRNG in `lib/tamil-motors/demo-data.ts`, so every
run produces the identical, internally consistent dataset. The same module backs
the in-app initializer at `/admin/settings/demo-data`.

---

## Security rules

`firestore.rules` contains the Driving School rules **verbatim** plus a Tamil
Motors section, because deploying replaces the ruleset for the whole project.
`firestore.rules.drivingschool-backup` is the pre-change ruleset, kept for rollback.

Roles come from the auth custom claim first (no extra document read), falling
back to the `tamilMotors_users` profile:

| Principal | Can do |
|---|---|
| Anonymous | Read the bike catalog and settings; create a test-drive request (`status: Requested`) and an enquiry lead (`status: lead`) |
| Customer | Read only their own customer record, sales, bookings, payments, insurance and test drives — via scoped queries |
| Sales / Manager / Accountant | Full operational access; money modules limited to admin, manager and accountant |
| Admin | Everything, including deletes |

`npm run verify:rules` asserts all of this, including that a customer cannot read
a collection unscoped, cannot self-promote to admin, and that a dealership admin
cannot reach Driving School data.

> Because a customer may not read whole collections, the portal uses scoped
> queries in `lib/tamil-motors/customer-portal.ts` rather than the admin-wide
> `useDealership()` hook.

---

## Routes

**Public** — `/` `/about` `/bikes` `/bikes/[slug]` `/services` `/test-drive`
`/finance` `/insurance` `/contact`

**Customer** — `/customer/login` `/customer/dashboard`

**Admin** — `/admin/login` `/admin/dashboard` `/admin/sales` `/admin/sales/new`
`/admin/sales/pending` `/admin/customers` `/admin/customers/[id]` `/admin/employees`
`/admin/employees/[id]` `/admin/inventory` `/admin/test-drives` `/admin/bookings`
`/admin/finance` `/admin/insurance` `/admin/payments` `/admin/expenses`
`/admin/revenue` `/admin/reports` `/admin/notifications` `/admin/advanced`
`/admin/settings` `/admin/settings/demo-data`

---

## Notes and known limits

* **Firebase Storage is not enabled on this project** — the bucket does not exist.
  Bike photos are therefore set by pasting a hosted image URL in
  *Inventory → Bike Models → Edit*. The upload button and
  `lib/firebase/storage.ts` are wired and will work as soon as Storage is turned
  on in the Firebase console; until then the upload shows a clear message instead
  of failing silently.
* **Bike imagery** ships as designed gradient cards, not photography. Supply the
  dealership's own photos via the image URL field — no manufacturer images are
  bundled, to avoid licensing problems.
* **Local-data fallback.** If a Firestore read fails or returns nothing, the UI
  falls back to the locally generated dataset so no screen renders empty. That is
  deliberate for demos, but the affected collections are logged to the console and
  shown as an amber banner on the admin dashboard, so a permissions regression is
  never silently disguised as real data.
* **Export buttons** (PDF / Excel / Print) and everything under
  `/admin/advanced` are intentionally locked and open the PubliqWebb Tech upsell
  modal with feature-specific copy.
* Prices, customers, staff and performance figures are **fictional demo data**.

---

Powered by **PubliqWebb Tech** · publiqwebb.com · publiqwebbtech@gmail.com · +91 96003 76168
