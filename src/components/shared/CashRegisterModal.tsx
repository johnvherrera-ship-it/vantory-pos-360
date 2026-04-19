import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface CashRegister {
  isOpen: boolean;
  initialCash: number;
  currentCash: number;
  openedAt: string | null;
}

interface CashHistory {
  id: number;
  openedAt: string;
  closedAt: string;
  initialCash: number;
  expectedCash: number;
  actualCash: number;
  difference: number;
  user: string;
  status: string;
}

interface CashRegisterModalProps {
  showCashRegisterModal: boolean;
  setShowCashRegisterModal: (show: boolean) => void;
  clientCashRegister: CashRegister;
  setClientCashRegister: (register: CashRegister) => void;
  setClientCashHistory: (action: (prev: CashHistory[]) => CashHistory[]) => void;
  currentUser: any;
}

export const CashRegisterModal: React.FC<CashRegisterModalProps> = ({
  showCashRegisterModal,
  setShowCashRegisterModal,
  clientCashRegister,
  setClientCashRegister,
  setClientCashHistory,
  currentUser
}) => {
  return (
    <AnimatePresence>
      {showCashRegisterModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-black text-[#0F172A] font-headline">{clientCashRegister.isOpen ? 'Cierre' : 'Apertura'} de <span className="text-secondary">Caja</span></h3>
                <p className="text-sm font-bold text-[#0F172A]/70">{clientCashRegister.isOpen ? 'Cuadre de caja al final del turno' : 'Ingresa el monto inicial para comenzar'}</p>
              </div>
              <button onClick={() => setShowCashRegisterModal(false)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
                <X className="w-6 h-6 text-[#0F172A]" />
              </button>
            </div>

            {!clientCashRegister.isOpen ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const initial = parseInt((form.elements.namedItem('initialCash') as HTMLInputElement).value);
                setClientCashRegister({ isOpen: true, initialCash: initial, currentCash: initial, openedAt: new Date().toISOString() });
                setShowCashRegisterModal(false);
              }} className="space-y-6">
                <div>
                  <label className="block text-sm font-black text-[#0F172A] mb-2">Monto Inicial en Efectivo (Sencillo)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F172A]/50 font-black">$</span>
                    <input
                      name="initialCash"
                      type="number"
                      required
                      min="0"
                      className="w-full pl-8 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-lg font-black text-[#0F172A] focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                      placeholder="Ej. 50000"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-4 bg-gradient-secondary text-white font-black rounded-xl shadow-lg shadow-secondary/20 hover:scale-[1.02] transition-transform">
                  Abrir Caja
                </button>
              </form>
            ) : (
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const actual = parseInt((form.elements.namedItem('actualCash') as HTMLInputElement).value);
                const expected = clientCashRegister.currentCash;
                const diff = actual - expected;

                if (diff !== 0) {
                  const type = diff > 0 ? 'sobrante' : 'faltante';
                  if (!window.confirm(`Discrepancia en cierre de caja\n\nSe detectó un ${type} de $${Math.abs(diff).toLocaleString('es-CL')}.\n\nEfectivo registrado: $${expected.toLocaleString('es-CL')}\nEfectivo contado: $${actual.toLocaleString('es-CL')}\n\n¿Deseas continuar con el cierre?`)) {
                    return;
                  }
                } else {
                  alert('Cierre de caja completado correctamente.');
                }

                // Save to history
                const closingRecord = {
                  id: Date.now(),
                  openedAt: clientCashRegister.openedAt || new Date().toISOString(),
                  closedAt: new Date().toISOString(),
                  initialCash: clientCashRegister.initialCash,
                  expectedCash: expected,
                  actualCash: actual,
                  difference: diff,
                  user: currentUser?.name || 'Sistema',
                  status: diff === 0 ? 'Cuadrada' : (diff > 0 ? 'Sobrante' : 'Faltante')
                };

                setClientCashHistory((prev: CashHistory[]) => [closingRecord, ...prev]);
                setClientCashRegister({ isOpen: false, initialCash: 0, currentCash: 0, openedAt: null });
                setShowCashRegisterModal(false);
              }} className="space-y-6">
                <div className="bg-surface-container-low p-4 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-[#0F172A]/70">Monto Inicial:</span>
                    <span className="text-sm font-black text-[#0F172A]">${clientCashRegister.initialCash.toLocaleString('es-CL')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-[#0F172A]/70">Ventas en Efectivo:</span>
                    <span className="text-sm font-black text-green-600">+${(clientCashRegister.currentCash - clientCashRegister.initialCash).toLocaleString('es-CL')}</span>
                  </div>
                  <div className="h-px bg-outline-variant/20 w-full"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-black text-[#0F172A]">Efectivo Esperado:</span>
                    <span className="text-lg font-black text-secondary">${clientCashRegister.currentCash.toLocaleString('es-CL')}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black text-[#0F172A] mb-2">Efectivo Real en Caja</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F172A]/50 font-black">$</span>
                    <input
                      name="actualCash"
                      type="number"
                      required
                      min="0"
                      className="w-full pl-8 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-lg font-black text-[#0F172A] focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                      placeholder="Ingresa el monto contado"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-4 bg-error text-white font-black rounded-xl shadow-lg shadow-error/20 hover:scale-[1.02] transition-transform">
                  Cerrar Caja
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
