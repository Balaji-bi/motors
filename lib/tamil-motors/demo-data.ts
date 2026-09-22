import { slugify } from '@/lib/utils';
import type {
  Bike, Booking, Customer, Employee, Expense, FinanceApplication, FollowUp,
  InsuranceRecord, InventoryItem, Notification, Payment, Sale,
  TestDrive, BikeCategory, EmployeeRole,
} from '@/types';

/* ------------------------------------------------------------------ *
 * Deterministic PRNG so the generated demo set is identical every run.
 * ------------------------------------------------------------------ */
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
const rng = makeRng(20260923);
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rng() * arr.length)];
const int = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;

function isoDaysAgo(days: number) {
  return new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
}
function isoDaysAhead(days: number) {
  return new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
}

/* ------------------------------------------------------------------ *
 * Reference lists — fictional demo data, Coimbatore / Tamil Nadu flavour.
 * ------------------------------------------------------------------ */
const CITIES = ['Coimbatore', 'Tiruppur', 'Erode', 'Pollachi', 'Mettupalayam', 'Sulur', 'Karamadai'];
const AREAS = [
  'Gandhipuram', 'RS Puram', 'Peelamedu', 'Saibaba Colony', 'Singanallur',
  'Ganapathy', 'Kuniamuthur', 'Vadavalli', 'Ramanathapuram', 'Thudiyalur',
];
const FIRST = [
  'Arun', 'Karthik', 'Priya', 'Vignesh', 'Harish', 'Divya', 'Sanjay', 'Keerthana',
  'Manoj', 'Sowmya', 'Gokul', 'Lakshmi', 'Bharath', 'Nandhini', 'Surya',
  'Aishwarya', 'Prakash', 'Revathi', 'Naveen', 'Deepa', 'Ramesh', 'Anitha',
  'Vimal', 'Janani', 'Saravanan', 'Meena', 'Ashwin', 'Kavitha', 'Muthu', 'Shalini',
];
const LAST = ['Kumar', 'S', 'M', 'R', 'P', 'Raj', 'Velan', 'Murugan', 'Krishnan', 'Balan'];

const COLORS = ['Racing Red', 'Pearl White', 'Matte Black', 'Metallic Blue', 'Titanium Grey', 'Sunset Orange'];
const FINANCE_COMPANIES = ['Bajaj Finserv (Demo)', 'TVS Credit (Demo)', 'HDB Financial (Demo)', 'Chola Finance (Demo)', 'Muthoot Capital (Demo)'];
const INSURERS = ['Demo General Insurance', 'Southern Shield Insurance (Demo)', 'Kovai Assure (Demo)', 'National Demo Insurance'];
const BRANCHES = ['Coimbatore — Gandhipuram', 'Coimbatore — Peelamedu', 'Tiruppur', 'Erode'];

const name = () => `${pick(FIRST)} ${pick(LAST)}`;
const phone = () => `+91 9${int(10, 99)}${int(1000000, 9999999)}`;
const emailFor = (n: string, i: number) =>
  `${slugify(n).replace(/-/g, '.')}.${i}@example.com`;

/* ------------------------------------------------------------------ *
 * Bikes — 25 demo models
 * ------------------------------------------------------------------ */
type BikeSeed = [string, string, string, BikeCategory, number, string, string, string, string];

