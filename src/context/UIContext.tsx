import React, { createContext, useContext, useState, useEffect } from 'react';

type CurrentPage =
  | 'home'
  | 'features'
  | 'blog'
  | 'login'
  | 'lobby'
  | 'sales'
  | 'customer-view'
  | 'inventory'
  | 'dashboard'
  | 'history'
  | 'entries'
  | 'kpis'
  | 'users'
  | 'fiados'
  | 'superadmin-dashboard'
  | 'superadmin-clients'
  | 'superadmin-client-profile';

interface UIContextType {
  currentPage: CurrentPage;
  setCurrentPage: (page: CurrentPage) => void;
  showCashRegisterModal: boolean;
  setShowCashRegisterModal: (show: boolean) => void;
  activeModal: 'privacy' | 'terms' | null;
  setActiveModal: (modal: 'privacy' | 'terms' | null) => void;
  showCookies: boolean;
  setShowCookies: (show: boolean) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  viewingSale: any | null;
  setViewingSale: (sale: any | null) => void;
  selectedPost: any | null;
  setSelectedPost: (post: any | null) => void;
  isScrolled: boolean;
  showBackToTop: boolean;
  scrollToTop: () => void;
  showNotificationsPanel: boolean;
  setShowNotificationsPanel: (show: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

interface UIContextProviderProps {
  children: React.ReactNode;
}

export const UIContextProvider: React.FC<UIContextProviderProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<CurrentPage>('home');
  const [showCashRegisterModal, setShowCashRegisterModal] = useState(false);
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | null>(null);
  const [showCookies, setShowCookies] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [viewingSale, setViewingSale] = useState<any | null>(null);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Check cookie consent on mount
  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowCookies(true);
    }
  }, []);

  // Check for customer-view URL param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'customer') {
      setCurrentPage('customer-view');
    }
  }, []);

  // Scroll listener for navbar and back-to-top
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const value: UIContextType = {
    currentPage,
    setCurrentPage,
    showCashRegisterModal,
    setShowCashRegisterModal,
    activeModal,
    setActiveModal,
    showCookies,
    setShowCookies,
    showPassword,
    setShowPassword,
    viewingSale,
    setViewingSale,
    selectedPost,
    setSelectedPost,
    isScrolled,
    showBackToTop,
    scrollToTop,
    showNotificationsPanel,
    setShowNotificationsPanel,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};

export const useUIContext = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUIContext must be used within UIContextProvider');
  }
  return context;
};
