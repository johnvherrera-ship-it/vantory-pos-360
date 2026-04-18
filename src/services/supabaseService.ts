import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Product, SaaSClient, Sale, User, Store, POS } from '../types';

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
  async getProducts(clientId: number, storeId?: number): Promise<Product[]> {
    if (notConfigured()) return [];
    try {
      let query = supabase.from('products').select('*').eq('client_id', clientId);
      if (storeId) query = query.eq('store_id', storeId);
      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map((p: any) => ({
        ...p,
        clientId: p.client_id,
        storeId: p.store_id,
        category: p.category_id,
        stock: p.stock_quantity,
        minStock: p.min_stock,
        image: p.image_url
      })) as Product[];
    } catch (e) {
      console.error('getProducts failed:', e);
      return [];
    }
  },

  async upsertProduct(product: Partial<Product> & { clientId: number }) {
    if (notConfigured()) return product;
    const { data, error } = await supabase
      .from('products')
      .upsert({
        id: product.id,
        client_id: product.clientId,
        store_id: (product as any).storeId,
        name: product.name,
        sku: product.sku,
        category_id: product.category,
        price: product.price,
        cost: product.cost,
        stock_quantity: product.stock,
        min_stock: product.minStock,
        unit: product.unit,
        image_url: product.image
      })
      .select();
    if (error) throw error;
    return data?.[0];
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
        user: s.user_name
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
          store_id: (sale as any).storeId,
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
  }
};