const BIKE_SEEDS: BikeSeed[] = [
  ['TVS', 'Raider 125', 'Disc SmartXonnect', 'Commuter', 98500, '124.8cc', 'Petrol', '5-Speed Manual', '67 kmpl'],
  ['Honda', 'Shine 125', 'Drum CBS', 'Commuter', 86400, '123.94cc', 'Petrol', '5-Speed Manual', '65 kmpl'],
  ['Honda', 'Activa 6G', 'Standard', 'Scooter', 84200, '109.51cc', 'Petrol', 'CVT Automatic', '60 kmpl'],
  ['Yamaha', 'MT-15 V2', 'Dual Channel ABS', 'Sports', 178500, '155cc', 'Petrol', '6-Speed Manual', '48 kmpl'],
  ['Yamaha', 'R15 V4', 'Racing Blue', 'Sports', 195400, '155cc', 'Petrol', '6-Speed Manual', '46 kmpl'],
  ['TVS', 'Apache RTR 160 4V', 'Dual Channel', 'Sports', 132900, '159.7cc', 'Petrol', '5-Speed Manual', '45 kmpl'],
  ['Royal Enfield', 'Hunter 350', 'Metro Rebel', 'Premium', 186500, '349cc', 'Petrol', '5-Speed Manual', '36 kmpl'],
  ['Hero', 'Splendor Plus', 'i3S', 'Commuter', 79600, '97.2cc', 'Petrol', '4-Speed Manual', '70 kmpl'],
  ['Ola', 'S1 Pro', 'Gen 3', 'Electric', 147500, 'PMSM Motor', 'Electric', 'Single Speed', '195 km range'],
  ['TVS', 'Jupiter 110', 'SmartXonnect', 'Scooter', 88900, '113.3cc', 'Petrol', 'CVT Automatic', '62 kmpl'],
  ['Suzuki', 'Access 125', 'Ride Connect', 'Scooter', 92300, '124cc', 'Petrol', 'CVT Automatic', '58 kmpl'],
  ['Bajaj', 'Pulsar N160', 'Dual ABS', 'Sports', 138700, '164.82cc', 'Petrol', '5-Speed Manual', '44 kmpl'],
  ['Royal Enfield', 'Classic 350', 'Chrome', 'Premium', 219800, '349cc', 'Petrol', '5-Speed Manual', '35 kmpl'],
  ['Honda', 'SP 125', 'OBD2', 'Commuter', 94100, '123.94cc', 'Petrol', '5-Speed Manual', '64 kmpl'],
  ['Hero', 'Xtreme 125R', 'IBS', 'Commuter', 101200, '124.7cc', 'Petrol', '5-Speed Manual', '60 kmpl'],
  ['TVS', 'Ntorq 125', 'Race XP', 'Scooter', 104500, '124.79cc', 'Petrol', 'CVT Automatic', '52 kmpl'],
  ['Ather', '450X', '3.7 kWh', 'Electric', 159900, 'PMSM Motor', 'Electric', 'Single Speed', '150 km range'],
  ['Bajaj', 'Chetak Premium', '2024', 'Electric', 137300, 'BLDC Motor', 'Electric', 'Single Speed', '126 km range'],
  ['Yamaha', 'FZ-S FI V4', 'Deluxe', 'Sports', 134800, '149cc', 'Petrol', '5-Speed Manual', '50 kmpl'],
  ['Royal Enfield', 'Bullet 350', 'Standard', 'Premium', 197200, '349cc', 'Petrol', '5-Speed Manual', '37 kmpl'],
  ['Suzuki', 'Gixxer SF 155', 'Dual Tone', 'Sports', 143600, '155cc', 'Petrol', '5-Speed Manual', '45 kmpl'],
  ['Honda', 'Dio 125', 'H-Smart', 'Scooter', 91400, '123.92cc', 'Petrol', 'CVT Automatic', '57 kmpl'],
  ['TVS', 'iQube S', '3.4 kWh', 'Electric', 129500, 'BLDC Hub Motor', 'Electric', 'Single Speed', '145 km range'],
  ['Hero', 'Destini 125', 'Xtec', 'Scooter', 83700, '124.6cc', 'Petrol', 'CVT Automatic', '55 kmpl'],
  ['Bajaj', 'Dominar 400', 'Touring', 'Premium', 248900, '373.3cc', 'Petrol', '6-Speed Manual', '27 kmpl'],
];

const FEATURE_POOL = [
  'Digital LCD console', 'Bluetooth connectivity', 'Turn-by-turn navigation',
  'LED headlamp & DRL', 'Side-stand engine cut-off', 'USB charging port',
  'Tubeless tyres', 'Combi/Dual-channel braking', 'Ride mode selector',
  'Call & SMS alerts', 'Service due reminder', 'Anti-theft alert',
];

