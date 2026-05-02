-- ===== RLS POLICIES PARA SEGURIDAD MULTI-TENANT =====
-- ANTES de ejecutar esto:
-- 1. Ve a cada tabla en Database → Tables
-- 2. Click RLS → Enable RLS en cada tabla
-- 3. LUEGO pega este script en SQL Editor

-- ===== PRODUCTS TABLE =====
CREATE POLICY "Products: SELECT own client"
ON products FOR SELECT
USING (client_id = (auth.jwt() ->> 'clientId')::int);

CREATE POLICY "Products: INSERT own client"
ON products FOR INSERT
WITH CHECK (client_id = (auth.jwt() ->> 'clientId')::int);

CREATE POLICY "Products: UPDATE own client"
ON products FOR UPDATE
USING (client_id = (auth.jwt() ->> 'clientId')::int);

CREATE POLICY "Products: DELETE own client"
ON products FOR DELETE
USING (client_id = (auth.jwt() ->> 'clientId')::int);

-- ===== SALES TABLE =====
CREATE POLICY "Sales: SELECT own client"
ON sales FOR SELECT
USING (client_id = (auth.jwt() ->> 'clientId')::int);

CREATE POLICY "Sales: INSERT own client"
ON sales FOR INSERT
WITH CHECK (client_id = (auth.jwt() ->> 'clientId')::int);

CREATE POLICY "Sales: UPDATE own client"
ON sales FOR UPDATE
USING (client_id = (auth.jwt() ->> 'clientId')::int);

-- ===== FIADOS TABLE =====
CREATE POLICY "Fiados: SELECT own client"
ON fiados FOR SELECT
USING (client_id = (auth.jwt() ->> 'clientId')::int);

CREATE POLICY "Fiados: INSERT own client"
ON fiados FOR INSERT
WITH CHECK (client_id = (auth.jwt() ->> 'clientId')::int);

CREATE POLICY "Fiados: UPDATE own client"
ON fiados FOR UPDATE
USING (client_id = (auth.jwt() ->> 'clientId')::int);

-- ===== STOCK_ENTRIES TABLE =====
CREATE POLICY "StockEntries: SELECT own client"
ON stock_entries FOR SELECT
USING (client_id = (auth.jwt() ->> 'clientId')::int);

CREATE POLICY "StockEntries: INSERT own client"
ON stock_entries FOR INSERT
WITH CHECK (client_id = (auth.jwt() ->> 'clientId')::int);

-- ===== USERS TABLE =====
CREATE POLICY "Users: SELECT own client"
ON users FOR SELECT
USING (client_id = (auth.jwt() ->> 'clientId')::int);

CREATE POLICY "Users: UPDATE own user"
ON users FOR UPDATE
USING (id = auth.uid());

-- ===== STORES TABLE =====
CREATE POLICY "Stores: SELECT own client"
ON stores FOR SELECT
USING (client_id = (auth.jwt() ->> 'clientId')::int);

-- ===== POS_MACHINES TABLE =====
CREATE POLICY "POSMachines: SELECT own client via store"
ON pos_machines FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM stores
    WHERE stores.id = pos_machines.store_id
    AND stores.client_id = (auth.jwt() ->> 'clientId')::int
  )
);

-- ===== CASH_REGISTERS TABLE =====
CREATE POLICY "CashRegisters: SELECT own client"
ON cash_registers FOR SELECT
USING (client_id = (auth.jwt() ->> 'clientId')::int);

CREATE POLICY "CashRegisters: INSERT own client"
ON cash_registers FOR INSERT
WITH CHECK (client_id = (auth.jwt() ->> 'clientId')::int);

-- ===== CASH_HISTORY TABLE =====
CREATE POLICY "CashHistory: SELECT own client"
ON cash_history FOR SELECT
USING (client_id = (auth.jwt() ->> 'clientId')::int);

CREATE POLICY "CashHistory: INSERT own client"
ON cash_history FOR INSERT
WITH CHECK (client_id = (auth.jwt() ->> 'clientId')::int);
