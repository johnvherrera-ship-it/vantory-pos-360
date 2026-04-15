import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

export const POSContextProvider: React.FC<POSContextProviderProps> = ({
  children,
  users = [],
  onUserAutoGrant
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [currentPOS, setCurrentPOS] = useState<POS | null>(null);

  // Auto-grant first user if no user is set
  useEffect(() => {
    if (users.length > 0 && !currentUser) {
      setCurrentUser(users[0]);
      if (onUserAutoGrant) {
        onUserAutoGrant(users);
      }
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