export function buildBikes(): Bike[] {
  return BIKE_SEEDS.map(([brand, model, variant, category, price, engine, fuelType, transmission, mileage], i) => {
    const stock = [0, 2, 3, 4, 6, 8, 9, 11, 14, 17][i % 10];
    const colors = [COLORS[i % COLORS.length], COLORS[(i + 2) % COLORS.length], COLORS[(i + 4) % COLORS.length]];
    return {
      id: `bike-${String(i + 1).padStart(2, '0')}`,
      slug: slugify(`${brand} ${model}`),
      brand, model, variant, category, price, engine, fuelType, transmission, mileage,
      color: colors[0],
      colors,
      stock,
      status: stock === 0 ? 'out_of_stock' : stock <= 3 ? 'low_stock' : 'available',
      features: [
        FEATURE_POOL[i % FEATURE_POOL.length],
        FEATURE_POOL[(i + 3) % FEATURE_POOL.length],
        FEATURE_POOL[(i + 5) % FEATURE_POOL.length],
        FEATURE_POOL[(i + 8) % FEATURE_POOL.length],
        FEATURE_POOL[(i + 10) % FEATURE_POOL.length],
      ],
      specs: {
        Engine: engine,
        'Fuel Type': fuelType,
        Transmission: transmission,
        Mileage: mileage,
        'Kerb Weight': `${int(108, 191)} kg`,
        'Fuel Tank': fuelType === 'Electric' ? 'N/A (Battery)' : `${(int(90, 150) / 10).toFixed(1)} L`,
        'Brakes (Front)': 'Disc',
        'Brakes (Rear)': i % 3 === 0 ? 'Disc' : 'Drum',
        Warranty: '2 years / 30,000 km (demo terms)',
      },
      description: `The ${brand} ${model} ${variant} is part of the Tamil Motors demo showroom line-up in ${category.toLowerCase()} segment. Figures shown are demo values for this demonstration platform.`,
    } satisfies Bike;
  });
}

/* ------------------------------------------------------------------ *
 * Employees — 15
 * ------------------------------------------------------------------ */
const EMP_NAMES = [
  'Raj Kumar', 'Praveen S', 'Arun Raj', 'Karthik M', 'Dinesh P',
  'Sathish Kumar', 'Vijay Anand', 'Ramya Devi', 'Naveen Chandra', 'Hari Prasad',
  'Selvi M', 'Gopinath R', 'Ashok Kumar', 'Bhuvana S', 'Manikandan T',
];
const EMP_ROLES: EmployeeRole[] = [
  'Sales Manager', 'Sales Executive', 'Sales Executive', 'Sales Executive', 'Sales Executive',
  'Sales Executive', 'Sales Executive', 'Accountant', 'Sales Executive', 'Service Advisor',
  'Sales Executive', 'Sales Executive', 'Admin', 'Service Advisor', 'Sales Executive',
];

export function buildEmployees(): Employee[] {
  return EMP_NAMES.map((n, i) => {
    const target = [1500000, 1200000, 1000000, 900000, 800000][i % 5];
    const achieved = Math.round(target * (0.52 + rng() * 0.62));
    return {
      id: `emp-${String(i + 1).padStart(2, '0')}`,
      name: n,
      phone: phone(),
      email: `${slugify(n)}@tamilmotors.demo`,
      role: EMP_ROLES[i],
      branch: BRANCHES[i % BRANCHES.length],
      monthlyTarget: target,
      monthlySales: achieved,
      salesCount: int(3, 14),
      revenueGenerated: Math.round(achieved * (2.4 + rng() * 2.6)),
      conversionRate: Math.round((28 + rng() * 44) * 10) / 10,
      status: i === 12 ? 'inactive' : 'active',
      joiningDate: isoDaysAgo(int(120, 1800)),
    } satisfies Employee;
  });
}

/* ------------------------------------------------------------------ *
 * Customers — 30
 * ------------------------------------------------------------------ */
