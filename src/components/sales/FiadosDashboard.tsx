import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Printer,
  X,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';
import { SideNavBar } from '../layout/SideNavBar';
import { NotificationsPanel } from '../shared/NotificationsPanel';
import { useAppContexts } from '../../hooks/useAppContexts';

interface FiadosDashboardProps {}

export const FiadosDashboard = ({}: FiadosDashboardProps) => {
  const { ui, pos, app } = useAppContexts();
  const { setCurrentPage, setShowNotificationsPanel } = ui;
  const { currentUser, setCurrentUser, currentStore, currentPOS } = pos;
  const { clientFiados: fiados, setClientFiados: setFiados, clientUsers: users } = app;
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'debt' | 'paid'>('all');

  // KPIs calculations
  const totalDebtAll = fiados.reduce((sum, client) => sum + client.totalDebt, 0);
  const clientsWithDebt = fiados.filter(client => client.totalDebt > 0).length;
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const totalPaidThisMonth = fiados.reduce((sum, client) => {
    const monthlyPayments = client.history
      .filter((record: any) => {
        if (record.type !== 'payment') return false;
        const recordDate = new Date(record.date);
        return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
      })
      .reduce((paymentSum: number, record: any) => paymentSum + record.amount, 0);
    return sum + monthlyPayments;
  }, 0);

  const filteredFiados = fiados.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (client.phone && client.phone.includes(searchTerm));
    if (!matchesSearch) return false;
    
    if (filterStatus === 'debt') return client.totalDebt > 0;
    if (filterStatus === 'paid') return client.totalDebt === 0;
    return true;
  });

  const getDebtColor = (client: any) => {
    if (client.totalDebt === 0) return 'text-on-surface-variant';
    
    // Find oldest unpaid charge (simplified: just oldest charge if there's debt)
    const charges = client.history.filter((r: any) => r.type === 'charge');
    if (charges.length === 0) return 'text-error';
    
    const oldestChargeDate = new Date(charges[0].date);
    const daysOld = Math.floor((new Date().getTime() - oldestChargeDate.getTime()) / (1000 * 3600 * 24));
    
    if (daysOld > 30) return 'text-red-600 font-black';
    if (daysOld > 15) return 'text-orange-500 font-black';
    return 'text-error font-black';
  };

  const getDebtStatusBadge = (client: any) => {
    if (client.totalDebt === 0) return null;
    
    const charges = client.history.filter((r: any) => r.type === 'charge');
    if (charges.length === 0) return null;
    
    const oldestChargeDate = new Date(charges[0].date);
    const daysOld = Math.floor((new Date().getTime() - oldestChargeDate.getTime()) / (1000 * 3600 * 24));
    
    if (daysOld > 30) return <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] rounded-full font-bold uppercase tracking-wider">+30 Días</span>;
    if (daysOld > 15) return <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] rounded-full font-bold uppercase tracking-wider">+15 Días</span>;
    return null;
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(paymentAmount);
    if (isNaN(amount) || amount <= 0) return;

    const updatedFiados = fiados.map(client => {
      if (client.id === selectedClient.id) {
        return {
          ...client,
          totalDebt: client.totalDebt - amount,
          history: [...client.history, {
            id: Date.now(),
            date: new Date().toISOString(),
            amount: amount,
            type: 'payment'
          }]
        };
      }
      return client;
    });

    setFiados(updatedFiados);
    setShowPaymentModal(false);
    setSelectedClient(null);
    setPaymentAmount('');
  };

  return (
    <div className="flex min-h-screen bg-surface text-on-surface font-body">
      <SideNavBar currentPage="fiados" setCurrentPage={setCurrentPage} currentUser={currentUser} users={users} setCurrentUser={setCurrentUser} currentStore={currentStore} currentPOS={currentPOS} />
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen p-4 md:p-8 pt-20 md:pt-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-[#0F172A] font-headline mb-1">Gestión de <span className="text-secondary">Fiados</span></h1>
            <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-3">OPERACIONES &gt; FIADOS</p>
            <p className="text-[#0F172A]/70 font-bold text-lg">Control de créditos y deudas de clientes.</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowNotificationsPanel(true)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f2f3ff] transition-colors relative">
              <Bell className="w-5 h-5 text-on-surface-variant" />
              {clientsWithDebt > 0 && <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-error rounded-full text-white text-[9px] font-black flex items-center justify-center border border-white">{clientsWithDebt > 9 ? '9+' : clientsWithDebt}</span>}
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

        <div className="w-full space-y-8">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-7 rounded-2xl shadow-md border border-error/20 flex flex-col hover:shadow-lg hover:border-error/60 transition-all">
              <span className="text-xs font-black text-error uppercase tracking-widest mb-3">Total por Cobrar</span>
              <span className="text-4xl font-black text-error">${totalDebtAll.toLocaleString('es-CL')}</span>
            </div>
            <div className="bg-white p-7 rounded-2xl shadow-md border border-secondary/20 flex flex-col hover:shadow-lg hover:border-secondary/60 transition-all">
              <span className="text-xs font-black text-secondary uppercase tracking-widest mb-3">Clientes con Deuda</span>
              <span className="text-4xl font-black text-secondary">{clientsWithDebt}</span>
            </div>
            <div className="bg-white p-7 rounded-2xl shadow-md border-2 border-green-500/40 flex flex-col hover:shadow-lg hover:border-green-500/60 transition-all">
              <span className="text-xs font-black text-green-600 uppercase tracking-widest mb-3">Abonado este Mes</span>
              <span className="text-4xl font-black text-green-600">${totalPaidThisMonth.toLocaleString('es-CL')}</span>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-5 rounded-2xl shadow-md border border-secondary/10">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant" />
              <input
                type="text"
                placeholder="Buscar por nombre o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-secondary/20 rounded-xl text-sm font-medium text-[#0F172A] focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button 
                onClick={() => setFilterStatus('all')}
                className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-sm font-bold transition-colors ${filterStatus === 'all' ? 'bg-secondary text-white shadow-md shadow-secondary/20' : 'bg-surface-container-low text-on-surface hover:bg-surface-container'}`}
              >
                Todos
              </button>
              <button 
                onClick={() => setFilterStatus('debt')}
                className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-sm font-bold transition-colors ${filterStatus === 'debt' ? 'bg-error text-white shadow-md shadow-error/20' : 'bg-surface-container-low text-on-surface hover:bg-surface-container'}`}
              >
                Con Deuda
              </button>
              <button 
                onClick={() => setFilterStatus('paid')}
                className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-sm font-bold transition-colors ${filterStatus === 'paid' ? 'bg-green-600 text-white shadow-md shadow-green-600/20' : 'bg-surface-container-low text-on-surface hover:bg-surface-container'}`}
              >
                Al Día
              </button>
            </div>
          </div>

          <section className="bg-white rounded-3xl overflow-hidden shadow-md border border-secondary/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-secondary text-white text-xs uppercase tracking-wider font-bold">
                    <th className="px-8 py-5">Cliente</th>
                    <th className="px-8 py-5">Teléfono</th>
                    <th className="px-8 py-5">Límite Crédito</th>
                    <th className="px-8 py-5">Deuda Total</th>
                    <th className="px-8 py-5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low">
                  {filteredFiados.map((client) => (
                    <tr key={client.id} className="hover:bg-surface-container-high/30 transition-colors group">
                      <td className="px-8 py-6 font-bold text-on-surface">
                        {client.name}
                        {getDebtStatusBadge(client)}
                      </td>
                      <td className="px-8 py-6 text-sm text-on-surface-variant font-medium">{client.phone || '-'}</td>
                      <td className="px-8 py-6 text-sm text-on-surface-variant font-medium">{client.creditLimit ? `$${client.creditLimit.toLocaleString('es-CL')}` : 'Sin Límite'}</td>
                      <td className={`px-8 py-6 text-lg ${getDebtColor(client)}`}>${client.totalDebt.toLocaleString('es-CL')}</td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => { setSelectedClient(client); setShowDetailsModal(true); }}
                            className="px-4 py-2 bg-surface-container-low text-on-surface font-bold rounded-lg hover:bg-surface-container-high transition-colors text-sm"
                          >
                            Ver Detalles
                          </button>
                          {client.totalDebt > 0 ? (
                            <button 
                              onClick={() => { setSelectedClient(client); setShowPaymentModal(true); }}
                              className="px-4 py-2 bg-green-100 text-green-700 font-bold rounded-lg hover:bg-green-200 transition-colors text-sm"
                            >
                              Abonar / Pagar
                            </button>
                          ) : (
                            <span className="px-3 py-1 bg-surface-container-highest text-on-surface-variant rounded-full text-xs font-bold">Al Día</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredFiados.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center text-outline-variant font-medium">
                        No se encontraron clientes.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      <AnimatePresence>
        {showPaymentModal && selectedClient && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-[#0F172A] font-headline">Abonar a <span className="text-secondary">{selectedClient.name}</span></h3>
                  <p className="text-sm text-on-surface-variant font-medium mt-1">Deuda actual: <span className="font-bold text-error">${selectedClient.totalDebt.toLocaleString('es-CL')}</span></p>
                </div>
                <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
                  <X className="w-6 h-6 text-[#0F172A]" />
                </button>
              </div>

              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#0F172A] mb-1">Monto a Abonar</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    max={selectedClient.totalDebt}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-sm font-medium text-[#0F172A] focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                    placeholder="Ej. 5000"
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setPaymentAmount(selectedClient.totalDebt.toString())}
                    className="flex-1 px-4 py-3 bg-surface-container-low text-on-surface font-bold rounded-xl hover:bg-surface-container transition-colors text-sm"
                  >
                    Pagar Total
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-br from-secondary to-on-secondary-container text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-sm text-sm"
                  >
                    Confirmar Abono
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDetailsModal && selectedClient && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-[#0F172A] font-headline">Historial de <span className="text-secondary">{selectedClient.name}</span></h3>
                  <p className="text-sm text-on-surface-variant font-medium mt-1">Deuda actual: <span className="font-bold text-error">${selectedClient.totalDebt.toLocaleString('es-CL')}</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      const printContent = document.getElementById('print-area');
                      if (printContent) {
                        const originalContent = document.body.innerHTML;
                        document.body.innerHTML = printContent.innerHTML;
                        window.print();
                        document.body.innerHTML = originalContent;
                        window.location.reload(); // Reload to restore React state
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-surface-container-low text-on-surface font-bold rounded-lg hover:bg-surface-container-high transition-colors text-sm"
                  >
                    <Printer className="w-4 h-4" />
                    Imprimir
                  </button>
                  <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
                    <X className="w-6 h-6 text-[#0F172A]" />
                  </button>
                </div>
              </div>

              <div id="print-area" className="flex-1 overflow-y-auto pr-2">
                {/* Print Header (Only visible when printing) */}
                <div className="hidden print:block mb-8 text-center border-b pb-4">
                  <h1 className="text-2xl font-black mb-2">Estado de Cuenta</h1>
                  <h2 className="text-xl font-bold">{selectedClient.name}</h2>
                  <p className="text-sm text-gray-600">Teléfono: {selectedClient.phone || 'N/A'}</p>
                  <p className="text-lg font-black mt-4">Deuda Total: ${selectedClient.totalDebt.toLocaleString('es-CL')}</p>
                  <p className="text-xs text-gray-500 mt-2">Fecha de emisión: {new Date().toLocaleString()}</p>
                </div>
                {selectedClient.history && selectedClient.history.length > 0 ? (
                  <div className="space-y-4">
                    {[...selectedClient.history].reverse().map((record: any) => (
                      <div key={record.id} className={`p-4 rounded-xl border ${record.type === 'payment' ? 'bg-green-50 border-green-100' : 'bg-surface-container-lowest border-outline-variant/20'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${record.type === 'payment' ? 'bg-green-200 text-green-800' : 'bg-error-container text-error'}`}>
                              {record.type === 'payment' ? 'Abono' : 'Cargo (Fiado)'}
                            </span>
                            <p className="text-xs text-on-surface-variant mt-2">{new Date(record.date).toLocaleString()}</p>
                            {record.dueDate && record.type === 'charge' && (
                              <p className="text-[10px] font-bold text-error mt-1 uppercase">Vence: {new Date(record.dueDate).toLocaleDateString()}</p>
                            )}
                          </div>
                          <span className={`font-black ${record.type === 'payment' ? 'text-green-600' : 'text-error'}`}>
                            {record.type === 'payment' ? '-' : '+'}${record.amount.toLocaleString('es-CL')}
                          </span>
                        </div>
                        {record.type === 'charge' && record.cart && (
                          <div className="mt-3 pt-3 border-t border-outline-variant/10">
                            <p className="text-xs font-bold text-on-surface mb-2">Detalle de la compra:</p>
                            <ul className="space-y-1">
                              {record.cart.map((item: any, idx: number) => (
                                <li key={idx} className="text-xs text-on-surface flex justify-between">
                                  <span>{item.quantity}x {item.name}</span>
                                  <span>${(item.price * item.quantity).toLocaleString('es-CL')}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-outline-variant py-10">No hay historial registrado para este cliente.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <NotificationsPanel />
    </div>
  );
};
