import React from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  LogOut, 
  Printer, 
  Trash2 
} from 'lucide-react';
import { SideNavBar } from '../layout/SideNavBar';

interface SalesHistoryProps {
  setCurrentPage: (page: any) => void;
  salesHistory: any[];
  setViewingSale: (product: any) => void;
  currentUser: any;
  users: any[];
  setCurrentUser: (user: any) => void;
  currentStore: any;
  currentPOS: any;
}

export const SalesHistory = ({ 
  setCurrentPage, 
  salesHistory, 
  setViewingSale, 
  currentUser, 
  users, 
  setCurrentUser, 
  currentStore, 
  currentPOS 
}: SalesHistoryProps) => {
  return (
    <div className="flex min-h-screen bg-surface text-on-surface font-body">
      <SideNavBar currentPage="history" setCurrentPage={setCurrentPage} currentUser={currentUser} users={users} setCurrentUser={setCurrentUser} currentStore={currentStore} currentPOS={currentPOS} />
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto p-8">
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
                placeholder="Buscar en historial..." 
                type="text"
              />
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f2f3ff] transition-colors relative">
              <Bell className="w-5 h-5 text-on-surface-variant" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f2f3ff] transition-colors">
              <Settings className="w-5 h-5 text-on-surface-variant" />
            </button>
            <div className="h-8 w-px bg-outline-variant/30 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-black text-[#0F172A]">Admin Vantory</p>
                <p className="text-xs text-secondary font-bold">Soporte Técnico</p>
              </div>
              <img 
                className="w-10 h-10 rounded-full border-2 border-surface-container-highest object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPTOJksruGaNQm6gW0cTKsmHx_gthleGI0Hy70R56Q1oJ4i9lW0iL4JU8oXMoZAshoKE8S3a1-5NvKCV26POVasYgktSZtJpP6RHaMYbMEtqakjdL7rtnYFQso4Kzl5w6R3449pD-nViJIAngGkUqQijX4Zz9xtfKBk4SztlssTnGEGmOQeqPZsahAs-DUJ7tdh68w9VguZXCBAxiCk5XRvvm-GQdW31C8hvfujnZJlbpJ3SVzXGcnVimo2ARlMqv9ks88IY_RN2o_" 
                referrerPolicy="no-referrer"
              />
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-error-container/20 text-error transition-colors ml-2" title="Cerrar Sesión">
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
              {salesHistory.map((sale) => (
                <tr key={sale.id} className="hover:bg-surface-container-high transition-all cursor-pointer" onClick={() => setViewingSale(sale)}>
                  <td className="px-8 py-6 font-bold text-[#0F172A]">#{sale.id.toString().slice(-8)}</td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-medium text-[#0F172A]">{new Date(sale.date).toLocaleDateString()}</p>
                    <p className="text-xs text-[#0F172A] font-black">{new Date(sale.date).toLocaleTimeString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${sale.paymentMethod === 'Efectivo' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-[#0F172A]">{sale.cart.length} ítems</p>
                    <p className="text-xs text-[#0F172A] font-black truncate max-w-[200px]">
                      {sale.cart.map((item: any) => item.name).join(', ')}
                    </p>
                  </td>
                  <td className="px-8 py-6 font-black text-green-600">${sale.total.toLocaleString('es-CL')}</td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-outline hover:text-secondary transition-colors">
                      <Printer className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-outline hover:text-error transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {salesHistory.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-outline-variant font-medium">
                    No hay transacciones registradas en el historial.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
