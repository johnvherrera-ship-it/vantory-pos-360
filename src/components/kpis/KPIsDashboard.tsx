
import React, { useState, useMemo } from 'react';
import {
  Receipt, Zap, Bell, Banknote, TrendingUp, Calendar,
  ArrowRight, Download, History, X, Info, CheckCircle,
  ArrowUp, ArrowDown, Settings, CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SideNavBar } from '../layout/SideNavBar';
import { useAppContexts } from '../../hooks/useAppContexts';

export const KPIsDashboard = () => {
  const { ui, pos, app } = useAppContexts();
  const { setCurrentPage, setShowCashRegisterModal } = ui;
  const { currentUser, setCurrentUser, currentStore, currentPOS } = pos;
  const { clientInventory: inventory, clientSalesHistory: salesHistory, clientCashRegister: cashRegister, clientCashHistory: cashHistory, clientUsers: users } = app;
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
      const daysUntilDepletion = p.stock === 0 ? 0 : (dailyVelocity > 0 ? Math.floor(p.stock / dailyVelocity) : Infinity);
      return { ...p, dailyVelocity, daysUntilDepletion };
    }).sort((a, b) => a.daysUntilDepletion - b.daysUntilDepletion);
  }, [salesHistory, inventory]);

  const lowStockProducts = stockProjections.filter(p => p.stock < 10 || p.daysUntilDepletion <= 7);
  const totalInventoryValue = inventory.reduce((sum, p) => sum + (p.cost * p.stock), 0);
  
  // Calcula utilidad usando el profit guardado en la venta (costo al momento de vender)
  // Fallback: usa item.cost del carrito, o costo actual del inventario
  const calcSaleProfit = (sale: any) => {
    if (typeof sale.profit === 'number') return sale.profit;
    const saleCost = sale.cart.reduce((cSum: number, item: any) => {
      const cost = typeof item.cost === 'number'
        ? item.cost
        : (inventory.find((p: any) => p.id === item.id)?.cost ?? 0);
      return cSum + cost * item.quantity;
    }, 0);
    return sale.total - saleCost;
  };

  const totalProfit = filteredSales.reduce((sum, sale) => sum + calcSaleProfit(sale), 0);
  const prevTotalProfit = previousFilteredSales.reduce((sum, sale) => sum + calcSaleProfit(sale), 0);

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
        const product = inventory.find((p: any) => p.id === item.id);
        const cost = typeof item.cost === 'number'
          ? item.cost
          : (product?.cost ?? 0);
        const profit = (item.price - cost) * item.quantity;
        if (!productProfits[item.id]) {
          productProfits[item.id] = {
            name: item.name || product?.name || 'Desconocido',
            profit: 0,
            quantity: 0,
            image: product?.image || item.image || ''
          };
        }
        productProfits[item.id].profit += profit;
        productProfits[item.id].quantity += item.quantity;
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
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen p-4 md:p-8 pt-20 md:pt-8 pb-20 md:pb-0">
        <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-[#0F172A] font-headline mb-1">Rendimiento <span className="text-secondary">Operativo</span></h2>
            <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-3">PANEL &gt; KPIS &amp; ANALÍTICA</p>
            <p className="text-[#0F172A]/70 font-bold text-sm md:text-lg">Visualización en tiempo real de métricas críticas de ventas y salud del inventario de tu local.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3 md:mb-1">
            <button
              onClick={() => setShowCashHistoryModal(true)}
              className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 md:py-2.5 bg-white text-secondary border border-secondary/20 font-black rounded-xl shadow-lg hover:scale-[1.02] transition-transform min-h-12 md:min-h-auto"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div onClick={() => setShowTransactionsModal(true)} className="bg-white p-5 rounded-3xl border border-secondary/20 shadow-md hover:shadow-lg hover:border-opacity-60 transition-all flex flex-col justify-between group cursor-pointer">
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

          <div onClick={() => setShowRotationModal(true)} className="bg-white p-5 rounded-3xl border border-secondary/20 shadow-md hover:shadow-lg hover:border-opacity-60 transition-all flex flex-col justify-between group cursor-pointer">
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

          <div onClick={() => setShowCriticalStockModal(true)} className="bg-white p-5 rounded-3xl border border-error/20 shadow-md hover:shadow-lg hover:border-opacity-60 transition-all flex flex-col justify-between group cursor-pointer">
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

          <div onClick={() => setShowRevenueModal(true)} className="bg-white p-5 rounded-3xl border border-secondary/20 shadow-md hover:shadow-lg hover:border-opacity-60 transition-all flex flex-col justify-between group cursor-pointer">
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

          <div onClick={() => setShowProfitModal(true)} className="bg-white p-5 rounded-3xl border border-secondary/20 shadow-md hover:shadow-lg hover:border-opacity-60 transition-all flex flex-col justify-between group cursor-pointer">
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

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-8 rounded-[2rem] shadow-md border border-secondary/15">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black font-headline text-[#0F172A]">Ventas por <span className="text-secondary">Período</span></h3>
                <p className="text-sm text-[#0F172A] font-bold">Comparativa de ingresos en el tiempo</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex p-1 bg-surface-container-low rounded-xl">
                  {['day', 'week', 'month', 'custom'].map((filter) => (
                    <button 
                      key={filter}
                      onClick={() => setTimeFilter(filter as any)}
                      className={`px-5 py-2 text-xs font-black rounded-lg transition-all flex items-center gap-2 ${timeFilter === filter ? 'bg-white shadow-sm text-secondary' : 'text-on-surface-variant hover:text-[#0F172A]'}`}
                    >
                      {filter === 'custom' && <Calendar className="w-3 h-3" />}
                      {filter === 'day' ? 'Día' : filter === 'week' ? 'Semana' : filter === 'month' ? 'Mes' : 'Personalizado'}
                    </button>
                  ))}
                </div>
                {timeFilter === 'custom' && (
                  <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-xl">
                    <input 
                      type="date" 
                      value={customDateRange.start}
                      onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="bg-white px-3 py-1.5 rounded-lg text-xs font-bold text-[#0F172A] border-none outline-none focus:ring-2 focus:ring-secondary/50"
                    />
                    <span className="text-xs font-bold text-on-surface-variant">a</span>
                    <input 
                      type="date" 
                      value={customDateRange.end}
                      onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="bg-white px-3 py-1.5 rounded-lg text-xs font-bold text-[#0F172A] border-none outline-none focus:ring-2 focus:ring-secondary/50"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="h-64 w-full flex items-end justify-between gap-4 px-2 relative border-b border-secondary/20">
              <div className="absolute inset-x-0 top-0 border-t border-dashed border-outline-variant/10 h-1/4 w-full"></div>
              <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-outline-variant/10 h-1/4 w-full"></div>
              <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-outline-variant/10 h-1/4 w-full"></div>
              <div className="absolute inset-x-0 top-3/4 border-t border-dashed border-outline-variant/10 h-1/4 w-full"></div>
              
              {chartData.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group cursor-pointer h-full justify-end">
                  <div 
                    style={{ height: item.heightStyle }}
                    className={`w-full ${item.active ? 'bg-secondary' : item.highlight ? 'bg-secondary/80' : 'bg-surface-container-high'} rounded-t-xl group-hover:opacity-80 transition-all relative min-h-[10%]`}
                  >
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white px-3 py-1.5 rounded-lg text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {item.val}
                    </div>
                  </div>
                  <span className={`text-[11px] font-black ${item.active ? 'text-secondary' : 'text-[#0F172A]'} uppercase tracking-wider`}>{item.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-center justify-between text-xs text-[#0F172A] border-t border-outline-variant/10 pt-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-secondary"></span>
                  <span className="font-black">Ventas Actuales</span>
                </div>
              </div>
              <button onClick={() => setCurrentPage('history')} className="font-black text-secondary cursor-pointer flex items-center gap-1 hover:underline">
                Ver detalles de transacciones <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-md border border-secondary/15">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black font-headline text-[#0F172A]">Top <span className="text-secondary">Productos</span></h3>
              <button className="hover:bg-surface-container-low p-1.5 rounded-full transition-colors">
                <Settings className="w-5 h-5 text-outline" />
              </button>
            </div>
            <div className="space-y-7">
              {topProducts.length > 0 ? topProducts.map((p, i) => (
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
              )) : (
                <p className="text-sm text-on-surface-variant text-center py-4">No hay ventas en este período.</p>
              )}
            </div>
            <button onClick={() => setCurrentPage('inventory')} className="w-full mt-10 py-3.5 bg-surface-container-low text-secondary font-black text-xs rounded-xl hover:bg-secondary hover:text-white transition-all uppercase tracking-widest shadow-sm">
              Ver Inventario Completo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-white p-8 rounded-[2rem] border border-secondary/15 shadow-md">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black font-headline text-[#0F172A]">Estado de <span className="text-secondary">Inventario Local</span></h3>
              <div className={`flex items-center gap-2 text-xs font-black px-3 py-1.5 rounded-lg ${inventoryHealth.critical > 20 ? 'bg-red-50 text-error' : 'bg-green-50 text-[#0F172A]'}`}>
                <span className={`w-2 h-2 rounded-full ${inventoryHealth.critical > 20 ? 'bg-error' : 'bg-green-500'}`}></span>
                {inventoryHealth.critical > 20 ? 'Atención Requerida' : 'Optimizado'}
              </div>
            </div>
            <div className="flex flex-col gap-6">
              {[
                { label: 'Stock Saludable', val: inventoryHealth.healthy, color: 'bg-green-500' },
                { label: 'Stock Bajo (Alerta)', val: inventoryHealth.low, color: 'bg-secondary' },
                { label: 'Sin Stock (Crítico)', val: inventoryHealth.critical, color: 'bg-error' }
              ].map((item) => (
                <div key={item.label} className="space-y-3">
                  <div className="flex justify-between text-xs font-black uppercase tracking-wider text-[#0F172A]">
                    <span>{item.label}</span>
                    <span className={item.color.replace('bg-', 'text-')}>{item.val}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-surface-container-low rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${item.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div onClick={() => setShowCriticalStockModal(true)} className="mt-8 p-5 bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer rounded-2xl flex items-start gap-4 border border-secondary/15">
              <div className="p-2 bg-secondary/5 rounded-lg"><Zap className="w-5 h-5 text-secondary" /></div>
              <div>
                <p className="text-sm font-black text-[#0F172A]">Recomendación de Compra</p>
                <p className="text-xs text-[#0F172A] font-bold mt-1 leading-relaxed">
                  {lowStockProducts.length > 0 
                    ? `Se sugiere reponer ${lowStockProducts[0].name} y otros ${lowStockProducts.length - 1} productos para evitar quiebre de stock.`
                    : 'El inventario se encuentra en niveles óptimos. No hay recomendaciones de compra urgentes.'}
                </p>
              </div>
            </div>
            <div onClick={() => setShowStagnantModal(true)} className={`mt-4 p-5 bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer rounded-2xl flex items-start gap-4 border ${stagnantProducts.length > 0 ? 'border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'border-outline-variant/10'}`}>
              <div className="relative">
                {stagnantProducts.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                  </span>
                )}
                <div className="p-2 bg-orange-50 rounded-lg"><History className="w-5 h-5 text-orange-500" /></div>
              </div>
              <div>
                <p className="text-sm font-black text-[#0F172A]">Alerta de Estancamiento</p>
                <p className="text-xs text-[#0F172A] font-bold mt-1 leading-relaxed">
                  {stagnantProducts.length > 0 
                    ? `Hay ${stagnantProducts.length} productos sin ventas en los últimos 15 días. Capital inmovilizado: $${stuckCapital.toLocaleString('es-CL')}.`
                    : 'Excelente rotación. Todos tus productos se han movido en los últimos 15 días.'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#0F172A] p-8 rounded-[2rem] text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-black font-headline">Resumen de <span className="text-secondary-container">Rentabilidad</span></h3>
                  <p className="text-sm text-white/50 font-bold">Información consolidada de tu negocio ({timeFilter === 'day' ? 'Hoy' : timeFilter === 'week' ? 'Últimos 7 días' : 'Últimos 30 días'})</p>
                </div>
                <TrendingUp className="w-6 h-6 text-white/20" />
              </div>
              <div className="grid grid-cols-2 gap-10 mt-10">
                <div>
                  <p className="text-xs font-black text-white/40 uppercase tracking-widest mb-2">Ingresos Netos</p>
                  <p className="text-4xl font-black font-headline tabular-nums">${totalSales.toLocaleString('es-CL')}</p>
                </div>
                <div>
                  <p className="text-xs font-black text-white/40 uppercase tracking-widest mb-2">Valor Inventario</p>
                  <p className="text-4xl font-black font-headline tabular-nums text-blue-400">${totalInventoryValue.toLocaleString('es-CL')}</p>
                  <p className="text-[10px] text-white/40 mt-2 font-black uppercase tracking-wider">Costo total almacenado</p>
                </div>
              </div>
              <div className="mt-12 pt-10 border-t border-white/10">
                <div className="flex items-center justify-between">
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
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-secondary/10 rounded-full blur-[80px]"></div>
            <div className="absolute -left-20 -top-20 w-64 h-64 bg-blue-500/5 rounded-full blur-[60px]"></div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showTransactionsModal && (
          <Modal title={<>Transacciones <span className="text-secondary">Totales</span></>} subtitle="Detalle de ventas en el período seleccionado" onClose={() => setShowTransactionsModal(false)}>
             <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6 flex gap-3 items-start">
               <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
               <div>
                 <p className="text-sm font-bold text-blue-900">¿Qué estoy viendo?</p>
                 <p className="text-xs text-blue-800 mt-1">Este es el registro de cada venta individual que has realizado. Te ayuda a entender el volumen de actividad de tu negocio.</p>
               </div>
             </div>
             {filteredSales.length > 0 ? (
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
                       <td className="py-4">
                         <span className={`px-3 py-1 rounded-full text-xs font-black ${sale.paymentMethod === 'Efectivo' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{sale.paymentMethod}</span>
                       </td>
                       <td className="py-4 text-sm font-black text-[#0F172A] text-right">${sale.total.toLocaleString('es-CL')}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             ) : <p className="text-center py-10 text-[#0F172A]/60 font-bold">No hay transacciones.</p>}
          </Modal>
        )}

        {showCriticalStockModal && (
          <Modal title={<>Stock <span className="text-secondary">Crítico</span> y <span className="text-orange-500">Proyecciones</span></>} subtitle="Productos por agotarse o con menos de 10 unidades" onClose={() => setShowCriticalStockModal(false)}>
             <div className="bg-red-50 border border-red-100 p-4 rounded-xl mb-6 flex gap-3 items-start">
               <Info className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
               <div>
                 <p className="text-sm font-bold text-red-900">Inteligencia de Inventario</p>
                 <p className="text-xs text-red-800 mt-1">El sistema calcula tu velocidad de venta basándose en los últimos 30 días.</p>
               </div>
             </div>
             {lowStockProducts.length > 0 ? (
               <div className="space-y-4">
                 {lowStockProducts.map((product: any, i) => (
                   <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border ${product.stock === 0 ? 'border-error/50 bg-red-50' : product.daysUntilDepletion <= 3 ? 'border-orange-500/30 bg-orange-50/30' : 'border-outline-variant/20 bg-surface-container-lowest'}`}>
                     <div className="w-16 h-16 rounded-xl bg-white overflow-hidden flex-shrink-0 border border-outline-variant/10">
                       <img alt={product.name} className="w-full h-full object-cover" src={product.image} />
                     </div>
                     <div className="flex-1">
                       <h4 className="text-base font-black text-[#0F172A]">{product.name}</h4>
                       <div className="flex gap-4 mt-1">
                         <p className="text-xs text-[#0F172A]/60 font-bold">Stock actual: <span className={product.stock === 0 ? 'text-error font-black' : 'text-[#0F172A] font-black'}>{product.stock} un.</span></p>
                         <p className="text-xs text-[#0F172A]/60 font-bold">Velocidad: <span className="text-[#0F172A] font-black">{product.dailyVelocity.toFixed(1)} un/día</span></p>
                       </div>
                     </div>
                     <div className="text-right flex flex-col items-end">
                       {product.stock === 0 ? <span className="px-3 py-1 bg-error text-white text-xs font-black rounded-lg">Agotado</span> : product.daysUntilDepletion === Infinity ? <span className="px-3 py-1 bg-surface-container-low text-[#0F172A] text-xs font-black rounded-lg">Sin ventas</span> : (
                         <div className="text-center">
                           <p className={`text-2xl font-black tabular-nums leading-none ${product.daysUntilDepletion <= 3 ? 'text-orange-600' : 'text-[#0F172A]'}`}>{product.daysUntilDepletion}</p>
                           <p className="text-[10px] font-black uppercase tracking-wider text-[#0F172A]/50 mt-1">Días para agotar</p>
                         </div>
                       )}
                     </div>
                   </div>
                 ))}
               </div>
             ) : <p className="text-center py-10 text-[#0F172A]/60 font-bold">Todo en orden.</p>}
          </Modal>
        )}

        {showRevenueModal && (
          <Modal title={<>Ingresos <span className="text-secondary">Totales</span></>} subtitle="Desglose de ingresos por método de pago" onClose={() => setShowRevenueModal(false)}>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
               {Object.entries(revenueByMethod).length === 0 ? (
                 <p className="col-span-2 text-center py-6 text-[#0F172A]/60 font-bold">No hay ventas en este período.</p>
               ) : Object.entries(revenueByMethod).sort((a, b) => (b[1] as number) - (a[1] as number)).map(([method, amount]) => {
                 const cfg: Record<string, { icon: React.ReactNode, bg: string, iconBg: string }> = {
                   'Efectivo': { icon: <Banknote className="w-5 h-5 text-green-700" />, bg: 'bg-surface-container-lowest', iconBg: 'bg-green-100' },
                   'Tarjeta': { icon: <CreditCard className="w-5 h-5 text-blue-700" />, bg: 'bg-surface-container-lowest', iconBg: 'bg-blue-100' },
                   'Fiado': { icon: <Receipt className="w-5 h-5 text-orange-700" />, bg: 'bg-orange-50', iconBg: 'bg-orange-100' },
                   'Pluxee': { icon: <CreditCard className="w-5 h-5 text-[#ff5e00]" />, bg: 'bg-surface-container-lowest', iconBg: 'bg-orange-50' },
                   'AmiPass': { icon: <CreditCard className="w-5 h-5 text-pink-700" />, bg: 'bg-surface-container-lowest', iconBg: 'bg-pink-100' },
                 };
                 const style = cfg[method] || { icon: <CreditCard className="w-5 h-5 text-secondary" />, bg: 'bg-surface-container-lowest', iconBg: 'bg-secondary/10' };
                 const pct = totalSales > 0 ? Math.round(((amount as number) / totalSales) * 100) : 0;
                 return (
                   <div key={method} className={`${style.bg} p-6 rounded-2xl border border-outline-variant/10`}>
                     <div className="flex items-center justify-between mb-3">
                       <div className="flex items-center gap-3">
                         <div className={`p-2 ${style.iconBg} rounded-lg`}>{style.icon}</div>
                         <h4 className="font-black text-[#0F172A]">{method}</h4>
                       </div>
                       <span className="text-xs font-black text-[#0F172A]/40 bg-surface-container-low px-2 py-1 rounded-full">{pct}%</span>
                     </div>
                     <p className="text-3xl font-black font-headline tabular-nums text-[#0F172A]">${(amount as number).toLocaleString('es-CL')}</p>
                   </div>
                 );
               })}
             </div>
             <div className="bg-[#0F172A] p-6 rounded-2xl text-white flex justify-between items-center">
               <div>
                 <p className="text-xs font-black text-white/50 uppercase tracking-wider mb-1">Total Ingresos</p>
                 <p className="text-4xl font-black font-headline tabular-nums">${totalSales.toLocaleString('es-CL')}</p>
               </div>
               <TrendingUp className="w-12 h-12 text-secondary/50" />
             </div>
          </Modal>
        )}

        {showProfitModal && (
          <Modal title={<>Utilidad <span className="text-secondary">Total</span></>} subtitle="Productos que generaron mayor ganancia" onClose={() => setShowProfitModal(false)}>
             <div className="flex items-center justify-between p-6 bg-green-50 rounded-2xl border border-green-200 mb-6">
               <div>
                 <p className="text-xs font-black text-green-800 uppercase tracking-wider mb-1">Ganancia Neta Total</p>
                 <p className="text-4xl font-black font-headline tabular-nums text-green-700">${totalProfit.toLocaleString('es-CL')}</p>
               </div>
               <div className="text-right">
                 <p className="text-xs font-black text-green-800 uppercase tracking-wider mb-1">Margen Promedio</p>
                 <p className="text-3xl font-black font-headline tabular-nums text-green-700">{profitMargin}%</p>
               </div>
             </div>
             <div className="space-y-3">
               {profitByProduct.slice(0, 10).map((product, i) => (
                 <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container-lowest transition-colors border border-transparent hover:border-outline-variant/10">
                   <div className="w-12 h-12 rounded-lg bg-surface-container-low overflow-hidden flex-shrink-0">
                     <img alt={product.name} className="w-full h-full object-cover" src={product.image} />
                   </div>
                   <div className="flex-1">
                     <h5 className="text-sm font-black text-[#0F172A]">{product.name}</h5>
                     <p className="text-xs text-[#0F172A]/60 font-bold">{product.quantity} unidades vendidas</p>
                   </div>
                   <div className="text-right"><p className="text-base font-black text-green-600">+${product.profit.toLocaleString('es-CL')}</p></div>
                 </div>
               ))}
             </div>
          </Modal>
        )}

        {showRotationModal && (
          <Modal title={<>Nivel de <span className="text-amber-600">Rotación</span></>} subtitle="Análisis de fluidez de inventario" onClose={() => setShowRotationModal(false)}>
             <div className="flex items-center justify-between p-6 bg-amber-50 rounded-2xl border border-amber-200 mb-6">
               <div>
                 <p className="text-xs font-black text-amber-800 uppercase tracking-wider mb-1">Rotación Global</p>
                 <p className="text-4xl font-black font-headline tabular-nums text-amber-700">{rotationRate}%</p>
               </div>
               <div className="text-right">
                 <p className="text-xs font-black text-amber-800 uppercase tracking-wider mb-1">Unidades Vendidas</p>
                 <p className="text-3xl font-black font-headline tabular-nums text-amber-700">{totalUnitsSold}</p>
               </div>
             </div>
             <div className="space-y-3">
               {inventory
                 .map(item => {
                   const sold = filteredSales.reduce((sum, sale) => {
                     const saleItem = sale.cart.find((i: any) => i.sku === item.sku);
                     return sum + (saleItem ? saleItem.quantity : 0);
                   }, 0);
                   const total = sold + item.stock;
                   const rate = total > 0 ? Math.round((sold / total) * 100) : 0;
                   return { ...item, sold, rate };
                 })
                 .sort((a, b) => b.rate - a.rate)
                 .slice(0, 5)
                 .map((product, i) => (
                   <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/10">
                     <div className="w-12 h-12 rounded-lg bg-surface-container-low overflow-hidden flex-shrink-0">
                       <img alt={product.name} className="w-full h-full object-cover" src={product.image} />
                     </div>
                     <div className="flex-1">
                       <h5 className="text-sm font-black text-[#0F172A]">{product.name}</h5>
                       <p className="text-xs text-[#0F172A]/60 font-bold">Stock: {product.stock} | Vendidos: {product.sold}</p>
                     </div>
                     <div className="text-right"><p className="text-base font-black text-amber-600">{product.rate}%</p></div>
                   </div>
                 ))}
             </div>
          </Modal>
        )}

        {showStagnantModal && (
          <Modal title={<>Inventario <span className="text-orange-500">Estancado</span></>} subtitle="Productos sin ventas en los últimos 15 días" onClose={() => setShowStagnantModal(false)}>
             <div className="flex items-center justify-between p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 mb-6">
               <div>
                 <p className="text-xs font-black text-[#0F172A]/50 uppercase tracking-wider mb-1">Capital Inmovilizado Total</p>
                 <p className="text-4xl font-black font-headline tabular-nums text-orange-600">${stuckCapital.toLocaleString('es-CL')}</p>
               </div>
               <div className="text-right">
                 <p className="text-xs font-black text-[#0F172A]/50 uppercase tracking-wider mb-1">SKUs Estancados</p>
                 <p className="text-3xl font-black font-headline tabular-nums text-[#0F172A]">{stagnantProducts.length}</p>
               </div>
             </div>
             <div className="space-y-3">
               {stagnantProducts.map((product, i) => (
                 <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container-lowest transition-colors border border-transparent hover:border-outline-variant/10">
                   <div className="w-12 h-12 rounded-lg bg-surface-container-low overflow-hidden flex-shrink-0">
                     <img alt={product.name} className="w-full h-full object-cover" src={product.image} />
                   </div>
                   <div className="flex-1">
                     <h5 className="text-sm font-black text-[#0F172A]">{product.name}</h5>
                     <p className="text-xs text-[#0F172A]/60 font-bold">Stock actual: {product.stock} unidades</p>
                   </div>
                   <div className="text-right">
                     <p className="text-base font-black text-orange-600">${(product.stock * product.cost).toLocaleString('es-CL')}</p>
                   </div>
                 </div>
               ))}
             </div>
          </Modal>
        )}

        {showCashHistoryModal && (
          <Modal title={<>Historial de <span className="text-secondary">Cierres de Caja</span></>} subtitle="Registro detallado de aperturas, cierres y discrepancias." onClose={() => setShowCashHistoryModal(false)} wide>
             {cashHistory.length === 0 ? <p className="text-center py-10 text-[#0F172A]/40">No hay registros.</p> : (
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-separate border-spacing-y-3">
                   <thead>
                     <tr className="text-[10px] font-black text-[#0F172A]/40 uppercase tracking-widest">
                       <th className="px-4 py-2">Fecha Cierre</th>
                       <th className="px-4 py-2">Usuario</th>
                       <th className="px-4 py-2 text-right">M. Inicial</th>
                       <th className="px-4 py-2 text-right">Esperado</th>
                       <th className="px-4 py-2 text-right">Real</th>
                       <th className="px-4 py-2 text-right">Diferencia</th>
                       <th className="px-4 py-2 text-center">Estado</th>
                     </tr>
                   </thead>
                   <tbody>
                     {cashHistory.map((record) => (
                       <tr key={record.id} className="bg-surface-container-lowest hover:bg-surface-container-low transition-colors group">
                         <td className="px-4 py-4 rounded-l-2xl">
                           <div className="text-sm font-black text-[#0F172A]">{new Date(record.closedAt).toLocaleDateString('es-CL')}</div>
                           <div className="text-[10px] font-bold text-[#0F172A]/50">{new Date(record.closedAt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</div>
                         </td>
                         <td className="px-4 py-4"><div className="text-sm font-bold text-[#0F172A]">{record.user}</div></td>
                         <td className="px-4 py-4 text-right"><div className="text-sm font-medium text-[#0F172A]/70">${record.initialCash.toLocaleString('es-CL')}</div></td>
                         <td className="px-4 py-4 text-right"><div className="text-sm font-black text-[#0F172A]">${record.expectedCash.toLocaleString('es-CL')}</div></td>
                         <td className="px-4 py-4 text-right"><div className="text-sm font-black text-secondary">${record.actualCash.toLocaleString('es-CL')}</div></td>
                         <td className="px-4 py-4 text-right"><div className={`text-sm font-black ${record.difference === 0 ? 'text-green-600' : (record.difference > 0 ? 'text-blue-600' : 'text-error')}`}>{record.difference > 0 ? '+' : ''}{record.difference.toLocaleString('es-CL')}</div></td>
                         <td className="px-4 py-4 rounded-r-2xl text-center">
                           <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${record.status === 'Cuadrada' ? 'bg-green-100 text-green-700' : (record.status === 'Sobrante' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700')}`}>{record.status}</span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             )}
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

const Modal = ({ title, subtitle, onClose, children, wide = false }: { title: React.ReactNode, subtitle: string, onClose: () => void, children: React.ReactNode, wide?: boolean }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-sm">
    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className={`bg-white rounded-3xl p-8 ${wide ? 'max-w-4xl' : 'max-w-3xl'} w-full shadow-2xl max-h-[85vh] flex flex-col`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-black text-[#0F172A] font-headline">{title}</h3>
          <p className="text-sm font-bold text-[#0F172A]/70">{subtitle}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-surface-container-low rounded-full transition-colors"><X className="w-6 h-6 text-[#0F172A]" /></button>
      </div>
      <div className="overflow-y-auto flex-1 pr-2">{children}</div>
    </motion.div>
  </motion.div>
);
