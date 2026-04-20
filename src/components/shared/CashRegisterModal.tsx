import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import { queueService } from '../../services/queueService';

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
  const [discrepancyModal, setDiscrepancyModal] = useState<{ show: boolean; type?: string; diff?: number; expected?: number; actual?: number }>({ show: false });
  const [successModal, setSuccessModal] = useState(false);
  return (
    <>
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
                const openedAt = new Date().toISOString();
                const registerData = { isOpen: true, initialCash: initial, currentCash: initial, openedAt };
                setClientCashRegister(registerData);
                queueService.enqueue('cash_register_open', {
                  clientId: (currentUser as any).clientId,
                  storeId: (currentUser as any).storeId,
                  posId: null,
                  initialCash: initial,
                  openedAt
                });
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
                  setDiscrepancyModal({ show: true, type, diff, expected, actual });
                  return;
                } else {
                  setSuccessModal(true);
                  setTimeout(() => {
                    // Continue with closing...
                    const closingRecord = {
                      clientId: (currentUser as any).clientId,
                      storeId: (currentUser as any).storeId,
                      posId: null,
                      openedAt: clientCashRegister.openedAt || new Date().toISOString(),
                      closedAt: new Date().toISOString(),
                      initialCash: clientCashRegister.initialCash,
                      expectedCash: expected,
                      actualCash: actual,
                      difference: diff,
                      user: currentUser?.name || 'Sistema',
                      status: 'Cuadrada'
                    };
                    setClientCashHistory((prev: CashHistory[]) => [{ id: Date.now(), ...closingRecord } as any, ...prev]);
                    queueService.enqueue('cash_history', { record: closingRecord });
                    setClientCashRegister({ isOpen: false, initialCash: 0, currentCash: 0, openedAt: null });
                    setShowCashRegisterModal(false);
                    setSuccessModal(false);
                  }, 1500);
                  return;
                }
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

    {/* Modal Discrepancia */}
    <AnimatePresence>
      {discrepancyModal.show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#0F172A]">Discrepancia detectada</h3>
                <p className="text-sm text-[#0F172A]/60">Diferencia en cierre de caja</p>
              </div>
            </div>

            <div className="space-y-3 mb-6 p-4 bg-amber-50 rounded-xl">
              <div className="flex justify-between">
                <span className="text-sm font-bold text-[#0F172A]/70">Tipo:</span>
                <span className="text-sm font-black text-amber-600 capitalize">{discrepancyModal.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-bold text-[#0F172A]/70">Diferencia:</span>
                <span className="text-sm font-black text-amber-600">${Math.abs(discrepancyModal.diff || 0).toLocaleString('es-CL')}</span>
              </div>
              <div className="h-px bg-amber-200"></div>
              <div className="flex justify-between">
                <span className="text-xs text-[#0F172A]/60">Registrado:</span>
                <span className="text-xs font-bold text-[#0F172A]">${discrepancyModal.expected?.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-[#0F172A]/60">Contado:</span>
                <span className="text-xs font-bold text-[#0F172A]">${discrepancyModal.actual?.toLocaleString('es-CL')}</span>
              </div>
            </div>

            <p className="text-sm text-[#0F172A]/70 mb-6">¿Deseas continuar con el cierre de caja?</p>

            <div className="flex gap-3">
              <button
                onClick={() => setDiscrepancyModal({ show: false })}
                className="flex-1 py-3 bg-surface-container-low text-[#0F172A] font-black rounded-xl hover:bg-surface-container-high transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setDiscrepancyModal({ show: false });
                  // Continue with closing
                  const closingRecord = {
                    clientId: (currentUser as any).clientId,
                    storeId: (currentUser as any).storeId,
                    posId: null,
                    openedAt: clientCashRegister.openedAt || new Date().toISOString(),
                    closedAt: new Date().toISOString(),
                    initialCash: clientCashRegister.initialCash,
                    expectedCash: discrepancyModal.expected || 0,
                    actualCash: discrepancyModal.actual || 0,
                    difference: discrepancyModal.diff || 0,
                    user: currentUser?.name || 'Sistema',
                    status: discrepancyModal.type === 'sobrante' ? 'Sobrante' : 'Faltante'
                  };
                  setClientCashHistory((prev: CashHistory[]) => [{ id: Date.now(), ...closingRecord } as any, ...prev]);
                  queueService.enqueue('cash_history', { record: closingRecord });
                  setClientCashRegister({ isOpen: false, initialCash: 0, currentCash: 0, openedAt: null });
                  setShowCashRegisterModal(false);
                  setSuccessModal(true);
                  setTimeout(() => setSuccessModal(false), 1500);
                }}
                className="flex-1 py-3 bg-secondary text-white font-black rounded-xl hover:bg-secondary/90 transition-colors"
              >
                Continuar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Modal Éxito */}
    <AnimatePresence>
      {successModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-8 h-8 text-green-600" />
            </motion.div>
            <h3 className="text-2xl font-black text-[#0F172A] mb-2">¡Cierre completado!</h3>
            <p className="text-sm text-[#0F172A]/70">La caja ha sido cerrada correctamente.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};
