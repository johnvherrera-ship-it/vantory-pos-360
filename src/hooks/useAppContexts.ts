/**
 * Custom hook to access all app contexts
 * Centralizes context consumption pattern to avoid destructuring boilerplate
 */
import { useUIContext } from '../context/UIContext';
import { usePOSContext } from '../context/POSContext';
import { useAppContext } from '../context/AppContext';

export const useAppContexts = () => ({
  ui: useUIContext(),
  pos: usePOSContext(),
  app: useAppContext(),
});
