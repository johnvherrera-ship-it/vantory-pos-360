/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Menu, Package, Globe, ArrowUp, ArrowLeft, X, ExternalLink, MessageCircle, Instagram, CheckCircle, CreditCard, Banknote, Wallet, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppContextProvider } from './context/AppContext';
import { POSContextProvider } from './context/POSContext';
import { UIContextProvider, useUIContext } from './context/UIContext';
import { HomePage } from './components/landing/HomePage';
import { CashRegisterModal } from './components/shared/CashRegisterModal';
import { Logo } from './components/layout/Logo';
import { FeaturesPage } from './components/landing/FeaturesPage';
import { BlogPage } from './components/landing/BlogPage';
import { CookieBanner } from './components/landing/CookieBanner';
import { LegalModal } from './components/landing/LegalModal';
import { LoginPage as LoginPageComponent } from './components/auth/LoginPage';
import { Lobby as LobbyComponent } from './components/auth/Lobby';
import SuperAdminDashboardComponent from './components/superadmin/SuperAdminDashboard';
import SuperAdminClientsComponent from './components/superadmin/SuperAdminClients';
import SuperAdminClientProfileComponent from './components/superadmin/SuperAdminClientProfile';
import { Dashboard as DashboardComponent } from './components/dashboard/Dashboard';
import { SalesHistory as SalesHistoryComponent } from './components/sales/SalesHistory';
import { FiadosDashboard as FiadosDashboardComponent } from './components/sales/FiadosDashboard';
import { InventoryDashboard as InventoryDashboardComponent } from './components/inventory/InventoryDashboard';
import { StockEntries as StockEntriesComponent } from './components/inventory/StockEntries';
import { KPIsDashboard as KPIsDashboardComponent } from './components/kpis/KPIsDashboard';
import { SalesDashboard as SalesDashboardComponent } from './components/sales/SalesDashboard';
import { usePOSContext } from './context/POSContext';
import { useAppContext } from './context/AppContext';





