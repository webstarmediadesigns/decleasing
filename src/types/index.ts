// Credit Rating enum
export enum CreditRating {
  Excellent = 'Excellent',
  Good = 'Good',
  Fair = 'Fair',
  Poor = 'Poor',
}

// Deal Types
export enum DealType {
  Rental = 'Rental',
  Lease = 'Lease',
  Finance = 'Finance',
}

// Deal Stages
export enum DealStage {
  Lead = 'Lead',
  Qualification = 'Qualification',
  DealStructuring = 'Deal Structuring',
  DealApproved = 'Deal Approved',
  Settlement = 'Settlement',
  Delivery = 'Delivery',
  Completed = 'Completed',
}

// Transaction Types
export enum TransactionType {
  CustomerPayment = 'Customer Payment',
  DealerPayment = 'Dealer Payment',
  VendorPayment = 'Vendor Payment',
  Fee = 'Fee',
  Commission = 'Commission',
  Other = 'Other'
}

// Payment Methods
export enum PaymentMethod {
  Cash = 'Cash',
  Check = 'Check',
  WireTransfer = 'Wire Transfer',
  CreditCard = 'Credit Card',
  ACH = 'ACH',
  Other = 'Other'
}

// Payment Status
export enum PaymentStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Failed = 'Failed',
  Cancelled = 'Cancelled'
}

export enum CustomerIncentiveType {
  Rebate = 'Rebate',
  Loyalty = 'Loyalty',
  CollegeGraduate = 'College Graduate',
  Military = 'Military',
  FirstResponder = 'First Responder',
  Costco = 'Costco',
  SamsClub = 'Sams Club'
}

// Base interfaces
export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface Activity {
  id: string;
  type: 'note' | 'document' | 'status_change' | 'task' | 'email';
  description: string;
  createdBy: string;
  createdAt: string;
  relatedTo?: {
    type: 'customer' | 'deal' | 'dealership' | 'task';
    id: string;
  };
}

export interface TradeInVehicle {
  year: string;
  make: string;
  model: string;
  vin: string;
  estimatedPayoff: number;
  estimatedValue: number;
}

export interface CustomerIncentive {
  id: string;
  customerId: string;
  type: CustomerIncentiveType;
  verified: boolean;
  verificationDate?: string;
  documents?: Document[];
  createdAt: string;
  updatedAt: string;
}

// Settlement Transaction interface
export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  direction: 'in' | 'out';
  description: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  date: string;
  relatedParty: {
    type: 'customer' | 'dealer' | 'vendor';
    id: string;
    name: string;
  };
  documents?: Document[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Settlement Summary interface
export interface SettlementSummary {
  totalIncoming: number;
  totalOutgoing: number;
  profit: number;
  transactions: Transaction[];
  lastUpdated: string;
}

// Task interface
export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  completed: boolean;
  completedAt?: string;
  relatedTo?: {
    type: 'customer' | 'deal' | 'dealership';
    id: string;
  };
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

// Customer interface
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  documents: {
    driversLicense?: Document;
    insurance?: Document;
    creditApplication?: Document;
  };
  creditRating: CreditRating;
  currentMonthlyPayment?: number;
  negativeEquityAmount?: number;
  tradeInVehicle?: TradeInVehicle;
  activities: Activity[];
  incentives?: CustomerIncentive[];
  createdAt: string;
  updatedAt: string;
}

// Deal interface with type-specific fields
export interface BaseDeal {
  id: string;
  customerId: string;
  dealershipId: string;
  type: DealType;
  stage: DealStage;
  documents: Document[];
  activities: Activity[];
  notes: string;
  settlement?: SettlementSummary;
  createdAt: string;
  updatedAt: string;
}

export interface RentalDeal extends BaseDeal {
  type: DealType.Rental;
  rentalVehicleInfo: {
    year: string;
    make: string;
    model: string;
    vin?: string;
  };
  rentalPeriod: {
    start: string;
    end: string;
  };
  insuranceRequirements: string[];
  rate: {
    amount: number;
    period: 'daily' | 'weekly' | 'monthly';
  };
}

export interface LeaseDeal extends BaseDeal {
  type: DealType.Lease;
  vehicleOfInterest: {
    year: string;
    make: string;
    model: string;
    vin?: string;
  };
  leaseTerms: {
    months: number;
    miles: number;
  };
  creditApprovalStatus: 'pending' | 'approved' | 'denied';
  loyaltyProgramEligibility: boolean;
  incentives: Array<{
    name: string;
    amount: number;
    description: string;
  }>;
}

export interface FinanceDeal extends BaseDeal {
  type: DealType.Finance;
  vehicleOfInterest: {
    year: string;
    make: string;
    model: string;
    vin?: string;
  };
  loanTerm: number; // In months
  apr: number;
  downPayment: number;
  tradeInDetails: TradeInVehicle;
}

export type Deal = RentalDeal | LeaseDeal | FinanceDeal;

// Dealership interface
export interface Dealership {
  id: string;
  name: string;
  primaryContact: {
    name: string;
    email: string;
    phone: string;
    position: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  inventory?: string;
  specialPrograms: Array<{
    name: string;
    description: string;
    expirationDate?: string;
  }>;
  activities: Activity[];
  createdAt: string;
  updatedAt: string;
}