export function buildCustomers(bikes: Bike[], employees: Employee[]): Customer[] {
  const statuses: Customer['status'][] = ['lead', 'interested', 'booked', 'customer'];
  return Array.from({ length: 30 }, (_, i) => {
    const n = name();
    const status = statuses[i % 4];
    const bike = pick(bikes);
    const purchased = status === 'customer';
    return {
      id: `cust-${String(i + 1).padStart(2, '0')}`,
      name: n,
      phone: phone(),
      email: emailFor(n, i + 1),
      address: `${int(1, 120)}, ${pick(AREAS)}`,
      city: pick(CITIES),
      interestedBikeId: bike.id,
      purchasedBikeId: purchased ? bike.id : undefined,
      assignedEmployeeId: pick(employees).id,
      totalPurchase: purchased ? bike.price + int(4000, 22000) : 0,
      paymentStatus: purchased ? (i % 5 === 0 ? 'partial' : 'paid') : 'pending',
      status,
    } satisfies Customer;
  });
}

/* ------------------------------------------------------------------ *
 * Inventory — 50 physical units
 * ------------------------------------------------------------------ */
export function buildInventory(bikes: Bike[]): InventoryItem[] {
  const stockStates: InventoryItem['stockStatus'][] =
    ['Available', 'Available', 'Available', 'Reserved', 'Sold', 'Sold', 'In Service', 'Incoming'];
  return Array.from({ length: 50 }, (_, i) => {
    const bike = bikes[i % bikes.length];
    return {
      id: `inv-${String(i + 1).padStart(3, '0')}`,
      bikeId: bike.id,
      brand: bike.brand,
      model: bike.model,
      variant: bike.variant,
      color: pick(bike.colors ?? COLORS),
      vehicleNumber: `TN 3${int(7, 9)} ${String.fromCharCode(65 + int(0, 25))}${String.fromCharCode(65 + int(0, 25))} ${int(1000, 9999)}`,
      engineNumber: `ENG${int(100000, 999999)}TM`,
      chassisNumber: `CHS${int(1000000, 9999999)}TM`,
      purchasePrice: Math.round(bike.price * 0.86),
      sellingPrice: bike.price,
      stockStatus: stockStates[i % stockStates.length],
      location: BRANCHES[i % BRANCHES.length],
    } satisfies InventoryItem;
  });
}

/* ------------------------------------------------------------------ *
 * Sales — 60
 * ------------------------------------------------------------------ */
const SALE_STATUSES: Sale['saleStatus'][] = [
  'Delivered', 'Delivered', 'Confirmed', 'Payment Pending',
  'Booking', 'Quotation', 'Enquiry', 'Cancelled',
];
const PAY_METHODS = ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Finance', 'Partial Payment'];

export function buildSales(customers: Customer[], bikes: Bike[], employees: Employee[]): Sale[] {
  const salesTeam = employees.filter((e) => e.role.includes('Sales'));
  return Array.from({ length: 60 }, (_, i) => {
    const customer = customers[i % customers.length];
    const bike = bikes[(i * 3) % bikes.length];
    const employee = salesTeam[i % salesTeam.length];
    const basePrice = bike.price;
    const accessories = int(0, 12) * 500;
    const discount = int(0, 14) * 1000;
    const insurance = int(6, 14) * 1000;
    const registration = int(6, 12) * 1000;
    const financeCharges = i % 3 === 0 ? int(2, 8) * 1000 : 0;
    const other = int(0, 4) * 500;
    const finalAmount = basePrice + accessories + insurance + registration + financeCharges + other - discount;
    const status = SALE_STATUSES[i % SALE_STATUSES.length];
    const saleDate = isoDaysAgo(int(0, 330));
    return {
      id: `sale-${String(i + 1).padStart(3, '0')}`,
      saleCode: `TM-S-${String(1001 + i)}`,
      customerId: customer.id,
      customerName: customer.name,
      bikeId: bike.id,
      bikeName: `${bike.brand} ${bike.model}`,
      employeeId: employee.id,
      employeeName: employee.name,
      basePrice,
      accessoriesAmount: accessories,
      discount,
      insuranceAmount: insurance,
      registrationAmount: registration,
      financeCharges,
      otherCharges: other,
      finalAmount,
      paymentMethod: PAY_METHODS[i % PAY_METHODS.length],
      paymentStatus: status === 'Delivered' ? 'paid' : status === 'Cancelled' ? 'pending' : i % 3 === 0 ? 'partial' : 'pending',
      saleStatus: status,
      saleDate,
      expectedDelivery: isoDaysAhead(int(-20, 25)),
      deliveryStatus: status === 'Delivered' ? 'Delivered' : 'Scheduled',
    } satisfies Sale;
  });
}

