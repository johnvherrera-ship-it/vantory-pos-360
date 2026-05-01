import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, Package, Wallet } from 'lucide-react';
import { useAppContexts } from '../../hooks/useAppContexts';

export const NotificationsPanel = () => {
  const { ui, app } = useAppContexts();
  const { showNotificationsPanel, setShowNotificationsPanel, setCurrentPage } = ui;
  const { clientInventory: inventory, clientFiados: fiados } = app;

  const lowStock = inventory.filter(p => p.stock < 10);

  const overdueFiados = fiados.filter(client => {
    if (client.totalDebt <= 0) return false;
    const charges = client.history.filter((r: any) => r.type === 'charge');
    if (charges.length === 0) return false;
    const oldest = new Date(charges[0].date);
    const daysOld = Math.floor((Date.now() - oldest.getTime()) / (1000 * 3600 * 24));
    return daysOld > 15;
  });

  const totalAlerts = lowStock.length + overdueFiados.length;

  return (
    <AnimatePresence>
      {showNotificationsPanel && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNotificationsPanel(false)}
            className="fixed inset-0 z-[200] bg-black/30 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-[201] w-96 bg-white shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-[#0F172A]">Notificaciones</h3>
                <p className="text-xs font-bold text-outline-variant">
                  {totalAlerts > 0 ? `${totalAlerts} alertas activas` : 'Sin alertas'}
                </p>
              </div>
              <button
                onClick={() => setShowNotificationsPanel(false)}
                className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-[#0F172A]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {lowStock.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-4 h-4 text-error" />
                    <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-widest">
                      Stock Crítico ({lowStock.length})
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {lowStock.slice(0, 8).map(p => (
                      <div
                        key={p.id}
                        className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100"
                      >
                        <img
                          src={p.image}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                          alt={p.name}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#0F172A] truncate">{p.name}</p>
                          <p className="text-xs text-error font-black">{p.stock} unidades restantes</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => { setCurrentPage('inventory'); setShowNotificationsPanel(false); }}
                    className="mt-3 w-full py-2.5 text-xs font-black text-secondary border border-secondary/20 rounded-xl hover:bg-secondary/5 transition-colors"
                  >
                    Gestionar Inventario
                  </button>
                </div>
              )}

              {overdueFiados.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Wallet className="w-4 h-4 text-orange-500" />
                    <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-widest">
                      Fiados Vencidos ({overdueFiados.length})
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {overdueFiados.slice(0, 6).map(client => (
                      <div
                        key={client.id}
                        className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100"
                      >
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Wallet className="w-5 h-5 text-orange-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#0F172A] truncate">{client.name}</p>
                          <p className="text-xs text-orange-600 font-black">
                            ${client.totalDebt.toLocaleString('es-CL')} pendiente
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => { setCurrentPage('fiados'); setShowNotificationsPanel(false); }}
                    className="mt-3 w-full py-2.5 text-xs font-black text-secondary border border-secondary/20 rounded-xl hover:bg-secondary/5 transition-colors"
                  >
                    Gestionar Fiados
                  </button>
                </div>
              )}

              {totalAlerts === 0 && (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <Bell className="w-12 h-12 text-outline-variant/30 mb-4" />
                  <p className="font-bold text-[#0F172A]">Todo en orden</p>
                  <p className="text-xs text-outline-variant mt-1">No hay alertas activas en este momento.</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
