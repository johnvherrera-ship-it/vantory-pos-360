import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Product, Sale, StockEntry, User, Store, POS, Fiado, CashRegister, CashHistoryRecord, SaaSClient } from '../types';

interface AppContextType {
  // SaaS Clients
  vantoryClients: SaaSClient[];
  setVantoryClients: (clients: SaaSClient[] | ((prev: SaaSClient[]) => SaaSClient[])) => void;
  selectedClient: SaaSClient | null;
  setSelectedClient: (client: SaaSClient | null) => void;

  // Stores & POS
  stores: any[];
  setStores: (stores: any[] | ((prev: any[]) => any[])) => void;
  posMachines: POS[];
  setPosMachines: (pos: POS[] | ((prev: POS[]) => POS[])) => void;

  // Inventory & Stock
  inventory: Product[];
  setInventory: (inventory: Product[] | ((prev: Product[]) => Product[])) => void;
  categories: string[];
  setCategories: (categories: string[] | ((prev: string[]) => string[])) => void;
  stockEntries: StockEntry[];
  setStockEntries: (entries: StockEntry[] | ((prev: StockEntry[]) => StockEntry[])) => void;

  // Sales
  salesHistory: Sale[];
  setSalesHistory: (sales: Sale[] | ((prev: Sale[]) => Sale[])) => void;

  // Cash Register
  cashRegisters: CashRegister[];
  setCashRegisters: (registers: CashRegister[] | ((prev: CashRegister[]) => CashRegister[])) => void;
  cashHistory: CashHistoryRecord[];
  setCashHistory: (history: CashHistoryRecord[] | ((prev: CashHistoryRecord[]) => CashHistoryRecord[])) => void;

  // Users
  users: User[];
  setUsers: (users: User[] | ((prev: User[]) => User[])) => void;

  // Fiados
  fiados: Fiado[];
  setFiados: (fiados: Fiado[] | ((prev: Fiado[]) => Fiado[])) => void;

  // Data Isolation Helpers
  activeClientId: number;
  activePosId: number;
  clientInventory: Product[];
  setClientInventory: (action: any) => void;
  clientSalesHistory: Sale[];
  setClientSalesHistory: (action: any) => void;
  clientStockEntries: StockEntry[];
  setClientStockEntries: (action: any) => void;
  clientStores: any[];
  setClientStores: (action: any) => void;
  clientUsers: User[];
  setClientUsers: (action: any) => void;
  clientFiados: Fiado[];
  setClientFiados: (action: any) => void;
  clientCashHistory: CashHistoryRecord[];
  setClientCashHistory: (action: any) => void;
  clientCashRegister: CashRegister;
  setClientCashRegister: (register: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppContextProviderProps {
  children: React.ReactNode;
  currentUser?: User | null;
  currentPOS?: POS | null;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children, currentUser, currentPOS }) => {
  // ===== SaaS Clients =====
  const [vantoryClients, setVantoryClients] = useState(() => {
    const saved = localStorage.getItem('vantory_saas_clients');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Minimarket Don Tito', email: 'duoc@gmail.com', maxStores: 3, maxPosPerStore: 2, status: 'Activo', mrr: 49990, joinDate: '2024-01-15' },
      { id: 2, name: 'Ferretería San Juan', email: 'contacto@sanjuan.cl', maxStores: 1, maxPosPerStore: 1, status: 'Activo', mrr: 29990, joinDate: '2024-02-20' },
      { id: 3, name: 'Botillería El Paso', email: 'admin@elpaso.cl', maxStores: 1, maxPosPerStore: 2, status: 'Suspendido', mrr: 29990, joinDate: '2023-11-05' }
    ];
  });
  const [selectedClient, setSelectedClient] = useState<any>(null);

