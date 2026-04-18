/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Menu, ArrowUp, ExternalLink, MessageCircle, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppContextProvider } from './context/AppContext';
import { POSContextProvider } from './context/POSContext';
import { UIContextProvider, useUIContext } from './context/UIContext';
import { CashRegisterModal } from './components/shared/CashRegisterModal';
import { Logo } from './components/layout/Logo';
import { LegalModal } from './components/landing/LegalModal';
import { CookieBanner } from './components/landing/CookieBanner';
import { Router } from './components/Router';
import { usePOSContext } from './context/POSContext';
import { useAppContext } from './context/AppContext';

function AppShell() {
  const { currentPage, setCurrentPage, activeModal, setActiveModal, showCookies, setShowCookies, isScrolled, showBackToTop, scrollToTop, showCashRegisterModal, setShowCashRegisterModal } = useUIContext();
  const { currentUser } = usePOSContext();
  const { clientCashRegister, setClientCashRegister, setClientCashHistory } = useAppContext();

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body selection:bg-secondary/20 selection:text-secondary">
      {/* Top Navigation Bar (Landing Pages Only) */}
      {['home', 'features', 'blog'].includes(currentPage) && (
        <nav className={`fixed top-0 left-0 right-0 h-16 z-50 transition-all duration-500 flex justify-between items-center px-6 md:px-12 border-b ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl border-secondary/10 shadow-lg py-2'
            : 'bg-secondary/[0.03] backdrop-blur-2xl border-transparent py-4'
        }`}>
          <Logo onClick={() => setCurrentPage('home')} />
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => setCurrentPage('features')}
              className={`text-sm font-medium transition-colors ${currentPage === 'features' ? 'text-secondary' : 'text-on-surface-variant hover:text-secondary'}`}
            >
              Funcionalidades
            </button>
            <button
              onClick={() => setCurrentPage('blog')}
              className={`text-sm font-medium transition-colors ${currentPage === 'blog' ? 'text-secondary' : 'text-on-surface-variant hover:text-secondary'}`}
            >
              Blog
            </button>
            <motion.button
              onClick={() => setCurrentPage('login')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 text-sm font-bold text-white bg-gradient-secondary rounded-lg"
            >
              Acceder
            </motion.button>
          </div>
          <button className="md:hidden p-2">
            <Menu className="w-6 h-6" />
          </button>
        </nav>
      )}

      {/* Main Router */}
      <Router />

      {/* Footer (Landing Pages Only) */}
      {['home', 'features', 'blog'].includes(currentPage) && (
        <footer className="bg-secondary/5 py-16 px-6 md:px-12 border-t border-secondary/10">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <Logo onClick={() => setCurrentPage('home')} />
              <p className="text-on-surface-variant text-sm">Software de gestión integral para retail y almacenes modernos.</p>
              <div className="flex gap-4 pt-2">
                <motion.a
                  href="https://wa.me/56920182313?text=Hola,%20me%20gustaría%20recibir%20más%20información%20sobre%20VANTORY%20POS%20360."
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600"
                >
                  <MessageCircle className="w-5 h-5" />
                </motion.a>
                <motion.a
                  href="https://www.instagram.com/vantorydg"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-600"
                >
                  <Instagram className="w-5 h-5" />
                </motion.a>
              </div>
            </div>
          </div>

          <div className="container mx-auto mt-16 pt-8 border-t border-secondary/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-on-surface-variant/60">© 2024 Vantory Digital. Todos los derechos reservados.</p>
            <div className="flex flex-wrap justify-center gap-6 text-xs text-on-surface-variant/60">
              <button onClick={() => setActiveModal('privacy')} className="hover:text-secondary">Política de Privacidad</button>
              <button onClick={() => setActiveModal('terms')} className="hover:text-secondary">Términos y Condiciones</button>
              <button onClick={() => setShowCookies(true)} className="hover:text-secondary">Cookies</button>
            </div>
          </div>
        </footer>
      )}

      {/* Global Modals & Components */}
      <AnimatePresence>
        {activeModal && (
          <LegalModal type={activeModal} onClose={() => setActiveModal(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCookies && <CookieBanner />}
      </AnimatePresence>

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-secondary text-white rounded-full shadow-2xl"
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

// Context wrapper
function AppContextWrapper({ children }: { children: React.ReactNode }) {
  const { currentUser, currentPOS, currentStore } = usePOSContext();
  return (
    <AppContextProvider currentUser={currentUser} currentPOS={currentPOS} currentStore={currentStore}>
      {children}
    </AppContextProvider>
  );
}

// Main App with all providers
export default function App() {
  return (
    <UIContextProvider>
      <POSContextProvider users={[]} onUserAutoGrant={() => {}}>
        <AppContextWrapper>
          <AppShell />
        </AppContextWrapper>
      </POSContextProvider>
    </UIContextProvider>
  );
}
