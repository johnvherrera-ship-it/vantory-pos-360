import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Search,
  Package,
  CreditCard,
  Banknote,
  Wallet,
  Monitor,
  Star,
  Filter,
  Printer,
  X,
  CheckCircle,
  AlertCircle,
  Bell,
  Settings,
  LogOut,
  ShoppingCart
} from 'lucide-react';
import { CartItem } from '../../types';
import { SideNavBar } from '../layout/SideNavBar';
import { NotificationsPanel } from '../shared/NotificationsPanel';
import { useAppContexts } from '../../hooks/useAppContexts';
import { supabaseService } from '../../services/supabaseService';
import { queueService } from '../../services/queueService';
import { cacheService } from '../../services/cacheService';

interface SalesDashboardProps {
  onSaleComplete?: (sale: any) => void;
}

export const SalesDashboard = ({ onSaleComplete }: SalesDashboardProps) => {
  const { ui, pos, app } = useAppContexts();
  const { setCurrentPage, setShowCashRegisterModal, setShowNotificationsPanel } = ui;
  const { currentUser, setCurrentUser, currentStore, currentPOS } = pos;
  const { clientInventory: inventory, setClientInventory: setInventory, clientFiados: fiados, setClientFiados: setFiados, clientCashRegister: cashRegister, setClientCashRegister: setCashRegister, clientUsers: users, setClientSalesHistory, activePosId, activeClientId, activeStoreId } = app;

  const [cart, setCart] = useState<CartItem[]>([]);
  const [barcode, setBarcode] = useState('');
  const [showCashModal, setShowCashModal] = useState(false);
  const [amountReceived, setAmountReceived] = useState('');
  const [lastScanned, setLastScanned] = useState<{name: string, price: number} | null>(null);

  const [showFiadoModal, setShowFiadoModal] = useState(false);
  const [selectedFiadoClient, setSelectedFiadoClient] = useState('');
  const [newFiadoClient, setNewFiadoClient] = useState({ name: '', phone: '', observation: '', creditLimit: '' });
  const [fiadoDueDate, setFiadoDueDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30); // Default 30 days
    return date.toISOString().split('T')[0];
  });
  const [surcharge, setSurcharge] = useState('');
  const [pausedSales, setPausedSales] = useState<{cart: CartItem[], total: number, timestamp: Date}[]>([]);
  const [showPausedModal, setShowPausedModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [lastSale, setLastSale] = useState<{cart: CartItem[], total: number, change: number, date: Date} | null>(null);
  const [pausedSalePopup, setPausedSalePopup] = useState<number | null>(null);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [dropdownRect, setDropdownRect] = React.useState<DOMRect | null>(null);
  const [stockAlert, setStockAlert] = useState<{ product: string; show: boolean } | null>(null);

  const updateDropdownPosition = () => {
    if (searchInputRef.current) {
      setDropdownRect(searchInputRef.current.getBoundingClientRect());
    }
  };

  const searchResults = barcode.trim() ? inventory.filter(p => {
    const lowerBarcode = barcode.toLowerCase();
    return p.name.toLowerCase().startsWith(lowerBarcode) ||
           p.sku.toLowerCase().startsWith(lowerBarcode);
  }).slice(0, 8) : [];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F10') {
        e.preventDefault();
        if (cart.length > 0) {
          if (!currentPOS) {
            alert('Debes seleccionar una caja primero');
            return;
          }
          if (!cashRegister.isOpen) {
            setShowCashRegisterModal(true);
            return;
          }
          setShowCashModal(true);
        }
      }
      if (e.key === 'Delete') {
        setCart([]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, cashRegister.isOpen, setShowCashRegisterModal, currentPOS]);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + (parseInt(surcharge) || 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const change = amountReceived ? Math.max(0, parseInt(amountReceived.replace(/\D/g, '')) - total) : 0;

  // Sync cart to localStorage for customer view (namespaced by clientId)
  useEffect(() => {
    localStorage.setItem(`pos-cart-client_${activeClientId}`, JSON.stringify(cart));
  }, [cart, activeClientId]);

  // Sync payment modal state in real-time to customer screen (namespaced by clientId)
  useEffect(() => {
    if (showCashModal) {
      const received = parseInt(amountReceived.replace(/\D/g, '')) || 0;
      localStorage.setItem(`pos-payment-client_${activeClientId}`, JSON.stringify({
        method: 'Efectivo',
        total,
        amountReceived: received,
        change: Math.max(0, received - total),
        sufficient: received >= total
      }));
    } else if (showFiadoModal) {
      const clientName = selectedFiadoClient === 'new'
        ? newFiadoClient.name
        : fiados.find(c => c.id.toString() === selectedFiadoClient)?.name || '';
      localStorage.setItem(`pos-payment-client_${activeClientId}`, JSON.stringify({
        method: 'Fiado',
        total,
        clientName
      }));
    } else {
      localStorage.removeItem(`pos-payment-client_${activeClientId}`);
    }
  }, [showCashModal, showFiadoModal, amountReceived, total, selectedFiadoClient, newFiadoClient.name, activeClientId]);

  const playBeep = () => {
    try {
      const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext);
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
      osc.onended = () => ctx.close();
    } catch {}
  };

  const handleAddToCart = (product: any) => {
    if (product.stock <= 0) {
      setStockAlert({ product: product.name, show: true });
      setTimeout(() => setStockAlert(null), 3000);
      return;
    }

    playBeep();

    // Limpiar venta completada anterior si comienza una nueva compra
    if (cart.length === 0) {
      localStorage.removeItem(`pos-sale-completed-client_${activeClientId}`);
    }

    setLastScanned({ name: product.name, price: product.price });
    const existing = cart.find(item => item.id === product.id);
    const cartQuantity = existing ? existing.quantity : 0;

    if (cartQuantity >= product.stock) {
      alert(`Stock insuficiente de ${product.name}`);
      return;
    }

    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (index: number, delta: number) => {
    const newCart = [...cart];
    const newQuantity = newCart[index].quantity + delta;

    if (newQuantity <= 0) {
      newCart.splice(index, 1);
    } else if (newQuantity > newCart[index].stock) {
      alert(`Stock insuficiente. Disponible: ${newCart[index].stock}`);
      return;
    } else {
      newCart[index].quantity = newQuantity;
    }

    setCart(newCart);
  };

  const handleSearchChange = (value: string) => {
    setBarcode(value);
    setSearchTerm(value); // Filtrar productos en tiempo real
  };

  const handleScan = () => {
    if (!barcode) return;
    playBeep();
    const searchTerm = barcode.toLowerCase().trim();

    // Buscar por SKU exacto primero
    let product = inventory.find(p => p.sku.toLowerCase() === searchTerm);

    // Si no encuentra por SKU, buscar por nombre exacto
    if (!product) {
      product = inventory.find(p => p.name.toLowerCase() === searchTerm);
    }

    // Si aún no encuentra, buscar por coincidencia parcial
    if (!product) {
      product = inventory.find(p =>
        p.sku.toLowerCase().includes(searchTerm) ||
        p.name.toLowerCase().includes(searchTerm)
      );
    }

    if (product) {
      handleAddToCart(product);
      setBarcode('');
    } else {
      alert(`Producto no encontrado: ${barcode}. Regístralo primero en Inventario.`);
    }
  };

  const handleConfirmSale = async (method: string) => {
    if (!cashRegister.isOpen) {
      setShowCashRegisterModal(true);
      return;
    }

    if (cart.length === 0) return;

    // Calculate profit for this sale
    const saleProfit = cart.reduce((sum, item) => {
      const cost = item.cost || 0;
      return sum + ((item.price - cost) * item.quantity);
    }, 0);

    // Deduct from inventory (optimistic UI update)
    const updatedInventory = inventory.map(invItem => {
      const cartItem = cart.find(c => c.id === invItem.id);
      if (cartItem) {
        return { ...invItem, stock: Math.max(0, invItem.stock - cartItem.quantity) };
      }
      return invItem;
    });
    setInventory(updatedInventory);

    // Validar stock final en BD antes de decrementar
    const decrementItems = cart
      .filter(ci => inventory.find(p => p.id === ci.id))
      .map(ci => ({ productId: ci.id, quantity: ci.quantity }));

    if (decrementItems.length) {
      const dbProducts = await supabaseService.getProducts(activeClientId).catch(() => []);
      if (dbProducts.length > 0) {
        for (const item of decrementItems) {
          const dbProduct = dbProducts.find(p => p.id === item.productId);
          if (!dbProduct || dbProduct.stock < item.quantity) {
            alert(`Stock insuficiente: ${inventory.find(p => p.id === item.productId)?.name}`);
            setInventory(dbProducts);
            return;
          }
        }
      }

      supabaseService.decrementStockAtomic(activeClientId, decrementItems)
        .then((fresh) => {
          if (fresh.length) {
            setInventory((prev: any[]) =>
              prev.map(p => {
                const updated = fresh.find(f => f.id === p.id);
                return updated ? updated : p;
              })
            );
          }
        })
        .catch(err => {
          alert('Error al procesar venta: ' + err.message);
          console.error('decrementStockAtomic error:', err);
        });
    }

    // Save last sale for ticket
    const saleId = Date.now();
    const saleData = {
      id: saleId,
      clientId: activeClientId,
      storeId: activeStoreId,
      posId: activePosId,
      cart: [...cart],
      total,
      subtotal,
      profit: saleProfit,
      change,
      date: new Date().toISOString(),
      paymentMethod: method,
      user: currentUser?.name || 'Sistema'
    };

    if (method === 'Efectivo') {
      const updatedCashRegister = { ...cashRegister, currentCash: cashRegister.currentCash + total };
      setCashRegister(updatedCashRegister);
      supabaseService.updateCashRegister(updatedCashRegister)
        .catch(err => console.error('updateCashRegister persist error:', err));
    } else if (method === 'Fiado') {
      let updatedFiados = [...fiados];
      let fiadoToSync: any = null;

      if (selectedFiadoClient === 'new') {
        const newFiadoPayload: any = {
          id: Date.now(),
          clientId: activeClientId,
          storeId: activeStoreId,
          name: newFiadoClient.name,
          phone: newFiadoClient.phone,
          observation: newFiadoClient.observation,
          creditLimit: newFiadoClient.creditLimit ? parseInt(newFiadoClient.creditLimit) : 0,
          totalDebt: total,
          history: [{
            id: Date.now(),
            date: new Date().toISOString(),
            dueDate: fiadoDueDate,
            amount: total,
            type: 'charge',
            cart: [...cart]
          }]
        };
        updatedFiados.push(newFiadoPayload);
        fiadoToSync = { action: 'create', data: newFiadoPayload };
      } else {
        updatedFiados = updatedFiados.map(client => {
          if (client.id.toString() === selectedFiadoClient) {
            const updated = {
              ...client,
              totalDebt: client.totalDebt + total,
              history: [...client.history, {
                id: Date.now(),
                date: new Date().toISOString(),
                dueDate: fiadoDueDate,
                amount: total,
                type: 'charge',
                cart: [...cart]
              }]
            };
            fiadoToSync = { action: 'update', data: updated };
            return updated;
          }
          return client;
        });
      }

      setFiados(updatedFiados);
      if (fiadoToSync) {
        cacheService.delete(`fiados_${activeClientId}_${activeStoreId}`);
        queueService.enqueue({
          type: 'fiado',
          data: fiadoToSync,
          maxRetries: 5
        });
      }
    }

    setLastSale({ ...saleData, date: new Date(saleData.date) });
    onSaleComplete?.(saleData);

    // Guardar venta en historial (conecta con KPIs, Dashboard y Historial)
    setClientSalesHistory((prev: any[]) => [saleData, ...prev]);

    // Encolar venta para sincronizar (offline-first con queueService)
    queueService.enqueue({
      type: 'sale',
      data: {
        sale: {
          clientId: activeClientId,
          storeId: activeStoreId,
          posId: activePosId,
          date: saleData.date,
          total,
          subtotal,
          paymentMethod: method,
          cart: [...cart],
          user: currentUser?.name || 'Sistema',
          change
        },
        clientId: activeClientId
      },
      maxRetries: 5
    });

    // Limpiar estado de pago en progreso y sincronizar venta completada al panel cliente
    localStorage.removeItem(`pos-payment-client_${activeClientId}`);
    const fiadoClientName = selectedFiadoClient === 'new'
      ? newFiadoClient.name
      : fiados.find(c => c.id.toString() === selectedFiadoClient)?.name;

    localStorage.setItem(`pos-sale-completed-client_${activeClientId}`, JSON.stringify({
      id: saleId,
      cart: [...cart],
      total,
      subtotal,
      change,
      paymentMethod: method,
      date: new Date().toISOString(),
      fiadoInfo: method === 'Fiado' ? {
        clientName: fiadoClientName,
        dueDate: fiadoDueDate
      } : null
    }));

    setShowTicketModal(true);

    // Reset state - pero MANTENER caja abierta
    setCart([]);
    setShowCashModal(false);
    setShowFiadoModal(false);
    setSelectedFiadoClient('');
    setNewFiadoClient({ name: '', phone: '', observation: '', creditLimit: '' });
    setAmountReceived('');
    setSurcharge('');
    setLastScanned(null);
  };

  const handlePauseSale = () => {
    if (cart.length === 0) return;
    setPausedSales([...pausedSales, { cart, total, timestamp: new Date() }]);
    setCart([]);
    setSurcharge('');
  };

  const handleResumeSale = (index: number) => {
    const saleToResume = pausedSales[index];
    setCart(saleToResume.cart);
    setPausedSales(pausedSales.filter((_, i) => i !== index));
    setShowPausedModal(false);
  };

  const formatCurrency = (num: number) => `$${Math.round(num).toLocaleString()}`;

  return (
    <div className="flex min-h-screen bg-surface text-on-surface font-body">
      <SideNavBar currentPage="sales" setCurrentPage={setCurrentPage} currentUser={currentUser} users={users} setCurrentUser={setCurrentUser} currentStore={currentStore} currentPOS={currentPOS} />
      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen p-4 md:p-8 pt-20 md:pt-8 pb-20 md:pb-0">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-[#0F172A] font-headline mb-1">Terminal de <span className="text-secondary">Ventas</span></h2>
            <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-3">PUNTO DE VENTA &gt; CAJA</p>
            <p className="text-[#0F172A]/70 font-bold text-sm md:text-lg">Escanea productos o selecciónalos manualmente para procesar una venta.</p>
          </div>
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-4 w-full md:w-auto">
            <button
              onClick={() => setShowCashRegisterModal(true)}
              className={`flex items-center justify-center gap-2 px-4 md:px-4 py-3 md:py-2 rounded-xl font-bold transition-all min-h-12 md:min-h-auto ${cashRegister.isOpen ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}
            >
              <Banknote className="w-5 h-5" />
              <span className="text-sm">{cashRegister.isOpen ? 'Caja Abierta' : 'Abrir Caja'}</span>
            </button>
            <button
              className="flex items-center justify-center gap-2 px-4 md:px-4 py-3 md:py-2 bg-secondary/10 text-secondary font-bold rounded-lg hover:bg-secondary/20 transition-colors min-h-12 md:min-h-auto"
              onClick={() => {
                localStorage.setItem('pos-store-info', JSON.stringify({
                  storeName: currentStore?.name,
                  posName: currentPOS?.name
                }));
                window.open('?view=customer', '_blank');
              }}
            >
              <Monitor className="w-5 h-5" />
              <span className="text-sm">Pantalla Cliente</span>
            </button>
            <button onClick={() => setShowNotificationsPanel(true)} className="w-12 h-12 md:w-10 md:h-10 flex items-center justify-center rounded-full hover:bg-[#f2f3ff] transition-colors relative flex-shrink-0">
              <Bell className="w-5 h-5 text-on-surface-variant" />
            </button>
            <div className="h-8 w-px bg-outline-variant/30 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-black text-[#0F172A]">{currentUser?.name || 'Admin Vantory'}</p>
                <p className="text-xs text-secondary font-bold">{currentUser?.role || 'Soporte Técnico'}</p>
              </div>
              <img 
                className="w-10 h-10 rounded-full border-2 border-surface-container-highest object-cover" 
                src={currentUser?.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuAPTOJksruGaNQm6gW0cTKsmHx_gthleGI0Hy70R56Q1oJ4i9lW0iL4JU8oXMoZAshoKE8S3a1-5NvKCV26POVasYgktSZtJpP6RHaMYbMEtqakjdL7rtnYFQso4Kzl5w6R3449pD-nViJIAngGkUqQijX4Zz9xtfKBk4SztlssTnGEGmOQeqPZsahAs-DUJ7tdh68w9VguZXCBAxiCk5XRvvm-GQdW31C8hvfujnZJlbpJ3SVzXGcnVimo2ARlMqv9ks88IY_RN2o_"} 
                alt="User"
                referrerPolicy="no-referrer"
              />
            </div>
            <button 
              onClick={() => {
                setCurrentUser(null);
                setCurrentPage('home');
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-error-container/20 text-error transition-colors ml-2" 
              title="Cerrar Sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Shortcuts Info */}
        <div className="flex items-center gap-4 text-xs text-[#0F172A]/70 font-semibold px-6 py-2">
          <div className="flex items-center gap-1"><kbd className="bg-surface-container-low px-1.5 py-0.5 rounded border border-outline-variant/40 font-mono text-[10px]">F10</kbd> <span className="text-xs">Cobrar</span></div>
          <div className="flex items-center gap-1"><kbd className="bg-surface-container-low px-1.5 py-0.5 rounded border border-outline-variant/40 font-mono text-[10px]">Supr</kbd> <span className="text-xs">Limpiar</span></div>
        </div>
        <div className="bg-[#ced5ff] h-[1px] w-full"></div>

        {/* POS Workspace */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden gap-4 md:gap-0 h-full md:items-start">
          {/* Left Side: Sales Operations */}
          <section className="flex-[1.8] p-3 md:p-6 overflow-hidden flex flex-col gap-3 md:gap-6">

            {/* Paused Sales - Always Visible, fixed height, horizontal scroll */}
            {pausedSales.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-2 py-1.5 shadow-sm relative z-50 flex-shrink-0">
                <div className="flex items-center gap-1.5 overflow-x-auto overflow-y-hidden" style={{maxHeight: '32px'}}>
                  <span className="text-[10px] font-bold text-blue-700 whitespace-nowrap flex-shrink-0">En espera:</span>
                  {pausedSales.map((sale, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPausedSalePopup(pausedSalePopup === index ? null : index);
                      }}
                      className="text-[10px] bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded font-bold transition-colors whitespace-nowrap flex-shrink-0"
                    >
                      #{index+1} ${Math.round(sale.total).toLocaleString()}
                    </button>
                  ))}
                </div>
                {/* Popup - fixed position */}
                {pausedSalePopup !== null && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-blue-200 px-3 py-2 z-[9999] flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <span className="text-[11px] text-[#0F172A]/60">Compra #{(pausedSalePopup)+1} — ¿Retomar?</span>
                    <button onClick={() => { handleResumeSale(pausedSalePopup); setPausedSalePopup(null); }} className="text-[11px] bg-secondary text-white px-2.5 py-1 rounded font-bold hover:bg-secondary/90 transition-colors">✓ Sí</button>
                    <button onClick={() => { setPausedSales(pausedSales.filter((_, i) => i !== pausedSalePopup)); setPausedSalePopup(null); }} className="text-[11px] bg-error text-white px-2.5 py-1 rounded font-bold hover:bg-error/90 transition-colors">✕ Eliminar</button>
                    <button onClick={() => setPausedSalePopup(null)} className="text-[11px] text-[#0F172A]/40 px-1.5 py-1 rounded hover:bg-gray-100 transition-colors">Cancelar</button>
                  </div>
                )}
              </div>
            )}

            {/* Barcode Area */}
            <div className="bg-[#131b2e] rounded-3xl p-3 shadow-2xl border border-secondary/15 shadow-secondary/10 overflow-visible relative">
              <div className="absolute inset-0 animate-bright-shine pointer-events-none"></div>
              <h2 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 flex items-center gap-2 relative z-10">
                <Search className="w-4 h-4 text-secondary" /> Buscar Producto
              </h2>
              <div className="relative z-10">
                <div className="relative flex items-center">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-white/30" />
                  <input
                    ref={searchInputRef}
                    className="w-full pl-16 pr-24 py-2.5 bg-white/5 border-2 border-white/10 rounded-2xl text-base font-bold text-white focus:border-secondary focus:ring-4 focus:ring-secondary/10 placeholder:text-white/20 outline-none transition-all"
                    placeholder="Escanea código o escribe nombre..."
                    type="text"
                    value={barcode}
                    onChange={(e) => {
                      handleSearchChange(e.target.value);
                      setShowSearchDropdown(true);
                      updateDropdownPosition();
                    }}
                    onFocus={() => { if (barcode) { setShowSearchDropdown(true); updateDropdownPosition(); } }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleScan();
                      }
                    }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleScan}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-secondary text-white px-3 py-1.5 rounded-lg font-bold text-sm hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20">
                    <Plus className="w-3.5 h-3.5" />
                  </button>

                </div>
              </div>
            </div>

            {/* Close dropdown when clicking outside */}
            {showSearchDropdown && (
              <div className="fixed inset-0 z-[9998]" onClick={() => setShowSearchDropdown(false)} />
            )}

            {/* Search Dropdown - Fixed to escape overflow constraints */}
            {showSearchDropdown && searchResults.length > 0 && dropdownRect && (
              <div
                className="fixed bg-white rounded-2xl shadow-2xl border border-secondary/15 overflow-hidden z-[9999]"
                style={{
                  top: dropdownRect.bottom + 8,
                  left: dropdownRect.left,
                  width: dropdownRect.width,
                }}
              >
                <div className="max-h-64 overflow-y-auto">
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => {
                        handleAddToCart(product);
                        setBarcode('');
                        setShowSearchDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-secondary/10 border-b border-secondary/5 last:border-0 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-lg bg-surface-container-low overflow-hidden flex-shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#0F172A] text-sm line-clamp-1">{product.name}</p>
                        <p className="text-xs text-[#0F172A]/60">{formatCurrency(product.price)}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-bold text-secondary">{product.stock}u</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State - Only scan/search */}
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-16 px-4">
                <ShoppingCart className="w-16 h-16 text-secondary/30 mb-4 animate-bounce" />
                <h3 className="text-lg font-bold text-[#0F172A] mb-2">Escanea o busca productos</h3>
                <p className="text-sm text-on-surface-variant text-center">Usa el código de barras o busca por nombre para agregar al carrito</p>
              </div>
            ) : (
              /* Cart Items List */
              <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-secondary/15 overflow-hidden flex flex-col" style={{maxHeight: '62vh'}}>
                  {/* Cart Header */}
                  <div className="p-3 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-lowest flex-shrink-0">
                    <h3 className="text-sm font-black text-[#0F172A] tracking-widest uppercase"><span className="text-secondary">CARRITO</span> <span className="text-[#0F172A]/70">({totalItems})</span></h3>
                    <div className="flex gap-2">
                      {pausedSales.length > 0 && (
                        <button onClick={() => setShowPausedModal(true)} className="text-xs font-bold text-blue-600 border border-blue-600/30 px-3 py-1 rounded-full hover:bg-blue-600/5 transition-colors">
                          Recuperar ({pausedSales.length})
                        </button>
                      )}
                      <button
                        onClick={handlePauseSale}
                        disabled={cart.length === 0}
                        className="text-xs font-bold text-secondary border border-secondary/30 px-3 py-1 rounded-full hover:bg-secondary/5 transition-colors disabled:cursor-not-allowed"
                      >
                        Pausar
                      </button>
                      <button onClick={() => setCart([])} className="text-xs font-bold text-error border border-error/30 px-3 py-1 rounded-full hover:bg-error/5 transition-colors">Limpiar</button>
                    </div>
                  </div>

                  {/* Cart Items - Scrollable with Images */}
                  <div className="p-2 overflow-y-auto space-y-1.5">
                    {cart.map((item, index) => (
                      <div key={`${item.id}-${index}`} className="flex gap-3 items-center group py-2 px-3 border border-outline-variant/10 rounded-lg bg-white hover:bg-secondary/5 transition-colors">
                        {/* Product Image */}
                        <div className="w-12 h-12 rounded-lg bg-surface-container-low overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-on-surface text-sm leading-tight line-clamp-1">{item.name}</p>
                          <p className="text-xs text-[#0F172A]/60 font-medium">{formatCurrency(item.price)} c/u</p>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="flex items-center gap-1 bg-surface-container-low rounded-lg px-1 py-0.5 border border-outline-variant/20">
                            <button onClick={() => updateQuantity(index, -1)} className="w-6 h-6 flex items-center justify-center hover:bg-surface-container-high rounded font-bold text-sm">-</button>
                            <span className="w-5 text-center text-sm font-bold">{item.quantity}</span>
                            <button onClick={() => updateQuantity(index, 1)} className="w-6 h-6 flex items-center justify-center hover:bg-surface-container-high rounded font-bold text-sm">+</button>
                          </div>
                          <p className="font-black text-on-surface text-sm w-16 text-right">{formatCurrency(item.price * item.quantity)}</p>
                          <button
                            onClick={() => setCart(cart.filter((_, i) => i !== index))}
                            className="text-error hover:bg-error/10 p-1 rounded transition-colors flex-shrink-0"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
            )}
          </section>

          {/* Right Side: Payment & Totals - Fixed, never grows */}
          <section className="flex-1 bg-surface-container-low p-2 md:p-3 border-t md:border-t-0 md:border-l border-outline-variant/20 self-start sticky top-0">
            {/* Payment & Checkout */}
            <div className="bg-gradient-to-br from-[#5b7ec9] via-[#6b8dd9] to-[#5b7ec9] p-4 rounded-2xl border-2 border-white/20 shadow-2xl flex flex-col">
              <div className="space-y-3 flex-1 flex flex-col">
                {/* Surcharge */}
                <div className="flex flex-col gap-1.5 bg-white/15 p-3 rounded-lg border border-white/30 backdrop-blur-md">
                  <span className="text-xs font-black text-white uppercase tracking-wider">Recargo ($)</span>
                  <input
                    type="number"
                    value={surcharge}
                    onChange={(e) => setSurcharge(e.target.value)}
                    className="flex-1 bg-white/95 border border-white/40 rounded-lg px-2 py-1.5 text-sm font-bold text-right outline-none focus:border-white focus:bg-white transition-all"
                  />
                </div>

                {/* Totals */}
                <div className="space-y-2 bg-white/10 p-3 rounded-lg border border-white/20 backdrop-blur-md">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Subtotal</span>
                    <span className="text-sm font-bold text-white/90">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-end pt-1.5 border-t border-white/20">
                    <span className="text-sm font-black text-white">Total</span>
                    <span className="text-3xl font-black text-white drop-shadow-lg">{formatCurrency(total)}</span>
                  </div>
                </div>

                {/* Payment Buttons */}
                <div className="grid grid-cols-1 gap-2 flex-1 flex flex-col justify-end">
                  <button
                    onClick={() => {
                      if (!currentPOS) {
                        alert('Debes seleccionar una caja primero');
                        return;
                      }
                      if (!cashRegister.isOpen) {
                        setShowCashRegisterModal(true);
                        return;
                      }
                      setShowCashModal(true);
                    }}
                    disabled={cart.length === 0}
                    className="flex items-center justify-center gap-2 py-3 bg-[#009944] hover:bg-[#008833] text-white rounded-lg font-black text-sm transition-all disabled:cursor-not-allowed shadow-md shadow-[#009944]/50 hover:shadow-lg hover:shadow-[#009944]/70 border border-white/20"
                    style={{ textShadow: '0 0 3px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.7)' }}
                  >
                    <Banknote className="w-4 h-4" />
                    Efectivo
                  </button>
                  <button
                    onClick={() => {
                      if (!currentPOS) {
                        alert('Debes seleccionar una caja primero');
                        return;
                      }
                      if (!cashRegister.isOpen) {
                        setShowCashRegisterModal(true);
                        return;
                      }
                      handleConfirmSale('Débito');
                    }}
                    disabled={cart.length === 0}
                    className="flex items-center justify-center gap-2 py-3 bg-[#0077FF] hover:bg-[#0066EE] text-white rounded-lg font-black text-sm transition-all disabled:cursor-not-allowed shadow-lg shadow-[#0077FF]/50 hover:shadow-xl hover:shadow-[#0077FF]/70 border border-white/20"
                    style={{ textShadow: '0 0 3px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.7)' }}
                  >
                    <CreditCard className="w-4 h-4" />
                    Débito
                  </button>
                  <button
                    onClick={() => {
                      if (!currentPOS) {
                        alert('Debes seleccionar una caja primero');
                        return;
                      }
                      if (!cashRegister.isOpen) {
                        setShowCashRegisterModal(true);
                        return;
                      }
                      handleConfirmSale('Pluxee');
                    }}
                    disabled={cart.length === 0}
                    className="flex items-center justify-center gap-2 py-3 bg-[#FFBB11] hover:bg-[#FFAA00] text-white rounded-lg font-black text-sm transition-all disabled:cursor-not-allowed shadow-lg shadow-[#FFBB11]/50 hover:shadow-xl hover:shadow-[#FFBB11]/70 border border-white/20"
                    style={{ textShadow: '0 0 3px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.7)' }}
                  >
                    <CreditCard className="w-4 h-4" />
                    Pluxee
                  </button>
                  <button
                    onClick={() => {
                      if (!currentPOS) {
                        alert('Debes seleccionar una caja primero');
                        return;
                      }
                      if (!cashRegister.isOpen) {
                        setShowCashRegisterModal(true);
                        return;
                      }
                      handleConfirmSale('AmiPass');
                    }}
                    disabled={cart.length === 0}
                    className="flex items-center justify-center gap-2 py-3 bg-[#F2277B] hover:bg-[#E51A6A] text-white rounded-lg font-black text-sm transition-all disabled:cursor-not-allowed shadow-lg shadow-[#F2277B]/50 hover:shadow-xl hover:shadow-[#F2277B]/70 border border-white/20"
                    style={{ textShadow: '0 0 3px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.7)' }}
                  >
                    <CreditCard className="w-4 h-4" />
                    AmiPass
                  </button>
                  <button
                    onClick={() => {
                      if (!currentPOS) {
                        alert('Debes seleccionar una caja primero');
                        return;
                      }
                      if (!cashRegister.isOpen) {
                        setShowCashRegisterModal(true);
                        return;
                      }
                      cacheService.delete(`fiados_${activeClientId}`);
                      setShowFiadoModal(true);
                    }}
                    disabled={cart.length === 0}
                    className="flex items-center justify-center gap-2 py-3 bg-[#0099FF] hover:bg-[#0088EE] text-white rounded-lg font-black text-sm transition-all disabled:cursor-not-allowed shadow-lg shadow-[#0099FF]/50 hover:shadow-xl hover:shadow-[#0099FF]/70 border border-white/20"
                    style={{ textShadow: '0 0 3px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.7)' }}
                  >
                    <Wallet className="w-4 h-4" />
                    Fiado
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <NotificationsPanel />

      {/* Cash Payment Modal */}
      <AnimatePresence>
        {showCashModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center">
                <h2 className="text-2xl font-black text-[#0F172A]">Pago en <span className="text-secondary">Efectivo</span></h2>
                <button onClick={() => setShowCashModal(false)} className="p-2 hover:bg-surface-container rounded-full transition-colors">
                  <X className="w-6 h-6 text-outline-variant" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-6 text-center">
                  <p className="text-xs font-black text-[#0F172A] uppercase tracking-widest mb-2">TOTAL A PAGAR</p>
                  <p className="text-4xl font-black text-[#0F172A]">{formatCurrency(total)}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-black text-[#0F172A] uppercase tracking-widest mb-2">MONTO RECIBIDO</label>
                  <input 
                    type="text" 
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value)}
                    className="w-full border-2 border-secondary rounded-xl py-4 px-6 text-2xl font-bold text-center focus:ring-4 focus:ring-secondary/20 outline-none transition-all"
                    placeholder="Ej. 10000"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[1000, 5000, 10000, 20000].map(amt => (
                    <button 
                      key={amt}
                      onClick={() => {
                        const current = parseInt(amountReceived.replace(/\D/g, '')) || 0;
                        setAmountReceived((current + amt).toString());
                      }}
                      className="py-3 bg-surface-container-low hover:bg-surface-container-high rounded-lg font-bold text-[#0F172A] transition-colors border border-outline-variant/20"
                    >
                      +{formatCurrency(amt)}
                    </button>
                  ))}
                  <button 
                    onClick={() => setAmountReceived(total.toString())}
                    className="py-3 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-lg font-bold transition-colors border border-secondary/20"
                  >
                    Exacto
                  </button>
                  <button 
                    onClick={() => setAmountReceived('')}
                    className="py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-bold transition-colors border border-red-200"
                  >
                    Borrar
                  </button>
                </div>

                {amountReceived && (
                  <div className={`p-6 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${parseInt(amountReceived.replace(/\D/g, '')) >= total ? 'bg-green-600 text-white shadow-xl shadow-green-600/20' : 'bg-red-50 border-2 border-red-200 text-red-700'}`}>
                    <span className="text-xs font-black uppercase tracking-[0.2em] opacity-80">
                      {parseInt(amountReceived.replace(/\D/g, '')) >= total ? 'VUELTO A ENTREGAR' : 'FALTA POR PAGAR'}
                    </span>
                    <span className="text-5xl font-black tabular-nums">
                      {formatCurrency(Math.abs(parseInt(amountReceived.replace(/\D/g, '')) - total))}
                    </span>
                  </div>
                )}

                <button 
                  onClick={() => {
                    setShowCashModal(false);
                    handleConfirmSale('Efectivo');
                  }}
                  disabled={!amountReceived || parseInt(amountReceived.replace(/\D/g, '')) < total}
                  className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-surface-container-high disabled:text-outline-variant disabled:cursor-not-allowed text-white rounded-xl font-black text-lg transition-colors shadow-lg shadow-green-600/20 disabled:shadow-none"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fiado Modal */}
      <AnimatePresence>
        {showFiadoModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-[#0F172A]">Registrar <span className="text-secondary">Fiado</span></h2>
                <button onClick={() => setShowFiadoModal(false)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
                  <X className="w-6 h-6 text-[#0F172A]" />
                </button>
              </div>
              
              <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-6 mb-6 text-center">
                <p className="text-xs font-black text-[#0F172A] uppercase tracking-widest mb-2">MONTO A FIAR</p>
                <p className="text-4xl font-black text-[#0F172A]">{formatCurrency(total)}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-bold text-[#0F172A] mb-1">Seleccionar Cliente</label>
                  <select 
                    value={selectedFiadoClient}
                    onChange={(e) => setSelectedFiadoClient(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-sm font-medium text-[#0F172A] focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                  >
                    <option value="">-- Seleccione un cliente --</option>
                    <option value="new">+ Crear Nuevo Cliente</option>
                    {fiados.map(client => {
                      const available = client.creditLimit ? client.creditLimit - client.totalDebt : null;
                      const limitText = available !== null ? ` (Disp: $${available.toLocaleString('es-CL')})` : '';
                      return (
                        <option key={client.id} value={client.id}>{client.name} - Deuda: ${client.totalDebt.toLocaleString('es-CL')}{limitText}</option>
                      );
                    })}
                  </select>
                </div>

                {selectedFiadoClient && selectedFiadoClient !== 'new' && fiados.find(c => c.id.toString() === selectedFiadoClient)?.creditLimit > 0 && (
                  <div className={`p-3 rounded-lg text-sm font-bold ${
                    (fiados.find(c => c.id.toString() === selectedFiadoClient)?.creditLimit - fiados.find(c => c.id.toString() === selectedFiadoClient)?.totalDebt) < total 
                    ? 'bg-red-100 text-red-700 border border-red-200' 
                    : 'bg-green-100 text-green-700 border border-green-200'
                  }`}>
                    Crédito Disponible: ${(fiados.find(c => c.id.toString() === selectedFiadoClient)?.creditLimit - fiados.find(c => c.id.toString() === selectedFiadoClient)?.totalDebt).toLocaleString('es-CL')}
                    {((fiados.find(c => c.id.toString() === selectedFiadoClient)?.creditLimit - fiados.find(c => c.id.toString() === selectedFiadoClient)?.totalDebt) < total) && (
                      <span className="block mt-1 text-xs">⚠️ El monto de la venta supera el crédito disponible.</span>
                    )}
                  </div>
                )}

                {selectedFiadoClient === 'new' && (
                  <div className="space-y-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant/20">
                    <div>
                      <label className="block text-sm font-bold text-[#0F172A] mb-1">Nombre del Cliente *</label>
                      <input 
                        type="text" 
                        required
                        value={newFiadoClient.name}
                        onChange={(e) => setNewFiadoClient({...newFiadoClient, name: e.target.value})}
                        className="w-full px-4 py-2 bg-white border border-outline-variant/30 rounded-lg text-sm font-medium text-[#0F172A] focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#0F172A] mb-1">Teléfono (Opcional)</label>
                      <input 
                        type="tel" 
                        value={newFiadoClient.phone}
                        onChange={(e) => setNewFiadoClient({...newFiadoClient, phone: e.target.value})}
                        className="w-full px-4 py-2 bg-white border border-outline-variant/30 rounded-lg text-sm font-medium text-[#0F172A] focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#0F172A] mb-1">Observación (Opcional)</label>
                      <input 
                        type="text" 
                        value={newFiadoClient.observation}
                        onChange={(e) => setNewFiadoClient({...newFiadoClient, observation: e.target.value})}
                        className="w-full px-4 py-2 bg-white border border-outline-variant/30 rounded-lg text-sm font-medium text-[#0F172A] focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#0F172A] mb-1">Límite de Crédito ($) (Opcional)</label>
                      <input 
                        type="number" 
                        placeholder="Ej. 50000 (0 = Sin límite)"
                        value={newFiadoClient.creditLimit}
                        onChange={(e) => setNewFiadoClient({...newFiadoClient, creditLimit: e.target.value})}
                        className="w-full px-4 py-2 bg-white border border-outline-variant/30 rounded-lg text-sm font-medium text-[#0F172A] focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {selectedFiadoClient && (
                  <div>
                    <label className="block text-sm font-bold text-[#0F172A] mb-1">Fecha de Vencimiento</label>
                    <input 
                      type="date" 
                      value={fiadoDueDate}
                      onChange={(e) => setFiadoDueDate(e.target.value)}
                      className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-sm font-medium text-[#0F172A] focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowFiadoModal(false)}
                  className="flex-1 py-4 bg-surface-container-low hover:bg-surface-container-high text-on-surface rounded-xl font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => handleConfirmSale('Fiado')}
                  disabled={
                    !selectedFiadoClient || 
                    (selectedFiadoClient === 'new' && !newFiadoClient.name) ||
                    (selectedFiadoClient !== 'new' && fiados.find(c => c.id.toString() === selectedFiadoClient)?.creditLimit > 0 && (fiados.find(c => c.id.toString() === selectedFiadoClient)?.creditLimit - fiados.find(c => c.id.toString() === selectedFiadoClient)?.totalDebt) < total)
                  }
                  className="flex-1 py-4 bg-secondary hover:bg-on-secondary-container text-white rounded-xl font-black transition-colors shadow-lg shadow-secondary/20 disabled:cursor-not-allowed"
                >
                  Confirmar Fiado
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ticket Modal */}
      <AnimatePresence>
        {showTicketModal && lastSale && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="print-ticket bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="bg-secondary p-6 text-white text-center relative">
                <div className="absolute -bottom-3 left-0 right-0 flex justify-around">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-white rounded-full"></div>
                  ))}
                </div>
                <CheckCircle className="w-12 h-12 mx-auto mb-3" />
                <h2 className="text-2xl font-black tracking-tight">¡Venta <span className="text-secondary">Exitosa!</span></h2>
                <p className="text-white/80 text-sm">{lastSale.date.toLocaleString()}</p>
              </div>

              <div className="p-8 pt-10 flex-1 overflow-y-auto max-h-[60vh]">
                <div className="border-b-2 border-dashed border-outline-variant/30 pb-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-outline-variant uppercase tracking-widest">Detalle</span>
                    <span className="text-xs font-bold text-outline-variant uppercase tracking-widest">Subtotal</span>
                  </div>
                  {lastSale.cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between mb-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#0F172A]">{item.name}</span>
                        <span className="text-[10px] text-outline-variant">{item.quantity} x {formatCurrency(item.price)}</span>
                      </div>
                      <span className="text-sm font-bold text-[#0F172A]">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-outline-variant font-medium">Subtotal</span>
                    <span className="font-bold">{formatCurrency(lastSale.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-outline-variant font-medium">IVA (19%)</span>
                    <span className="font-bold">{formatCurrency(Math.round(lastSale.total * 0.19))}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-outline-variant/10">
                    <span className="text-lg font-black text-[#0F172A]">TOTAL</span>
                    <span className="text-2xl font-black text-green-600">{formatCurrency(lastSale.total)}</span>
                  </div>
                  {lastSale.change > 0 && (
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm font-bold text-secondary">Vuelto</span>
                      <span className="text-lg font-black text-secondary">{formatCurrency(lastSale.change)}</span>
                    </div>
                  )}
                </div>

                <div className="text-center space-y-4">
                  <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                    <p className="text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-1">Código de Operación</p>
                    <p className="text-xs font-mono font-bold">#VT-{lastSale?.id?.toString().slice(-6).padStart(6, '0')}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-surface-container-low flex flex-col gap-3">
                <button 
                  onClick={() => {
                    window.print();
                  }}
                  className="w-full py-4 bg-[#0F172A] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#1e293b] transition-all"
                >
                  <Printer className="w-5 h-5" />
                  Imprimir Ticket
                </button>
                <button 
                  onClick={() => setShowTicketModal(false)}
                  className="w-full py-4 bg-white text-secondary border border-secondary/10 rounded-2xl font-bold hover:bg-secondary/5 transition-all"
                >
                  Nueva Venta
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paused Sales Modal */}
      <AnimatePresence>
        {showPausedModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center">
                <h2 className="text-2xl font-black text-[#0F172A]">Ventas <span className="text-secondary">Pausadas</span></h2>
                <button onClick={() => setShowPausedModal(false)} className="p-2 hover:bg-surface-container rounded-full transition-colors">
                  <X className="w-6 h-6 text-outline-variant" />
                </button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                {pausedSales.map((sale, index) => (
                  <div key={index} className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-on-surface">Venta Pausada #{index + 1}</p>
                      <p className="text-xs text-outline-variant">{sale.timestamp.toLocaleTimeString()} - {sale.cart.length} productos</p>
                      <p className="text-sm font-bold text-secondary mt-1">{formatCurrency(sale.total)}</p>
                    </div>
                    <button 
                      onClick={() => handleResumeSale(index)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
                    >
                      Recuperar
                    </button>
                  </div>
                ))}
                {pausedSales.length === 0 && (
                  <p className="text-center text-outline-variant py-8">No hay ventas pausadas.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stock Alert Notification */}
      <AnimatePresence>
        {stockAlert?.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-lg max-w-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-black text-sm text-amber-900">{stockAlert.product}</p>
                <p className="text-xs text-amber-700">Sin inventario disponible</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
