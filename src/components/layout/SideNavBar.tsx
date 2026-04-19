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
    if (currentUser && currentUser.modules && !currentUser.modules.includes(page)) return null;
    return (
      <a
        onClick={() => { setCurrentPage(page); }}
        className={`flex items-center gap-3 py-2.5 px-4 my-0.5 transition-all cursor-pointer rounded-lg mx-2 active:scale-[0.98] ${currentPage === page ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
      >
        <Icon className="w-5 h-5" />
        <span className="text-sm font-semibold font-body">{label}</span>
      </a>
    );
  };

  const BottomNavItem = ({ page, icon: Icon, label }: { page: string, icon: any, label: string }) => {
    if (currentUser && currentUser.modules && !currentUser.modules.includes(page)) return null;
    return (
      <button
        onClick={() => { setCurrentPage(page); }}
        className={`flex flex-col items-center gap-1 py-2 px-3 transition-all rounded-lg active:scale-95 flex-1 ${currentPage === page ? 'text-white bg-white/15' : 'text-white/60 hover:text-white'}`}
      >
        <Icon className="w-6 h-6" />
        <span className="text-[10px] font-semibold text-center">{label}</span>
      </button>
    );
  };

  const DesktopNav = () => (
    <>
      <div className="px-6 mb-4">
        <Logo onClick={() => { setCurrentPage('home'); }} light={true} />
      </div>

      {currentStore && currentPOS && (
        <div className="mx-4 mb-6 p-3 bg-white/10 rounded-xl border border-white/15">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-white/70" />
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-white/60 leading-tight">Sucursal</span>
              <span className="text-sm font-semibold text-white leading-tight">{currentStore.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-white/70" />
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-white/60 leading-tight">Terminal</span>
              <span className="text-sm font-semibold text-white leading-tight">{currentPOS.name}</span>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto overflow-x-hidden pr-2">
        <div className="px-6 mb-2 mt-4 text-xs font-semibold text-white/50 uppercase tracking-wider">General</div>
        <NavItem page="dashboard" icon={LayoutDashboard} label="Mi Negocio" />

        <div className="px-6 mb-2 mt-6 text-xs font-semibold text-white/50 uppercase tracking-wider">Operaciones</div>
        <NavItem page="sales" icon={Receipt} label="Ventas" />
        <NavItem page="inventory" icon={Package} label="Inventario" />
        <NavItem page="entries" icon={Zap} label="Entradas" />
        <NavItem page="fiados" icon={Wallet} label="Fiados" />

        <div className="px-6 mb-2 mt-6 text-xs font-semibold text-white/50 uppercase tracking-wider">Analítica / Finanzas</div>
        <NavItem page="kpis" icon={LineChart} label="KPIs" />
        <NavItem page="history" icon={History} label="Historial / Salidas" />
      </nav>

      <div className="mt-auto px-6 border-t border-white/10 pt-6">
        <button
          onClick={() => { if (setCurrentUser) setCurrentUser(null); setCurrentPage('home'); }}
          className="flex items-center gap-3 py-3 px-4 text-white/70 hover:bg-white/10 hover:text-white transition-all rounded-xl active:scale-[0.98] mx-2 w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-semibold font-body">Cerrar Sesión</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed top-0 bottom-0 left-0 w-64 z-50 bg-secondary flex-col py-6 shadow-lg border-r border-white/10">
        <DesktopNav />
      </aside>

      {/* Mobile top bar con info de sucursal/terminal */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-secondary px-4 py-2 shadow-md border-b border-white/10">
        <div className="flex items-center justify-between">
          <Logo onClick={() => setCurrentPage('home')} light={true} />
          {currentStore && currentPOS && (
            <div className="flex gap-3 text-[10px]">
              <div className="text-right">
                <div className="text-white/60">{currentStore.name}</div>
                <div className="text-white/40 text-[9px]">{currentPOS.name}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-secondary border-t border-white/10 flex justify-around items-center px-2 py-2 shadow-2xl h-20">
        <BottomNavItem page="dashboard" icon={LayoutDashboard} label="Mi Negocio" />
        <BottomNavItem page="sales" icon={Receipt} label="Ventas" />
        <BottomNavItem page="fiados" icon={Wallet} label="Fiados" />
        <BottomNavItem page="kpis" icon={LineChart} label="KPIs" />
        <BottomNavItem page="history" icon={History} label="Historial" />
        <button
          onClick={() => { if (setCurrentUser) setCurrentUser(null); setCurrentPage('home'); }}
          className="flex flex-col items-center gap-1 py-2 px-3 transition-all rounded-lg active:scale-95 flex-1 text-white/60 hover:text-white"
          title="Cerrar Sesión"
        >
          <LogOut className="w-6 h-6" />
          <span className="text-[10px] font-semibold">Salir</span>
        </button>
      </nav>

      {/* Mobile connection indicator */}
      <div className="md:hidden fixed bottom-20 right-4 flex items-center gap-1 bg-green-50 border border-green-200 px-2 py-1 rounded-full text-[10px] text-green-700 z-30">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="font-semibold">Conectado</span>
      </div>
    </>
  );
};
