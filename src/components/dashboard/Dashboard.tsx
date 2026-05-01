import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Settings,
  LogOut,
  TrendingUp,
  Zap,
  Receipt,
  Package,
  History,
  AlertCircle
} from 'lucide-react';
import { Stat, Card, CardHeader, CardBody } from '../ui';
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

interface DashboardProps {
  setCurrentPage: (page: any) => void;
  inventory: any[];
  salesHistory: any[];
  setViewingSale: (sale: any) => void;
  currentUser: any;
  users: any[];
  setCurrentUser: (user: any) => void;
  currentStore: any;
  currentPOS: any;
}

export const Dashboard = ({ 
  setCurrentPage, 
  inventory, 
  salesHistory, 
  setViewingSale, 
  currentUser, 
  users, 
  setCurrentUser, 
  currentStore, 
  currentPOS 
}: DashboardProps) => {
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
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto bg-slate-50">
        <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 border-b border-slate-700 px-8 py-6 flex justify-between items-center shadow-md">
          <div>
            <h2 className="text-4xl font-black text-white">Mi <span className="text-blue-300">Negocio</span></h2>
            <p className="text-sm text-slate-300 mt-1">Resumen ejecutivo de tu negocio en tiempo real</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-600 transition-colors relative text-white cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-600 transition-colors text-white cursor-pointer">
              <Settings className="w-5 h-5" />
            </button>
            <div className="h-8 w-px bg-slate-600 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-white">{currentUser?.name || 'Admin Vantory'}</p>
                <p className="text-xs text-slate-300">{currentUser?.role || 'Soporte Técnico'}</p>
              </div>
              <img
                className="w-10 h-10 rounded-lg border-2 border-slate-500 object-cover"
                src={currentUser?.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuAPTOJksruGaNQm6gW0cTKsmHx_gthleGI0Hy70R56Q1oJ4i9lW0iL4JU8oXMoZAshoKE8S3a1-5NvKCV26POVasYgktSZtJpP6RHaMYbMEtqakjdL7rtnYFQso4Kzl5w6R3449pD-nViJIAngGkUqQijX4Zz9xtfKBk4SztlssTnGEGmOQeqPZsahAs-DUJ7tdh68w9VguZXCBAxiCk5XRvvm-GQdW31C8hvfujnZJlbpJ3SVzXGcnVimo2ARlMqv9ks88IY_RN2o_"}
                alt="User"
              />
            </div>
            <button
              onClick={() => {
                setCurrentUser(null);
                setCurrentPage('home');
              }}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-red-600/20 text-red-400 transition-colors ml-2 cursor-pointer"
              title="Cerrar Sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="p-8">

          <motion.div
            className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.2
                }
              }
            }}
          >
            {[
              {
                icon: <TrendingUp className="w-6 h-6" />,
                label: "Ventas Totales",
                value: `$${totalSales.toLocaleString('es-CL')}`,
                variant: "primary" as const,
                tooltip: "Suma de todas las ventas registradas"
              },
              {
                icon: <Zap className="w-6 h-6" />,
                label: "Ganancia Neta",
                value: `$${totalProfit.toLocaleString('es-CL')}`,
                sublabel: `${totalMargin}% margen • Hoy: +$${profitToday.toLocaleString('es-CL')}`,
                variant: "success" as const,
                tooltip: "Ingresos menos costo de productos"
              },
              {
                icon: <Receipt className="w-6 h-6" />,
                label: "Ventas Hoy",
                value: salesToday,
                variant: "primary" as const,
                tooltip: "Tickets emitidos en el día actual"
              },
              {
                icon: <Package className="w-6 h-6" />,
                label: "Valor Inventario",
                value: `$${totalInventoryValue.toLocaleString('es-CL')}`,
                variant: "warning" as const,
                tooltip: "Capital invertido en stock"
              },
              {
                icon: <AlertCircle className="w-6 h-6" />,
                label: "Alertas Stock",
                value: lowStockProducts.length,
                variant: "error" as const,
                tooltip: "Productos con menos de 10 unidades"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <Stat {...stat} />
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Trend Chart */}
            <Card variant="elevated" className="lg:col-span-2">
              <CardHeader
                title="Tendencia de Ventas"
                subtitle="Últimos 7 días"
                action={<div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                  <TrendingUp className="w-3 h-3" />
                  +12.5%
                </div>}
              />
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0052cc" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#0052cc" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                      tickFormatter={(value) => `$${(value/1000)}k`}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 600 }}
                      formatter={(value: number) => [`$${value.toLocaleString('es-CL')}`, 'Ventas']}
                    />
                    <Area
                      type="monotone"
                      dataKey="ventas"
                      stroke="#0052cc"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorSales)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Top Products */}
            <Card variant="elevated">
              <CardHeader title="Top 5 Productos" />
              <div className="h-[300px] w-full">
                {productSales.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productSales} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                      <XAxis type="number" hide />
                      <YAxis
                        dataKey="name"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                        width={100}
                      />
                      <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 600 }}
                        formatter={(value: number, name: string) => [
                          name === 'total' ? `$${value.toLocaleString('es-CL')}` : `${value} u.`,
                          name === 'total' ? 'Ventas' : 'Cantidad'
                        ]}
                      />
                      <Bar dataKey="total" fill="#0052cc" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 h-full flex flex-col items-center justify-center">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-sm font-semibold text-slate-500">Sin datos de ventas aún</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card variant="elevated">
              <CardHeader
                title="Últimas Ventas"
                action={<History className="w-5 h-5 text-sky-600" />}
              />
              <CardBody>
                {salesHistory.slice(0, 5).map((sale, i) => {
                  const saleProfit = sale.cart.reduce((sum: number, item: any) => sum + ((item.price - (item.cost || 0)) * item.quantity), 0);
                  return (
                    <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div>
                        <p className="font-semibold text-slate-900">Venta #{sale.id.toString().slice(-6)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-slate-600">{new Date(sale.date).toLocaleTimeString()}</p>
                          <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded-full">
                            +${saleProfit.toLocaleString('es-CL')}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${sale.total.toLocaleString('es-CL')}</p>
                        <p className="text-xs text-slate-600 font-semibold">{sale.paymentMethod}</p>
                      </div>
                    </div>
                  );
                })}
                {salesHistory.length === 0 && <p className="text-center py-10 text-slate-500">No hay ventas registradas aún.</p>}
              </CardBody>
            </Card>

            <Card variant="elevated">
              <CardHeader
                title="Alertas de Reposición"
                action={<AlertCircle className="w-5 h-5 text-red-600" />}
              />
              <CardBody>
                {lowStockProducts.slice(0, 5).map((p, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-3">
                      <img src={p.image} className="w-10 h-10 rounded-lg object-cover" alt={p.name} />
                      <div>
                        <p className="font-semibold text-slate-900">{p.name}</p>
                        <p className="text-xs text-red-700 font-semibold">Stock: {p.stock} un.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setCurrentPage('inventory')}
                      className="px-3 py-1.5 bg-white text-red-600 border border-red-200 rounded-lg text-xs font-semibold hover:bg-red-50 transition-colors"
                    >
                      Gestionar
                    </button>
                  </div>
                ))}
                {lowStockProducts.length === 0 && <p className="text-center py-10 text-slate-500">Todo el stock está en niveles óptimos.</p>}
              </CardBody>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
