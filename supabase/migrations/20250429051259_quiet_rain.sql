/*
  # Add Customer Incentives Support

  1. New Tables
    - customer_incentives
      - id (uuid, primary key)
      - customer_id (uuid, references customers)
      - type (text)
      - verified (boolean)
      - verification_date (timestamptz)
      - documents (array of document references)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS on new table
    - Add policies for authenticated users
*/

-- Create customer incentives table
CREATE TABLE customer_incentives (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  type text NOT NULL,
  verified boolean DEFAULT false,
  verification_date timestamptz,
  documents jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE customer_incentives ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON customer_incentives
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable full access for authenticated users" ON customer_incentives
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create index
CREATE INDEX customer_incentives_customer_id_idx ON customer_incentives(customer_id);