import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Store, POS } from '../types';

interface POSContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  currentStore: Store | null;
  setCurrentStore: (store: Store | null) => void;
  currentPOS: POS | null;
  setCurrentPOS: (pos: POS | null) => void;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

interface POSContextProviderProps {
  children: React.ReactNode;
  users?: User[];
  onUserAutoGrant?: (users: User[]) => void;
}

const SESSION_KEY = 'vantory_session_v1';

type PersistedSession = {
  currentUser: User | null;
  currentStore: Store | null;
  currentPOS: POS | null;
};

const readSession = (): PersistedSession => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return { currentUser: null, currentStore: null, currentPOS: null };
    const parsed = JSON.parse(raw);
    return {
      currentUser: parsed.currentUser ?? null,
      currentStore: parsed.currentStore ?? null,
      currentPOS: parsed.currentPOS ?? null
    };
  } catch {
    return { currentUser: null, currentStore: null, currentPOS: null };
  }
};

export const POSContextProvider: React.FC<POSContextProviderProps> = ({
  children,
  users = [],
  onUserAutoGrant
}) => {
  const initial = readSession();
  const [currentUser, setCurrentUser] = useState<User | null>(initial.currentUser);
  const [currentStore, setCurrentStore] = useState<Store | null>(initial.currentStore);
  const [currentPOS, setCurrentPOS] = useState<POS | null>(initial.currentPOS);

  useEffect(() => {
    try {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ currentUser, currentStore, currentPOS })
      );
    } catch {}
  }, [currentUser, currentStore, currentPOS]);

  useEffect(() => {
    if (users.length > 0 && currentUser && onUserAutoGrant) {
      onUserAutoGrant(users);
    }
  }, [users, currentUser, onUserAutoGrant]);

  const value: POSContextType = {
    currentUser,
    setCurrentUser,
    currentStore,
    setCurrentStore,
    currentPOS,
    setCurrentPOS,
  };

  return (
    <POSContext.Provider value={value}>
      {children}
    </POSContext.Provider>
  );
};

export const usePOSContext = () => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOSContext must be used within POSContextProvider');
  }
  return context;
};
