import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useUIContext } from '../context/UIContext';
import { usePOSContext } from '../context/POSContext';
import { useAppContext } from '../context/AppContext';
import { HomePage } from './landing/HomePage';
import { FeaturesPage } from './landing/FeaturesPage';
import { BlogPage } from './landing/BlogPage';
import { LoginPage as LoginPageComponent } from './auth/LoginPage';
import { Lobby as LobbyComponent } from './auth/Lobby';
import { Dashboard as DashboardComponent } from './dashboard/Dashboard';
import { SalesHistory as SalesHistoryComponent } from './sales/SalesHistory';
import { FiadosDashboard as FiadosDashboardComponent } from './sales/FiadosDashboard';
import { InventoryDashboard as InventoryDashboardComponent } from './inventory/InventoryDashboard';
import { StockEntries as StockEntriesComponent } from './inventory/StockEntries';
import { KPIsDashboard as KPIsDashboardComponent } from './kpis/KPIsDashboard';
import { SalesDashboard as SalesDashboardComponent } from './sales/SalesDashboard';
import SuperAdminDashboardComponent from './superadmin/SuperAdminDashboard';
import SuperAdminClientsComponent from './superadmin/SuperAdminClients';
import SuperAdminClientProfileComponent from './superadmin/SuperAdminClientProfile';
import { CustomerView } from './customer/CustomerView';

export function Router() {
  const { currentPage, setCurrentPage } = useUIContext();
  const { currentUser, setCurrentUser, currentStore, setCurrentStore, currentPOS, setCurrentPOS } = usePOSContext();
  const { vantoryClients, setVantoryClients, selectedClient, setSelectedClient, stores, setStores, posMachines, setPosMachines, users, setUsers, clientStores, clientUsers, posMachines: allPosMachines } = useAppContext();

  // Trigger "thank you" animation for customer view
  const [completedSale, setCompletedSale] = React.useState<any>(null);
  const [showThankYou, setShowThankYou] = React.useState(false);

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

  return (
    <AnimatePresence mode="wait">
      {currentPage === 'customer-view' ? (
        <CustomerView
          setCompletedSale={setCompletedSale}
          completedSale={completedSale}
          showThankYou={showThankYou}
        />
      ) : currentPage === 'inventory' ? (
        <motion.div key="inventory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0 }}>
          <InventoryDashboardComponent />
        </motion.div>
      ) : currentPage === 'sales' ? (
        <motion.div key="sales" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0 }}>
          <SalesDashboardComponent />
        </motion.div>
      ) : currentPage === 'dashboard' ? (
        <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0 }}>
          <DashboardComponent />
        </motion.div>
      ) : currentPage === 'history' ? (
        <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0 }}>
          <SalesHistoryComponent />
        </motion.div>
      ) : currentPage === 'entries' ? (
        <motion.div key="entries" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0 }}>
          <StockEntriesComponent />
        </motion.div>
      ) : currentPage === 'kpis' ? (
        <motion.div key="kpis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0 }}>
          <KPIsDashboardComponent />
        </motion.div>
      ) : currentPage === 'fiados' ? (
        <motion.div key="fiados" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0 }}>
          <FiadosDashboardComponent />
        </motion.div>
      ) : currentPage === 'home' ? (
        <HomePage setCurrentPage={setCurrentPage} />
      ) : currentPage === 'features' ? (
        <FeaturesPage setCurrentPage={setCurrentPage} />
      ) : currentPage === 'blog' ? (
        <BlogPage />
      ) : currentPage === 'lobby' ? (
        <LobbyComponent stores={clientStores} posMachines={allPosMachines} setCurrentStore={setCurrentStore} setCurrentPOS={setCurrentPOS} setCurrentPage={setCurrentPage} currentUser={currentUser} />
      ) : currentPage === 'superadmin-dashboard' ? (
        <SuperAdminDashboardComponent setCurrentPage={setCurrentPage} vantoryClients={vantoryClients} currentUser={currentUser} />
      ) : currentPage === 'superadmin-clients' ? (
        <SuperAdminClientsComponent setCurrentPage={setCurrentPage} vantoryClients={vantoryClients} setVantoryClients={setVantoryClients} setCurrentUser={setCurrentUser} setSelectedClient={setSelectedClient} />
      ) : currentPage === 'superadmin-client-profile' && selectedClient ? (
        <SuperAdminClientProfileComponent client={selectedClient} setCurrentPage={setCurrentPage} stores={stores} setStores={setStores} posMachines={posMachines} setPosMachines={setPosMachines} vantoryClients={vantoryClients} setVantoryClients={setVantoryClients} users={users} setUsers={setUsers} />
      ) : (
        <LoginPageComponent users={clientUsers} stores={clientStores} posMachines={allPosMachines} setCurrentUser={setCurrentUser} setCurrentPage={setCurrentPage} setCurrentStore={setCurrentStore} setCurrentPOS={setCurrentPOS} />
      )}
    </AnimatePresence>
  );
}
