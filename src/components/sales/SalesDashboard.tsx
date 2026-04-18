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
  Bell,
  Settings,
  LogOut
} from 'lucide-react';
import { CartItem } from '../../types';
import { SideNavBar } from '../layout/SideNavBar';
import { NotificationsPanel } from '../shared/NotificationsPanel';
import { useAppContexts } from '../../hooks/useAppContexts';
import { supabaseService } from '../../services/supabaseService';

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

  // Sync cart to localStorage for customer view
  useEffect(() => {
    localStorage.setItem('pos-cart', JSON.stringify(cart));
  }, [cart]);

  // Sync payment modal state in real-time to customer screen
  useEffect(() => {
    if (showCashModal) {
      const received = parseInt(amountReceived.replace(/\D/g, '')) || 0;
      localStorage.setItem('pos-payment', JSON.stringify({
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
      localStorage.setItem('pos-payment', JSON.stringify({
        method: 'Fiado',
        total,
        clientName
      }));
    } else {
      localStorage.removeItem('pos-payment');
    }
  }, [showCashModal, showFiadoModal, amountReceived, total, selectedFiadoClient, newFiadoClient.name]);

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
    playBeep();

    // Limpiar venta completada anterior si comienza una nueva compra
    if (cart.length === 0) {
      localStorage.removeItem('pos-sale-completed');
    }

    setLastScanned({ name: product.name, price: product.price });
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (index: number, delta: number) => {
    const newCart = [...cart];
    newCart[index].quantity += delta;
    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1);
    }
    setCart(newCart);
  };

  const handleScan = () => {
    if (!barcode) return;
    playBeep();
    const product = inventory.find(p => p.sku === barcode || p.name.toLowerCase().includes(barcode.toLowerCase()));
    if (product) {
      handleAddToCart(product);
    } else {
      alert(`Producto no encontrado: ${barcode}. Regístralo primero en Inventario.`);
    }
    setBarcode('');
  };

  const handleConfirmSale = (method: string) => {
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

    // Atomic stock decrement: re-fetch from DB before upsert to avoid race conditions
    const decrementItems = cart
      .filter(ci => inventory.find(p => p.id === ci.id))
      .map(ci => ({ productId: ci.id, quantity: ci.quantity }));
    if (decrementItems.length) {
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
        .catch(err => console.error('decrementStockAtomic error:', err));
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
      setCashRegister({ ...cashRegister, currentCash: cashRegister.currentCash + total });
    } else if (method === 'Fiado') {
      let updatedFiados = [...fiados];
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
        supabaseService.createFiado(newFiadoPayload)
          .catch(err => console.error('createFiado persist error:', err));
      } else {
        updatedFiados = updatedFiados.map(client => {
          if (client.id.toString() === selectedFiadoClient) {
            return {
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
          }
          return client;
        });
      }
      setFiados(updatedFiados);
    }

    setLastSale({ ...saleData, date: new Date(saleData.date) });
    onSaleComplete?.(saleData);

    // Guardar venta en historial (conecta con KPIs, Dashboard y Historial)
    setClientSalesHistory((prev: any[]) => [saleData, ...prev]);

    // Persistir venta en Supabase (si está configurado)
    supabaseService.createSale({
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
    } as any).catch((err) => console.error('createSale persist error:', err));

    // Limpiar estado de pago en progreso y sincronizar venta completada al panel cliente
    localStorage.removeItem('pos-payment');
    const fiadoClientName = selectedFiadoClient === 'new'
      ? newFiadoClient.name
      : fiados.find(c => c.id.toString() === selectedFiadoClient)?.name;

    localStorage.setItem('pos-sale-completed', JSON.stringify({
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

  const formatCurrency = (num: number) => `$${num.toLocaleString('es-CL')}`;

  return (
    <div className="flex min-h-screen bg-surface text-on-surface font-body">
      <SideNavBar currentPage="sales" setCurrentPage={setCurrentPage} currentUser={currentUser} users={users} setCurrentUser={setCurrentUser} currentStore={currentStore} currentPOS={currentPOS} />
      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen p-8">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black text-[#0F172A] font-headline mb-1">Terminal de <span className="text-secondary">Ventas</span></h2>
            <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-3">PUNTO DE VENTA &gt; CAJA</p>
            <p className="text-[#0F172A]/70 font-bold text-lg">Escanea productos o selecciónalos manualmente para procesar una venta.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowCashRegisterModal(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${cashRegister.isOpen ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}
            >
              <Banknote className="w-5 h-5" />
              <span>{cashRegister.isOpen ? 'Caja Abierta' : 'Abrir Caja'}</span>
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary font-bold rounded-lg hover:bg-secondary/20 transition-colors"
              onClick={() => {
                localStorage.setItem('pos-store-info', JSON.stringify({
                  storeName: currentStore?.name,
                  posName: currentPOS?.name
                }));
                window.open('?view=customer', '_blank');
              }}
            >
              <Monitor className="w-5 h-5" />
              <span className="hidden sm:inline">Pantalla Cliente</span>
            </button>
            <button onClick={() => setShowNotificationsPanel(true)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f2f3ff] transition-colors relative">
              <Bell className="w-5 h-5 text-on-surface-variant" />
            </button>
            <button onClick={() => setCurrentPage('users')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f2f3ff] transition-colors">
              <Settings className="w-5 h-5 text-on-surface-variant" />
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
        <div className="bg-[#ced5ff] h-[1px] w-full"></div>

        {/* POS Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Side: Sales Operations */}
          <section className="flex-[1.8] p-6 overflow-y-auto flex flex-col gap-6">
            {/* Shortcuts Info */}
            <div className="flex items-center gap-4 text-sm text-[#0F172A] font-bold">
              <div className="flex items-center gap-2"><kbd className="bg-surface-container-low px-2 py-1 rounded border border-outline-variant/40 font-mono text-xs">F10</kbd> Cobrar en efectivo</div>
              <div className="flex items-center gap-2"><kbd className="bg-surface-container-low px-2 py-1 rounded border border-outline-variant/40 font-mono text-xs">Supr</kbd> Limpiar carrito</div>
            </div>

            {/* Barcode Area */}
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-secondary/20">
              <div className="relative flex items-center">
                <input 
                  className="w-full pl-4 pr-32 py-3 bg-transparent border-2 border-secondary rounded-lg text-lg font-bold focus:ring-4 focus:ring-secondary/10 placeholder:text-[#0F172A]/50 outline-none transition-all" 
                  placeholder="Escanea o escribe código / nombre del producto..." 
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                />
                <button onClick={handleScan} className="absolute right-2 bg-secondary text-white px-6 py-2 rounded-md font-bold flex items-center justify-center hover:bg-secondary/90 transition-colors">
                  <Plus className="w-4 h-4 mr-2" /> Agregar
                </button>
              </div>
            </div>

            {/* Favorites Section */}
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-secondary/10">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <h3 className="text-sm font-black text-[#0F172A] uppercase tracking-widest">Favoritos / Acceso Rápido</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {inventory.filter(p => p.isFavorite).map(product => (
                  <button
                    key={product.id}
                    onClick={() => handleAddToCart(product)}
                    className="px-4 py-2 bg-white border border-outline-variant/30 rounded-lg text-sm font-bold text-[#0F172A] hover:border-secondary hover:bg-secondary/5 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <div className="w-6 h-6 rounded bg-surface-container-low overflow-hidden">
                      <img src={product.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    {product.name}
                  </button>
                ))}
                {inventory.filter(p => p.isFavorite).length === 0 && (
                  <p className="text-xs text-on-surface-variant italic">No hay productos marcados como favoritos.</p>
                )}
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-xl shadow-sm">
                <Filter className="text-outline w-4 h-4" />
                <span className="text-xs font-bold">Filtrar por Categoría</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button 
                  onClick={() => setSearchTerm('')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${searchTerm === '' ? 'bg-secondary text-white' : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'}`}
                >
                  Todos
                </button>
                {Array.from(new Set(inventory.map(p => p.category))).map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSearchTerm(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${searchTerm === cat ? 'bg-secondary text-white' : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
              {inventory
                .filter(p =>
                  p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  p.category.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleAddToCart(product)}
                  className="bg-surface-container-lowest p-0 rounded-lg border border-outline-variant/20 shadow-sm hover:border-secondary hover:shadow-md transition-all text-left flex flex-col h-full group overflow-hidden"
                >
                  <div className="aspect-square w-full bg-surface-container-low overflow-hidden relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {product.stock < 10 && (
                      <div className="absolute top-1 right-1 bg-error text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-lg">
                        BAJO
                      </div>
                    )}
                  </div>
                  <div className="p-2 flex flex-col flex-1">
                    <h4 className="font-bold text-on-surface text-xs leading-tight mb-0.5 group-hover:text-secondary transition-colors line-clamp-2">{product.name}</h4>
                    <p className="text-[10px] text-[#0F172A] font-black mb-1">{product.category}</p>
                    <div className="mt-auto">
                      <p className="text-sm font-black text-green-600 mb-0.5">{formatCurrency(product.price)}</p>
                      <p className={`text-[10px] font-black ${product.stock < 10 ? 'text-error' : 'text-[#0F172A]'}`}>
                        {product.stock}u {product.stock < 10 && '⚠'}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Right Side: Cart / Summary */}
          <section className="flex-1 bg-surface-container-low p-6 flex flex-col border-l border-outline-variant/20">
            <div className="bg-surface-container-lowest h-[500px] rounded-2xl flex flex-col shadow-sm border border-outline-variant/20 overflow-hidden">
              {/* Cart List */}
              <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                <div className="p-4 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-lowest sticky top-0 z-10">
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
                      className="text-xs font-bold text-secondary border border-secondary/30 px-3 py-1 rounded-full hover:bg-secondary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Pausar
                    </button>
                    <button onClick={() => setCart([])} className="text-xs font-bold text-error border border-error/30 px-3 py-1 rounded-full hover:bg-error/5 transition-colors">Limpiar</button>
                  </div>
                </div>
                <div className="p-4 overflow-y-auto flex-1 space-y-4">
                  {cart.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex justify-between items-center group py-2 border-b border-outline-variant/10 last:border-0">
                      <div className="flex-1 pr-4">
                        <p className="font-bold text-on-surface text-sm leading-tight line-clamp-1">{item.name}</p>
                        <p className="text-xs text-[#0F172A] font-black">{formatCurrency(item.price)} c/u</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-surface-container-low rounded-lg p-1 border border-outline-variant/20">
                          <button onClick={() => updateQuantity(index, -1)} className="w-6 h-6 flex items-center justify-center hover:bg-surface-container-high rounded text-on-surface font-bold">-</button>
                          <span className="w-4 text-center text-sm font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(index, 1)} className="w-6 h-6 flex items-center justify-center hover:bg-surface-container-high rounded text-on-surface font-bold">+</button>
                        </div>
                        <div className="w-20 text-right">
                          <p className="font-black text-on-surface text-sm">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                        <button 
                          onClick={() => setCart(cart.filter((_, i) => i !== index))}
                          className="text-error hover:bg-error/10 p-1 rounded transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {cart.length === 0 && (
                    <div className="text-center py-10 text-[#0F172A]">
                      <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="font-black">El carrito está vacío</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment & Checkout */}
              <div className="bg-surface-container-lowest p-6 border-t border-outline-variant/20">
                <div className="flex items-center gap-4 mb-6 bg-[#fff9e6] p-3 rounded-lg border border-[#fce49c]">
                  <span className="text-xs font-black text-[#0F172A]">Recargo ($)</span>
                  <input 
                    type="number" 
                    value={surcharge}
                    onChange={(e) => setSurcharge(e.target.value)}
                    className="w-24 bg-white border border-outline-variant/30 rounded px-2 py-1 text-sm font-bold text-right outline-none focus:border-secondary"
                  />
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-center text-[#0F172A]">
                    <span className="text-sm font-bold">Subtotal</span>
                    <span className="text-sm font-bold">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-black text-[#0F172A]">Total</span>
                    <span className="text-3xl font-black text-green-600">{formatCurrency(total)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
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
                    className="flex items-center justify-center gap-2 py-4 bg-[#0f9d58] hover:bg-[#0b8043] text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#0f9d58]/20"
                  >
                    <Banknote className="w-5 h-5" />
                    Efectivo (F10)
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
                    className="flex items-center justify-center gap-2 py-4 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#3b82f6]/20"
                  >
                    <CreditCard className="w-5 h-5" />
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
                    className="flex items-center justify-center gap-2 py-3 bg-[#ff5e00] hover:bg-[#cc4b00] text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#ff5e00]/20 text-sm"
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
                    className="flex items-center justify-center gap-2 py-3 bg-[#e91e63] hover:bg-[#c2185b] text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#e91e63]/20 text-sm"
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
                      setShowFiadoModal(true);
                    }}
                    disabled={cart.length === 0}
                    className="col-span-2 flex items-center justify-center gap-2 py-3 bg-surface-container-highest hover:bg-outline-variant/30 text-on-surface rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm"
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
                  className="flex-1 py-4 bg-secondary hover:bg-on-secondary-container text-white rounded-xl font-black transition-colors shadow-lg shadow-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="w-full py-4 bg-white text-secondary border-2 border-secondary/20 rounded-2xl font-bold hover:bg-secondary/5 transition-all"
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
    </div>
  );
};