  // ===== Stores & POS =====
  const [stores, setStores] = useState(() => {
    const saved = localStorage.getItem('vantory_stores');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Local Centro', address: 'Av. Principal 123' },
      { id: 2, name: 'Sucursal Norte', address: 'Plaza Norte 456' },
      { id: 3, name: 'Bodega Sur', address: 'Parque Industrial 789' }
    ];
  });

  const [posMachines, setPosMachines] = useState(() => {
    const saved = localStorage.getItem('vantory_pos');
    return saved ? JSON.parse(saved) : [
      { id: 1, storeId: 1, name: 'Caja 1' },
      { id: 2, storeId: 1, name: 'Caja 2' },
      { id: 3, storeId: 2, name: 'Caja 1' },
      { id: 4, storeId: 3, name: 'Caja 1' }
    ];
  });

  // ===== Inventory & Stock =====
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('vantory_inventory');
    return saved ? JSON.parse(saved) : [
      { id: 1, clientId: 1, name: 'Cerveza Corona 330cc', category: 'Cerveza', cost: 900, price: 1500, stock: 48, sku: '7801', isFavorite: true, image: 'https://images.unsplash.com/photo-1614315584058-2200ed432b4b?auto=format&fit=crop&w=100&q=80' },
      { id: 2, clientId: 1, name: 'Pisco Mistral 35° 750cc', category: 'Licor', cost: 5000, price: 8500, stock: 12, sku: '7802', isFavorite: true, image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=100&q=80' },
      { id: 3, clientId: 1, name: 'Coca Cola 1.5L', category: 'Bebida', cost: 1200, price: 2100, stock: 5, sku: '7803', isFavorite: true, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=100&q=80' },
      { id: 4, clientId: 1, name: 'Papas Lays Clásicas 250g', category: 'Snacks', cost: 1500, price: 2800, stock: 15, sku: '7804', isFavorite: false, image: 'https://images.unsplash.com/photo-1566478989037-e924e5bbc31e?auto=format&fit=crop&w=100&q=80' },
    ];
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('vantory_categories');
    return saved ? JSON.parse(saved) : ['Cerveza', 'Licor', 'Bebida', 'Snacks', 'Abarrotes', 'Limpieza'];
  });

  const [stockEntries, setStockEntries] = useState(() => {
    const saved = localStorage.getItem('vantory_stock_entries');
    return saved ? JSON.parse(saved) : [
      { id: 1, clientId: 1, folio: 'ENT-4829', productName: 'iPhone 15 Pro Max 256GB', productId: 101, quantity: 24, date: '27 Oct, 23', user: 'J. Delgado', image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=100&q=80' },
      { id: 2, clientId: 1, folio: 'ENT-4828', productName: 'MacBook Air M2 13"', productId: 102, quantity: 10, date: '27 Oct, 23', user: 'A. María', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=100&q=80' },
    ];
  });

  // ===== Sales =====
  const [salesHistory, setSalesHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('vantory_sales_history');
    return saved ? JSON.parse(saved) : [];
  });

  // ===== Cash Register =====
  const [cashRegisters, setCashRegisters] = useState<any[]>(() => {
    const saved = localStorage.getItem('vantory_cash_registers');
    return saved ? JSON.parse(saved) : [];
  });

  const [cashHistory, setCashHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('vantory_cash_history');
    return saved ? JSON.parse(saved) : [];
  });

  // ===== Users =====
  const [users, setUsers] = useState<any[]>(() => {
    const saved = localStorage.getItem('vantory_users');
    let parsedUsers = saved ? JSON.parse(saved) : [
      { id: 1, clientId: 1, name: 'Admin Duoc', email: 'duoc@gmail.com', role: 'Administrador', status: 'Activo', modules: ['dashboard', 'inventory', 'sales', 'history', 'entries', 'kpis', 'users', 'fiados'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfLVv6ohrtIE1tV50hhfzyQoC_-ADrxKzmlZGDV-3q0wsLG0oX1rxHZAoGZubgfK_a8kAW7lNR4uR2hH9puFiqXk8uIk4cma4AtWee_CyfKF6Xp6ht64UImKASzqOvK5H9W5VV4O0aN6kidyheXojT3g5eweScDgb6ozL_VXSkV-76BPplDQ5Tv0RM7pj3-HTx49aYz2-_7Ugx32bVbSsdFpsgKrwX2L-igWxXkTVYVROb1d68R9o1_2kMqMveMbfIrDNeV36iemdh' },
      { id: 2, clientId: 1, name: 'Ricardo Soto', email: 'ricardo.soto@vantory.com', role: 'Cajero', status: 'Activo', modules: ['sales', 'history', 'fiados'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANLhG_VqVE9P2D6Y4Abt1EQQ6w4JzEk58-YOcokpbSuUEffULDW93Tw8zOeyen6LcqT2ayW9xRArIzn3W-KFIUxncjNunCHp2r_o96Hu_0uTQJSeiJ6GZjbjwK3MFaluU-O9uZ7_Z0QkaSIgWB-RJ59ueEM2ZWmfnQumxlTlZm14o7Xp9Cm7OV1h37XpeU73u-13lIgfcLTX9O8vZ5rdQR7M0FTTitZ449lqKcBW58Xa0BL9dGUdzP20WogyQUNh3Y-hFEXEsYYeJU' },
      { id: 3, clientId: 1, name: 'Camila Torres', email: 'camila.torres@vantory.com', role: 'Supervisor', status: 'Inactivo', modules: ['inventory', 'sales', 'history', 'entries', 'fiados'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2YwVdB_b2QnQwBF9HvODyoio55om9Cz0GFv0X3U2Aixo5U7V8wifpn0nvDDQxr5Gz6yK3VeFBp3iffrOS8ZIZO02de7auqPEKchOxNsqfbuG_sxCaWPhIu0aI4e29svlAFLeM3foK1ZJmTx2cjqxn20Gwvk8M_DxY-aSiFRSb491Fy2oZeUx-y6AambRwHtW_cc7CgrjDmVX3Cfk6FrosdizQqEglYknaujnW2wXppRO5p5DSk_wKyY2_0HzLqI9ryegATyXQYzhD' },
    ];

    // Auto-grant fiados to Admin if missing
    parsedUsers = parsedUsers.map((u: any) => {
      if (u.role === 'Administrador' && !u.modules.includes('fiados')) {
        return { ...u, modules: [...u.modules, 'fiados'] };
      }
      return u;
    });

    return parsedUsers;
  });

  // ===== Fiados =====
  const [fiados, setFiados] = useState<any[]>(() => {
    const saved = localStorage.getItem('vantory_fiados');
    return saved ? JSON.parse(saved) : [];
  });

  // ===== localStorage Persistence Effects =====
  useEffect(() => {
    localStorage.setItem('vantory_sales_history', JSON.stringify(salesHistory));
  }, [salesHistory]);

  useEffect(() => {
    localStorage.setItem('vantory_stock_entries', JSON.stringify(stockEntries));
  }, [stockEntries]);

  useEffect(() => {
    localStorage.setItem('vantory_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('vantory_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('vantory_cash_registers', JSON.stringify(cashRegisters));
  }, [cashRegisters]);

  useEffect(() => {
    localStorage.setItem('vantory_fiados', JSON.stringify(fiados));
  }, [fiados]);

  useEffect(() => {
    localStorage.setItem('vantory_cash_history', JSON.stringify(cashHistory));
  }, [cashHistory]);

  useEffect(() => {
    localStorage.setItem('vantory_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('vantory_saas_clients', JSON.stringify(vantoryClients));
  }, [vantoryClients]);

  useEffect(() => {
    localStorage.setItem('vantory_stores', JSON.stringify(stores));
  }, [stores]);

  useEffect(() => {
    localStorage.setItem('vantory_pos', JSON.stringify(posMachines));
  }, [posMachines]);

  // ===== Data Isolation Helpers =====
  const activeClientId = currentUser?.clientId || 1;
  const activePosId = currentPOS?.id || 1; // Will be updated when currentPOS is set in POSContext

  const createClientSetter = useCallback((globalSetter: any) => (action: any) => {
    globalSetter((prev: any[]) => {
      const otherData = prev.filter((item: any) => item.clientId !== activeClientId);
      const clientData = prev.filter((item: any) => item.clientId === activeClientId);
      let newClientData = typeof action === 'function' ? action(clientData) : action;
      newClientData = newClientData.map((item: any) => ({ ...item, clientId: activeClientId }));
      return [...otherData, ...newClientData];
    });
  }, [activeClientId]);

  const clientInventory = useMemo(() => inventory.filter(i => i.clientId === activeClientId), [inventory, activeClientId]);
  const setClientInventory = useCallback(createClientSetter(setInventory), [createClientSetter]);

  const clientSalesHistory = useMemo(() => salesHistory.filter(s => s.clientId === activeClientId), [salesHistory, activeClientId]);
  const setClientSalesHistory = useCallback(createClientSetter(setSalesHistory), [createClientSetter]);

  const clientStockEntries = useMemo(() => stockEntries.filter(e => e.clientId === activeClientId), [stockEntries, activeClientId]);
  const setClientStockEntries = useCallback(createClientSetter(setStockEntries), [createClientSetter]);

  const clientStores = useMemo(() => stores.filter(s => s.clientId === activeClientId), [stores, activeClientId]);
  const setClientStores = useCallback(createClientSetter(setStores), [createClientSetter]);

  const clientUsers = useMemo(() => users.filter(u => u.clientId === activeClientId), [users, activeClientId]);
  const setClientUsers = useCallback(createClientSetter(setUsers), [createClientSetter]);

  const clientFiados = useMemo(() => fiados.filter(f => f.clientId === activeClientId), [fiados, activeClientId]);
  const setClientFiados = useCallback(createClientSetter(setFiados), [createClientSetter]);

  const clientCashHistory = useMemo(() => cashHistory.filter(h => h.clientId === activeClientId && h.posId === activePosId), [cashHistory, activeClientId, activePosId]);
  const setClientCashHistory = useCallback((action: any) => {
    setCashHistory((prev: any[]) => {
      const otherData = prev.filter((item: any) => !(item.clientId === activeClientId && item.posId === activePosId));
      const clientData = prev.filter((item: any) => item.clientId === activeClientId && item.posId === activePosId);
      let newClientData = typeof action === 'function' ? action(clientData) : action;
      newClientData = newClientData.map((item: any) => ({ ...item, clientId: activeClientId, posId: activePosId }));
      return [...otherData, ...newClientData];
    });
  }, [activeClientId, activePosId]);

  const clientCashRegister = useMemo(() =>
    cashRegisters.find(cr => cr.posId === activePosId) || { isOpen: false, initialCash: 0, currentCash: 0, openedAt: null },
    [cashRegisters, activePosId]
  );
  const setClientCashRegister = useCallback((newRegister: any) => {
    setCashRegisters(prev => {
      const others = prev.filter(cr => cr.posId !== activePosId);
      return [...others, { ...newRegister, posId: activePosId }];
    });
  }, [activePosId]);

  const value: AppContextType = {
    vantoryClients,
    setVantoryClients,
    selectedClient,
    setSelectedClient,
    stores,
    setStores,
    posMachines,
    setPosMachines,
    inventory,
    setInventory,
    categories,
    setCategories,
    stockEntries,
    setStockEntries,
    salesHistory,
    setSalesHistory,
    cashRegisters,
    setCashRegisters,
    cashHistory,
    setCashHistory,
    users,
    setUsers,
    fiados,
    setFiados,
    activeClientId,
    activePosId,
    clientInventory,
    setClientInventory,
    clientSalesHistory,
    setClientSalesHistory,
    clientStockEntries,
    setClientStockEntries,
    clientStores,
    setClientStores,
    clientUsers,
    setClientUsers,
    clientFiados,
    setClientFiados,
    clientCashHistory,
    setClientCashHistory,
    clientCashRegister,
    setClientCashRegister,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContextProvider');
  }
  return context;
};
