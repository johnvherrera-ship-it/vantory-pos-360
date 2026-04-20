import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Product, Sale, StockEntry, User, Store, POS, Fiado, CashRegister, CashHistoryRecord, SaaSClient } from '../types';
import { supabaseService } from '../services/supabaseService';
import { cacheService } from '../services/cacheService';
import { supabase } from '../lib/supabase';
import { registerQueueHandlers, CACHE_INVALIDATED_EVENT } from '../services/queueHandlers';

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
  activeStoreId: number;
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
  currentStore?: Store | null;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children, currentUser, currentPOS, currentStore }) => {
  const prevClientIdRef = React.useRef<string | number>(currentUser?.clientId ?? 'default');
  const reloadingRef = React.useRef<boolean>(false);
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
  // Source of truth: Supabase. Loaded via refetch effects below.
  const [inventory, setInventory] = useState<Product[]>([]);

  const [categories, setCategories] = useState<string[]>(() => {
    const clientId = currentUser?.clientId || 'default';
    const saved = localStorage.getItem(`vantory_categories_client_${clientId}`);
    return saved ? JSON.parse(saved) : ['Cerveza', 'Licor', 'Bebida', 'Snacks', 'Abarrotes', 'Limpieza'];
  });

  const [stockEntries, setStockEntries] = useState<StockEntry[]>([]);

  // ===== Sales =====
  const [salesHistory, setSalesHistory] = useState<Sale[]>([]);

  // ===== Cash Register =====
  const [cashRegisters, setCashRegisters] = useState<any[]>(() => {
    const clientId = currentUser?.clientId || 'default';
    const saved = localStorage.getItem(`vantory_cash_registers_client_${clientId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [cashHistory, setCashHistory] = useState<any[]>(() => {
    const clientId = currentUser?.clientId || 'default';
    const saved = localStorage.getItem(`vantory_cash_history_client_${clientId}`);
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
  const [fiados, setFiados] = useState<Fiado[]>([]);

  // ===== localStorage Persistence Effects (with client isolation) =====
  const getClientStorageKey = (baseKey: string) => {
    const clientId = currentUser?.clientId || 'default';
    return `${baseKey}_client_${clientId}`;
  };

  // Reload client-scoped data from localStorage when clientId changes (post-login)
  useEffect(() => {
    const cid = currentUser?.clientId || 'default';
    if (prevClientIdRef.current === cid) return;
    prevClientIdRef.current = cid;
    reloadingRef.current = true;

    const load = <T,>(key: string, fallback: T): T => {
      try {
        const raw = localStorage.getItem(`${key}_client_${cid}`);
        return raw ? (JSON.parse(raw) as T) : fallback;
      } catch {
        return fallback;
      }
    };

    // Supabase refetch effects will load inventory/sales/stockEntries/fiados.
    // Only load local caches for non-DB-backed resources.
    setCategories((prev) => load('vantory_categories', prev));
    setCashRegisters((prev) => load('vantory_cash_registers', prev));
    setCashHistory((prev) => load('vantory_cash_history', prev));

    // Release guard on next tick so persistence effects skip the transitional render
    const t = setTimeout(() => { reloadingRef.current = false; }, 0);
    return () => clearTimeout(t);
  }, [currentUser?.clientId]);

  // NOTE: inventory, salesHistory, stockEntries, fiados persist to Supabase (source of truth).
  // localStorage removed to avoid dual source of truth divergence. Cache-on-read only via initial useState.

  useEffect(() => {
    if (reloadingRef.current) return;
    localStorage.setItem(getClientStorageKey('vantory_categories'), JSON.stringify(categories));
  }, [categories, currentUser?.clientId]);

  useEffect(() => {
    if (reloadingRef.current) return;
    localStorage.setItem(getClientStorageKey('vantory_cash_registers'), JSON.stringify(cashRegisters));
  }, [cashRegisters, currentUser?.clientId]);

  useEffect(() => {
    if (reloadingRef.current) return;
    localStorage.setItem(getClientStorageKey('vantory_cash_history'), JSON.stringify(cashHistory));
  }, [cashHistory, currentUser?.clientId]);

  // ===== Data Isolation Helpers =====
  const activeClientId = currentUser?.clientId || 1;
  // Use 0 as sentinel value when no POS/Store is selected, not 1 (which might be a valid ID)
  const activePosId = currentPOS?.id || 0;
  const activeStoreId = currentStore?.id || currentPOS?.storeId || 0;

  useEffect(() => {
    localStorage.setItem('vantory_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    registerQueueHandlers();
    const loadInitialData = async () => {
      try {
        const clients = await supabaseService.getClients();
        if (clients.length > 0) {
          setVantoryClients(clients);
        }
      } catch (error) {
        console.error('Error loading clients from Supabase:', error);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    localStorage.setItem('vantory_saas_clients', JSON.stringify(vantoryClients));
  }, [vantoryClients]);

  useEffect(() => {
    if (!activeClientId) return;

    const refetchProducts = async () => {
      try {
        const products = await cacheService.getOrFetch(
          `products_${activeClientId}`,
          () => supabaseService.getProducts(activeClientId),
          5
        );
        setInventory(prev => {
          const keepLocal = prev.filter(p => p.clientId !== activeClientId);
          return [...keepLocal, ...products];
        });
      } catch (e) {
        console.error('Error loading inventory for clientId:', activeClientId, e);
      }
    };

    const refetchSales = async () => {
      try {
        const sales = await cacheService.getOrFetch(
          `sales_${activeClientId}`,
          () => supabaseService.getSales(activeClientId),
          3
        );
        setSalesHistory(prev => {
          const keepLocal = prev.filter(s => s.clientId !== activeClientId);
          return [...keepLocal, ...sales];
        });
      } catch (e) {
        console.error('Error loading sales for clientId:', activeClientId, e);
      }
    };

    const refetchStockEntries = async () => {
      try {
        const entries = await cacheService.getOrFetch(
          `stockEntries_${activeClientId}`,
          () => supabaseService.getStockEntries(activeClientId),
          5
        );
        setStockEntries(prev => {
          const keepLocal = prev.filter(e => e.clientId !== activeClientId);
          return [...keepLocal, ...entries];
        });
      } catch (e) {
        console.error('Error loading stock entries for clientId:', activeClientId, e);
      }
    };

    const refetchFiados = async () => {
      try {
        const fiados = await cacheService.getOrFetch(
          `fiados_${activeClientId}_${activeStoreId}`,
          () => supabaseService.getFiados(activeClientId, activeStoreId),
          5
        );
        setFiados(prev => {
          const keepLocal = prev.filter(f => !(f.clientId === activeClientId && f.storeId === activeStoreId));
          return [...keepLocal, ...fiados];
        });
      } catch (e) {
        console.error('Error loading fiados for clientId:', activeClientId, e);
      }
    };

    refetchProducts();
    refetchSales();
    refetchStockEntries();
    refetchFiados();

    const channel = supabase
      .channel(`client-${activeClientId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products', filter: `client_id=eq.${activeClientId}` }, refetchProducts)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sales', filter: `client_id=eq.${activeClientId}` }, refetchSales)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stock_entries', filter: `client_id=eq.${activeClientId}` }, refetchStockEntries)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fiados', filter: `client_id=eq.${activeClientId}` }, refetchFiados)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeClientId]);

  useEffect(() => {
    const loadStoresAndPOS = async () => {
      if (activeClientId && activeClientId !== 0) {
        try {
          const fetchedStores = await supabaseService.getStores(activeClientId);
          if (fetchedStores.length > 0) setStores(fetchedStores);

          const fetchedPOS = await supabaseService.getPOSMachines(activeClientId);
          if (fetchedPOS.length > 0) setPosMachines(fetchedPOS);
        } catch (error) {
          console.error('Error loading stores/POS from Supabase:', error);
        }
      }
    };
    loadStoresAndPOS();
  }, [activeClientId]);

  useEffect(() => {
    localStorage.setItem('vantory_stores', JSON.stringify(stores));
  }, [stores]);

  useEffect(() => {
    localStorage.setItem('vantory_pos', JSON.stringify(posMachines));
  }, [posMachines]);

  useEffect(() => {
    const handleCacheInvalidated = async (event: Event) => {
      const customEvent = event as CustomEvent;
      const { table, clientId } = customEvent.detail;

      if (clientId !== activeClientId) return;

      try {
        if (table === 'products') {
          const products = await supabaseService.getProducts(activeClientId);
          setInventory(prev => {
            const keepLocal = prev.filter(p => p.clientId !== activeClientId);
            return [...keepLocal, ...products];
          });
        } else if (table === 'sales') {
          const sales = await supabaseService.getSales(activeClientId);
          setSalesHistory(prev => {
            const keepLocal = prev.filter(s => s.clientId !== activeClientId);
            return [...keepLocal, ...sales];
          });
        } else if (table === 'stockEntries') {
          const entries = await supabaseService.getStockEntries(activeClientId);
          setStockEntries(prev => {
            const keepLocal = prev.filter(e => e.clientId !== activeClientId);
            return [...keepLocal, ...entries];
          });
        } else if (table === 'fiados') {
          const fiados = await supabaseService.getFiados(activeClientId, activeStoreId);
          setFiados(prev => {
            const keepLocal = prev.filter(f => !(f.clientId === activeClientId && f.storeId === activeStoreId));
            return [...keepLocal, ...fiados];
          });
        }
      } catch (e) {
        console.error(`Error refetching ${table}:`, e);
      }
    };

    window.addEventListener(CACHE_INVALIDATED_EVENT, handleCacheInvalidated);
    return () => window.removeEventListener(CACHE_INVALIDATED_EVENT, handleCacheInvalidated);
  }, [activeClientId, activeStoreId]);

  const createClientSetter = useCallback((globalSetter: any) => (action: any) => {
    globalSetter((prev: any[]) => {
      const otherData = prev.filter((item: any) => item.clientId !== activeClientId);
      const clientData = prev.filter((item: any) => item.clientId === activeClientId);
      let newClientData = typeof action === 'function' ? action(clientData) : action;
      newClientData = newClientData.map((item: any) => ({ ...item, clientId: activeClientId }));
      return [...otherData, ...newClientData];
    });
  }, [activeClientId]);

  // Scoped setter by clientId + storeId (for store-isolated resources)
  const createClientStoreSetter = useCallback((globalSetter: any) => (action: any) => {
    globalSetter((prev: any[]) => {
      const otherData = prev.filter((item: any) => !(item.clientId === activeClientId && (item.storeId ?? activeStoreId) === activeStoreId));
      const scopedData = prev.filter((item: any) => item.clientId === activeClientId && (item.storeId ?? activeStoreId) === activeStoreId);
      let newScopedData = typeof action === 'function' ? action(scopedData) : action;
      newScopedData = newScopedData.map((item: any) => ({ ...item, clientId: activeClientId, storeId: activeStoreId }));
      return [...otherData, ...newScopedData];
    });
  }, [activeClientId, activeStoreId]);

  const clientInventory = useMemo(
    () => inventory.filter(i => i.clientId === activeClientId && (activeStoreId === 0 || (i as any).storeId === activeStoreId)),
    [inventory, activeClientId, activeStoreId]
  );
  const setClientInventory = useCallback(createClientStoreSetter(setInventory), [createClientStoreSetter]);

  const clientSalesHistory = useMemo(
    () => salesHistory.filter(s => s.clientId === activeClientId && (activeStoreId === 0 || (s as any).storeId === activeStoreId)),
    [salesHistory, activeClientId, activeStoreId]
  );
  const setClientSalesHistory = useCallback(createClientStoreSetter(setSalesHistory), [createClientStoreSetter]);

  const clientStockEntries = useMemo(
    () => stockEntries.filter(e => e.clientId === activeClientId && (activeStoreId === 0 || (e as any).storeId === activeStoreId)),
    [stockEntries, activeClientId, activeStoreId]
  );
  const setClientStockEntries = useCallback(createClientStoreSetter(setStockEntries), [createClientStoreSetter]);

  const clientStores = useMemo(() => stores.filter(s => s.clientId === activeClientId), [stores, activeClientId]);
  const setClientStores = useCallback(createClientSetter(setStores), [createClientSetter]);

  const clientUsers = useMemo(() => users.filter(u => u.clientId === activeClientId), [users, activeClientId]);
  const setClientUsers = useCallback(createClientSetter(setUsers), [createClientSetter]);

  const clientFiados = useMemo(
    () => fiados.filter(f => f.clientId === activeClientId && (activeStoreId === 0 || (f as any).storeId === activeStoreId)),
    [fiados, activeClientId, activeStoreId]
  );
  const setClientFiados = useCallback(createClientStoreSetter(setFiados), [createClientStoreSetter]);

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
    activeStoreId,
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
