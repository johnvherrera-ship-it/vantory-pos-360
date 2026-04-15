import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, 
  Download, 
  Receipt, 
  Zap, 
  Bell, 
  Banknote, 
  TrendingUp, 
  Calendar, 
  ArrowRight, 
  ArrowUp, 
  ArrowDown, 
  Settings, 
  Info, 
  X, 
  CreditCard, 
  CheckCircle 
} from 'lucide-react';
import { SideNavBar } from '../layout/SideNavBar';

interface KPIsDashboardProps {
  setCurrentPage: (page: any) => void;
  inventory: any[];
  salesHistory: any[];
  cashRegister: any;
  setShowCashRegisterModal: (show: boolean) => void;
  currentUser: any;
  users: any[];
  setCurrentUser: (user: any) => void;
  cashHistory: any[];
  currentStore: any;
  currentPOS: any;
}

export const KPIsDashboard = ({ 
  setCurrentPage, 
  inventory, 
  salesHistory, 
  cashRegister, 
  setShowCashRegisterModal, 
  currentUser, 
  users, 
  setCurrentUser, 
  cashHistory, 
  currentStore, 
  currentPOS 
}: KPIsDashboardProps) => {
  const [timeFilter, setTimeFilter] = useState<'day' | 'week' | 'month' | 'custom'>('week');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);
  const [showCriticalStockModal, setShowCriticalStockModal] = useState(false);
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [showProfitModal, setShowProfitModal] = useState(false);
  const [showRotationModal, setShowRotationModal] = useState(false);
  const [showStagnantModal, setShowStagnantModal] = useState(false);
  const [showCashHistoryModal, setShowCashHistoryModal] = useState(false);

  const filteredSales = useMemo(() => {
    const now = new Date();
    return salesHistory.filter(sale => {
      const saleDate = new Date(sale.date);
      if (timeFilter === 'day') {
        return saleDate.toDateString() === now.toDateString();
      } else if (timeFilter === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return saleDate >= weekAgo;
      } else if (timeFilter === 'month') {
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        return saleDate >= monthAgo;
      } else if (timeFilter === 'custom' && customDateRange.start && customDateRange.end) {
        const start = new Date(customDateRange.start);
        start.setHours(0, 0, 0, 0);
        const end = new Date(customDateRange.end);
        end.setHours(23, 59, 59, 999);
        return saleDate >= start && saleDate <= end;
      }
      return false;
    });
  }, [salesHistory, timeFilter, customDateRange]);

  const previousFilteredSales = useMemo(() => {
    const now = new Date();
    return salesHistory.filter(sale => {
      const saleDate = new Date(sale.date);
      if (timeFilter === 'day') {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        return saleDate.toDateString() === yesterday.toDateString();
      } else if (timeFilter === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        const twoWeeksAgo = new Date(now);
        twoWeeksAgo.setDate(now.getDate() - 14);
        return saleDate >= twoWeeksAgo && saleDate < weekAgo;
      } else if (timeFilter === 'month') {
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        const twoMonthsAgo = new Date(now);
        twoMonthsAgo.setMonth(now.getMonth() - 2);
        return saleDate >= twoMonthsAgo && saleDate < monthAgo;
      } else if (timeFilter === 'custom' && customDateRange.start && customDateRange.end) {
        const start = new Date(customDateRange.start);
        const end = new Date(customDateRange.end);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        const prevStart = new Date(start);
        prevStart.setDate(start.getDate() - diffDays);
        prevStart.setHours(0, 0, 0, 0);
        const prevEnd = new Date(end);
        prevEnd.setDate(end.getDate() - diffDays);
        prevEnd.setHours(23, 59, 59, 999);
        return saleDate >= prevStart && saleDate <= prevEnd;
      }
      return false;
    });
  }, [salesHistory, timeFilter, customDateRange]);

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const prevTotalSales = previousFilteredSales.reduce((sum, sale) => sum + sale.total, 0);
  
  const totalUnitsSold = filteredSales.reduce((sum, sale) => sum + sale.cart.reduce((cSum: number, item: any) => cSum + item.quantity, 0), 0);
  const totalStock = inventory.reduce((sum, item) => sum + item.stock, 0);
  const rotationRate = totalStock > 0 ? Math.round((totalUnitsSold / (totalUnitsSold + totalStock)) * 100) : 0;

  const stockProjections = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const productSalesCount: Record<number, number> = {};
    salesHistory.forEach(sale => {
      if (new Date(sale.date) >= thirtyDaysAgo) {
        sale.cart.forEach((item: any) => {
          productSalesCount[item.id] = (productSalesCount[item.id] || 0) + item.quantity;
        });
      }
    });

    return inventory.map(p => {
      const soldIn30Days = productSalesCount[p.id] || 0;
      const dailyVelocity = soldIn30Days / 30;
      const daysUntilDepletion = dailyVelocity > 0 ? Math.floor(p.stock / dailyVelocity) : Infinity;
      return { ...p, dailyVelocity, daysUntilDepletion };
    }).filter(p => p.stock > 0).sort((a, b) => a.daysUntilDepletion - b.daysUntilDepletion);
  }, [salesHistory, inventory]);

  const lowStockProducts = stockProjections.filter(p => p.stock < 10 || p.daysUntilDepletion <= 7);
  const totalInventoryValue = inventory.reduce((sum, p) => sum + (p.cost * p.stock), 0);
  
  const totalProfit = filteredSales.reduce((sum, sale) => {
    const saleCost = sale.cart.reduce((cSum: number, item: any) => {
      const product = inventory.find(p => p.id === item.id);
      return cSum + (product ? product.cost * item.quantity : 0);
    }, 0);
    return sum + (sale.total - saleCost);
  }, 0);

  const prevTotalProfit = previousFilteredSales.reduce((sum, sale) => {
    const saleCost = sale.cart.reduce((cSum: number, item: any) => {
      const product = inventory.find(p => p.id === item.id);
      return cSum + (product ? product.cost * item.quantity : 0);
    }, 0);
    return sum + (sale.total - saleCost);
  }, 0);

  const profitMargin = totalSales > 0 ? Math.round((totalProfit / totalSales) * 100) : 0;

  const getTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const salesTrend = getTrend(totalSales, prevTotalSales);
  const transactionsTrend = getTrend(filteredSales.length, previousFilteredSales.length);
  const profitTrend = getTrend(totalProfit, prevTotalProfit);

  const topProducts = useMemo(() => {
    const productSales: Record<number, { product: any, quantity: number }> = {};
    filteredSales.forEach(sale => {
      sale.cart.forEach((item: any) => {
        if (!productSales[item.id]) {
          const product = inventory.find(p => p.id === item.id) || item;
          productSales[item.id] = { product, quantity: 0 };
        }
        productSales[item.id].quantity += item.quantity;
      });
    });
    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 4);
  }, [filteredSales, inventory]);

  const revenueByMethod = useMemo(() => {
    return filteredSales.reduce((acc, sale) => {
      acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + sale.total;
      return acc;
    }, {} as Record<string, number>);
  }, [filteredSales]);

  const profitByProduct = useMemo(() => {
    const productProfits: Record<number, { name: string, profit: number, quantity: number, image: string }> = {};
    filteredSales.forEach(sale => {
      sale.cart.forEach((item: any) => {
        const product = inventory.find(p => p.id === item.id);
        if (product) {
          const profit = (item.price - product.cost) * item.quantity;
          if (!productProfits[item.id]) {
            productProfits[item.id] = { name: product.name, profit: 0, quantity: 0, image: product.image };
          }
          productProfits[item.id].profit += profit;
          productProfits[item.id].quantity += item.quantity;
        }
      });
    });
    return Object.values(productProfits).sort((a, b) => b.profit - a.profit);
  }, [filteredSales, inventory]);

  const stagnantProducts = useMemo(() => {
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

    const soldProductIds = new Set();
    salesHistory.forEach(sale => {
      const saleDate = new Date(sale.date);
      if (saleDate >= fifteenDaysAgo) {
        sale.cart.forEach((item: any) => soldProductIds.add(item.id));
      }
    });
    
    return inventory.filter(p => !soldProductIds.has(p.id) && p.stock > 0)
      .sort((a, b) => (b.stock * b.cost) - (a.stock * a.cost));
  }, [salesHistory, inventory]);

  const stuckCapital = useMemo(() => {
    return stagnantProducts.reduce((total, product) => total + (product.stock * product.cost), 0);
  }, [stagnantProducts]);

  const chartData = useMemo(() => {
    if (timeFilter === 'week') {
      const days = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
      const data = days.map(day => ({ day, total: 0, active: false, highlight: false }));
      filteredSales.forEach(sale => {
        const dayIndex = (new Date(sale.date).getDay() + 6) % 7;
        data[dayIndex].total += sale.total;
      });
      const maxTotal = Math.max(...data.map(d => d.total), 1);
      const todayIndex = (new Date().getDay() + 6) % 7;
      data[todayIndex].active = true;
      
      return data.map(d => ({
        ...d,
        heightStyle: `${Math.max((d.total / maxTotal) * 100, 5)}%`,
        val: `$${d.total.toLocaleString('es-CL')}`
      }));
    } else if (timeFilter === 'day') {
       const blocks = [
         { label: 'Mañana', min: 0, max: 12, total: 0 },
         { label: 'Tarde', min: 12, max: 16, total: 0 },
         { label: 'Tarde-Noche', min: 16, max: 20, total: 0 },
         { label: 'Noche', min: 20, max: 24, total: 0 }
       ];
       filteredSales.forEach(sale => {
         const hour = new Date(sale.date).getHours();
         const block = blocks.find(b => hour >= b.min && hour < b.max);
         if (block) block.total += sale.total;
       });
       const maxTotal = Math.max(...blocks.map(d => d.total), 1);
       return blocks.map(d => ({
         day: d.label,
         total: d.total,
         active: false,
         highlight: false,
         heightStyle: `${Math.max((d.total / maxTotal) * 100, 5)}%`,
         val: `$${d.total.toLocaleString('es-CL')}`
       }));
    } else {
       const weeks = [
         { label: 'Sem 1', total: 0 },
         { label: 'Sem 2', total: 0 },
         { label: 'Sem 3', total: 0 },
         { label: 'Sem 4', total: 0 }
       ];
       filteredSales.forEach(sale => {
         const date = new Date(sale.date).getDate();
         const weekIndex = Math.min(Math.floor((date - 1) / 7), 3);
         weeks[weekIndex].total += sale.total;
       });
       const maxTotal = Math.max(...weeks.map(d => d.total), 1);
       return weeks.map(d => ({
         day: d.label,
         total: d.total,
         active: false,
         highlight: false,
         heightStyle: `${Math.max((d.total / maxTotal) * 100, 5)}%`,
         val: `$${d.total.toLocaleString('es-CL')}`
       }));
    }
  }, [filteredSales, timeFilter]);

  const inventoryHealth = useMemo(() => {
    let healthy = 0;
    let low = 0;
    let critical = 0;
    inventory.forEach(p => {
      if (p.stock === 0) critical++;
      else if (p.stock < 10) low++;
      else healthy++;
    });
    const total = inventory.length || 1;
    return {
      healthy: Math.round((healthy / total) * 100),
      low: Math.round((low / total) * 100),
      critical: Math.round((critical / total) * 100)
    };
  }, [inventory]);

  return (
    <div className="flex min-h-screen bg-surface text-on-surface font-body">
      <SideNavBar currentPage="kpis" setCurrentPage={setCurrentPage} currentUser={currentUser} users={users} setCurrentUser={setCurrentUser} currentStore={currentStore} currentPOS={currentPOS} />
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto p-8">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black text-[#0F172A] font-headline mb-1">Rendimiento <span className="text-secondary">Operativo</span></h2>
            <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-3">PANEL &gt; KPIS &amp; ANALÍTICA</p>
            <p className="text-[#0F172A]/70 font-bold text-lg">Visualización en tiempo real de métricas críticas de ventas y salud del inventario de tu local.</p>
          </div>
          <div className="flex items-center gap-3 mb-1">
            <button 
              onClick={() => setShowCashHistoryModal(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-white text-secondary border border-secondary/20 font-black rounded-xl shadow-lg hover:scale-[1.02] transition-transform"
            >
              <History className="w-5 h-5" />
              <span className="text-sm">Historial de Caja</span>
            </button>
            <button 
              onClick={() => {
                const csvContent = [
                  ["ID Venta", "Fecha", "Metodo Pago", "Total", "Productos"],
                  ...filteredSales.map(sale => [
                    sale.id,
                    new Date(sale.date).toLocaleString('es-CL'),
                    sale.paymentMethod,
                    sale.total,
                    sale.cart.map((item: any) => `${item.name} (x${item.quantity})`).join(" | ")
                  ])
                ].map(e => e.join(",")).join("\n");
                
                const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                const fileName = timeFilter === 'custom' ? `informe_ventas_${customDateRange.start}_${customDateRange.end}.csv` : `informe_ventas_${timeFilter}.csv`;
                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-secondary text-white font-black rounded-xl shadow-lg shadow-secondary/20 hover:scale-[1.02] transition-transform"
            >
              <Download className="w-5 h-5" />
              <span className="text-sm">Exportar Reporte</span>
            </button>
          </div>
        </header>

        {/* Bento Grid: KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div onClick={() => setShowTransactionsModal(true)} className="bg-white p-5 rounded-3xl border border-outline-variant/10 hover:border-secondary/30 transition-all flex flex-col justify-between group shadow-sm cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-secondary/5 rounded-xl group-hover:bg-secondary/10 transition-colors">
                <Receipt className="w-5 h-5 text-secondary" />
              </div>
              <span className="text-[9px] font-black py-1 px-2 rounded-full bg-secondary/10 text-secondary uppercase tracking-tighter">KPI #1: Transacciones</span>
            </div>
            <div className="mt-4">
              <h3 className="text-[10px] font-black text-[#0F172A]/50 uppercase tracking-widest">Transacciones Totales</h3>
              <p className="text-2xl font-black font-headline tabular-nums mt-1">{filteredSales.length}</p>
              <p className="text-[10px] font-bold mt-2 flex items-center gap-1">
                {transactionsTrend >= 0 ? (
                  <span className="text-green-600 flex items-center"><ArrowUp className="w-3 h-3" /> {transactionsTrend}%</span>
                ) : (
                  <span className="text-red-600 flex items-center"><ArrowDown className="w-3 h-3" /> {Math.abs(transactionsTrend)}%</span>
                )}
                <span className="text-on-surface-variant">vs anterior</span>
              </p>
            </div>
          </div>

          <div onClick={() => setShowRotationModal(true)} className="bg-white p-5 rounded-3xl border border-outline-variant/10 hover:border-secondary/30 transition-all flex flex-col justify-between group shadow-sm cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-amber-50 rounded-xl group-hover:bg-amber-100 transition-colors">
                <Zap className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-[9px] font-black py-1 px-2 rounded-full bg-amber-100 text-amber-700 uppercase tracking-tighter">KPI #2: Rotación</span>
            </div>
            <div className="mt-4">
              <h3 className="text-[10px] font-black text-[#0F172A]/50 uppercase tracking-widest">Nivel de Rotación</h3>
              <p className="text-2xl font-black font-headline tabular-nums mt-1">{rotationRate}%</p>
              <p className="text-[10px] text-on-surface-variant mt-2 font-bold">Fluidez de inventario</p>
            </div>
          </div>

          <div onClick={() => setShowCriticalStockModal(true)} className="bg-white p-5 rounded-3xl border border-outline-variant/10 hover:border-error/30 transition-all flex flex-col justify-between group shadow-sm cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors">
                <Bell className="w-5 h-5 text-error" />
              </div>
              <span className="text-[9px] font-black py-1 px-2 rounded-full bg-red-100 text-red-700 uppercase tracking-tighter">KPI #3: Stock Crítico</span>
            </div>
            <div className="mt-4">
              <h3 className="text-[10px] font-black text-[#0F172A]/50 uppercase tracking-widest">Stock Crítico</h3>
              <p className="text-2xl font-black font-headline tabular-nums mt-1">{lowStockProducts.length} <span className="text-sm font-normal text-on-surface-variant">SKUs</span></p>
              <p className="text-[10px] text-error mt-2 font-black">Acción Requerida</p>
            </div>
          </div>

          <div onClick={() => setShowRevenueModal(true)} className="bg-white p-5 rounded-3xl border border-outline-variant/10 hover:border-secondary/30 transition-all flex flex-col justify-between group shadow-sm cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-secondary/5 rounded-xl group-hover:bg-secondary/10 transition-colors">
                <Banknote className="w-5 h-5 text-secondary" />
              </div>
              <span className="text-[9px] font-black py-1 px-2 rounded-full bg-green-100 text-green-700 uppercase tracking-tighter">KPI #4: Ingresos</span>
            </div>
            <div className="mt-4">
              <h3 className="text-[10px] font-black text-[#0F172A]/50 uppercase tracking-widest">Ingresos Totales</h3>
              <p className="text-2xl font-black font-headline tabular-nums mt-1">${totalSales.toLocaleString('es-CL')}</p>
              <p className="text-[10px] font-bold mt-2 flex items-center gap-1">
                {salesTrend >= 0 ? (
                  <span className="text-green-600 flex items-center"><ArrowUp className="w-3 h-3" /> {salesTrend}%</span>
                ) : (
                  <span className="text-red-600 flex items-center"><ArrowDown className="w-3 h-3" /> {Math.abs(salesTrend)}%</span>
                )}
                <span className="text-on-surface-variant">vs anterior</span>
              </p>
            </div>
          </div>

          <div onClick={() => setShowProfitModal(true)} className="bg-white p-5 rounded-3xl border border-outline-variant/10 hover:border-secondary/30 transition-all flex flex-col justify-between group shadow-sm cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-secondary/5 rounded-xl group-hover:bg-secondary/10 transition-colors">
                <TrendingUp className="w-5 h-5 text-secondary" />
              </div>
              <span className="text-[9px] font-black py-1 px-2 rounded-full bg-green-100 text-green-700 uppercase tracking-tighter">KPI #5: Utilidad</span>
            </div>
            <div className="mt-4">
              <h3 className="text-[10px] font-black text-[#0F172A]/50 uppercase tracking-widest">Utilidad Total</h3>
              <p className="text-2xl font-black font-headline tabular-nums mt-1">${totalProfit.toLocaleString('es-CL')}</p>
              <p className="text-[10px] font-bold mt-2 flex items-center gap-1">
                {profitTrend >= 0 ? (
                  <span className="text-green-600 flex items-center"><ArrowUp className="w-3 h-3" /> {profitTrend}%</span>
                ) : (
                  <span className="text-red-600 flex items-center"><ArrowDown className="w-3 h-3" /> {Math.abs(profitTrend)}%</span>
                )}
                <span className="text-on-surface-variant">vs anterior</span>
              </p>
            </div>
          </div>
        </div>

        {/* Analytics Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-8">
          <div className="xl:col-span-3 bg-white p-8 rounded-[2rem] shadow-sm border border-outline-variant/10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black font-headline text-[#0F172A]">Ventas por <span className="text-secondary">Período</span></h3>
                <p className="text-sm text-[#0F172A] font-bold">Comparativa de ingresos en el tiempo</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex p-1 bg-surface-container-low rounded-xl">
                  {(['day', 'week', 'month', 'custom'] as const).map(filter => (
                    <button 
                      key={filter}
                      onClick={() => setTimeFilter(filter)}
                      className={`px-5 py-2 text-xs font-black rounded-lg transition-all ${timeFilter === filter ? 'bg-white shadow-sm text-secondary' : 'text-on-surface-variant hover:text-[#0F172A]'}`}
                    >
                      {filter === 'day' ? 'Día' : filter === 'week' ? 'Semana' : filter === 'month' ? 'Mes' : 'Personalizado'}
                    </button>
                  ))}
                </div>
                {timeFilter === 'custom' && (
                  <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-xl">
                    <input type="date" value={customDateRange.start} onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))} className="bg-white px-3 py-1.5 rounded-lg text-xs font-bold text-[#0F172A] border-none outline-none focus:ring-2 focus:ring-secondary/50" />
                    <span className="text-xs font-bold text-on-surface-variant">a</span>
                    <input type="date" value={customDateRange.end} onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))} className="bg-white px-3 py-1.5 rounded-lg text-xs font-bold text-[#0F172A] border-none outline-none focus:ring-2 focus:ring-secondary/50" />
                  </div>
                )}
              </div>
            </div>
            <div className="h-80 w-full flex items-end justify-between gap-4 px-2 relative border-b border-outline-variant/20">
              {[0, 0.25, 0.5, 0.75].map(pos => (
                <div key={pos} className="absolute inset-x-0 border-t border-dashed border-outline-variant/10 w-full" style={{ top: `${pos * 100}%` }}></div>
              ))}
              {chartData.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group cursor-pointer h-full justify-end">
                  <div style={{ height: item.heightStyle }} className={`w-full ${item.active ? 'bg-secondary' : 'bg-surface-container-high'} rounded-t-xl group-hover:opacity-80 transition-all relative min-h-[10%]`}>
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white px-3 py-1.5 rounded-lg text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {item.val}
                    </div>
                  </div>
                  <span className={`text-[11px] font-black ${item.active ? 'text-secondary' : 'text-[#0F172A]'} uppercase tracking-wider`}>{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="xl:col-span-1 bg-white p-8 rounded-[2rem] shadow-sm border border-outline-variant/10">
            <h3 className="text-xl font-black font-headline text-[#0F172A] mb-8">Top <span className="text-secondary">Productos</span></h3>
            <div className="space-y-7">
              {topProducts.map((p, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-low overflow-hidden flex-shrink-0">
                    <img alt={p.product.name} className="w-full h-full object-cover" src={p.product.image} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-black text-[#0F172A] group-hover:text-secondary transition-colors truncate max-w-[120px]">{p.product.name}</h4>
                    <p className="text-xs text-[#0F172A] font-bold">{p.product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black font-headline text-[#0F172A]">{p.quantity}</p>
                    <p className="text-[10px] font-black text-green-600 uppercase tracking-tighter">Vendidos</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setCurrentPage('inventory')} className="w-full mt-10 py-3.5 bg-surface-container-low text-secondary font-black text-xs rounded-xl hover:bg-secondary hover:text-white transition-all uppercase tracking-widest">Ver Inventario</button>
          </div>
        </div>

        {/* Secondary Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-white p-8 rounded-[2rem] border border-outline-variant/10 shadow-sm">
            <h3 className="text-xl font-black font-headline text-[#0F172A] mb-8">Estado de <span className="text-secondary">Inventario Local</span></h3>
            <div className="flex flex-col gap-6">
              {[
                { label: 'Stock Saludable', val: inventoryHealth.healthy, color: 'bg-green-500', text: 'text-green-600' },
                { label: 'Stock Bajo (Alerta)', val: inventoryHealth.low, color: 'bg-secondary', text: 'text-secondary' },
                { label: 'Sin Stock (Crítico)', val: inventoryHealth.critical, color: 'bg-error', text: 'text-error' }
              ].map(item => (
                <div key={item.label} className="space-y-3">
                  <div className="flex justify-between text-xs font-black uppercase tracking-wider text-[#0F172A]">
                    <span>{item.label}</span>
                    <span className={item.text}>{item.val}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-surface-container-low rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${item.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div onClick={() => setShowCriticalStockModal(true)} className="mt-8 p-5 bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer rounded-2xl flex items-start gap-4 border border-outline-variant/10">
              <Zap className="w-5 h-5 text-secondary mt-1" />
              <div>
                <p className="text-sm font-black text-[#0F172A]">Recomendación de Compra</p>
                <p className="text-xs text-[#0F172A] font-bold mt-1 leading-relaxed">
                  {lowStockProducts.length > 0 
                    ? `Se sugiere reponer ${lowStockProducts[0].name} y otros ${lowStockProducts.length - 1} productos.`
                    : 'Inventario en niveles óptimos.'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#0F172A] p-8 rounded-[2rem] text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h3 className="text-xl font-black font-headline mb-10">Resumen de <span className="text-secondary-container">Rentabilidad</span></h3>
              <div className="grid grid-cols-2 gap-10">
                <div>
                  <p className="text-xs font-black text-white/40 uppercase tracking-widest mb-2">Ingresos Netos</p>
                  <p className="text-4xl font-black font-headline tabular-nums">${totalSales.toLocaleString('es-CL')}</p>
                </div>
                <div>
                  <p className="text-xs font-black text-white/40 uppercase tracking-widest mb-2">Valor Inventario</p>
                  <p className="text-4xl font-black font-headline tabular-nums text-blue-400">${totalInventoryValue.toLocaleString('es-CL')}</p>
                </div>
              </div>
              <div className="mt-12 pt-10 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-white/40 uppercase tracking-widest mb-2">Utilidad Estimada</p>
                  <p className="text-3xl font-black font-headline">${totalProfit.toLocaleString('es-CL')}</p>
                </div>
                <div className="relative flex items-center justify-center">
                  <svg className="w-20 h-20">
                    <circle className="text-white/5" cx="40" cy="40" fill="transparent" r="34" stroke="currentColor" strokeWidth="6"></circle>
                    <circle className="text-green-400 transition-all duration-1000" cx="40" cy="40" fill="transparent" r="34" stroke="currentColor" strokeDasharray="213.6" strokeDashoffset={213.6 - (213.6 * profitMargin) / 100} strokeLinecap="round" strokeWidth="6" transform="rotate(-90 40 40)"></circle>
                  </svg>
                  <span className="absolute text-sm font-black text-green-400">{profitMargin}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showTransactionsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTransactionsModal(false)} className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl max-h-[80vh] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-[#0F172A] font-headline">Transacciones <span className="text-secondary">Totales</span></h3>
                <button onClick={() => setShowTransactionsModal(false)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors"><X className="w-6 h-6 text-[#0F172A]" /></button>
              </div>
              <div className="overflow-y-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-outline-variant/20 text-xs text-[#0F172A]/60 uppercase tracking-wider">
                      <th className="pb-3 font-black">Fecha</th>
                      <th className="pb-3 font-black">ID Venta</th>
                      <th className="pb-3 font-black">Método</th>
                      <th className="pb-3 font-black text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSales.map((sale, i) => (
                      <tr key={i} className="border-b border-outline-variant/10 hover:bg-surface-container-lowest transition-colors">
                        <td className="py-4 text-sm font-bold text-[#0F172A]">{new Date(sale.date).toLocaleString('es-CL')}</td>
                        <td className="py-4 text-sm font-bold text-[#0F172A]">#{sale.id}</td>
                        <td className="py-4"><span className={`px-3 py-1 rounded-full text-xs font-black ${sale.paymentMethod === 'Efectivo' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{sale.paymentMethod}</span></td>
                        <td className="py-4 text-sm font-black text-[#0F172A] text-right">${sale.total.toLocaleString('es-CL')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}

        {showCriticalStockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCriticalStockModal(false)} className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl max-h-[80vh] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-[#0F172A] font-headline">Stock <span className="text-secondary">Crítico</span></h3>
                <button onClick={() => setShowCriticalStockModal(false)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors"><X className="w-6 h-6 text-[#0F172A]" /></button>
              </div>
              <div className="overflow-y-auto flex-1 space-y-4">
                {lowStockProducts.map((product: any, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest">
                    <img alt={product.name} className="w-16 h-16 rounded-xl object-cover" src={product.image} />
                    <div className="flex-1">
                      <h4 className="text-base font-black text-[#0F172A]">{product.name}</h4>
                      <p className="text-xs text-[#0F172A]/60 font-bold">Stock: {product.stock} un. | Velocidad: {product.dailyVelocity.toFixed(1)} un/día</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black tabular-nums">{product.daysUntilDepletion === Infinity ? '∞' : product.daysUntilDepletion}</p>
                      <p className="text-[10px] font-black uppercase tracking-wider text-[#0F172A]/50">Días restantes</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {showRevenueModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRevenueModal(false)} className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-[#0F172A] font-headline">Ingresos <span className="text-secondary">Totales</span></h3>
                <button onClick={() => setShowRevenueModal(false)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors"><X className="w-6 h-6 text-[#0F172A]" /></button>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10">
                  <h4 className="font-black text-[#0F172A] mb-2">Efectivo</h4>
                  <p className="text-3xl font-black tabular-nums">${(revenueByMethod['Efectivo'] || 0).toLocaleString('es-CL')}</p>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10">
                  <h4 className="font-black text-[#0F172A] mb-2">Tarjeta</h4>
                  <p className="text-3xl font-black tabular-nums">${(revenueByMethod['Débito'] || 0).toLocaleString('es-CL')}</p>
                </div>
              </div>
              <div className="bg-[#0F172A] p-6 rounded-2xl text-white flex justify-between items-center">
                <p className="text-4xl font-black tabular-nums">${totalSales.toLocaleString('es-CL')}</p>
                <TrendingUp className="w-12 h-12 text-secondary/50" />
              </div>
            </motion.div>
          </div>
        )}

        {showProfitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowProfitModal(false)} className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl max-h-[80vh] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-[#0F172A] font-headline">Utilidad <span className="text-secondary">Total</span></h3>
                <button onClick={() => setShowProfitModal(false)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors"><X className="w-6 h-6 text-[#0F172A]" /></button>
              </div>
              <div className="overflow-y-auto flex-1 space-y-3">
                {profitByProduct.map((product, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/10">
                    <img alt={product.name} className="w-12 h-12 rounded-lg object-cover" src={product.image} />
                    <div className="flex-1">
                      <h5 className="text-sm font-black text-[#0F172A]">{product.name}</h5>
                      <p className="text-xs text-[#0F172A]/60 font-bold">{product.quantity} vendidos</p>
                    </div>
                    <p className="text-base font-black text-green-600">+${product.profit.toLocaleString('es-CL')}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {showRotationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRotationModal(false)} className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-[#0F172A] font-headline">Nivel de <span className="text-amber-600">Rotación</span></h3>
                <button onClick={() => setShowRotationModal(false)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors"><X className="w-6 h-6 text-[#0F172A]" /></button>
              </div>
              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 flex justify-between items-center">
                <p className="text-4xl font-black text-amber-700">{rotationRate}%</p>
                <p className="text-3xl font-black text-amber-700">{totalUnitsSold} vendidas</p>
              </div>
            </motion.div>
          </div>
        )}

        {showStagnantModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowStagnantModal(false)} className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl max-h-[80vh] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-[#0F172A] font-headline">Inventario <span className="text-orange-500">Estancado</span></h3>
                <button onClick={() => setShowStagnantModal(false)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors"><X className="w-6 h-6 text-[#0F172A]" /></button>
              </div>
              <div className="overflow-y-auto flex-1 space-y-3">
                {stagnantProducts.map((product, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/10">
                    <img alt={product.name} className="w-12 h-12 rounded-lg object-cover" src={product.image} />
                    <div className="flex-1">
                      <h5 className="text-sm font-black text-[#0F172A]">{product.name}</h5>
                      <p className="text-xs text-[#0F172A]/60 font-bold">Stock: {product.stock} un.</p>
                    </div>
                    <p className="text-base font-black text-orange-600">${(product.stock * product.cost).toLocaleString('es-CL')}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {showCashHistoryModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCashHistoryModal(false)} className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] shadow-2xl flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-[#0F172A] font-headline">Historial de <span className="text-secondary">Cierres de Caja</span></h3>
                <button onClick={() => setShowCashHistoryModal(false)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors"><X className="w-6 h-6 text-[#0F172A]" /></button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-[10px] font-black text-[#0F172A]/40 uppercase tracking-widest">
                      <th className="px-4 py-2">Fecha Cierre</th>
                      <th className="px-4 py-2">Usuario</th>
                      <th className="px-4 py-2 text-right">Esperado</th>
                      <th className="px-4 py-2 text-right">Real</th>
                      <th className="px-4 py-2 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cashHistory.map((record) => (
                      <tr key={record.id} className="bg-surface-container-lowest hover:bg-surface-container-low transition-colors group">
                        <td className="px-4 py-4 rounded-l-2xl text-sm font-black">{new Date(record.closedAt).toLocaleDateString('es-CL')}</td>
                        <td className="px-4 py-4 text-sm font-bold">{record.user}</td>
                        <td className="px-4 py-4 text-right text-sm font-black">${record.expectedCash.toLocaleString('es-CL')}</td>
                        <td className="px-4 py-4 text-right text-sm font-black text-secondary">${record.actualCash.toLocaleString('es-CL')}</td>
                        <td className="px-4 py-4 rounded-r-2xl text-center"><span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-green-100 text-green-700">{record.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
