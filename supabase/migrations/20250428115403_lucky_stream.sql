/*
  # Initial Schema Setup for DEC Leasing CRM

  1. Tables
    - customers
    - deals
    - dealerships
    - tasks
    - documents
    - transactions
    - activities

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE credit_rating AS ENUM ('Excellent', 'Good', 'Fair', 'Poor');
CREATE TYPE deal_type AS ENUM ('Rental', 'Lease', 'Finance');
CREATE TYPE deal_stage AS ENUM ('Lead', 'Qualification', 'Deal Structuring', 'Deal Approved', 'Settlement', 'Delivery', 'Completed');
CREATE TYPE transaction_type AS ENUM ('Customer Payment', 'Dealer Payment', 'Vendor Payment', 'Fee', 'Commission', 'Other');
CREATE TYPE payment_method AS ENUM ('Cash', 'Check', 'Wire Transfer', 'Credit Card', 'ACH', 'Other');
CREATE TYPE payment_status AS ENUM ('Pending', 'Completed', 'Failed', 'Cancelled');
CREATE TYPE activity_type AS ENUM ('note', 'document', 'status_change', 'task', 'email');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');

-- Customers table
CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  street text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip text NOT NULL,
  credit_rating credit_rating NOT NULL,
  current_monthly_payment decimal,
  negative_equity_amount decimal,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Trade-in vehicles table
CREATE TABLE trade_in_vehicles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  year text NOT NULL,
  make text NOT NULL,
  model text NOT NULL,
  vin text NOT NULL,
  estimated_payoff decimal NOT NULL,
  estimated_value decimal NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Dealerships table
CREATE TABLE dealerships (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text NOT NULL,
  contact_position text NOT NULL,
  street text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip text NOT NULL,
  inventory_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Dealership special programs
CREATE TABLE dealership_programs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealership_id uuid REFERENCES dealerships(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  expiration_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Deals table
CREATE TABLE deals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  dealership_id uuid REFERENCES dealerships(id) ON DELETE CASCADE,
  type deal_type NOT NULL,
  stage deal_stage NOT NULL DEFAULT 'Lead',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Deal details tables for different types
CREATE TABLE rental_deals (
  deal_id uuid PRIMARY KEY REFERENCES deals(id) ON DELETE CASCADE,
  vehicle_year text NOT NULL,
  vehicle_make text NOT NULL,
  vehicle_model text NOT NULL,
  vehicle_vin text,
  rental_start timestamptz NOT NULL,
  rental_end timestamptz NOT NULL,
  insurance_requirements text[] NOT NULL,
  rate_amount decimal NOT NULL,
  rate_period text NOT NULL
);

CREATE TABLE lease_deals (
  deal_id uuid PRIMARY KEY REFERENCES deals(id) ON DELETE CASCADE,
  vehicle_year text NOT NULL,
  vehicle_make text NOT NULL,
  vehicle_model text NOT NULL,
  vehicle_vin text,
  lease_months integer NOT NULL,
  lease_miles integer NOT NULL,
  credit_approval_status text NOT NULL,
  loyalty_program_eligible boolean DEFAULT false
);

CREATE TABLE finance_deals (
  deal_id uuid PRIMARY KEY REFERENCES deals(id) ON DELETE CASCADE,
  vehicle_year text NOT NULL,
  vehicle_make text NOT NULL,
  vehicle_model text NOT NULL,
  vehicle_vin text,
  loan_term integer NOT NULL,
  apr decimal NOT NULL,
  down_payment decimal NOT NULL
);

-- Documents table
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  type text NOT NULL,
  url text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  uploaded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Transactions table
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  amount decimal NOT NULL,
  direction text NOT NULL,
  description text NOT NULL,
  payment_method payment_method NOT NULL,
  status payment_status NOT NULL,
  date timestamptz NOT NULL,
  related_party_type text NOT NULL,
  related_party_id uuid NOT NULL,
  related_party_name text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tasks table
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  assigned_to text NOT NULL,
  due_date timestamptz NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  related_type text,
  related_id uuid,
  priority task_priority NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Activities table
CREATE TABLE activities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  type activity_type NOT NULL,
  description text NOT NULL,
  created_by text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_in_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealership_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE lease_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON customers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON trade_in_vehicles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON dealerships
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON dealership_programs
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON deals
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON rental_deals
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON lease_deals
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON finance_deals
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON documents
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON transactions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON tasks
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON activities
  FOR SELECT TO authenticated USING (true);

-- Create policies for insert/update/delete
CREATE POLICY "Enable full access for authenticated users" ON customers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable full access for authenticated users" ON trade_in_vehicles
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable full access for authenticated users" ON dealerships
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable full access for authenticated users" ON dealership_programs
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable full access for authenticated users" ON deals
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable full access for authenticated users" ON rental_deals
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable full access for authenticated users" ON lease_deals
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable full access for authenticated users" ON finance_deals
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable full access for authenticated users" ON documents
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable full access for authenticated users" ON transactions
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable full access for authenticated users" ON tasks
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable full access for authenticated users" ON activities
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create indexes
CREATE INDEX customers_email_idx ON customers(email);
CREATE INDEX deals_customer_id_idx ON deals(customer_id);
CREATE INDEX deals_dealership_id_idx ON deals(dealership_id);
CREATE INDEX documents_entity_idx ON documents(entity_type, entity_id);
CREATE INDEX transactions_deal_id_idx ON transactions(deal_id);
CREATE INDEX tasks_related_idx ON tasks(related_type, related_id);
CREATE INDEX activities_entity_idx ON activities(entity_type, entity_id);