-- ===== ÍNDICES PARA PERFORMANCE =====
-- Copia todo esto y pégalo en Supabase → SQL Editor

-- Products
CREATE INDEX IF NOT EXISTS idx_products_client_id ON products(client_id);
CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

-- Sales
CREATE INDEX IF NOT EXISTS idx_sales_client_id ON sales(client_id);
CREATE INDEX IF NOT EXISTS idx_sales_store_id ON sales(store_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(date DESC);

-- Fiados
CREATE INDEX IF NOT EXISTS idx_fiados_client_id ON fiados(client_id);
CREATE INDEX IF NOT EXISTS idx_fiados_store_id ON fiados(store_id);

-- Stock Entries
CREATE INDEX IF NOT EXISTS idx_stock_entries_client_id ON stock_entries(client_id);
CREATE INDEX IF NOT EXISTS idx_stock_entries_product_id ON stock_entries(product_id);

-- Users
CREATE INDEX IF NOT EXISTS idx_users_client_id ON users(client_id);

-- POS Machines
CREATE INDEX IF NOT EXISTS idx_pos_machines_store_id ON pos_machines(store_id);

-- Cash Registers
CREATE INDEX IF NOT EXISTS idx_cash_registers_client_id ON cash_registers(client_id);
CREATE INDEX IF NOT EXISTS idx_cash_registers_opened_at ON cash_registers(opened_at DESC);

-- Cash History
CREATE INDEX IF NOT EXISTS idx_cash_history_client_id ON cash_history(client_id);
CREATE INDEX IF NOT EXISTS idx_cash_history_opened_at ON cash_history(opened_at DESC);