/* ------------------------------------------------------------------ *
 * Test drives — 40
 * ------------------------------------------------------------------ */
export function buildTestDrives(customers: Customer[], bikes: Bike[], employees: Employee[]): TestDrive[] {
  const statuses: TestDrive['status'][] = ['Requested', 'Confirmed', 'Completed', 'Completed', 'Cancelled', 'No Show'];
  const times = ['10:00 AM', '11:30 AM', '01:00 PM', '03:30 PM', '05:00 PM', '06:30 PM'];
  return Array.from({ length: 40 }, (_, i) => {
    const c = customers[(i * 7) % customers.length];
    const bike = bikes[(i * 5) % bikes.length];
    const emp = employees[i % employees.length];
    return {
      id: `td-${String(i + 1).padStart(3, '0')}`,
      name: c.name,
      phone: c.phone,
      email: c.email,
      bikeId: bike.id,
      bikeName: `${bike.brand} ${bike.model}`,
      date: i % 3 === 0 ? isoDaysAhead(int(1, 12)) : isoDaysAgo(int(1, 60)),
      time: times[i % times.length],
      location: BRANCHES[i % BRANCHES.length],
      employeeId: emp.id,
      employeeName: emp.name,
      status: statuses[i % statuses.length],
      notes: i % 4 === 0 ? 'Customer requested a weekend slot.' : '',
    } satisfies TestDrive;
  });
}

/* ------------------------------------------------------------------ *
 * Bookings — 30
 * ------------------------------------------------------------------ */
export function buildBookings(customers: Customer[], bikes: Bike[], employees: Employee[]): Booking[] {
  const statuses: Booking['deliveryStatus'][] =
    ['Booked', 'Payment Pending', 'Ready for Delivery', 'Delivered', 'Cancelled'];
  const salesTeam = employees.filter((e) => e.role.includes('Sales'));
  return Array.from({ length: 30 }, (_, i) => {
    const c = customers[(i * 3) % customers.length];
    const bike = bikes[(i * 4) % bikes.length];
    const emp = salesTeam[i % salesTeam.length];
    const status = statuses[i % statuses.length];
    return {
      id: `bk-${String(i + 1).padStart(3, '0')}`,
      bookingCode: `TM-B-${String(2001 + i)}`,
      customerId: c.id,
      customerName: c.name,
      bikeId: bike.id,
      bikeName: `${bike.brand} ${bike.model}`,
      bookingAmount: [5000, 10000, 15000, 25000][i % 4],
      bookingDate: isoDaysAgo(int(1, 90)),
      employeeId: emp.id,
      employeeName: emp.name,
      paymentStatus: status === 'Delivered' ? 'paid' : status === 'Payment Pending' ? 'pending' : 'partial',
      deliveryStatus: status,
    } satisfies Booking;
  });
}

/* ------------------------------------------------------------------ *
 * Payments — 60
 * ------------------------------------------------------------------ */
export function buildPayments(sales: Sale[]): Payment[] {
  const methods: Payment['method'][] = ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Finance'];
  return sales.map((s, i) => ({
    id: `pay-${String(i + 1).padStart(3, '0')}`,
    paymentCode: `TM-P-${String(3001 + i)}`,
    customerId: s.customerId,
    customerName: s.customerName,
    saleId: s.saleCode,
    amount: s.paymentStatus === 'partial' ? Math.round(s.finalAmount * 0.4) : s.finalAmount,
    method: methods[i % methods.length],
    date: s.saleDate,
    status: s.saleStatus === 'Cancelled' ? 'Failed' : s.paymentStatus === 'pending' ? 'Pending' : 'Success',
  }));
}

/* ------------------------------------------------------------------ *
 * Finance — 20
 * ------------------------------------------------------------------ */
