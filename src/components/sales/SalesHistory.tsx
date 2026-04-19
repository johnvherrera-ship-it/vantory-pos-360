import React, { useState } from 'react';
import {
  Search,
  Bell,
  Settings,
  LogOut,
  Printer,
  Trash2,
  X,
  CheckCircle,
  CreditCard,
  Banknote,
  Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SideNavBar } from '../layout/SideNavBar';
import { NotificationsPanel } from '../shared/NotificationsPanel';
import { useAppContexts } from '../../hooks/useAppContexts';

interface SalesHistoryProps {}

export const SalesHistory = ({}: SalesHistoryProps) => {
  const { ui, pos, app } = useAppContexts();
  const { setCurrentPage, viewingSale, setViewingSale, setShowNotificationsPanel } = ui;
  const { currentUser, setCurrentUser, currentStore, currentPOS } = pos;
  const { clientSalesHistory: salesHistory, setClientSalesHistory: setSalesHistory, clientUsers: users } = app;

  const [searchTerm, setSearchTerm] = useState('');
  const [saleToDelete, setSaleToDelete] = useState<number | null>(null);

  const filteredSales = salesHistory.filter(sale => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      sale.id.toString().includes(term) ||
      sale.paymentMethod.toLowerCase().includes(term) ||
      sale.cart.some((item: any) => item.name.toLowerCase().includes(term))
    );
  });

  const handleDelete = (id: number) => {
    setSalesHistory((prev: any[]) => prev.filter(s => s.id !== id));
    setSaleToDelete(null);
    if (viewingSale?.id === id) setViewingSale(null);
  };

  const formatCurrency = (n: number) => `$${n.toLocaleString('es-CL')}`;

  return (
    <div className="flex min-h-screen bg-surface text-on-surface font-body">
      <SideNavBar currentPage="history" setCurrentPage={setCurrentPage} currentUser={currentUser} users={users} setCurrentUser={setCurrentUser} currentStore={currentStore} currentPOS={currentPOS} />
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen p-4 md:p-8 pt-20 md:pt-8 pb-20 md:pb-0">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black text-[#0F172A] font-headline mb-1">Historial / <span className="text-secondary">Salidas</span></h2>
            <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-3">PANEL &gt; HISTORIAL / SALIDAS</p>
            <p className="text-[#0F172A]/70 font-bold text-lg">Registro detallado de todas las transacciones realizadas.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <input
                className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-secondary/20 focus:bg-surface-container-lowest transition-all"
                placeholder="Buscar por ID, método, producto..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button onClick={() => setShowNotificationsPanel(true)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f2f3ff] transition-colors relative">
              <Bell className="w-5 h-5 text-on-surface-variant" />
            </button>
            <button onClick={() => setCurrentPage('users')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f2f3ff] transition-colors">
              <Settings className="w-5 h-5 text-on-surface-variant" />
            </button>
            <div className="h-8 w-px bg-outline-variant/30 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-black text-[#0F172A]">{currentUser?.name || 'Admin Vantory'}</p>
                <p className="text-xs text-secondary font-bold">{currentUser?.role || 'Soporte Técnico'}</p>
              </div>
              <img
                className="w-10 h-10 rounded-full border-2 border-surface-container-highest object-cover"
                src={currentUser?.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuAPTOJksruGaNQm6gW0cTKsmHx_gthleGI0Hy70R56Q1oJ4i9lW0iL4JU8oXMoZAshoKE8S3a1-5NvKCV26POVasYgktSZtJpP6RHaMYbMEtqakjdL7rtnYFQso4Kzl5w6R3449pD-nViJIAngGkUqQijX4Zz9xtfKBk4SztlssTnGEGmOQeqPZsahAs-DUJ7tdh68w9VguZXCBAxiCk5XRvvm-GQdW31C8hvfujnZJlbpJ3SVzXGcnVimo2ARlMqv9ks88IY_RN2o_"}
                alt="User"
                referrerPolicy="no-referrer"
              />
            </div>
            <button
              onClick={() => { setCurrentUser(null); setCurrentPage('home'); }}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-error-container/20 text-error transition-colors ml-2"
              title="Cerrar Sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-outline-variant/10 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-secondary text-white">
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest">ID Venta</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest">Fecha / Hora</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest">Método</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest">Productos</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest">Total</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filteredSales.map((sale) => (
                <tr
                  key={sale.id}
                  className="hover:bg-surface-container-high transition-all cursor-pointer"
                  onClick={() => setViewingSale(sale)}
                >
                  <td className="px-8 py-6 font-bold text-[#0F172A]">#{sale.id.toString().slice(-8)}</td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-medium text-[#0F172A]">{new Date(sale.date).toLocaleDateString()}</p>
                    <p className="text-xs text-[#0F172A] font-black">{new Date(sale.date).toLocaleTimeString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      sale.paymentMethod === 'Efectivo' ? 'bg-green-100 text-green-700' :
                      sale.paymentMethod === 'Fiado' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-[#0F172A]">{sale.cart.length} ítems</p>
                    <p className="text-xs text-[#0F172A] font-black truncate max-w-[200px]">
                      {sale.cart.map((item: any) => item.name).join(', ')}
                    </p>
                  </td>
                  <td className="px-8 py-6 font-black text-green-600">{formatCurrency(sale.total)}</td>
                  <td className="px-8 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setViewingSale(sale)}
                      className="p-2 text-outline hover:text-secondary transition-colors"
                      title="Ver detalle"
                    >
                      <Printer className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSaleToDelete(sale.id)}
                      className="p-2 text-outline hover:text-error transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-outline-variant font-medium">
                    {searchTerm ? 'No hay resultados para tu búsqueda.' : 'No hay transacciones registradas en el historial.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Sale Detail Modal */}
      <AnimatePresence>
        {viewingSale && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setViewingSale(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="print-ticket bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="bg-secondary p-6 text-white text-center relative">
                <div className="absolute -bottom-3 left-0 right-0 flex justify-around">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-white rounded-full"></div>
                  ))}
                </div>
                <CheckCircle className="w-12 h-12 mx-auto mb-3" />
                <h2 className="text-2xl font-black tracking-tight">Detalle de Venta</h2>
                <p className="text-white/80 text-sm">{new Date(viewingSale.date).toLocaleString('es-CL')}</p>
                <p className="text-white/60 text-xs font-mono mt-1">#VT-{viewingSale.id?.toString().slice(-6).padStart(6, '0')}</p>
              </div>

              <div className="p-8 pt-10 flex-1 overflow-y-auto max-h-[55vh]">
                <div className="border-b-2 border-dashed border-outline-variant/30 pb-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-outline-variant uppercase tracking-widest">Detalle</span>
                    <span className="text-xs font-bold text-outline-variant uppercase tracking-widest">Subtotal</span>
                  </div>
                  {viewingSale.cart.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between mb-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#0F172A]">{item.name}</span>
                        <span className="text-[10px] text-outline-variant">{item.quantity} x {formatCurrency(item.price)}</span>
                      </div>
                      <span className="text-sm font-bold text-[#0F172A]">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-outline-variant font-medium">Subtotal</span>
                    <span className="font-bold">{formatCurrency(viewingSale.subtotal ?? viewingSale.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-outline-variant font-medium">IVA (19%)</span>
                    <span className="font-bold">{formatCurrency(Math.round((viewingSale.subtotal ?? viewingSale.total) * 0.19))}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-outline-variant/10">
                    <span className="text-lg font-black text-[#0F172A]">TOTAL</span>
                    <span className="text-2xl font-black text-green-600">{formatCurrency(viewingSale.total)}</span>
                  </div>
                  {viewingSale.change > 0 && (
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-sm font-bold text-secondary">Vuelto</span>
                      <span className="text-lg font-black text-secondary">{formatCurrency(viewingSale.change)}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                  <div className="flex items-center gap-2">
                    {viewingSale.paymentMethod === 'Efectivo' ? <Banknote className="w-4 h-4 text-green-600" /> :
                     viewingSale.paymentMethod === 'Fiado' ? <Wallet className="w-4 h-4 text-orange-500" /> :
                     <CreditCard className="w-4 h-4 text-blue-600" />}
                    <span className="text-sm font-black text-[#0F172A]">{viewingSale.paymentMethod}</span>
                  </div>
                  {viewingSale.user && (
                    <span className="text-xs text-outline-variant font-bold">{viewingSale.user}</span>
                  )}
                </div>
              </div>

              <div className="p-6 bg-surface-container-low flex flex-col gap-3">
                <button
                  onClick={() => window.print()}
                  className="w-full py-4 bg-[#0F172A] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#1e293b] transition-all"
                >
                  <Printer className="w-5 h-5" />
                  Imprimir Ticket
                </button>
                <button
                  onClick={() => setViewingSale(null)}
                  className="w-full py-4 bg-white text-secondary border border-secondary/10 rounded-2xl font-bold hover:bg-secondary/5 transition-all"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <NotificationsPanel />

      {/* Delete Confirmation */}
      <AnimatePresence>
        {saleToDelete !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[160] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-error" />
              </div>
              <h3 className="text-xl font-black text-[#0F172A] mb-2">Eliminar Venta</h3>
              <p className="text-sm text-[#0F172A]/60 font-bold mb-6">Esta acción no se puede deshacer. ¿Confirmas?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setSaleToDelete(null)}
                  className="flex-1 py-3 bg-surface-container-low rounded-xl font-bold text-[#0F172A] hover:bg-surface-container-high transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(saleToDelete)}
                  className="flex-1 py-3 bg-error text-white rounded-xl font-bold hover:bg-error/90 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
