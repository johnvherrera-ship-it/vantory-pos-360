import React, { useMemo } from 'react';
import { 
  Bell, 
  Settings, 
  LogOut, 
  TrendingUp, 
  Zap, 
  Receipt, 
  Package, 
  History 
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
import { SideNavBar } from '../layout/SideNavBar';
import { NotificationsPanel } from '../shared/NotificationsPanel';
import { useAppContexts } from '../../hooks/useAppContexts';

interface DashboardProps {}

export const Dashboard = ({}: DashboardProps) => {
  const { ui, pos, app } = useAppContexts();
  const { setCurrentPage, setViewingSale, setShowNotificationsPanel } = ui;
  const { currentUser, setCurrentUser, currentStore, currentPOS } = pos;
  const { clientInventory: inventory, clientSalesHistory: salesHistory, clientUsers: users } = app;

  const totalSales = salesHistory.reduce((sum, sale) => sum + sale.total, 0);
  const salesToday = salesHistory.filter(sale => new Date(sale.date).toDateString() === new Date().toDateString()).length;
  const lowStockProducts = inventory.filter(p => p.stock < 10);
  const totalInventoryValue = inventory.reduce((sum, p) => sum + (p.cost * p.stock), 0);

  const totalProfit = useMemo(() => {
    return salesHistory.reduce((sum, sale) => {
      const saleCost = sale.cart.reduce((cSum: number, item: any) => {
        return cSum + ((item.cost || 0) * item.quantity);
      }, 0);
      return sum + (sale.total - saleCost);
    }, 0);
  }, [salesHistory]);

  const profitToday = useMemo(() => {
    return salesHistory
      .filter(sale => new Date(sale.date).toDateString() === new Date().toDateString())
      .reduce((sum, sale) => {
        const saleCost = sale.cart.reduce((cSum: number, item: any) => {
          return cSum + ((item.cost || 0) * item.quantity);
        }, 0);
        return sum + (sale.total - saleCost);
      }, 0);
  }, [salesHistory]);

  // Top 5 Products
  const productSales = useMemo(() => {
    const counts: { [key: string]: { name: string, total: number, quantity: number, profit: number } } = {};
    salesHistory.forEach(sale => {
      sale.cart.forEach((item: any) => {
        if (!counts[item.sku]) {
          counts[item.sku] = { name: item.name, total: 0, quantity: 0, profit: 0 };
        }
        counts[item.sku].total += item.price * item.quantity;
        counts[item.sku].quantity += item.quantity;
        counts[item.sku].profit += (item.price - (item.cost || 0)) * item.quantity;
      });
    });
    return Object.values(counts).sort((a, b) => b.total - a.total).slice(0, 5);
  }, [salesHistory]);

  const totalMargin = totalSales > 0 ? Math.round((totalProfit / totalSales) * 100) : 0;

  // Trend Data (Last 7 days)
  const trendData = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const daySales = salesHistory.filter(s => s.date.split('T')[0] === date);
      const total = daySales.reduce((sum, s) => sum + s.total, 0);
      return {
        date: date.split('-').slice(1).reverse().join('/'),
        ventas: total
      };
    });
  }, [salesHistory]);

  return (
    <div className="flex min-h-screen bg-surface text-on-surface font-body">
      <SideNavBar currentPage="dashboard" setCurrentPage={setCurrentPage} currentUser={currentUser} users={users} setCurrentUser={setCurrentUser} currentStore={currentStore} currentPOS={currentPOS} />
      <main className="flex-1 ml-64 flex flex-col min-h-screen p-8">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black text-[#0F172A] font-headline mb-1">Mi <span className="text-secondary">Negocio</span></h2>
            <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-3">PANEL &gt; MI NEGOCIO</p>
            <p className="text-[#0F172A]/70 font-bold text-lg">Resumen ejecutivo de tu negocio en tiempo real.</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowNotificationsPanel(true)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f2f3ff] transition-colors relative">
              <Bell className="w-5 h-5 text-on-surface-variant" />
              {lowStockProducts.length > 0 && <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-error rounded-full text-white text-[9px] font-black flex items-center justify-center border border-white">{lowStockProducts.length > 9 ? '9+' : lowStockProducts.length}</span>}
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
              />
            </div>
            <button 
              onClick={() => {
                setCurrentUser(null);
                setCurrentPage('home');
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-error-container/20 text-error transition-colors ml-2" 
              title="Cerrar Sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-5 rounded-3xl shadow-sm border-2 border-secondary/15 hover:border-secondary/60 hover:shadow-lg transition-all group relative card-hover-enhance">
            <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-bold text-[#0F172A] uppercase tracking-widest mb-1">Ventas Totales</p>
            <p className="text-xl font-black text-[#0F172A]">${totalSales.toLocaleString('es-CL')}</p>
            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-surface-container-highest text-on-surface text-xs p-2 rounded-lg -bottom-10 left-0 w-full z-10 pointer-events-none shadow-lg">
              Suma de todas las ventas registradas históricamente.
            </div>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-outline-variant/10 hover:shadow-md transition-shadow group relative">
            <div className="w-10 h-10 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-3">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <p className="text-[10px] font-bold text-[#0F172A] uppercase tracking-widest mb-1">Ganancia Neta</p>
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-black text-secondary">${totalProfit.toLocaleString('es-CL')}</p>
              <span className="text-[10px] font-black text-secondary/60">{totalMargin}% Margen</span>
            </div>
            <p className="text-[10px] font-bold text-secondary/70 mt-1">Hoy: +${profitToday.toLocaleString('es-CL')}</p>
            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-surface-container-highest text-on-surface text-xs p-2 rounded-lg -bottom-10 left-0 w-full z-10 pointer-events-none shadow-lg">
              Ingresos totales menos el costo de compra de los productos.
            </div>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-outline-variant/10 hover:shadow-md transition-shadow group relative">
            <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-3">
              <Receipt className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-bold text-[#0F172A] uppercase tracking-widest mb-1">Ventas Hoy</p>
            <p className="text-xl font-black text-[#0F172A]">{salesToday}</p>
            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-surface-container-highest text-on-surface text-xs p-2 rounded-lg -bottom-10 left-0 w-full z-10 pointer-events-none shadow-lg">
              Cantidad de tickets o boletas emitidas en el día actual.
            </div>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-outline-variant/10 hover:shadow-md transition-shadow group relative">
            <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-3">
              <Package className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-bold text-[#0F172A] uppercase tracking-widest mb-1">Valor Inventario</p>
            <p className="text-xl font-black text-[#0F172A]">${totalInventoryValue.toLocaleString('es-CL')}</p>
            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-surface-container-highest text-on-surface text-xs p-2 rounded-lg -bottom-10 left-0 w-full z-10 pointer-events-none shadow-lg">
              Capital total invertido en los productos actualmente en stock.
            </div>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-outline-variant/10 hover:shadow-md transition-shadow group relative">
            <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mb-3">
              <Bell className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-bold text-[#0F172A] uppercase tracking-widest mb-1">Alertas Stock</p>
            <p className="text-xl font-black text-[#0F172A]">{lowStockProducts.length}</p>
            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-surface-container-highest text-on-surface text-xs p-2 rounded-lg -bottom-10 left-0 w-full z-10 pointer-events-none shadow-lg">
              Productos que tienen menos de 10 unidades en inventario.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Trend Chart */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border-2 border-secondary/15 hover:border-secondary/60 hover:shadow-lg transition-all card-hover-enhance">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-black text-[#0F172A] font-headline">Tendencia de Ventas</h3>
                <p className="text-sm text-[#0F172A]/60 font-bold uppercase tracking-widest">Últimos 7 días</p>
              </div>
              {(() => {
                const today = new Date().toISOString().split('T')[0];
                const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
                const todayTotal = salesHistory.filter(s => s.date.split('T')[0] === today).reduce((s, x) => s + x.total, 0);
                const yesterdayTotal = salesHistory.filter(s => s.date.split('T')[0] === yesterday).reduce((s, x) => s + x.total, 0);
                const pct = yesterdayTotal > 0 ? Math.round(((todayTotal - yesterdayTotal) / yesterdayTotal) * 100) : (todayTotal > 0 ? 100 : 0);
                return (
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black ${pct >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    <TrendingUp className="w-3 h-3" />
                    <span>{pct >= 0 ? '+' : ''}{pct}% hoy</span>
                  </div>
                );
              })()}
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                    tickFormatter={(value) => `$${(value/1000)}k`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 700 }}
                    formatter={(value: number) => [`$${value.toLocaleString('es-CL')}`, 'Ventas']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="ventas" 
                    stroke="#6366f1" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border-2 border-secondary/15 hover:border-secondary/60 hover:shadow-lg transition-all card-hover-enhance">
            <h3 className="text-xl font-black text-[#0F172A] font-headline mb-8">Top 5 Productos</h3>
            <div className="h-[300px] w-full">
              {productSales.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productSales} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                      width={100}
                    />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 700 }}
                      formatter={(value: number, name: string) => [
                        name === 'total' ? `$${value.toLocaleString('es-CL')}` : `${value} u.`, 
                        name === 'total' ? 'Ventas' : 'Cantidad'
                      ]}
                    />
                    <Bar dataKey="total" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 h-full flex flex-col items-center justify-center">
                  <Package className="w-12 h-12 text-outline-variant/30 mx-auto mb-4" />
                  <p className="text-sm font-bold text-on-surface-variant">Sin datos de ventas aún</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border-2 border-secondary/15 hover:border-secondary/60 hover:shadow-lg transition-all card-hover-enhance">
            <h3 className="text-xl font-black text-[#0F172A] mb-6 flex items-center gap-2">
              <History className="w-5 h-5 text-secondary" />
              Últimas <span className="text-secondary">Ventas</span>
            </h3>
            <div className="space-y-4">
              {salesHistory.slice(0, 5).map((sale, i) => {
                const saleProfit = sale.cart.reduce((sum: number, item: any) => sum + ((item.price - (item.cost || 0)) * item.quantity), 0);
                return (
                  <div key={i} className="flex justify-between items-center p-4 bg-surface-container-low rounded-2xl">
                    <div>
                      <p className="font-bold text-base text-[#0F172A]">Venta #{sale.id.toString().slice(-6)}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-[#0F172A] font-bold">{new Date(sale.date).toLocaleTimeString()}</p>
                        <span className="text-[10px] font-black text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                          Ganancia: +${saleProfit.toLocaleString('es-CL')}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-base text-green-600">${sale.total.toLocaleString('es-CL')}</p>
                      <p className="text-xs text-[#0F172A] font-black">{sale.paymentMethod}</p>
                    </div>
                  </div>
                );
              })}
              {salesHistory.length === 0 && <p className="text-center py-10 text-[#0F172A] font-black">No hay ventas registradas aún.</p>}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border-2 border-error/15 hover:border-error/60 hover:shadow-lg transition-all card-hover-enhance">
            <h3 className="text-xl font-black text-[#0F172A] mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-error" />
              Alertas de <span className="text-secondary">Reposición</span>
            </h3>
            <div className="space-y-4">
              {lowStockProducts.slice(0, 5).map((p, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-red-50 rounded-2xl border border-red-100">
                  <div className="flex items-center gap-3">
                    <img src={p.image} className="w-10 h-10 rounded-lg object-cover" alt={p.name} />
                    <div>
                      <p className="font-bold text-base text-[#0F172A]">{p.name}</p>
                      <p className="text-xs text-red-600 font-bold">Stock Crítico: {p.stock} un.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setCurrentPage('inventory')}
                    className="px-4 py-2 bg-white text-red-600 border border-red-200 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors"
                  >
                    Gestionar
                  </button>
                </div>
              ))}
              {lowStockProducts.length === 0 && <p className="text-center py-10 text-[#0F172A] font-black">Todo el stock está en niveles óptimos.</p>}
            </div>
          </div>
        </div>
      </main>
      <NotificationsPanel />
    </div>
  );
};
