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
  Users 
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
    return (
      <a 
        onClick={() => setCurrentPage(page)} 
        className={`flex items-center gap-3 py-3 px-6 my-1 transition-all cursor-pointer rounded-xl mx-4 ${currentPage === page ? 'bg-white/20 text-white shadow-lg' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
      >
        <Icon className="w-5 h-5" />
        <span className="text-base font-bold font-body">{label}</span>
      </a>
    );
  };

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 z-50 bg-secondary/95 backdrop-blur-md flex flex-col py-6 shadow-2xl border-r border-white/10">
      <div className="px-6 mb-4">
        <Logo onClick={() => setCurrentPage('home')} light={true} />
      </div>

      {currentStore && currentPOS && (
        <div className="mx-4 mb-6 p-4 bg-amber-400 rounded-2xl shadow-lg border border-amber-500/50 animate-pulse-slow">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-amber-900/10 p-1.5 rounded-lg">
              <Globe className="w-4 h-4 text-amber-900" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-amber-900/60 uppercase tracking-widest leading-none mb-1">Sucursal</span>
              <span className="text-sm font-black text-amber-900 leading-none">{currentStore.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-amber-900/10 p-1.5 rounded-lg">
              <Monitor className="w-4 h-4 text-amber-900" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-amber-900/60 uppercase tracking-widest leading-none mb-1">Terminal</span>
              <span className="text-sm font-black text-amber-900 leading-none">{currentPOS.name}</span>
            </div>
          </div>
        </div>
      )}
      
      <nav className="flex-1 overflow-y-auto">
        <div className="px-6 mb-2 mt-4 text-[11px] font-black text-white/60 uppercase tracking-[0.25em] flex items-center gap-2 animate-pulse drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
          General
          <div className="h-[1px] flex-1 bg-white/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-white/40 animate-slide-bright"></div>
          </div>
        </div>
        <NavItem page="dashboard" icon={LayoutDashboard} label="Mi Negocio" />

        <div className="px-6 mb-2 mt-8 text-[11px] font-black text-white/60 uppercase tracking-[0.25em] flex items-center gap-2 animate-pulse drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
          Operaciones
          <div className="h-[1px] flex-1 bg-white/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-white/40 animate-slide-bright"></div>
          </div>
        </div>
        <NavItem page="sales" icon={Receipt} label="Ventas" />
        <NavItem page="inventory" icon={Package} label="Inventario" />
        <NavItem page="entries" icon={Zap} label="Entradas" />
        <NavItem page="fiados" icon={Wallet} label="Fiados" />

        <div className="px-6 mb-2 mt-8 text-[11px] font-black text-white/60 uppercase tracking-[0.25em] flex items-center gap-2 animate-pulse drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
          Análítica / Finanzas
          <div className="h-[1px] flex-1 bg-white/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-white/40 animate-slide-bright"></div>
          </div>
        </div>
        <NavItem page="kpis" icon={LineChart} label="KPIs" />
        <NavItem page="history" icon={History} label="Historial / Salidas" />

      </nav>
      
      <div className="mt-auto px-6 border-t border-white/10 pt-6">
        <button 
          onClick={() => {
            if (setCurrentUser) setCurrentUser(null);
            setCurrentPage('home');
          }}
          className="w-full flex items-center gap-3 py-3 px-6 text-white/70 hover:bg-white/10 hover:text-white transition-all rounded-xl"
        >
          <History className="w-5 h-5" />
          <span className="text-base font-bold font-body">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};
