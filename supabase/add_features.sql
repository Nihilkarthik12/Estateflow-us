-- ═══════════════════════════════════════════════════════════
-- EstateFlow US — Feature Migration
-- Run this once in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════

-- 1. Follow-up reminder + commission on leads
ALTER TABLE leads ADD COLUMN IF NOT EXISTS follow_up_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS commission_amount NUMERIC(12,2);

-- 2. Activity log per lead (calls, notes, emails, stage changes)
CREATE TABLE IF NOT EXISTS lead_activities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id     UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  type        TEXT NOT NULL DEFAULT 'note', -- 'note' | 'call' | 'email' | 'whatsapp' | 'stage_change'
  content     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "lead_activities_authenticated" ON lead_activities;
CREATE POLICY "lead_activities_authenticated" ON lead_activities
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
CREATE INDEX IF NOT EXISTS lead_activities_lead_id_idx ON lead_activities(lead_id);

-- 3. Rent payment history
CREATE TABLE IF NOT EXISTS rent_payments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  lease_id    UUID REFERENCES leases(id) ON DELETE SET NULL,
  amount      NUMERIC(12,2) NOT NULL,
  due_date    DATE NOT NULL,
  paid_date   DATE,
  status      TEXT DEFAULT 'pending', -- 'pending' | 'paid' | 'overdue'
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE rent_payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "rent_payments_anon_read" ON rent_payments;
CREATE POLICY "rent_payments_anon_read" ON rent_payments
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "rent_payments_auth_write" ON rent_payments;
CREATE POLICY "rent_payments_auth_write" ON rent_payments
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
CREATE INDEX IF NOT EXISTS rent_payments_tenant_id_idx ON rent_payments(tenant_id);

-- 4. Documents column on leases (array of {name, url, type})
ALTER TABLE leases ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb;

-- 5. Contact info on profiles (for tenant portal "contact agent" button)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone       TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS whatsapp    TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS brokerage_name TEXT;