function AppRouter() {
  // ===== Context Hooks =====
  const { currentPage, setCurrentPage, showCashRegisterModal, setShowCashRegisterModal, activeModal, setActiveModal, showCookies, setShowCookies, showPassword, setShowPassword, viewingSale, setViewingSale, selectedPost, setSelectedPost, isScrolled, showBackToTop, scrollToTop } = useUIContext();
  const { currentUser, setCurrentUser, currentStore, setCurrentStore, currentPOS, setCurrentPOS } = usePOSContext();
  const { vantoryClients, setVantoryClients, selectedClient, setSelectedClient, stores, setStores, posMachines, setPosMachines, inventory, setInventory, categories, setCategories, stockEntries, setStockEntries, salesHistory, setSalesHistory, cashRegisters, setCashRegisters, cashHistory, setCashHistory, users, setUsers, fiados, setFiados, clientInventory, setClientInventory, clientSalesHistory, setClientSalesHistory, clientStockEntries, setClientStockEntries, clientStores, setClientStores, clientUsers, setClientUsers, clientFiados, setClientFiados, clientCashHistory, setClientCashHistory, clientCashRegister, setClientCashRegister } = useAppContext();

  // State for customer view
  const [customerCart, setCustomerCart] = React.useState<any[]>([]);
  const [storeInfo, setStoreInfo] = React.useState<{ storeName?: string; posName?: string } | null>(null);
  const [completedSale, setCompletedSale] = React.useState<any>(null);
  const [paymentInProgress, setPaymentInProgress] = React.useState<any>(null);
  const [clockTime, setClockTime] = React.useState(new Date());
  const [showThankYou, setShowThankYou] = React.useState(false);

  // Live clock for customer view
  useEffect(() => {
    const timer = setInterval(() => setClockTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Trigger "thank you" animation 4s after completed sale appears
  useEffect(() => {
    if (completedSale) {
      setShowThankYou(false);
      const timer = setTimeout(() => setShowThankYou(true), 4000);
      return () => clearTimeout(timer);
    } else {
      setShowThankYou(false);
    }
  }, [completedSale]);

  // Handle query parameters for customer view
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'customer') {
      setCurrentPage('customer-view');
    }
  }, [setCurrentPage]);

  // Listen for all POS updates from localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const storedCart = localStorage.getItem('pos-cart');
        setCustomerCart(storedCart ? JSON.parse(storedCart) : []);
      } catch { setCustomerCart([]); }

      try {
        const storedInfo = localStorage.getItem('pos-store-info');
        setStoreInfo(storedInfo ? JSON.parse(storedInfo) : null);
      } catch { setStoreInfo(null); }

      try {
        const storedPayment = localStorage.getItem('pos-payment');
        setPaymentInProgress(storedPayment ? JSON.parse(storedPayment) : null);
      } catch { setPaymentInProgress(null); }

      try {
        const storedSale = localStorage.getItem('pos-sale-completed');
        setCompletedSale(storedSale ? JSON.parse(storedSale) : null);
      } catch { setCompletedSale(null); }
    };

    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body selection:bg-secondary/20 selection:text-secondary">
      {/* Top Bar Navigation */}
      {['home', 'features', 'blog'].includes(currentPage) && (
        <nav className={`fixed top-0 left-0 right-0 h-16 z-50 transition-all duration-500 flex justify-between items-center px-6 md:px-12 border-b ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl border-secondary/10 shadow-lg py-2' 
            : 'bg-secondary/[0.03] backdrop-blur-2xl border-transparent py-4'
        }`}>
          <div className="flex items-center gap-2">
            <Logo onClick={() => setCurrentPage('home')} />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => setCurrentPage('features')}
              className={`text-sm font-medium transition-colors relative group ${currentPage === 'features' ? 'text-secondary' : 'text-on-surface-variant hover:text-secondary'}`}
            >
              Funcionalidades
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-secondary transition-all ${currentPage === 'features' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </button>
            <button 
              onClick={() => setCurrentPage('blog')}
              className={`text-sm font-medium transition-colors relative group ${currentPage === 'blog' ? 'text-secondary' : 'text-on-surface-variant hover:text-secondary'}`}
            >
              Blog
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-secondary transition-all ${currentPage === 'blog' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </button>
            <motion.button 
              onClick={() => setCurrentPage('login')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 text-sm font-bold text-white bg-gradient-secondary rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              Acceder
            </motion.button>
          </div>
          <button className="md:hidden p-2 text-on-surface">
            <Menu className="w-6 h-6" />
          </button>
        </nav>
      )}

      <AnimatePresence mode="wait">
        {currentPage === 'customer-view' ? (
          <motion.div
            key="customer-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#0b1120] flex flex-col overflow-hidden"
          >
            {/* ── HEADER ── */}
            <header className="flex-shrink-0 flex justify-between items-center px-8 py-3 bg-white/5 border-b border-white/10">
              <div>
                <span className="text-2xl font-black tracking-tighter text-white">Vantory <span className="text-secondary">POS</span></span>
                {storeInfo && (storeInfo.storeName || storeInfo.posName) && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Globe className="w-3 h-3 text-secondary/70" />
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{storeInfo.storeName} · {storeInfo.posName}</span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-white font-black text-2xl tabular-nums">
                  {clockTime.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
                <div className="text-white/30 text-[11px] font-medium capitalize">
                  {clockTime.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
              </div>
            </header>

            {/* ── MAIN CONTENT ── */}
            <main className="flex-1 flex items-center justify-center overflow-hidden px-8 py-4">
              <AnimatePresence mode="wait">

                {/* ── STATE 0: GRACIAS ── aparece 4s después de completar la venta */}
                {showThankYou && completedSale ? (
                  <motion.div
                    key="thankyou"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="w-full h-full flex flex-col items-center justify-center text-center relative overflow-hidden"
                  >
                    {/* Partículas flotantes */}
                    {[...Array(16)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                          width: `${8 + (i % 4) * 6}px`,
                          height: `${8 + (i % 4) * 6}px`,
                          left: `${(i * 6.25) % 100}%`,
                          background: ['#6366f1','#22c55e','#f59e0b','#ec4899','#3b82f6','#14b8a6'][i % 6],
                          opacity: 0.7,
                        }}
                        initial={{ y: '110vh', opacity: 0 }}
                        animate={{ y: '-20vh', opacity: [0, 0.8, 0.8, 0] }}
                        transition={{
                          duration: 3.5 + (i % 4) * 0.8,
                          delay: (i * 0.18) % 2,
                          repeat: Infinity,
                          ease: 'easeOut',
                        }}
                      />
                    ))}

                    {/* Pulso de fondo */}
                    <motion.div
                      animate={{ scale: [1, 1.4, 1], opacity: [0.05, 0.12, 0.05] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute w-[600px] h-[600px] rounded-full bg-secondary"
                    />

                    {/* Contenido central */}
                    <div className="relative z-10 flex flex-col items-center">
                      <motion.div
                        initial={{ scale: 0, rotate: -15 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 18, duration: 0.6 }}
                        className="w-28 h-28 rounded-full bg-green-500/20 border-4 border-green-500/50 flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(34,197,94,0.3)]"
                      >
                        <CheckCircle className="w-16 h-16 text-green-400" />
                      </motion.div>

                      <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-8xl font-black text-white tracking-tight leading-none mb-4"
                      >
                        ¡Gracias!
                      </motion.h1>

                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="text-3xl font-medium text-white/50"
                      >
                        Vuelve Pronto
                      </motion.p>

                      {completedSale.total > 0 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.7, type: 'spring' }}
                          className="mt-10 px-8 py-4 bg-white/8 border border-white/15 rounded-2xl"
                        >
                          <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Total pagado</p>
                          <p className="text-secondary font-black text-4xl tabular-nums">${completedSale.total.toLocaleString('es-CL')}</p>
                        </motion.div>
                      )}

                      {storeInfo?.storeName && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.2 }}
                          transition={{ delay: 1 }}
                          className="mt-8 text-white text-sm font-bold uppercase tracking-[0.3em]"
                        >
                          {storeInfo.storeName}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>

                /* ── STATE 1: VENTA COMPLETADA ── */
                ) : completedSale ? (
                  <motion.div
                    key="completed"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-5xl"
                  >
                    {/* Success banner */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <motion.div
                          animate={{ scale: [1, 1.08, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-14 h-14 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center flex-shrink-0"
                        >
                          <CheckCircle className="w-8 h-8 text-green-400" />
                        </motion.div>
                        <div>
                          <h2 className="text-4xl font-black text-white leading-none">¡Venta Exitosa!</h2>
                          <p className="text-white/40 text-sm mt-0.5">{new Date(completedSale.date).toLocaleString('es-CL')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white/30 text-xs uppercase tracking-widest">Código de operación</p>
                        <p className="text-white font-mono font-black text-xl">#VT-{completedSale.id?.toString().slice(-6).padStart(6, '0')}</p>
                      </div>
                    </div>

                    {/* Two-column layout */}
                    <div className="grid grid-cols-5 gap-4">
                      {/* Products — 3 cols */}
                      <div className="col-span-3 bg-white/8 border border-white/12 rounded-2xl overflow-hidden">
                        <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2">
                          <ShoppingCart className="w-4 h-4 text-secondary" />
                          <span className="text-white font-black text-sm uppercase tracking-widest">Productos</span>
                          <span className="ml-auto text-white/30 text-xs">{completedSale.cart.length} ítem{completedSale.cart.length !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="divide-y divide-white/8">
                          {completedSale.cart.slice(0, 6).map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center px-5 py-3">
                              <div className="min-w-0">
                                <p className="text-white font-bold text-sm truncate">{item.name}</p>
                                <p className="text-white/40 text-xs">{item.quantity} × ${item.price.toLocaleString('es-CL')}</p>
                              </div>
                              <p className="text-secondary font-black ml-4 flex-shrink-0">${(item.price * item.quantity).toLocaleString('es-CL')}</p>
                            </div>
                          ))}
                          {completedSale.cart.length > 6 && (
                            <div className="px-5 py-2 text-center text-white/30 text-xs">
                              +{completedSale.cart.length - 6} producto{completedSale.cart.length - 6 !== 1 ? 's' : ''} más
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Summary — 2 cols */}
                      <div className="col-span-2 flex flex-col gap-3">
                        {/* Financial */}
                        <div className="bg-white/8 border border-white/12 rounded-2xl p-5 flex-1">
                          <div className="space-y-2 mb-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-white/40">Subtotal</span>
                              <span className="text-white font-bold">${(completedSale.subtotal ?? completedSale.total).toLocaleString('es-CL')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white/40">IVA (19%)</span>
                              <span className="text-white font-bold">${Math.round((completedSale.subtotal ?? completedSale.total) * 0.19).toLocaleString('es-CL')}</span>
                            </div>
                          </div>
                          <div className="border-t border-white/15 pt-3">
                            <div className="flex justify-between items-baseline">
                              <span className="text-white/60 font-bold text-sm uppercase tracking-wider">Total</span>
                              <span className="text-green-400 font-black text-3xl">${completedSale.total.toLocaleString('es-CL')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Payment method */}
                        <div className="bg-white/8 border border-white/12 rounded-2xl p-5">
                          <p className="text-white/30 text-xs uppercase tracking-widest mb-3">Método de Pago</p>
                          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${
                            completedSale.paymentMethod === 'Efectivo' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                            completedSale.paymentMethod === 'Débito' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                            completedSale.paymentMethod === 'Fiado' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                            'bg-secondary/20 text-secondary border border-secondary/30'
                          }`}>
                            {completedSale.paymentMethod === 'Efectivo' ? <Banknote className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                            {completedSale.paymentMethod}
                          </span>

                          {completedSale.paymentMethod === 'Efectivo' && completedSale.change >= 0 && (
                            <div className="mt-3 pt-3 border-t border-white/10">
                              <p className="text-white/40 text-xs mb-1">Vuelto a entregar</p>
                              <p className="text-secondary font-black text-3xl">${completedSale.change.toLocaleString('es-CL')}</p>
                            </div>
                          )}

                          {completedSale.paymentMethod === 'Fiado' && completedSale.fiadoInfo && (
                            <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
                              <div className="flex justify-between text-sm">
                                <span className="text-white/40">Cliente</span>
                                <span className="text-white font-bold">{completedSale.fiadoInfo.clientName}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-white/40">Vence</span>
                                <span className="text-orange-400 font-bold">{new Date(completedSale.fiadoInfo.dueDate).toLocaleDateString('es-CL')}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-center text-white/20 text-sm mt-4 italic">¡Gracias por su compra! Vuelva pronto.</p>
                  </motion.div>

                /* ── STATE 2: PAGO EN PROGRESO ── */
                ) : paymentInProgress ? (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.25 }}
                    className="w-full max-w-2xl"
                  >
                    <div className="text-center mb-8">
                      <div className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-full font-bold mb-6 border ${
                        paymentInProgress.method === 'Efectivo'
                          ? 'bg-green-500/15 text-green-300 border-green-500/30'
                          : 'bg-orange-500/15 text-orange-300 border-orange-500/30'
                      }`}>
                        {paymentInProgress.method === 'Efectivo'
                          ? <Banknote className="w-5 h-5" />
                          : <Wallet className="w-5 h-5" />}
                        Pago en {paymentInProgress.method}
                      </div>
                      <p className="text-white/40 text-lg mb-1">Total a pagar</p>
                      <p className="text-7xl font-black text-white tabular-nums">
                        ${paymentInProgress.total.toLocaleString('es-CL')}
                      </p>
                    </div>

                    {paymentInProgress.method === 'Efectivo' && paymentInProgress.amountReceived > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div className="bg-white/10 border border-white/15 rounded-2xl p-6 text-center">
                          <p className="text-white/40 text-sm uppercase tracking-widest mb-2">Recibido</p>
                          <p className="text-white font-black text-4xl tabular-nums">
                            ${paymentInProgress.amountReceived.toLocaleString('es-CL')}
                          </p>
                        </div>
                        <motion.div
                          animate={paymentInProgress.sufficient ? { scale: [1, 1.03, 1] } : {}}
                          transition={{ duration: 0.4 }}
                          className={`rounded-2xl p-6 text-center border-2 ${
                            paymentInProgress.sufficient
                              ? 'bg-green-500/20 border-green-500/50'
                              : 'bg-red-500/15 border-red-500/30'
                          }`}
                        >
                          <p className={`text-sm uppercase tracking-widest mb-2 ${paymentInProgress.sufficient ? 'text-green-300/70' : 'text-red-300/70'}`}>
                            {paymentInProgress.sufficient ? 'Vuelto' : 'Falta'}
                          </p>
                          <p className={`font-black text-4xl tabular-nums ${paymentInProgress.sufficient ? 'text-green-300' : 'text-red-400'}`}>
                            ${paymentInProgress.change.toLocaleString('es-CL')}
                          </p>
                        </motion.div>
                      </motion.div>
                    )}

                    {paymentInProgress.method === 'Fiado' && (
                      <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-6 text-center">
                        <Wallet className="w-10 h-10 text-orange-300 mx-auto mb-3" />
                        <p className="text-orange-200 font-bold text-lg">
                          {paymentInProgress.clientName ? `Cliente: ${paymentInProgress.clientName}` : 'Seleccionando cliente...'}
                        </p>
                      </div>
                    )}
                  </motion.div>

                /* ── STATE 3: CARRITO EN PROGRESO ── */
                ) : customerCart.length > 0 ? (
                  <motion.div
                    key="cart"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="w-full max-w-5xl"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <ShoppingCart className="w-6 h-6 text-secondary" />
                        <h2 className="text-3xl font-black text-white">Tu Compra</h2>
                        <span className="px-2.5 py-0.5 bg-secondary/20 text-secondary rounded-full text-sm font-bold">
                          {customerCart.reduce((s: number, i: any) => s + i.quantity, 0)} uds
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-white/40 text-sm">Total</p>
                        <p className="text-secondary font-black text-4xl tabular-nums">
                          ${customerCart.reduce((s: number, i: any) => s + i.price * i.quantity, 0).toLocaleString('es-CL')}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                      <div className="grid grid-cols-3 text-[10px] font-black text-white/25 uppercase tracking-widest px-5 py-2 border-b border-white/8">
                        <span>Producto</span>
                        <span className="text-center">Cant.</span>
                        <span className="text-right">Subtotal</span>
                      </div>
                      <div className="divide-y divide-white/8">
                        {customerCart.slice(0, 8).map((item: any, idx: number) => (
                          <motion.div
                            key={`${item.id}-${idx}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.04 }}
                            className="grid grid-cols-3 items-center px-5 py-3.5"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-secondary/20 flex-shrink-0 overflow-hidden">
                                {item.image
                                  ? <img src={item.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  : <Package className="w-4 h-4 text-secondary m-auto mt-2" />}
                              </div>
                              <p className="text-white font-bold text-sm truncate">{item.name}</p>
                            </div>
                            <div className="text-center">
                              <span className="inline-flex items-center justify-center w-8 h-8 bg-secondary/20 text-secondary font-black rounded-lg text-sm">
                                {item.quantity}
                              </span>
                            </div>
                            <p className="text-right text-secondary font-black">${(item.price * item.quantity).toLocaleString('es-CL')}</p>
                          </motion.div>
                        ))}
                        {customerCart.length > 8 && (
                          <div className="px-5 py-2.5 text-center text-white/25 text-xs">
                            +{customerCart.length - 8} producto{customerCart.length - 8 !== 1 ? 's' : ''} más
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>

                /* ── STATE 4: ESPERANDO ── */
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center select-none"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.7, 0.4] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-36 h-36 mx-auto mb-8 bg-secondary/10 rounded-3xl flex items-center justify-center"
                    >
                      <Package className="w-18 h-18 text-secondary w-20 h-20" />
                    </motion.div>
                    <h1 className="text-8xl font-black text-white mb-4 tracking-tight">Bienvenido</h1>
                    <p className="text-2xl text-white/30 font-medium">Esperando productos...</p>
                    {storeInfo?.storeName && (
                      <p className="mt-6 text-white/15 text-sm font-bold uppercase tracking-widest">{storeInfo.storeName}</p>
                    )}
                  </motion.div>
                )}

              </AnimatePresence>
            </main>

            {/* ── FOOTER ── */}
            <footer className="flex-shrink-0 flex justify-between items-center px-8 py-3 border-t border-white/8">
              <div className="flex items-center gap-2 text-xs text-white/25">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Conectado · Visor de Cliente
              </div>
              <div className="text-xs text-white/20">
                Desarrollado por <span className="font-bold text-white/35">VANTORY DIGITAL</span> · vantorydigital.cl
              </div>
            </footer>
          </motion.div>
        ) : currentPage === 'inventory' ? (
          <motion.div 
            key="inventory"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
          >
            <InventoryDashboardComponent />
          </motion.div>
        ) : currentPage === 'sales' ? (
          <motion.div 
            key="sales"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
          >
            <SalesDashboardComponent />
          </motion.div>
        ) : currentPage === 'dashboard' ? (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
          >
            <DashboardComponent />
          </motion.div>
        ) : currentPage === 'history' ? (
          <motion.div 
            key="history"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
          >
            <SalesHistoryComponent />
          </motion.div>
        ) : currentPage === 'entries' ? (
          <motion.div 
            key="entries"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
          >
            <StockEntriesComponent />
          </motion.div>
        ) : currentPage === 'kpis' ? (
          <motion.div 
            key="kpis"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
          >
            <KPIsDashboardComponent />
          </motion.div>
        ) : currentPage === 'fiados' ? (
          <motion.div 
            key="fiados"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
          >
            <FiadosDashboardComponent />
          </motion.div>
        ) : currentPage === 'home' ? (
          <HomePage setCurrentPage={setCurrentPage} />
        ) : currentPage === 'features' ? (
          <FeaturesPage setCurrentPage={setCurrentPage} />
        ) : currentPage === 'blog' ? (
          <BlogPage />
        ) : currentPage === 'lobby' ? (
          <LobbyComponent stores={clientStores} posMachines={posMachines} setCurrentStore={setCurrentStore} setCurrentPOS={setCurrentPOS} setCurrentPage={setCurrentPage} currentUser={currentUser} />
        ) : currentPage === 'superadmin-dashboard' ? (
          <SuperAdminDashboardComponent setCurrentPage={setCurrentPage} vantoryClients={vantoryClients} currentUser={currentUser} />
        ) : currentPage === 'superadmin-clients' ? (
          <SuperAdminClientsComponent setCurrentPage={setCurrentPage} vantoryClients={vantoryClients} setVantoryClients={setVantoryClients} setCurrentUser={setCurrentUser} setSelectedClient={setSelectedClient} />
        ) : currentPage === 'superadmin-client-profile' && selectedClient ? (
          <SuperAdminClientProfileComponent client={selectedClient} setCurrentPage={setCurrentPage} stores={stores} setStores={setStores} posMachines={posMachines} setPosMachines={setPosMachines} vantoryClients={vantoryClients} setVantoryClients={setVantoryClients} users={users} setUsers={setUsers} />
        ) : (
          <LoginPageComponent users={clientUsers} stores={clientStores} posMachines={posMachines} setCurrentUser={setCurrentUser} setCurrentPage={setCurrentPage} setCurrentStore={setCurrentStore} setCurrentPOS={setCurrentPOS} />
        )}
      </AnimatePresence>

      {/* Footer */}
      {['home', 'features', 'blog'].includes(currentPage) && (
        <footer className="bg-secondary/5 py-16 px-6 md:px-12 border-t border-secondary/10">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Logo onClick={() => setCurrentPage('home')} />
            <p className="text-on-surface-variant text-sm leading-relaxed">Software de gestión integral para retail y almacenes modernos. Tecnología chilena para el mundo.</p>
            <div className="flex gap-4 pt-2">
              <motion.a
                href="https://wa.me/56920182313?text=Hola,%20me%20gustaría%20recibir%20más%20información%20sobre%20VANTORY%20POS%20360."
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 border border-green-500/20 shadow-sm hover:shadow-md transition-shadow"
              >
                <MessageCircle className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://www.instagram.com/vantorydg?igsh=MXViNWEwemZocG45cA%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-600 border border-pink-500/20 shadow-sm hover:shadow-md transition-shadow"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
            </div>
          </div>
          {[
            { title: 'Producto', links: ['Ventas', 'Inventario', 'Reportes'] },
            { title: 'Compañía', links: [
              { label: 'Vantory Digital', href: 'https://www.vantorydigital.cl' },
              { label: 'Blog: Innovación Retail', onClick: () => setCurrentPage('blog') },
              { label: 'contacto@vantorydigital.cl', href: 'mailto:contacto@vantorydigital.cl' }
            ] },
            { title: 'Soporte', links: [
              { label: 'Contactar Soporte', href: 'mailto:contacto@vantorydigital.cl' },
              { label: 'Estado: 100% Online', href: '#' }
            ] }
          ].map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="font-bold text-on-surface font-headline">{section.title}</h4>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                {section.links.map((link) => {
                  const label = typeof link === 'string' ? link : link.label;
                  const href = typeof link === 'string' ? '#' : (link.href || '#');
                  const onClick = typeof link === 'string' ? undefined : link.onClick;
                  return (
                    <li key={label}>
                      <a 
                        className="hover:text-secondary transition-colors cursor-pointer" 
                        href={href}
                        onClick={(e) => {
                          if (onClick) {
                            e.preventDefault();
                            onClick();
                          }
                        }}
                      >
                        {label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="container mx-auto mt-16 pt-8 border-t border-secondary/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-on-surface-variant/60">© 2024 Vantory Digital. Todos los derechos reservados. Made in Chile.</p>
          <div className="flex flex-wrap justify-center md:justify-end gap-6 text-xs text-on-surface-variant/60">
            <button onClick={() => setActiveModal('privacy')} className="hover:text-secondary transition-colors">Política de Privacidad</button>
            <button onClick={() => setActiveModal('terms')} className="hover:text-secondary transition-colors">Términos y Condiciones</button>
            <button onClick={() => setShowCookies(true)} className="hover:text-secondary transition-colors">Cookies</button>
          </div>
        </div>

        {/* Developer Credit Banner */}
        <div className="container mx-auto mt-12 flex justify-center">
          <motion.a 
            href="https://www.vantorydigital.cl"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02, y: -2 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-50 text-secondary rounded-full shadow-sm hover:shadow-md transition-all border border-blue-100 group"
          >
            <span className="text-[10px] font-black tracking-widest uppercase opacity-60 group-hover:opacity-100 transition-opacity">Desarrollado por</span>
            <span className="text-sm font-black tracking-tight">VANTORY DIGITAL</span>
            <div className="w-1.5 h-1.5 rounded-full bg-secondary/30"></div>
            <span className="text-[10px] font-bold text-secondary/70 italic">Creamos tu web</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </motion.a>
        </div>
      </footer>
      )}

      {/* Legal Modals */}
      <AnimatePresence>
        {activeModal && (
          <LegalModal type={activeModal} onClose={() => setActiveModal(null)} />
        )}
      </AnimatePresence>

      {/* Cookie Banner */}
      <AnimatePresence>
        {showCookies && <CookieBanner />}
      </AnimatePresence>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-secondary text-white rounded-full shadow-2xl shadow-secondary/40 flex items-center justify-center border border-white/20 backdrop-blur-sm"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <CashRegisterModal
        showCashRegisterModal={showCashRegisterModal}
        setShowCashRegisterModal={setShowCashRegisterModal}
        clientCashRegister={clientCashRegister}
        setClientCashRegister={setClientCashRegister}
        setClientCashHistory={setClientCashHistory}
        currentUser={currentUser}
      />
    </div>
  );
}

// Wrapper que lee el usuario/POS activo del POSContext y los pasa a AppContext
function AppContextWrapper({ children }: { children: React.ReactNode }) {
  const { currentUser, currentPOS } = usePOSContext();
  return (
    <AppContextProvider currentUser={currentUser} currentPOS={currentPOS}>
      {children}
    </AppContextProvider>
  );
}

export default function App() {
  return (
    <UIContextProvider>
      <POSContextProvider users={[]} onUserAutoGrant={() => {}}>
        <AppContextWrapper>
          <AppRouter />
        </AppContextWrapper>
      </POSContextProvider>
    </UIContextProvider>
  );
}
