import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  LogOut, 
  Banknote, 
  Globe, 
  TrendingUp 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar 
} from 'recharts';
import { Logo } from '../layout/Logo';

interface SuperAdminDashboardProps {
  setCurrentPage: (page: any) => void;
  vantoryClients: any[];
  currentUser: any;
}

export const SuperAdminDashboard = ({ 
  setCurrentPage, 
  vantoryClients, 
  currentUser 
}: SuperAdminDashboardProps) => {
  const activeClients = vantoryClients.filter((c: any) => c.status === 'Activo').length;
  const totalMRR = vantoryClients.filter((c: any) => c.status === 'Activo').reduce((sum: number, c: any) => sum + c.mrr, 0);
  const totalStores = vantoryClients.reduce((sum: number, c: any) => sum + c.maxStores, 0);
  
  // Mock data for charts
  const mrrData = [
    { month: 'Oct', mrr: 25000 },
    { month: 'Nov', mrr: 35000 },
    { month: 'Dic', mrr: 45000 },
    { month: 'Ene', mrr: 65000 },
    { month: 'Feb', mrr: 85000 },
    { month: 'Mar', mrr: 109970 },
  ];

  const txData = [
    { month: 'Oct', tx: 1200 },
    { month: 'Nov', tx: 1800 },
    { month: 'Dic', tx: 2500 },
    { month: 'Ene', tx: 3200 },
    { month: 'Feb', tx: 4500 },
    { month: 'Mar', tx: 5800 },
  ];

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Super Admin Sidebar */}
      <aside className="w-64 bg-secondary/95 backdrop-blur-md flex flex-col py-6 shadow-2xl border-r border-white/10">
        <div className="px-6 mb-8">
          <Logo onClick={() => {}} light={true} />
          <p className="text-white/60 text-xs font-bold tracking-widest mt-2 uppercase">Backoffice</p>
        </div>
        <nav className="flex-1">
          <button onClick={() => setCurrentPage('superadmin-dashboard')} className={`w-full flex items-center gap-3 py-3 px-6 my-1 transition-all cursor-pointer rounded-xl mx-4 bg-white/20 text-white shadow-lg`}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-base font-bold font-body">Métricas</span>
          </button>
          <button onClick={() => setCurrentPage('superadmin-clients')} className={`w-full flex items-center gap-3 py-3 px-6 my-1 transition-all cursor-pointer rounded-xl mx-4 text-white/70 hover:bg-white/10 hover:text-white`}>
            <Users className="w-5 h-5" />
            <span className="text-base font-bold font-body">Clientes SaaS</span>
          </button>
        </nav>
        <div className="px-6 mt-auto pt-6 border-t border-white/10">
          <button onClick={() => setCurrentPage('login')} className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-sm font-bold">
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-10">
          <h2 className="text-3xl font-black text-[#0F172A] font-headline mb-1">Vantory <span className="text-secondary">Global</span></h2>
          <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-3">PANEL MAESTRO &gt; MÉTRICAS</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20 flex items-center gap-4 hover:shadow-md transition-shadow group cursor-default">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
              <Banknote className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">MRR Actual</p>
              <p className="text-2xl font-black text-on-surface">${totalMRR.toLocaleString('es-CL')}</p>
              <p className="text-[10px] text-on-surface-variant mt-1 leading-tight">Ingreso Mensual Recurrente total de clientes activos</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20 flex items-center gap-4 hover:shadow-md transition-shadow group cursor-default">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Clientes Activos</p>
              <p className="text-2xl font-black text-on-surface">{activeClients}</p>
              <p className="text-[10px] text-on-surface-variant mt-1 leading-tight">Empresas con suscripción al día</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20 flex items-center gap-4 hover:shadow-md transition-shadow group cursor-default">
            <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Locales Licenciados</p>
              <p className="text-2xl font-black text-on-surface">{totalStores}</p>
              <p className="text-[10px] text-on-surface-variant mt-1 leading-tight">Capacidad total vendida en planes</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20 flex items-center gap-4 hover:shadow-md transition-shadow group cursor-default">
            <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center text-error group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 rotate-180" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Churn Rate</p>
              <p className="text-2xl font-black text-on-surface">2.4%</p>
              <p className="text-[10px] text-on-surface-variant mt-1 leading-tight">Tasa de cancelación mensual</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* MRR Growth Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-black font-headline">Crecimiento MRR</h3>
                <p className="text-sm text-on-surface-variant font-medium">Ingresos recurrentes últimos 6 meses</p>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mrrData}>
                  <defs>
                    <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12, fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12, fontWeight: 600}} tickFormatter={(value) => `$${value/1000}k`} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff', padding: '12px' }}
                    itemStyle={{ color: '#0F172A', fontWeight: 'bold' }}
                    formatter={(value: number) => [`$${value.toLocaleString('es-CL')}`, 'MRR']}
                  />
                  <Area type="monotone" dataKey="mrr" stroke="#4F46E5" strokeWidth={4} fillOpacity={1} fill="url(#colorMrr)" activeDot={{ r: 6, strokeWidth: 0, fill: '#4F46E5' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Transaction Volume Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-black font-headline">Volumen Transaccional</h3>
                <p className="text-sm text-on-surface-variant font-medium">Ventas procesadas por todos los clientes</p>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={txData}>
                  <defs>
                    <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.4}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12, fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12, fontWeight: 600}} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff', padding: '12px' }}
                    itemStyle={{ color: '#0F172A', fontWeight: 'bold' }}
                    formatter={(value: number) => [value.toLocaleString('es-CL'), 'Transacciones']}
                    cursor={{fill: '#F1F5F9'}}
                  />
                  <Bar dataKey="tx" fill="url(#colorTx)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
