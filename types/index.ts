import type { Timestamp } from 'firebase/firestore';

export type TS = Timestamp | { seconds: number; nanoseconds: number } | string | null;

export type Role = 'admin' | 'manager' | 'sales' | 'accountant' | 'customer';

export interface AppUser {
  id: string;
  uid: string;
  email: string;
  name: string;
  role: Role;
  createdAt?: TS;
}

export type CustomerStatus = 'lead' | 'interested' | 'booked' | 'customer';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  interestedBikeId?: string;
  purchasedBikeId?: string;
  assignedEmployeeId?: string;
  totalPurchase?: number;
  paymentStatus?: PaymentStatus;
  status: CustomerStatus;
  createdAt?: TS;
  updatedAt?: TS;
}

export type BikeCategory = 'Commuter' | 'Scooter' | 'Sports' | 'Premium' | 'Electric';
export type BikeStatus = 'available' | 'low_stock' | 'out_of_stock';

export interface Bike {
  id: string;
  slug: string;
  brand: string;
  model: string;
  variant: string;
  category: BikeCategory;
  price: number;
  engine: string;
  fuelType: string;
  transmission: string;
  mileage: string;
  color: string;
  colors?: string[];
  stock: number;
  status: BikeStatus;
  imageUrl?: string;
  features?: string[];
  specs?: Record<string, string>;
  description?: string;
  createdAt?: TS;
  updatedAt?: TS;
}

export type StockStatus = 'Available' | 'Reserved' | 'Sold' | 'In Service' | 'Incoming';

export interface InventoryItem {
  id: string;
  bikeId: string;
  brand: string;
  model: string;
  variant: string;
  color: string;
  vehicleNumber: string;
  engineNumber: string;
  chassisNumber: string;
  purchasePrice: number;
  sellingPrice: number;
  stockStatus: StockStatus;
  location: string;
  createdAt?: TS;
}

export type EmployeeRole = 'Sales Executive' | 'Sales Manager' | 'Accountant' | 'Service Advisor' | 'Admin';

export interface Employee {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: EmployeeRole;
  branch: string;
  monthlyTarget: number;
  monthlySales: number;
  salesCount: number;
  revenueGenerated: number;
  conversionRate: number;
  status: 'active' | 'inactive';
  joiningDate: string;
  createdAt?: TS;
}

export type PaymentStatus = 'paid' | 'partial' | 'pending';
export type SaleStatus =
  | 'Enquiry' | 'Quotation' | 'Booking' | 'Payment Pending'
  | 'Confirmed' | 'Delivered' | 'Cancelled';

export interface Sale {
  id: string;
  saleCode: string;
  customerId: string;
  customerName: string;
  bikeId: string;
  bikeName: string;
  employeeId: string;
  employeeName: string;
  basePrice: number;
  accessoriesAmount: number;
  discount: number;
  insuranceAmount: number;
  registrationAmount: number;
  financeCharges: number;
  otherCharges: number;
  finalAmount: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  saleStatus: SaleStatus;
  saleDate: string;
  expectedDelivery?: string;
  deliveryStatus?: string;
  createdAt?: TS;
}

export type TestDriveStatus = 'Requested' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No Show';

export interface TestDrive {
  id: string;
  name: string;
  phone: string;
  email: string;
  bikeId?: string;
  bikeName: string;
  date: string;
  time: string;
  location: string;
  employeeId?: string;
  employeeName?: string;
  status: TestDriveStatus;
  notes?: string;
  createdAt?: TS;
}

export type BookingStatus = 'Booked' | 'Payment Pending' | 'Ready for Delivery' | 'Delivered' | 'Cancelled';

export interface Booking {
  id: string;
  bookingCode: string;
  customerId: string;
  customerName: string;
  bikeId: string;
  bikeName: string;
  bookingAmount: number;
  bookingDate: string;
  employeeId: string;
  employeeName: string;
  paymentStatus: PaymentStatus;
  deliveryStatus: BookingStatus;
  createdAt?: TS;
}

export type FinanceStatus =
  | 'Not Applied' | 'Applied' | 'Documents Pending'
  | 'Under Review' | 'Approved' | 'Rejected' | 'Disbursed';

export interface FinanceApplication {
  id: string;
  customerId: string;
  customerName: string;
  bikeName: string;
  loanAmount: number;
  downPayment: number;
  financeCompany: string;
  emi: number;
  tenure: number;
  interestRate: number;
  status: FinanceStatus;
  createdAt?: TS;
}

export type InsuranceStatus = 'Active' | 'Expiring Soon' | 'Expired';

export interface InsuranceRecord {
  id: string;
  customerId: string;
  customerName: string;
  bikeName: string;
  company: string;
  policyNumber: string;
  policyStart: string;
  policyExpiry: string;
  premium: number;
  status: InsuranceStatus;
  createdAt?: TS;
}

export interface Payment {
  id: string;
  paymentCode: string;
  customerId: string;
  customerName: string;
  saleId: string;
  amount: number;
  method: 'Cash' | 'UPI' | 'Card' | 'Bank Transfer' | 'Finance';
  date: string;
  status: 'Success' | 'Pending' | 'Failed';
  createdAt?: TS;
}

export type ExpenseCategory =
  | 'Rent' | 'Salary' | 'Electricity' | 'Marketing'
  | 'Maintenance' | 'Transport' | 'Office' | 'Other';

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  employeeName: string;
  description: string;
  createdAt?: TS;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt?: TS;
  date: string;
}

export interface FollowUp {
  id: string;
  customerId: string;
  customerName: string;
  employeeName: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  note: string;
  done: boolean;
  createdAt?: TS;
}
