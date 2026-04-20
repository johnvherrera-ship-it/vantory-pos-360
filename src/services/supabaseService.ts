import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Product, SaaSClient, Sale, User, Store, POS, StockEntry } from '../types';

const notConfigured = () => !isSupabaseConfigured;

export const supabaseService = {
  // === Clients ===
  async getClients(): Promise<SaaSClient[]> {
    if (notConfigured()) return [];
    try {
      const { data, error } = await supabase
        .from('saas_clients')
        .select('*')
        .order('name');
      if (error) throw error;
      return (data || []) as SaaSClient[];
    } catch (e) {
      console.error('getClients failed:', e);
      return [];
    }
  },

  async deleteClient(clientId: number) {
    if (notConfigured()) return true;
    const { error } = await supabase
      .from('saas_clients')
      .delete()
      .eq('id', clientId);
    if (error) throw error;
    return true;
  },

  async upsertClient(client: Partial<SaaSClient>) {
    if (notConfigured()) return client;
    const upsertData: any = {
      name: client.name,
      email: client.email,
      max_stores: client.maxStores,
      max_pos_per_store: client.maxPosPerStore,
      mrr: client.mrr,
      status: client.status,
      join_date: client.joinDate
    };
    if (client.id) upsertData.id = client.id;

    const { data, error } = await supabase
      .from('saas_clients')
      .upsert(upsertData)
      .select();
    if (error) throw error;
    return data?.[0];
  },

  // === Inventory ===
  async getProducts(clientId: number): Promise<Product[]> {
    if (notConfigured()) return [];
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('client_id', clientId);
      if (error) throw error;
      return (data || []).map((p: any) => ({
        ...p,
        clientId: p.client_id,
        storeId: p.store_id ?? 0,
        category: p.category,
        stock: p.stock ?? 0,
        minStock: p.stock ?? 0,
        image: p.image_url,
        isFavorite: !!p.is_favorite
      })) as Product[];
    } catch (e) {
      console.error('getProducts failed:', e);
      return [];
    }
  },

  _normalizeProduct(p: any): Product {
    return {
      ...p,
      clientId: p.client_id,
      storeId: p.store_id ?? 0,
      category: p.category,
      stock: p.stock ?? 0,
      minStock: p.stock ?? 0,
      image: p.image_url,
      isFavorite: !!p.is_favorite
    } as Product;
  },

  async upsertProduct(product: Partial<Product> & { clientId: number }): Promise<Product> {
    if (notConfigured()) return product as Product;
    const payload: any = {
      client_id: product.clientId,
      store_id: product.storeId ?? null,
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      cost: product.cost,
      stock: product.stock,
      image_url: product.image
    };
    if (product.id) payload.id = product.id;

    const { data, error } = await supabase
      .from('products')
      .upsert(payload)
      .select();
    if (error) {
      console.error('upsertProduct error:', error);
      throw error;
    }
    const result = data?.[0];
    if (!result) throw new Error('No se recibieron datos después de guardar el producto');
    return supabaseService._normalizeProduct(result);
  },

  async bulkUpsertProducts(products: Array<Partial<Product> & { clientId: number }>): Promise<Product[]> {
    if (notConfigured()) return products as Product[];
    if (!products.length) return [];
    const payload = products.map(p => {
      const row: any = {
        client_id: p.clientId,
        store_id: p.storeId ?? null,
        name: p.name,
        sku: p.sku,
        category: p.category,
        price: p.price,
        cost: p.cost,
        stock: p.stock,
        image_url: p.image
      };
      if (p.id) row.id = p.id;
      return row;
    });
    const { data, error } = await supabase.from('products').upsert(payload).select();
    if (error) {
      console.error('bulkUpsertProducts error:', error);
      throw error;
    }
    return (data || []).map(supabaseService._normalizeProduct);
  },

  async deleteProduct(productId: number) {
    if (notConfigured()) return true;
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
    if (error) throw error;
    return true;
  },

  // === Users ===
  async getUsers(clientId?: number): Promise<User[]> {
    if (notConfigured()) return [];
    try {
      let query = supabase.from('users').select('*');
      if (clientId) query = query.eq('client_id', clientId);
      const { data, error } = await query.order('name');
      if (error) throw error;
      return (data || []).map((u: any) => ({
        ...u,
        clientId: u.client_id,
        storeId: u.store_id,
        modules: u.modules || []
      })) as User[];
    } catch (e) {
      console.error('getUsers failed:', e);
      return [];
    }
  },

  async createUser(user: Partial<User> & { clientId: number; password?: string }) {
    if (notConfigured()) throw new Error('Backend no configurado');
    const { data, error } = await supabase
      .from('users')
      .insert({
        client_id: user.clientId,
        store_id: user.storeId,
        name: user.name,
        email: user.email,
        password: user.password || 'temp123',
        role: user.role,
        modules: user.modules,
        status: user.status || 'active',
        image_url: user.image
      })
      .select();
    if (error) {
      console.error('Supabase createUser error:', error);
      throw new Error(`No se pudo crear usuario: ${error.message}`);
    }
    return {
      ...data[0],
      clientId: data[0].client_id,
      storeId: data[0].store_id
    };
  },

  async updateUser(userId: number, updates: Partial<User>) {
    if (notConfigured()) return updates;
    const { data, error } = await supabase
      .from('users')
      .update({
        store_id: updates.storeId,
        name: updates.name,
        email: updates.email,
        role: updates.role,
        modules: updates.modules,
        status: updates.status,
        image_url: updates.image
      })
      .eq('id', userId)
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async deleteUser(userId: number) {
    if (notConfigured()) return true;
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    if (error) throw error;
    return true;
  },

  // === Stores & POS ===
  async getStores(clientId: number): Promise<Store[]> {
    if (notConfigured()) return [];
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('client_id', clientId);
      if (error) throw error;
      return (data || []).map((s: any) => ({
        ...s,
        clientId: s.client_id
      })) as Store[];
    } catch (e) {
      console.error('getStores failed:', e);
      return [];
    }
  },

  async getPOSMachines(clientId: number): Promise<POS[]> {
    if (notConfigured()) return [];
    try {
      const { data, error } = await supabase
        .from('pos_machines')
        .select('*')
        .eq('client_id', clientId);
      if (error) throw error;
      return (data || []).map((p: any) => ({
        ...p,
        clientId: p.client_id,
        storeId: p.store_id
      })) as POS[];
    } catch (e) {
      console.error('getPOSMachines failed:', e);
      return [];
    }
  },

  async createStore(store: Partial<Store> & { client_id: number }) {
    if (notConfigured()) throw new Error('Backend no configurado');
    const { data, error } = await supabase
      .from('stores')
      .insert({
        client_id: store.client_id,
        name: store.name,
        address: store.address,
        pin: store.pin
      })
      .select();
    if (error) throw error;
    return {
      ...data[0],
      clientId: data[0].client_id
    };
  },

  async createPOS(pos: Partial<POS> & { client_id: number; storeId: number }) {
    if (notConfigured()) throw new Error('Backend no configurado');
    const { data, error } = await supabase
      .from('pos_machines')
      .insert({
        client_id: pos.client_id,
        store_id: pos.storeId,
        name: pos.name,
        status: pos.status || 'Activa',
        last_sync: new Date().toISOString()
      })
      .select();
    if (error) {
      console.error('Supabase createPOS error:', error);
      throw new Error(`No se pudo crear caja: ${error.message}`);
    }
    if (!data || data.length === 0) throw new Error('No se pudo crear la caja');
    return {
      ...data[0],
      clientId: data[0].client_id,
      storeId: data[0].store_id,
      id: data[0].id
    };
  },

  // === Sales ===
  async getSales(clientId: number, storeId?: number): Promise<Sale[]> {
    if (notConfigured()) return [];
    try {
      let query = supabase
        .from('sales')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      if (storeId) query = query.eq('store_id', storeId);
      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map((s: any) => ({
        ...s,
        clientId: s.client_id,
        storeId: s.store_id,
        posId: s.pos_id,
        date: s.created_at,
        user: s.user_name,
        paymentMethod: s.payment_method
      })) as Sale[];
    } catch (e) {
      console.error('getSales failed:', e);
      return [];
    }
  },

  async createSale(sale: Omit<Sale, 'id'>) {
    if (notConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('sales')
        .insert({
          client_id: sale.clientId,
          store_id: (sale as any).storeId ?? null,
          pos_id: sale.posId,
          total: sale.total,
          payment_method: sale.paymentMethod,
          cart: sale.cart,
          user_name: sale.user
        })
        .select();
      if (error) throw error;
      return data?.[0];
    } catch (e) {
      console.error('createSale failed:', e);
      return null;
    }
  },

  async updateSale(sale: Sale) {
    if (notConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('sales')
        .update({
          total: sale.total,
          payment_method: sale.paymentMethod,
          cart: sale.cart,
          user_name: sale.user
        })
        .eq('id', sale.id)
        .select();
      if (error) throw error;
      return data?.[0];
    } catch (e) {
      console.error('updateSale failed:', e);
      return null;
    }
  },

  async deleteSale(saleId: number | string) {
    if (notConfigured()) return true;
    try {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', saleId);
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('deleteSale failed:', e);
      return false;
    }
  },

  async updateCashRegister(register: any) {
    if (notConfigured()) return register;
    try {
      const { data, error } = await supabase
        .from('cash_registers')
        .update({
          current_cash: register.currentCash,
          updated_at: new Date().toISOString()
        })
        .eq('id', register.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (e) {
      console.error('updateCashRegister failed:', e);
      throw e;
    }
  },

  async createCashHistory(record: any) {
    if (notConfigured()) return record;
    try {
      const { data, error } = await supabase
        .from('cash_history')
        .insert({
          client_id: record.clientId,
          store_id: record.storeId,
          pos_id: record.posId,
          opened_at: record.openedAt,
          closed_at: record.closedAt,
          initial_cash: record.initialCash,
          expected_cash: record.expectedCash,
          actual_cash: record.actualCash,
          difference: record.difference,
          user_name: record.user,
          status: record.status
        })
        .select();
      if (error) throw error;
      return data?.[0];
    } catch (e) {
      console.error('createCashHistory failed:', e);
      throw e;
    }
  },

  async decrementStockAtomic(clientId: number, items: Array<{ productId: number; quantity: number }>): Promise<Product[]> {
    if (notConfigured()) return [];
    if (!items.length) return [];

    const results: Product[] = [];
    for (const item of items) {
      const { data: current, error: fetchErr } = await supabase
        .from('products')
        .select('*')
        .eq('id', item.productId)
        .eq('client_id', clientId)
        .single();
      if (fetchErr) throw fetchErr;

      const newStock = Math.max(0, (current.stock ?? 0) - item.quantity);
      const { data: updated, error: updateErr } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', item.productId)
        .eq('client_id', clientId)
        .eq('stock', current.stock)
        .select()
        .single();

      if (updateErr) throw updateErr;
      if (!updated) throw new Error(`Stock conflict: Product ${item.productId} was modified concurrently`);

      results.push(supabaseService._normalizeProduct(updated));
    }
    return results;
  },

  // === Stock Entries ===
  async getStockEntries(clientId: number): Promise<StockEntry[]> {
    if (notConfigured()) return [];
    try {
      const { data, error } = await supabase
        .from('stock_entries')
        .select('*')
        .eq('client_id', clientId)
        .order('date', { ascending: false });
      if (error) throw error;
      return (data || []).map((entry: any) => ({
        ...entry,
        clientId: entry.client_id,
        productId: entry.product_id,
        productName: entry.product_name,
        userName: entry.user_name,
        imageUrl: entry.image_url
      })) as StockEntry[];
    } catch (e) {
      console.error('getStockEntries failed:', e);
      return [];
    }
  },

  async createStockEntry(entry: any) {
    if (notConfigured()) return entry;
    try {
      const { data, error } = await supabase
        .from('stock_entries')
        .insert({
          client_id: entry.clientId,
          product_id: entry.productId,
          product_name: entry.productName,
          quantity: entry.quantity,
          user_name: entry.user,
          folio: entry.folio,
          date: new Date().toISOString(),
          image_url: entry.image
        })
        .select();
      if (error) throw error;
      return data?.[0];
    } catch (e) {
      console.error('createStockEntry failed:', e);
      throw e;
    }
  },

  async bulkCreateStockEntries(entries: any[]) {
    if (notConfigured()) return entries;
    if (!entries.length) return [];
    try {
      const payload = entries.map(entry => ({
        client_id: entry.clientId,
        product_id: entry.productId,
        product_name: entry.productName,
        quantity: entry.quantity,
        user_name: entry.user,
        folio: entry.folio,
        date: entry.date ? new Date(entry.date).toISOString() : new Date().toISOString(),
        image_url: entry.image
      }));
      const { data, error } = await supabase
        .from('stock_entries')
        .insert(payload)
        .select();
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error('bulkCreateStockEntries failed:', e);
      throw e;
    }
  },

  // === Fiados ===
  _normalizeFiado(f: any): any {
    return {
      ...f,
      clientId: f.client_id,
      storeId: f.store_id,
      totalDebt: f.total_debt,
      customerName: f.name,
      createdAt: f.created_at
    };
  },

  async getFiados(clientId: number, storeId: number): Promise<any[]> {
    if (notConfigured()) return [];
    try {
      const { data, error } = await supabase
        .from('fiados')
        .select('*')
        .eq('client_id', clientId)
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(supabaseService._normalizeFiado);
    } catch (e) {
      console.error('getFiados failed:', e);
      return [];
    }
  },

  async createFiado(fiado: any) {
    if (notConfigured()) return fiado;
    try {
      const { data, error } = await supabase
        .from('fiados')
        .insert({
          client_id: fiado.clientId,
          name: fiado.name || fiado.customerName,
          phone: fiado.phone || '',
          total_debt: fiado.totalDebt || fiado.total || 0,
          history: fiado.history || []
        })
        .select();
      if (error) throw error;
      return data?.[0];
    } catch (e) {
      console.error('createFiado failed:', e);
      throw e;
    }
  },

  async updateFiado(fiado: any) {
    if (notConfigured()) return fiado;
    try {
      const { data, error } = await supabase
        .from('fiados')
        .update({
          name: fiado.name || fiado.customerName,
          phone: fiado.phone || '',
          total_debt: fiado.totalDebt || fiado.total || 0,
          history: fiado.history || []
        })
        .eq('id', fiado.id)
        .select();
      if (error) throw error;
      return data?.[0];
    } catch (e) {
      console.error('updateFiado failed:', e);
      throw e;
    }
  }
};
