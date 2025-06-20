import { 
  Customer,
  Deal,
  Dealership,
  Task,
  CreditRating,
  DealType,
  DealStage,
} from '../types';

// Helper to generate random IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Generate dates in ISO format
const today = new Date().toISOString();
const futureDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};
const pastDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

// Mock Customers
export const mockCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
    },
    documents: {
      driversLicense: {
        id: 'doc-1',
        name: 'Driver\'s License',
        type: 'image/jpeg',
        url: '/documents/drivers-license-1.jpg',
        uploadedAt: pastDate(5),
      },
      insurance: {
        id: 'doc-2',
        name: 'Insurance',
        type: 'application/pdf',
        url: '/documents/insurance-1.pdf',
        uploadedAt: pastDate(4),
      },
    },
    creditRating: CreditRating.Good,
    currentMonthlyPayment: 450,
    negativeEquityAmount: 2000,
    tradeInVehicle: {
      year: '2018',
      make: 'Honda',
      model: 'Civic',
      vin: 'JH2PC35051M200020',
      estimatedPayoff: 13000,
      estimatedValue: 11000,
    },
    activities: [
      {
        id: 'act-1',
        type: 'note',
        description: 'Customer inquired about Tesla Model 3 lease options',
        createdBy: 'Alice Johnson',
        createdAt: pastDate(7),
      },
      {
        id: 'act-2',
        type: 'document',
        description: 'Driver\'s license uploaded',
        createdBy: 'System',
        createdAt: pastDate(5),
      },
    ],
    createdAt: pastDate(7),
    updatedAt: pastDate(2),
  },
  {
    id: 'cust-2',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    phone: '(555) 987-6543',
    address: {
      street: '456 Oak Ave',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
    },
    documents: {
      driversLicense: {
        id: 'doc-3',
        name: 'Driver\'s License',
        type: 'image/jpeg',
        url: '/documents/drivers-license-2.jpg',
        uploadedAt: pastDate(10),
      },
      creditApplication: {
        id: 'doc-4',
        name: 'Credit Application',
        type: 'application/pdf',
        url: '/documents/credit-app-1.pdf',
        uploadedAt: pastDate(9),
      },
    },
    creditRating: CreditRating.Excellent,
    activities: [
      {
        id: 'act-3',
        type: 'note',
        description: 'Customer is interested in luxury SUV options',
        createdBy: 'Bob Miller',
        createdAt: pastDate(12),
      },
    ],
    createdAt: pastDate(14),
    updatedAt: pastDate(9),
  },
  {
    id: 'cust-3',
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    phone: '(555) 234-5678',
    address: {
      street: '789 Pine St',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001',
    },
    documents: {},
    creditRating: CreditRating.Fair,
    currentMonthlyPayment: 375,
    activities: [
      {
        id: 'act-4',
        type: 'note',
        description: 'First contact via website inquiry form',
        createdBy: 'System',
        createdAt: pastDate(3),
      },
    ],
    createdAt: pastDate(3),
    updatedAt: pastDate(3),
  },
];

// Mock Deals
export const mockDeals: Deal[] = [
  {
    id: 'deal-1',
    customerId: 'cust-1',
    dealershipId: 'dealer-1',
    type: DealType.Lease,
    stage: DealStage.DealStructuring,
    documents: [
      {
        id: 'doc-5',
        name: 'Pre-Approval Letter',
        type: 'application/pdf',
        url: '/documents/pre-approval-1.pdf',
        uploadedAt: pastDate(3),
      },
    ],
    activities: [
      {
        id: 'act-5',
        type: 'status_change',
        description: 'Deal moved from Qualification to Deal Structuring',
        createdBy: 'Alice Johnson',
        createdAt: pastDate(3),
      },
    ],
    notes: 'Customer is interested in a 36-month lease with 12,000 miles per year.',
    vehicleOfInterest: {
      year: '2023',
      make: 'Tesla',
      model: 'Model 3',
    },
    leaseTerms: {
      months: 36,
      miles: 12000,
    },
    creditApprovalStatus: 'approved',
    loyaltyProgramEligibility: false,
    incentives: [
      {
        name: 'First-Time Lessee',
        amount: 500,
        description: 'Discount for first-time lessees',
      },
    ],
    createdAt: pastDate(6),
    updatedAt: pastDate(3),
  },
  {
    id: 'deal-2',
    customerId: 'cust-2',
    dealershipId: 'dealer-2',
    type: DealType.Finance,
    stage: DealStage.Qualification,
    documents: [],
    activities: [
      {
        id: 'act-6',
        type: 'note',
        description: 'Customer requested information on financing options for BMW X5',
        createdBy: 'Bob Miller',
        createdAt: pastDate(11),
      },
    ],
    notes: 'Customer is looking for a 60-month loan with $10,000 down payment.',
    vehicleOfInterest: {
      year: '2023',
      make: 'BMW',
      model: 'X5',
    },
    loanTerm: 60,
    apr: 3.99,
    downPayment: 10000,
    tradeInDetails: {
      year: '2019',
      make: 'Audi',
      model: 'Q5',
      vin: 'WA1BNAFY2J2008189',
      estimatedPayoff: 25000,
      estimatedValue: 28000,
    },
    createdAt: pastDate(11),
    updatedAt: pastDate(10),
  },
  {
    id: 'deal-3',
    customerId: 'cust-3',
    dealershipId: 'dealer-3',
    type: DealType.Rental,
    stage: DealStage.Lead,
    documents: [],
    activities: [
      {
        id: 'act-7',
        type: 'note',
        description: 'Customer needs a month-long rental while car is being repaired',
        createdBy: 'Charlie Davis',
        createdAt: pastDate(2),
      },
    ],
    notes: 'Customer needs a rental for approximately 30 days',
    rentalVehicleInfo: {
      year: '2023',
      make: 'Toyota',
      model: 'Camry',
    },
    rentalPeriod: {
      start: futureDate(2),
      end: futureDate(32),
    },
    insuranceRequirements: [
      'Collision Coverage',
      'Liability Coverage',
    ],
    rate: {
      amount: 45,
      period: 'daily',
    },
    createdAt: pastDate(2),
    updatedAt: pastDate(2),
  },
];

