import React from 'react';
import {
  Globe,
  Monitor,
  LayoutDashboard,
  Receipt,
  Package,
  Zap,
  Wallet,
  LineChart,
  History,
  Users,
  LogOut
} from 'lucide-react';
import { Logo } from './Logo';

interface SideNavBarProps {
  currentPage: string;
  setCurrentPage: (page: any) => void;
  currentUser?: any;
  users?: any[];
  setCurrentUser?: (user: any) => void;
  currentStore?: any;
  currentPOS?: any;
}

export const SideNavBar = ({ 
  currentPage, 
  setCurrentPage, 
  currentUser, 
  users, 
  setCurrentUser, 
  currentStore, 
  currentPOS 
}: SideNavBarProps) => {
  const NavItem = ({ page, icon: Icon, label }: { page: string, icon: any, label: string }) => {
    if (currentUser && currentUser.modules && !currentUser.modules.includes(page)) {
      return null;
    }
    const isActive = currentPage === page;
    return (
      <a
        onClick={() => setCurrentPage(page)}
        className={`flex items-center gap-3 py-2.5 px-4 mx-2 transition-all cursor-pointer rounded-lg font-semibold text-sm ${
          isActive
            ? 'bg-white/25 text-white shadow-lg backdrop-blur-sm'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
      >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </a>
    );
  };

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 z-50 bg-gradient-to-b from-blue-700 via-blue-800 to-slate-900 flex flex-col py-6 shadow-2xl border-r border-slate-800">
      <div className="px-6 mb-8">
        <Logo onClick={() => setCurrentPage('home')} light={true} />
      </div>

      {currentStore && currentPOS && (
        <div className="mx-4 mb-6 p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg border border-blue-400/40 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/25 p-2 rounded-lg backdrop-blur-sm">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-white/80 uppercase tracking-widest">Sucursal</span>
              <span className="text-sm font-bold text-white">{currentStore.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/25 p-2 rounded-lg backdrop-blur-sm">
              <Monitor className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-white/80 uppercase tracking-widest">Terminal</span>
              <span className="text-sm font-bold text-white">{currentPOS.name}</span>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto space-y-1">
        <div className="px-6 mb-4 mt-2">
          <p className="text-xs font-bold text-white/80 uppercase tracking-widest">General</p>
        </div>
        <NavItem page="dashboard" icon={LayoutDashboard} label="Mi Negocio" />

        <div className="px-6 mb-4 mt-6">
          <p className="text-xs font-bold text-white/80 uppercase tracking-widest">Operaciones</p>
        </div>
        <NavItem page="sales" icon={Receipt} label="Ventas" />
        <NavItem page="inventory" icon={Package} label="Inventario" />
        <NavItem page="entries" icon={Zap} label="Entradas" />
        <NavItem page="fiados" icon={Wallet} label="Clientes" />

        <div className="px-6 mb-4 mt-6">
          <p className="text-xs font-bold text-white/80 uppercase tracking-widest">Análítica</p>
        </div>
        <NavItem page="kpis" icon={LineChart} label="KPIs" />
        <NavItem page="history" icon={History} label="Historial" />

        <div className="px-6 mb-4 mt-6">
          <p className="text-xs font-bold text-white/80 uppercase tracking-widest">Sistema</p>
        </div>
        <NavItem page="users" icon={Users} label="Usuarios" />
      </nav>

      <div className="mt-auto px-6 border-t border-slate-700 pt-6">
        <button
          onClick={() => {
            if (setCurrentUser) setCurrentUser(null);
            setCurrentPage('home');
          }}
          className="w-full flex items-center gap-3 py-2.5 px-4 text-white/70 hover:text-white hover:bg-red-600/20 transition-all rounded-lg font-semibold"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};
