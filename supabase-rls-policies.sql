-- Vantory POS 360 - RLS Policies
-- Execute these queries in Supabase SQL Editor
-- https://app.supabase.com/project/YOUR_PROJECT/sql

-- ============================================================================
-- STEP 1: Enable RLS on all tables
-- ============================================================================

ALTER TABLE saas_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE fiados ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_history ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 2: saas_clients - Full access (superadmin only in production)
-- ============================================================================

CREATE POLICY "saas_clients_select_all"
ON saas_clients FOR SELECT
USING (true);

CREATE POLICY "saas_clients_insert_all"
ON saas_clients FOR INSERT
WITH CHECK (true);

CREATE POLICY "saas_clients_update_all"
ON saas_clients FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "saas_clients_delete_all"
ON saas_clients FOR DELETE
USING (true);

-- ============================================================================
-- STEP 3: stores - Access by client_id
-- ============================================================================

CREATE POLICY "stores_select_own_client"
ON stores FOR SELECT
USING (true);

CREATE POLICY "stores_insert_own_client"
ON stores FOR INSERT
WITH CHECK (true);

CREATE POLICY "stores_update_own_client"
ON stores FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "stores_delete_own_client"
ON stores FOR DELETE
USING (true);

-- ============================================================================
-- STEP 4: pos_machines - Access by client_id and store_id
-- ============================================================================

CREATE POLICY "pos_machines_select_own_client"
ON pos_machines FOR SELECT
USING (true);

CREATE POLICY "pos_machines_insert_own_client"
ON pos_machines FOR INSERT
WITH CHECK (true);

CREATE POLICY "pos_machines_update_own_client"
ON pos_machines FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "pos_machines_delete_own_client"
ON pos_machines FOR DELETE
USING (true);

-- ============================================================================
-- STEP 5: users - Access by client_id
-- ============================================================================

CREATE POLICY "users_select_own_client"
ON users FOR SELECT
USING (true);

CREATE POLICY "users_insert_own_client"
ON users FOR INSERT
WITH CHECK (true);

CREATE POLICY "users_update_own"
ON users FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "users_delete_own_client"
ON users FOR DELETE
USING (true);

-- ============================================================================
-- STEP 6: products - Access by client_id
-- ============================================================================

CREATE POLICY "products_select_own_client"
ON products FOR SELECT
USING (true);

CREATE POLICY "products_insert_own_client"
ON products FOR INSERT
WITH CHECK (true);

CREATE POLICY "products_update_own_client"
ON products FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "products_delete_own_client"
ON products FOR DELETE
USING (true);

-- ============================================================================
-- STEP 7: sales - Access by client_id
-- ============================================================================

CREATE POLICY "sales_select_own_client"
ON sales FOR SELECT
USING (true);

CREATE POLICY "sales_insert_own_client"
ON sales FOR INSERT
WITH CHECK (true);

CREATE POLICY "sales_update_own_client"
ON sales FOR UPDATE
USING (true)
WITH CHECK (true);

-- ============================================================================
-- STEP 8: stock_entries - Access by client_id
-- ============================================================================

CREATE POLICY "stock_entries_select_own_client"
ON stock_entries FOR SELECT
USING (true);

CREATE POLICY "stock_entries_insert_own_client"
ON stock_entries FOR INSERT
WITH CHECK (true);

-- ============================================================================
-- STEP 9: fiados - Access by client_id
-- ============================================================================

CREATE POLICY "fiados_select_own_client"
ON fiados FOR SELECT
USING (true);

CREATE POLICY "fiados_insert_own_client"
ON fiados FOR INSERT
WITH CHECK (true);

CREATE POLICY "fiados_update_own_client"
ON fiados FOR UPDATE
USING (true)
WITH CHECK (true);

-- ============================================================================
-- STEP 10: cash_history - Access by client_id
-- ============================================================================

CREATE POLICY "cash_history_select_own_client"
ON cash_history FOR SELECT
USING (true);

CREATE POLICY "cash_history_insert_own_client"
ON cash_history FOR INSERT
WITH CHECK (true);

-- ============================================================================
-- NOTES FOR PRODUCTION:
-- ============================================================================
--
-- Current policies allow full access (true) because the app uses ANON key
-- and doesn't have Supabase Auth integrated yet.
--
-- For production with Supabase Auth, replace policies with:
--
-- WITH CHECK (client_id = (SELECT client_id FROM users WHERE id = auth.uid()))
--
-- This requires:
-- 1. Users must be created in auth.users (via Supabase Auth)
-- 2. Store auth.uid() in users.id column
-- 3. Every table must have client_id for scoping
-- 4. RLS checks will automatically scope data by client
--
-- ============================================================================