export function buildFinance(customers: Customer[], bikes: Bike[]): FinanceApplication[] {
  const statuses: FinanceApplication['status'][] = [
    'Applied', 'Documents Pending', 'Under Review', 'Approved', 'Approved', 'Disbursed', 'Rejected', 'Not Applied',
  ];
  return Array.from({ length: 20 }, (_, i) => {
    const c = customers[(i * 2) % customers.length];
    const bike = bikes[(i * 6) % bikes.length];
    const down = int(10, 40) * 1000;
    const loan = Math.max(bike.price - down, 20000);
    const tenure = [12, 18, 24, 36, 48][i % 5];
    const rate = Math.round((9.5 + rng() * 6) * 10) / 10;
    const emi = Math.round((loan * (1 + (rate / 100) * (tenure / 12))) / tenure);
    return {
      id: `fin-${String(i + 1).padStart(3, '0')}`,
      customerId: c.id,
      customerName: c.name,
      bikeName: `${bike.brand} ${bike.model}`,
      loanAmount: loan,
      downPayment: down,
      financeCompany: FINANCE_COMPANIES[i % FINANCE_COMPANIES.length],
      emi,
      tenure,
      interestRate: rate,
      status: statuses[i % statuses.length],
    } satisfies FinanceApplication;
  });
}

/* ------------------------------------------------------------------ *
 * Insurance — 30
 * ------------------------------------------------------------------ */
export function buildInsurance(customers: Customer[], bikes: Bike[]): InsuranceRecord[] {
  return Array.from({ length: 30 }, (_, i) => {
    const c = customers[(i * 5) % customers.length];
    const bike = bikes[(i * 7) % bikes.length];
    const offset = [-40, -10, 5, 18, 45, 120, 250, 300][i % 8];
    const expiry = isoDaysAhead(offset);
    const status: InsuranceRecord['status'] =
      offset < 0 ? 'Expired' : offset <= 30 ? 'Expiring Soon' : 'Active';
    return {
      id: `ins-${String(i + 1).padStart(3, '0')}`,
      customerId: c.id,
      customerName: c.name,
      bikeName: `${bike.brand} ${bike.model}`,
      company: INSURERS[i % INSURERS.length],
      policyNumber: `TM/POL/${int(100000, 999999)}`,
      policyStart: isoDaysAgo(365 - offset),
      policyExpiry: expiry,
      premium: int(12, 38) * 250,
      status,
    } satisfies InsuranceRecord;
  });
}

/* ------------------------------------------------------------------ *
 * Expenses — 40
 * ------------------------------------------------------------------ */
export function buildExpenses(employees: Employee[]): Expense[] {
  const cats: Expense['category'][] =
    ['Rent', 'Salary', 'Electricity', 'Marketing', 'Maintenance', 'Transport', 'Office', 'Other'];
  const titleFor: Record<string, string> = {
    Rent: 'Showroom rent', Salary: 'Staff salary payout', Electricity: 'EB bill',
    Marketing: 'Local campaign spend', Maintenance: 'Workshop maintenance',
    Transport: 'Vehicle transport charges', Office: 'Office supplies', Other: 'Miscellaneous expense',
  };
  const amountFor: Record<string, [number, number]> = {
    Rent: [85000, 125000], Salary: [180000, 420000], Electricity: [12000, 28000],
    Marketing: [15000, 90000], Maintenance: [6000, 35000], Transport: [8000, 42000],
    Office: [3000, 18000], Other: [2000, 25000],
  };
  return Array.from({ length: 40 }, (_, i) => {
    const cat = cats[i % cats.length];
    const [lo, hi] = amountFor[cat];
    return {
      id: `exp-${String(i + 1).padStart(3, '0')}`,
      title: titleFor[cat],
      category: cat,
      amount: int(lo, hi),
      date: isoDaysAgo(int(0, 300)),
      employeeName: employees[i % employees.length].name,
      description: `${titleFor[cat]} recorded for ${BRANCHES[i % BRANCHES.length]} (demo entry).`,
    } satisfies Expense;
  });
}

/* ------------------------------------------------------------------ *
 * Notifications & follow-ups
 * ------------------------------------------------------------------ */
