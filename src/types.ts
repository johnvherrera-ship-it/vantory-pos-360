export interface CartItem {
  id: number;
  name: string;
  sku: string;
  price: number;
  cost: number;
  quantity: number;
  isFavorite?: boolean;
}

export interface User {
  id: number;
  clientId: number;
  storeId?: number | null;
  name: string;
  email: string;
  role: string;
  status: string;
  modules: string[];
  image?: string;
}

export interface Store {
  id: number;
  clientId: number;
  name: string;
  pin: string;
  address: string;
}

export interface POS {
  id: number;
  storeId: number;
  clientId: number;
  name: string;
  status?: string;
  lastSync?: string;
}

export interface Product {
  id: number;
  clientId: number;
  storeId: number;
  name: string;
  category: string;
  cost: number;
  price: number;
  stock: number;
  minStock?: number;
  unit?: string;
  sku: string;
  isFavorite: boolean;
  image: string;
  margin?: number;
}

export interface Sale {
  id: number;
  clientId: number;
  storeId: number;
  posId: number;
  date: string;
  total: number;
  subtotal?: number;
  paymentMethod: string;
  cart: CartItem[];
  user?: string;
  change?: number;
  fiadoInfo?: {
    clientName: string;
    dueDate: string;
  };
}

export interface StockEntry {
  id: number;
  clientId: number;
  storeId: number;
  folio: string;
  productName: string;
  productId: number;
  quantity: number;
  date: string;
  user: string;
  image: string;
}

export interface FiadoTransaction {
  id: number;
  date: string;
  amount: number;
  description: string;
}

export interface Fiado {
  id: number;
  clientId: number;
  storeId: number;
  name: string;
  phone: string;
  totalDebt: number;
  history: FiadoTransaction[];
}

export interface CashRegister {
  isOpen: boolean;
  initialCash: number;
  currentCash: number;
  openedAt: string | null;
  posId?: number;
}

export interface CashHistoryRecord {
  id: number;
  clientId: number;
  posId: number;
  openedAt: string;
  closedAt: string;
  initialCash: number;
  expectedCash: number;
  actualCash: number;
  difference: number;
  user: string;
  status: string;
}

export interface SaaSClient {
  id: number;
  name: string;
  email: string;
  maxStores: number;
  maxPosPerStore: number;
  status: string;
  mrr: number;
  joinDate: string;
}

export type PageName =
  | 'home' | 'features' | 'blog'
  | 'login' | 'lobby'
  | 'sales' | 'dashboard' | 'history' | 'entries' | 'kpis' | 'fiados'
  | 'superadmin-dashboard' | 'superadmin-clients' | 'superadmin-client-profile'
  | 'customer-view';
