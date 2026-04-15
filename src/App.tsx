/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Menu, Package, Globe, ArrowUp, ArrowLeft, X, ExternalLink, MessageCircle, Instagram } from 'lucide-react';
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
import { SuperAdminDashboard as SuperAdminDashboardComponent } from './components/superadmin/SuperAdminDashboard';
import { SuperAdminClients as SuperAdminClientsComponent } from './components/superadmin/SuperAdminClients';
import { SuperAdminClientProfile as SuperAdminClientProfileComponent } from './components/superadmin/SuperAdminClientProfile';
import { Dashboard as DashboardComponent } from './components/dashboard/Dashboard';
import { SalesHistory as SalesHistoryComponent } from './components/sales/SalesHistory';
import { FiadosDashboard as FiadosDashboardComponent } from './components/sales/FiadosDashboard';
import { InventoryDashboard as InventoryDashboardComponent } from './components/inventory/InventoryDashboard';
import { StockEntries as StockEntriesComponent } from './components/inventory/StockEntries';
import { KPIsDashboard as KPIsDashboardComponent } from './components/kpis/KPIsDashboard';
import { UsersManagement as UsersManagementComponent } from './components/users/UsersManagement';
import { SalesDashboard as SalesDashboardComponent } from './components/sales/SalesDashboard';
import { usePOSContext } from './context/POSContext';
import { useAppContext } from './context/AppContext';





function AppRouter() {
  // ===== Context Hooks =====
  const { currentPage, setCurrentPage, showCashRegisterModal, setShowCashRegisterModal, activeModal, setActiveModal, showCookies, setShowCookies, showPassword, setShowPassword, viewingSale, setViewingSale, selectedPost, setSelectedPost, isScrolled, showBackToTop, scrollToTop } = useUIContext();
  const { currentUser, setCurrentUser, currentStore, setCurrentStore, currentPOS, setCurrentPOS } = usePOSContext();
  const { vantoryClients, setVantoryClients, selectedClient, setSelectedClient, stores, setStores, posMachines, setPosMachines, inventory, setInventory, categories, setCategories, stockEntries, setStockEntries, salesHistory, setSalesHistory, cashRegisters, setCashRegisters, cashHistory, setCashHistory, users, setUsers, fiados, setFiados, clientInventory, setClientInventory, clientSalesHistory, setClientSalesHistory, clientStockEntries, setClientStockEntries, clientStores, setClientStores, clientUsers, setClientUsers, clientFiados, setClientFiados, clientCashHistory, setClientCashHistory, clientCashRegister, setClientCashRegister } = useAppContext();

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
            className="fixed inset-0 z-[200] bg-[#0f172a] flex flex-col"
          >
            <header className="p-6 flex justify-between items-center bg-white/5 backdrop-blur-md border-b border-white/10">
              <div className="flex flex-col">
                <span className="text-3xl font-black tracking-tighter text-white">Vantory <span className="text-secondary">POS</span></span>
                {currentStore && (
                  <div className="flex items-center gap-2 mt-1">
                    <Globe className="w-3 h-3 text-secondary" />
                    <span className="text-[10px] font-bold text-outline-variant uppercase tracking-widest">{currentStore.name} · {currentPOS?.name}</span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-white font-black text-xl">
                  {new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-outline-variant text-xs font-medium">
                  {new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
              </div>
            </header>
            
            <main className="flex-1 flex flex-col items-center justify-center p-6">
              <div className="text-center animate-pulse">
                <div className="w-32 h-32 mx-auto mb-8 bg-white/5 rounded-3xl flex items-center justify-center">
                  <Package className="w-16 h-16 text-secondary" />
                </div>
                <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Bienvenido</h1>
                <p className="text-xl text-outline-variant">Esperando productos...</p>
              </div>
            </main>
            
            <footer className="p-6 flex justify-between items-center border-t border-white/10">
              <div className="flex items-center gap-2 text-sm text-outline-variant">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Conectado · Visor de Cliente
              </div>
              <div className="text-sm text-outline-variant">
                Desarrollado por <span className="font-bold text-white">VANTORY DIGITAL</span> · vantorydigital.cl
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
        ) : currentPage === 'users' ? (
          <motion.div 
            key="users"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
          >
            <UsersManagementComponent />
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
          <LobbyComponent stores={stores} posMachines={posMachines} setCurrentStore={setCurrentStore} setCurrentPOS={setCurrentPOS} setCurrentPage={setCurrentPage} currentUser={currentUser} />
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

export default function App() {
  return (
    <UIContextProvider>
      <POSContextProvider users={[]} onUserAutoGrant={() => {}}>
        <AppContextProvider currentUser={null} currentPOS={null}>
          <AppRouter />
        </AppContextProvider>
      </POSContextProvider>
    </UIContextProvider>
  );
}