export function buildNotifications(sales: Sale[], testDrives: TestDrive[], bikes: Bike[]): Notification[] {
  const rows: Omit<Notification, 'id'>[] = [];
  testDrives.slice(0, 6).forEach((td) => {
    rows.push({
      type: 'Test Drive Request',
      title: 'New test drive request',
      message: `Test drive requested by ${td.name} for ${td.bikeName}.`,
      read: false, date: td.date,
    });
  });
  sales.slice(0, 5).forEach((s) => {
    rows.push({
      type: 'New Sale',
      title: 'Sale recorded',
      message: `${s.employeeName} closed a sale of ${s.bikeName} for ${s.customerName}.`,
      read: false, date: s.saleDate,
    });
  });
  bikes.filter((b) => b.status !== 'available').slice(0, 5).forEach((b) => {
    rows.push({
      type: 'Low Stock',
      title: b.status === 'out_of_stock' ? 'Out of stock' : 'Low stock alert',
      message: `${b.brand} ${b.model} has ${b.stock} unit(s) left in inventory.`,
      read: false, date: isoDaysAgo(int(0, 6)),
    });
  });
  sales.filter((s) => s.paymentStatus !== 'paid').slice(0, 4).forEach((s) => {
    rows.push({
      type: 'Pending Payment',
      title: 'Payment pending',
      message: `${s.customerName} has a pending balance on ${s.saleCode}.`,
      read: true, date: s.saleDate,
    });
  });
  rows.push({
    type: 'Finance Approval', title: 'Finance approved',
    message: 'Loan application for Royal Enfield Hunter 350 was approved by the demo financier.',
    read: true, date: isoDaysAgo(2),
  });
  rows.push({
    type: 'Insurance Expiry', title: 'Policy expiring soon',
    message: '4 customer policies expire within the next 30 days.',
    read: false, date: isoDaysAgo(1),
  });
  rows.push({
    type: 'Employee Target Alert', title: 'Target alert',
    message: '3 sales executives are below 60% of their monthly target.',
    read: false, date: isoDaysAgo(3),
  });
  return rows.map((r, i) => ({ id: `ntf-${String(i + 1).padStart(3, '0')}`, ...r }));
}

export function buildFollowUps(customers: Customer[], employees: Employee[]): FollowUp[] {
  const priorities: FollowUp['priority'][] = ['High', 'High', 'Medium', 'Low'];
  const notes = [
    'Waiting on finance documents.',
    'Asked for a call back after salary credit.',
    'Comparing with another showroom — send quotation.',
    'Test drive done, decision pending.',
    'Interested in exchange offer for old vehicle.',
  ];
  return customers.slice(0, 20).map((c, i) => ({
    id: `fu-${String(i + 1).padStart(3, '0')}`,
    customerId: c.id,
    customerName: c.name,
    employeeName: employees[i % employees.length].name,
    dueDate: isoDaysAhead(int(-5, 14)),
    priority: priorities[i % priorities.length],
    note: notes[i % notes.length],
    done: i % 5 === 0,
  }));
}

/* ------------------------------------------------------------------ *
 * One call builds the whole coherent dataset.
 * ------------------------------------------------------------------ */
export function buildDemoDataset() {
  const bikes = buildBikes();
  const employees = buildEmployees();
  const customers = buildCustomers(bikes, employees);
  const inventory = buildInventory(bikes);
  const sales = buildSales(customers, bikes, employees);
  const testDrives = buildTestDrives(customers, bikes, employees);
  const bookings = buildBookings(customers, bikes, employees);
  const payments = buildPayments(sales);
  const finance = buildFinance(customers, bikes);
  const insurance = buildInsurance(customers, bikes);
  const expenses = buildExpenses(employees);
  const notifications = buildNotifications(sales, testDrives, bikes);
  const followups = buildFollowUps(customers, employees);
  return {
    bikes, employees, customers, inventory, sales, testDrives,
    bookings, payments, finance, insurance, expenses, notifications, followups,
  };
}

/** Static catalogue used by public pages so the showroom renders before
 *  any Firestore data exists. */
export const STATIC_BIKES = buildBikes();
