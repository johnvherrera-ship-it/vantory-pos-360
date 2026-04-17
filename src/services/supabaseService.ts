import { supabase } from '../lib/supabase';
import { Product, SaaSClient, Sale, User, Store, POS } from '../types';

export const supabaseService = {
  // === Clients ===
  async getClients(): Promise<SaaSClient[]> {
    const { data, error } = await supabase
      .from('saas_clients')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data as SaaSClient[];
  },

  async deleteClient(clientId: number) {
    const { error } = await supabase
      .from('saas_clients')
      .delete()
      .eq('id', clientId);
    
    if (error) throw error;
    return true;
  },

  async upsertClient(client: Partial<SaaSClient>) {
    const upsertData: any = {
      name: client.name,
      email: client.email,
      max_stores: client.maxStores,
      max_pos_per_store: client.maxPosPerStore,
      mrr: client.mrr,
      status: client.status,
      join_date: client.joinDate
    };

    // Only include id if it's defined (for updates, not inserts)
    if (client.id) {
      upsertData.id = client.id;
    }

    const { data, error } = await supabase
      .from('saas_clients')
      .upsert(upsertData)
      .select();

    if (error) throw error;
    return data[0];
  },

  // === Inventory ===
  async getProducts(clientId: number): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('client_id', clientId);
    
    if (error) throw error;
    return data.map(p => ({
      ...p,
      clientId: p.client_id,
      category: p.category_id,
      stock: p.stock_quantity,
      minStock: p.min_stock,
      image: p.image_url
    })) as Product[];
  },

  async upsertProduct(product: Partial<Product> & { clientId: number }) {
    const { data, error } = await supabase
      .from('products')
      .upsert({
        id: product.id,
        client_id: product.clientId,
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
    return data[0];
  },

  async deleteProduct(productId: number) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) throw error;
    return true;
  },

  // === Users ===
  async getUsers(clientId?: number): Promise<User[]> {
    let query = supabase.from('users').select('*');
    if (clientId) query = query.eq('client_id', clientId);
    
    const { data, error } = await query.order('name');
    if (error) throw error;
    
    return data.map(u => ({
      ...u,
      clientId: u.client_id,
      storeId: u.store_id,
      modules: u.modules || []
    })) as User[];
  },

  async createUser(user: Partial<User> & { clientId: number; password?: string }) {
    const { data, error } = await supabase
      .from('users')
      .insert({
        client_id: user.clientId,
        store_id: user.storeId,
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        modules: user.modules,
        status: user.status || 'active',
        image_url: user.image
      })
      .select();

    if (error) throw error;
    return {
      ...data[0],
      clientId: data[0].client_id,
      storeId: data[0].store_id
    };
  },

  async updateUser(userId: number, updates: Partial<User>) {
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
    return data[0];
  },

  // === Stores & POS ===
  async getStores(clientId: number): Promise<Store[]> {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('client_id', clientId);
    
    if (error) throw error;
    return data.map(s => ({
      ...s,
      clientId: s.client_id
    })) as Store[];
  },

  async getPOSMachines(clientId: number): Promise<POS[]> {
    const { data, error } = await supabase
      .from('pos_machines')
      .select('*')
      .eq('client_id', clientId);
    
    if (error) throw error;
    return data.map(p => ({
      ...p,
      clientId: p.client_id,
      storeId: p.store_id
    })) as POS[];
  },

  async createStore(store: Partial<Store> & { client_id: number }) {
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

  async createPOS(pos: Partial<POS> & { client_id: number }) {
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
    
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('No se pudo crear la caja');

    return {
      ...data[0],
      clientId: data[0].client_id,
      storeId: data[0].store_id,
      id: data[0].id // Aseguramos el ID
    };
  },

  // === Sales ===
  async getSales(clientId: number): Promise<Sale[]> {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data.map(s => ({
      ...s,
      clientId: s.client_id,
      posId: s.pos_id,
      date: s.created_at,
      user: s.user_name
    })) as Sale[];
  },

  async createSale(sale: Omit<Sale, 'id'>) {
    const { data, error } = await supabase
      .from('sales')
      .insert({
        client_id: sale.clientId,
        pos_id: sale.posId,
        total: sale.total,
        payment_method: sale.paymentMethod,
        cart: sale.cart,
        user_name: sale.user
      })
      .select();
    
    if (error) throw error;
    return data[0];
  }
};