// Mock Dealerships
export const mockDealerships: Dealership[] = [
  {
    id: 'dealer-1',
    name: 'Future Motors Tesla',
    primaryContact: {
      name: 'David Chen',
      email: 'david.chen@futuremotors.com',
      phone: '(555) 111-2222',
      position: 'Sales Manager',
    },
    address: {
      street: '100 Electric Ave',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
    },
    inventory: 'https://inventory.futuremotors.com',
    specialPrograms: [
      {
        name: 'Summer EV Promotion',
        description: '$1,000 off Model 3 leases',
        expirationDate: futureDate(60),
      },
    ],
    activities: [
      {
        id: 'act-8',
        type: 'note',
        description: 'Requested updated inventory list',
        createdBy: 'Alice Johnson',
        createdAt: pastDate(15),
      },
    ],
    createdAt: pastDate(180),
    updatedAt: pastDate(15),
  },
  {
    id: 'dealer-2',
    name: 'Premium Auto Group',
    primaryContact: {
      name: 'Jennifer Lopez',
      email: 'j.lopez@premiumauto.com',
      phone: '(555) 333-4444',
      position: 'Fleet Sales Director',
    },
    address: {
      street: '200 Luxury Lane',
      city: 'Chicago',
      state: 'IL',
      zip: '60602',
    },
    specialPrograms: [
      {
        name: 'Loyalty Discount',
        description: '1% APR reduction for returning customers',
      },
    ],
    activities: [],
    createdAt: pastDate(210),
    updatedAt: pastDate(45),
  },
  {
    id: 'dealer-3',
    name: 'City Rental Solutions',
    primaryContact: {
      name: 'Mark Thompson',
      email: 'mark@cityrentals.com',
      phone: '(555) 555-6666',
      position: 'Rental Manager',
    },
    address: {
      street: '300 Fleet St',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90002',
    },
    specialPrograms: [
      {
        name: 'Monthly Special',
        description: '20% off for rentals over 30 days',
        expirationDate: futureDate(30),
      },
    ],
    activities: [],
    createdAt: pastDate(150),
    updatedAt: pastDate(30),
  },
];

// Mock Tasks
export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Request updated insurance information',
    description: 'Current insurance document is expiring next month. Need updated policy information.',
    assignedTo: 'Alice Johnson',
    dueDate: futureDate(7),
    completed: false,
    relatedTo: {
      type: 'customer',
      id: 'cust-1',
    },
    priority: 'medium',
    createdAt: pastDate(2),
  },
  {
    id: 'task-2',
    title: 'Follow up on credit application',
    description: 'Credit application submitted but need to check on approval status.',
    assignedTo: 'Bob Miller',
    dueDate: futureDate(2),
    completed: false,
    relatedTo: {
      type: 'deal',
      id: 'deal-1',
    },
    priority: 'high',
    createdAt: pastDate(5),
  },
  {
    id: 'task-3',
    title: 'Prepare lease termination options',
    description: 'Customer\'s lease ending in 90 days. Prepare renewal options.',
    assignedTo: 'Charlie Davis',
    dueDate: futureDate(14),
    completed: false,
    relatedTo: {
      type: 'customer',
      id: 'cust-2',
    },
    priority: 'low',
    createdAt: pastDate(1),
  },
  {
    id: 'task-4',
    title: 'Update dealership special programs',
    description: 'New summer incentives available. Update in system.',
    assignedTo: 'Alice Johnson',
    dueDate: futureDate(3),
    completed: true,
    completedAt: pastDate(1),
    relatedTo: {
      type: 'dealership',
      id: 'dealer-1',
    },
    priority: 'medium',
    createdAt: pastDate(7),
  },
];