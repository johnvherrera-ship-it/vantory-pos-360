/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Menu, TrendingUp, Package, Zap, LineChart, Cloud, Check, ArrowRight, Database, Barcode, Users, Monitor, History, ArrowLeft, Globe, Laptop, Instagram, MessageCircle, ArrowUp, ArrowDown, Calendar, X, Shield, FileText, ExternalLink, Eye, EyeOff, LayoutGrid, LayoutDashboard, LogIn, Receipt, Settings, HelpCircle, UserCog, LogOut, Bell, ScanBarcode, Plus, Banknote, CreditCard, CheckCircle, Search, Filter, ChevronLeft, ChevronRight, Edit, Trash2, UploadCloud, Download, Printer, QrCode, ShoppingBag, BarChart3, UserPlus, Info, MinusCircle, Star, Wallet, Scan, ShoppingCart, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';
import { LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const Logo = ({ onClick, className = "", light = false }: { onClick?: () => void, className?: string, light?: boolean }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 font-headline cursor-pointer group ${className}`}
  >
    <div className="relative">
      <div className={`w-10 h-10 ${light ? 'bg-white text-secondary' : 'bg-secondary text-white'} rounded-xl flex items-center justify-center shadow-lg ${light ? 'shadow-white/10' : 'shadow-secondary/20'} group-hover:rotate-12 transition-transform duration-500`}>
        <Zap className="w-6 h-6 fill-current" />
      </div>
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        className={`absolute -inset-1 ${light ? 'bg-white/20' : 'bg-secondary/30'} blur-md rounded-xl -z-10`}
      ></motion.div>
    </div>
    <div className="flex flex-col leading-none">
      <span className={`text-2xl font-black tracking-tighter ${light ? 'text-white' : 'text-[#0F172A]'} group-hover:text-secondary transition-colors`}>VANTORY</span>
      <div className="flex items-center gap-1">
        <span className={`text-[11px] font-bold tracking-[0.2em] ${light ? 'text-white/80' : 'text-secondary'} uppercase`}>POS 360</span>
        <motion.div 
          animate={{ width: [8, 24, 8] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`h-0.5 ${light ? 'bg-white/50' : 'bg-secondary'} rounded-full`}
        ></motion.div>
      </div>
    </div>
  </div>
);

const SideNavBar = ({ currentPage, setCurrentPage, currentUser, users, setCurrentUser, currentStore, currentPOS }: { currentPage: string, setCurrentPage: (page: any) => void, currentUser?: any, users?: any[], setCurrentUser?: (user: any) => void, currentStore?: any, currentPOS?: any }) => {
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

        <div className="px-6 mb-2 mt-8 text-[11px] font-black text-white/60 uppercase tracking-[0.25em] flex items-center gap-2 animate-pulse drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
          Sistema
          <div className="h-[1px] flex-1 bg-white/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-white/40 animate-slide-bright"></div>
          </div>
        </div>
        <NavItem page="users" icon={Users} label="Usuarios" />
      </nav>
      
      <div className="mt-auto px-6 border-t border-white/10 pt-6">
        <button 
          onClick={() => {
            setCurrentUser(null);
            setCurrentPage('home');
          }}
          className="w-full flex items-center justify-center gap-2 bg-white/10 text-white py-3 rounded-xl font-bold text-sm hover:bg-white/20 transition-all cursor-pointer border border-white/20"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

const Lobby = ({ stores, posMachines, setCurrentStore, setCurrentPOS, setCurrentPage, currentUser }: any) => {
  const [step, setStep] = useState<'select-store' | 'enter-pin' | 'select-pos'>('select-store');
  const [selectedStoreTemp, setSelectedStoreTemp] = useState<any>(null);
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');

  const handleStoreSelect = (store: any) => {
    setSelectedStoreTemp(store);
    setStep('enter-pin');
    setPinInput('');
    setError('');
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === selectedStoreTemp.pin) {
      setStep('select-pos');
      setError('');
    } else {
      setError('PIN incorrecto');
      setPinInput('');
    }
  };

  const handlePosSelect = (pos: any) => {
    setCurrentStore(selectedStoreTemp);
    setCurrentPOS(pos);
    setCurrentPage('dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-surface-container-low rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-primary-fixed opacity-30 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="font-headline font-extrabold text-3xl tracking-tighter text-on-surface mb-2">
            Hola, {currentUser?.name?.split(' ')[0] || 'Usuario'} 👋
          </h1>
          <p className="font-label font-medium text-on-surface-variant text-lg tracking-wide">
            {step === 'select-store' && '¿En qué local trabajaremos hoy?'}
            {step === 'enter-pin' && `Ingresa el PIN para ${selectedStoreTemp?.name}`}
            {step === 'select-pos' && '¿Qué caja vas a utilizar?'}
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-xl border border-outline-variant/10">
          <AnimatePresence mode="wait">
            {step === 'select-store' && (
              <motion.div
                key="select-store"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {stores.map((store: any) => (
                  <button
                    key={store.id}
                    onClick={() => handleStoreSelect(store)}
                    className="p-6 text-left rounded-xl border-2 border-outline-variant/20 hover:border-secondary hover:bg-secondary/5 transition-all group"
                  >
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
                        <Globe className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-on-surface">{store.name}</h3>
                        <p className="text-sm text-on-surface-variant">{store.address}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}

            {step === 'enter-pin' && (
              <motion.div
                key="enter-pin"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-xs mx-auto"
              >
                <form onSubmit={handlePinSubmit} className="space-y-6">
                  <div className="text-center">
                    <input
                      type="password"
                      maxLength={4}
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                      className="w-full text-center text-4xl tracking-[1em] font-black bg-surface-container-lowest border-b-4 border-outline-variant/30 focus:border-secondary outline-none py-4 transition-colors"
                      placeholder="••••"
                      autoFocus
                    />
                    {error && <p className="text-error text-sm font-bold mt-2">{error}</p>}
                  </div>
                  
                  {/* Keypad */}
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => {
                          if (pinInput.length < 4) setPinInput(prev => prev + num);
                        }}
                        className="py-4 text-2xl font-bold bg-surface-container-low hover:bg-surface-container-high rounded-xl transition-colors"
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setStep('select-store')}
                      className="py-4 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (pinInput.length < 4) setPinInput(prev => prev + '0');
                      }}
                      className="py-4 text-2xl font-bold bg-surface-container-low hover:bg-surface-container-high rounded-xl transition-colors"
                    >
                      0
                    </button>
                    <button
                      type="button"
                      onClick={() => setPinInput(prev => prev.slice(0, -1))}
                      className="py-4 text-sm font-bold text-error hover:bg-error/10 rounded-xl transition-colors flex items-center justify-center"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={pinInput.length !== 4}
                    className="w-full py-4 bg-secondary text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-on-secondary-container transition-colors"
                  >
                    Ingresar
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'select-pos' && (
              <motion.div
                key="select-pos"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {posMachines.filter((p: any) => p.storeId === selectedStoreTemp?.id).map((pos: any) => (
                  <button
                    key={pos.id}
                    onClick={() => handlePosSelect(pos)}
                    className="p-6 flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-outline-variant/20 hover:border-secondary hover:bg-secondary/5 transition-all group"
                  >
                    <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
                      <Monitor className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-xl text-on-surface">{pos.name}</h3>
                  </button>
                ))}
                <button
                  onClick={() => setStep('select-store')}
                  className="p-6 flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-outline-variant/30 hover:border-outline-variant transition-all text-on-surface-variant"
                >
                  <ArrowLeft className="w-8 h-8" />
                  <span className="font-bold">Volver</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const SuperAdminDashboard = ({ setCurrentPage, vantoryClients, currentUser }: any) => {
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
          <a onClick={() => setCurrentPage('superadmin-dashboard')} className={`flex items-center gap-3 py-3 px-6 my-1 transition-all cursor-pointer rounded-xl mx-4 bg-white/20 text-white shadow-lg`}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-base font-bold font-body">Métricas</span>
          </a>
          <a onClick={() => setCurrentPage('superadmin-clients')} className={`flex items-center gap-3 py-3 px-6 my-1 transition-all cursor-pointer rounded-xl mx-4 text-white/70 hover:bg-white/10 hover:text-white`}>
            <Users className="w-5 h-5" />
            <span className="text-base font-bold font-body">Clientes SaaS</span>
          </a>
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

const SuperAdminClients = ({ setCurrentPage, vantoryClients, setVantoryClients, setCurrentUser, setSelectedClient }: any) => {
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);

  const handleSaveClient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const newClient = {
      id: editingClient ? editingClient.id : Date.now(),
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      maxStores: parseInt((form.elements.namedItem('maxStores') as HTMLInputElement).value),
      maxPosPerStore: parseInt((form.elements.namedItem('maxPosPerStore') as HTMLInputElement).value),
      mrr: parseInt((form.elements.namedItem('mrr') as HTMLInputElement).value),
      status: editingClient ? editingClient.status : 'Activo',
      joinDate: editingClient ? editingClient.joinDate : new Date().toISOString().split('T')[0],
    };

    if (editingClient) {
      setVantoryClients(vantoryClients.map((c: any) => c.id === editingClient.id ? newClient : c));
    } else {
      setVantoryClients([...vantoryClients, newClient]);
    }
    setShowModal(false);
    setEditingClient(null);
  };

  const toggleStatus = (id: number) => {
    setVantoryClients(vantoryClients.map((c: any) => {
      if (c.id === id) {
        return { ...c, status: c.status === 'Activo' ? 'Suspendido' : 'Activo' };
      }
      return c;
    }));
  };

  const impersonateClient = (client: any) => {
    // Mock impersonation: set current user to the client's admin email and go to dashboard
    setCurrentUser({ name: client.name, email: client.email, role: 'Administrador', modules: ['dashboard', 'inventory', 'sales', 'history', 'entries', 'kpis', 'users', 'fiados'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfLVv6ohrtIE1tV50hhfzyQoC_-ADrxKzmlZGDV-3q0wsLG0oX1rxHZAoGZubgfK_a8kAW7lNR4uR2hH9puFiqXk8uIk4cma4AtWee_CyfKF6Xp6ht64UImKASzqOvK5H9W5VV4O0aN6kidyheXojT3g5eweScDgb6ozL_VXSkV-76BPplDQ5Tv0RM7pj3-HTx49aYz2-_7Ugx32bVbSsdFpsgKrwX2L-igWxXkTVYVROb1d68R9o1_2kMqMveMbfIrDNeV36iemdh' });
    setCurrentPage('dashboard'); // Bypass lobby for impersonation simplicity
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Super Admin Sidebar */}
      <aside className="w-64 bg-secondary/95 backdrop-blur-md flex flex-col py-6 shadow-2xl border-r border-white/10">
        <div className="px-6 mb-8">
          <Logo onClick={() => {}} light={true} />
          <p className="text-white/60 text-xs font-bold tracking-widest mt-2 uppercase">Backoffice</p>
        </div>
        <nav className="flex-1">
          <a onClick={() => setCurrentPage('superadmin-dashboard')} className={`flex items-center gap-3 py-3 px-6 my-1 transition-all cursor-pointer rounded-xl mx-4 text-white/70 hover:bg-white/10 hover:text-white`}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-base font-bold font-body">Métricas</span>
          </a>
          <a onClick={() => setCurrentPage('superadmin-clients')} className={`flex items-center gap-3 py-3 px-6 my-1 transition-all cursor-pointer rounded-xl mx-4 bg-white/20 text-white shadow-lg`}>
            <Users className="w-5 h-5" />
            <span className="text-base font-bold font-body">Clientes SaaS</span>
          </a>
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
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black text-[#0F172A] font-headline mb-1">Gestión de <span className="text-secondary">Clientes</span></h2>
            <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-3">PANEL MAESTRO &gt; CLIENTES SAAS</p>
          </div>
          <button onClick={() => { setEditingClient(null); setShowModal(true); }} className="bg-secondary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-secondary/90 transition-colors shadow-lg">
            <Plus className="w-5 h-5" />
            Nuevo Cliente
          </button>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-outline-variant/20">
                  <th className="p-4 font-bold text-on-surface-variant text-sm">Empresa</th>
                  <th className="p-4 font-bold text-on-surface-variant text-sm">Límites (Locales/Cajas)</th>
                  <th className="p-4 font-bold text-on-surface-variant text-sm">MRR</th>
                  <th className="p-4 font-bold text-on-surface-variant text-sm">Estado</th>
                  <th className="p-4 font-bold text-on-surface-variant text-sm text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {vantoryClients.map((client: any) => (
                  <tr key={client.id} className={`border-b border-outline-variant/10 hover:bg-surface-container-lowest/50 transition-colors ${client.status === 'Suspendido' ? 'opacity-60' : ''}`}>
                    <td className="p-4">
                      <p className="font-bold text-on-surface">{client.name}</p>
                      <p className="text-xs text-on-surface-variant">{client.email}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3 text-sm font-medium">
                        <span className="flex items-center gap-1"><Globe className="w-4 h-4 text-on-surface-variant" /> {client.maxStores}</span>
                        <span className="flex items-center gap-1"><Monitor className="w-4 h-4 text-on-surface-variant" /> {client.maxPosPerStore}</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-on-surface">
                      ${client.mrr.toLocaleString('es-CL')}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${client.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setSelectedClient(client); setCurrentPage('superadmin-client-profile'); }} title="Ver Perfil Completo" className="p-2 text-on-surface-variant hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button onClick={() => impersonateClient(client)} title="Ingresar como Cliente" className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                          <LogIn className="w-5 h-5" />
                        </button>
                        <button onClick={() => { setEditingClient(client); setShowModal(true); }} title="Editar Licencia" className="p-2 text-on-surface-variant hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => toggleStatus(client.id)} title={client.status === 'Activo' ? 'Suspender' : 'Activar'} className={`p-2 rounded-lg transition-colors ${client.status === 'Activo' ? 'text-error hover:bg-error/10' : 'text-green-600 hover:bg-green-100'}`}>
                          {client.status === 'Activo' ? <MinusCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Client Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20"
            >
              <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-lowest">
                <h3 className="text-2xl font-black font-headline">
                  {editingClient ? 'Editar Cliente SaaS' : 'Nuevo Cliente SaaS'}
                </h3>
                <button onClick={() => { setShowModal(false); setEditingClient(null); }} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSaveClient} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-on-surface-variant mb-1">Nombre de la Empresa</label>
                    <input name="name" defaultValue={editingClient?.name} required className="w-full p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary outline-none font-medium" placeholder="Ej. Minimarket Don Tito" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-on-surface-variant mb-1">Correo Administrador</label>
                    <input type="email" name="email" defaultValue={editingClient?.email} required className="w-full p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary outline-none font-medium" placeholder="admin@empresa.cl" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-on-surface-variant mb-1">MRR (Mensualidad $)</label>
                    <input type="number" name="mrr" defaultValue={editingClient?.mrr || 29990} required className="w-full p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary outline-none font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-on-surface-variant mb-1">Locales Máximos</label>
                    <input type="number" name="maxStores" defaultValue={editingClient?.maxStores || 1} required min="1" className="w-full p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary outline-none font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-on-surface-variant mb-1">Cajas por Local</label>
                    <input type="number" name="maxPosPerStore" defaultValue={editingClient?.maxPosPerStore || 1} required min="1" className="w-full p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary outline-none font-medium" />
                  </div>
                </div>
                
                <div className="pt-6 flex gap-3">
                  <button type="button" onClick={() => { setShowModal(false); setEditingClient(null); }} className="flex-1 py-3 px-4 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl font-bold transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" className="flex-1 py-3 px-4 bg-secondary hover:bg-secondary/90 text-white rounded-xl font-bold transition-colors shadow-md">
                    Guardar Cliente
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SuperAdminClientProfile = ({ client, setCurrentPage, stores, setStores, posMachines, setPosMachines, vantoryClients, setVantoryClients, users, setUsers }: any) => {
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showPosModal, setShowPosModal] = useState(false);
  const [selectedStoreForPos, setSelectedStoreForPos] = useState<number | null>(null);

  // Ensure stores have clientId (for backward compatibility with existing localstorage)
  const clientStores = stores.filter((s: any) => s.clientId === client.id || (!s.clientId && client.id === 1));
  const clientUsers = users.filter((u: any) => u.clientId === client.id);
  
  const [storeError, setStoreError] = useState('');
  const [posError, setPosError] = useState('');
  
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value;
    const role = (form.elements.namedItem('role') as HTMLSelectElement).value;
    const status = (form.elements.namedItem('status') as HTMLSelectElement).value;
    const storeId = (form.elements.namedItem('storeId') as HTMLSelectElement).value;
    
    const modulesCheckboxes = form.querySelectorAll('input[name="modules"]:checked') as NodeListOf<HTMLInputElement>;
    const modules = Array.from(modulesCheckboxes).map(cb => cb.value);

    if (editingUser) {
      setUsers(users.map((u: any) => u.id === editingUser.id ? { ...u, name, email, role, status, modules, storeId: storeId ? parseInt(storeId) : null, ...(password ? { password } : {}) } : u));
    } else {
      setUsers([...users, { 
        id: Date.now(), 
        clientId: client.id,
        storeId: storeId ? parseInt(storeId) : null,
        name, 
        email, 
        password,
        role, 
        status, 
        modules,
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80' 
      }]);
    }
    setShowUserModal(false);
    setEditingUser(null);
  };

  const handleAddStore = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (clientStores.length >= client.maxStores) {
      setStoreError("Límite de locales alcanzado. Aumente el límite en el plan del cliente.");
      return;
    }
    const form = e.currentTarget;
    const newStore = {
      id: Date.now(),
      clientId: client.id,
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      address: (form.elements.namedItem('address') as HTMLInputElement).value,
      pin: (form.elements.namedItem('pin') as HTMLInputElement).value,
    };
    setStores([...stores, newStore]);
    setShowStoreModal(false);
    setStoreError('');
  };

  const handleAddPos = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedStoreForPos) return;
    
    const storePos = posMachines.filter((p: any) => p.storeId === selectedStoreForPos);
    if (storePos.length >= client.maxPosPerStore) {
      setPosError("Límite de cajas por local alcanzado. Aumente el límite en el plan del cliente.");
      return;
    }

    const form = e.currentTarget;
    const newPos = {
      id: Date.now(),
      storeId: selectedStoreForPos,
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
    };
    setPosMachines([...posMachines, newPos]);
    setShowPosModal(false);
    setPosError('');
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Super Admin Sidebar */}
      <aside className="w-64 bg-secondary/95 backdrop-blur-md flex flex-col py-6 shadow-2xl border-r border-white/10">
        <div className="px-6 mb-8">
          <Logo onClick={() => {}} light={true} />
          <p className="text-white/60 text-xs font-bold tracking-widest mt-2 uppercase">Backoffice</p>
        </div>
        <nav className="flex-1">
          <a onClick={() => setCurrentPage('superadmin-dashboard')} className={`flex items-center gap-3 py-3 px-6 my-1 transition-all cursor-pointer rounded-xl mx-4 text-white/70 hover:bg-white/10 hover:text-white`}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-base font-bold font-body">Métricas</span>
          </a>
          <a onClick={() => setCurrentPage('superadmin-clients')} className={`flex items-center gap-3 py-3 px-6 my-1 transition-all cursor-pointer rounded-xl mx-4 bg-white/20 text-white shadow-lg`}>
            <Users className="w-5 h-5" />
            <span className="text-base font-bold font-body">Clientes SaaS</span>
          </a>
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
        <header className="mb-10 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <button onClick={() => setCurrentPage('superadmin-clients')} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                <ArrowLeft className="w-6 h-6 text-on-surface" />
              </button>
              <h2 className="text-3xl font-black text-[#0F172A] font-headline">{client.name}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${client.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {client.status}
              </span>
            </div>
            <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-3 ml-11">PERFIL DE CLIENTE &gt; INFRAESTRUCTURA</p>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={() => { setStoreError(''); setShowStoreModal(true); }} 
                disabled={clientStores.length >= client.maxStores}
                title={clientStores.length >= client.maxStores ? "Límite de locales alcanzado" : "Crear nuevo local"}
                className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg ${clientStores.length >= client.maxStores ? 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed' : 'bg-secondary text-white hover:bg-secondary/90'}`}
             >
                <Plus className="w-5 h-5" />
                Nuevo Local
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20">
            <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4">Suscripción</h3>
            <p className="text-2xl font-black text-on-surface mb-1">${client.mrr.toLocaleString('es-CL')}/mes</p>
            <p className="text-sm font-medium text-on-surface-variant">Facturación mensual</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20">
            <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4">Locales (Uso / Límite)</h3>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-black text-on-surface">{clientStores.length}</p>
              <p className="text-xl font-bold text-on-surface-variant mb-1">/ {client.maxStores}</p>
            </div>
            <div className="w-full bg-surface-container-highest h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: `${(clientStores.length / client.maxStores) * 100}%` }}></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20">
            <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4">Cajas por Local (Límite)</h3>
            <p className="text-3xl font-black text-on-surface mb-1">{client.maxPosPerStore}</p>
            <p className="text-sm font-medium text-on-surface-variant">Máximo permitido por sucursal</p>
          </div>
        </div>

        <h3 className="text-xl font-black font-headline mb-6">Infraestructura del Cliente</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {clientStores.map((store: any) => {
            const storePos = posMachines.filter((p: any) => p.storeId === store.id);
            return (
              <div key={store.id} className="bg-white rounded-2xl shadow-sm border border-outline-variant/20 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-on-surface flex items-center gap-2">
                      <Globe className="w-5 h-5 text-secondary" />
                      {store.name}
                    </h4>
                    <p className="text-sm text-on-surface-variant mt-1">{store.address}</p>
                    <p className="text-xs text-on-surface-variant mt-1 font-mono bg-surface-container-lowest inline-block px-2 py-1 rounded">PIN: {store.pin}</p>
                  </div>
                  <button 
                    onClick={() => { setSelectedStoreForPos(store.id); setPosError(''); setShowPosModal(true); }} 
                    disabled={storePos.length >= client.maxPosPerStore}
                    title={storePos.length >= client.maxPosPerStore ? "Límite de cajas alcanzado" : "Añadir caja"}
                    className={`text-sm font-bold px-3 py-2 rounded-lg transition-colors flex items-center gap-1 ${storePos.length >= client.maxPosPerStore ? 'text-on-surface-variant bg-surface-container-highest cursor-not-allowed' : 'text-primary hover:bg-primary/10'}`}
                  >
                    <Plus className="w-4 h-4" /> Caja
                  </button>
                </div>
                
                <div className="space-y-2 mt-4">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Cajas ({storePos.length}/{client.maxPosPerStore})</p>
                  {storePos.length === 0 ? (
                    <p className="text-sm text-on-surface-variant italic">No hay cajas configuradas.</p>
                  ) : (
                    storePos.map((pos: any) => (
                      <div key={pos.id} className="flex items-center justify-between bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/10">
                        <div className="flex items-center gap-3">
                          <Monitor className="w-4 h-4 text-on-surface-variant" />
                          <span className="font-bold text-sm text-on-surface">{pos.name}</span>
                        </div>
                        <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">Activa</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
          
          {clientStores.length === 0 && (
            <div className="col-span-full bg-surface-container-lowest border-2 border-dashed border-outline-variant/30 rounded-2xl p-12 text-center">
              <Globe className="w-12 h-12 text-on-surface-variant mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-bold text-on-surface mb-2">Sin locales configurados</h3>
              <p className="text-on-surface-variant mb-6">Este cliente aún no tiene locales creados.</p>
              <button onClick={() => { setStoreError(''); setShowStoreModal(true); }} className="bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-primary/90 transition-colors">
                Crear Primer Local
              </button>
            </div>
          )}
        </div>

        <div className="mt-12 flex justify-between items-center mb-6">
          <h3 className="text-xl font-black font-headline">Usuarios del Cliente</h3>
          <button onClick={() => { setEditingUser(null); setShowUserModal(true); }} className="bg-secondary text-white px-4 py-2 rounded-xl font-bold hover:bg-secondary/90 transition-colors flex items-center gap-2 text-sm">
            <UserPlus className="w-4 h-4" /> Nuevo Usuario
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4">Módulos</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {clientUsers.map((user: any) => (
                <tr key={user.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img className="w-8 h-8 rounded-full object-cover border border-outline-variant/20" src={user.image} alt={user.name} />
                      <div>
                        <span className="font-bold text-on-surface block">{user.name}</span>
                        <span className="text-xs text-on-surface-variant">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-[#0F172A]">{user.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {user.modules.map((m: string) => (
                        <span key={m} className="text-[10px] bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-bold capitalize">{m}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${user.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => { setEditingUser(user); setShowUserModal(true); }} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {clientUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">
                    No hay usuarios registrados para este cliente.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modals for Store and POS */}
      <AnimatePresence>
        {showStoreModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-surface w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-white/20">
              <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-lowest">
                <h3 className="text-xl font-black font-headline">Nuevo Local</h3>
                <button onClick={() => setShowStoreModal(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddStore} className="p-6 space-y-4">
                {storeError && (
                  <div className="bg-error/10 text-error p-3 rounded-xl text-sm font-bold flex items-center gap-2">
                    <Info className="w-5 h-5" /> {storeError}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-1">Nombre del Local</label>
                  <input name="name" required className="w-full p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary outline-none font-medium" placeholder="Ej. Sucursal Norte" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-1">Dirección</label>
                  <input name="address" required className="w-full p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary outline-none font-medium" placeholder="Av. Siempre Viva 123" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-1">PIN de Acceso (4 dígitos)</label>
                  <input name="pin" required pattern="\d{4}" maxLength={4} className="w-full p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary outline-none font-medium font-mono" placeholder="1234" />
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowStoreModal(false)} className="flex-1 py-3 px-4 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl font-bold transition-colors">Cancelar</button>
                  <button type="submit" className="flex-1 py-3 px-4 bg-secondary hover:bg-secondary/90 text-white rounded-xl font-bold transition-colors shadow-md">Crear Local</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {showPosModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-surface w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-white/20">
              <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-lowest">
                <h3 className="text-xl font-black font-headline">Nueva Caja</h3>
                <button onClick={() => setShowPosModal(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddPos} className="p-6 space-y-4">
                {posError && (
                  <div className="bg-error/10 text-error p-3 rounded-xl text-sm font-bold flex items-center gap-2">
                    <Info className="w-5 h-5" /> {posError}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-1">Nombre de la Caja</label>
                  <input name="name" required className="w-full p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary outline-none font-medium" placeholder="Ej. Caja 1" />
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowPosModal(false)} className="flex-1 py-3 px-4 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl font-bold transition-colors">Cancelar</button>
                  <button type="submit" className="flex-1 py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-colors shadow-md">Crear Caja</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* User Modal */}
        {showUserModal && (
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
              className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-outline-variant/20 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-[#0F172A]">{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
                  <p className="text-sm text-on-surface-variant mt-1">Gestione los accesos, permisos y local del usuario.</p>
                </div>
                <button onClick={() => { setShowUserModal(false); setEditingUser(null); }} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
                  <X className="w-6 h-6 text-on-surface-variant" />
                </button>
              </div>

              <form onSubmit={handleSaveUser} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#0F172A] mb-2">Nombre Completo</label>
                    <input 
                      name="name"
                      required
                      defaultValue={editingUser?.name}
                      className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-sm font-medium text-[#0F172A] focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                      placeholder="Ej. Juan Pérez"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0F172A] mb-2">Correo Electrónico</label>
                    <input 
                      name="email"
                      type="email"
                      required
                      defaultValue={editingUser?.email}
                      className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-sm font-medium text-[#0F172A] focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                      placeholder="juan@empresa.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0F172A] mb-2">Contraseña {editingUser && '(Opcional)'}</label>
                    <input 
                      name="password"
                      type="password"
                      required={!editingUser}
                      className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-sm font-medium text-[#0F172A] focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0F172A] mb-2">Rol</label>
                    <select 
                      name="role"
                      defaultValue={editingUser?.role || 'Cajero'}
                      className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-sm font-medium text-[#0F172A] focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                    >
                      <option value="Administrador">Administrador</option>
                      <option value="Supervisor">Supervisor</option>
                      <option value="Cajero">Cajero</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0F172A] mb-2">Local Asignado</label>
                    <select 
                      name="storeId"
                      defaultValue={editingUser?.storeId || ''}
                      className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-sm font-medium text-[#0F172A] focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                    >
                      <option value="">Todos los locales (Global)</option>
                      {clientStores.map((store: any) => (
                        <option key={store.id} value={store.id}>{store.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0F172A] mb-2">Estado</label>
                    <select 
                      name="status"
                      defaultValue={editingUser?.status || 'Activo'}
                      className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-sm font-medium text-[#0F172A] focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-[#0F172A] mb-2">Módulos Permitidos (Personalizado)</label>
                  <p className="text-xs text-on-surface-variant mb-3">Como SuperAdmin, puedes anular los permisos por defecto del rol y asignar módulos específicos.</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'dashboard', label: 'Dashboard' },
                      { id: 'inventory', label: 'Inventario' },
                      { id: 'sales', label: 'Ventas' },
                      { id: 'history', label: 'Historial' },
                      { id: 'entries', label: 'Entradas' },
                      { id: 'kpis', label: 'KPIs' },
                      { id: 'users', label: 'Usuarios' },
                      { id: 'fiados', label: 'Fiados' }
                    ].map(module => (
                      <label key={module.id} className="flex items-center gap-2 p-2 bg-surface-container-low rounded-lg cursor-pointer hover:bg-surface-container-high transition-colors">
                        <input 
                          type="checkbox" 
                          name="modules" 
                          value={module.id} 
                          defaultChecked={editingUser ? editingUser.modules?.includes(module.id) : ['sales', 'history'].includes(module.id)}
                          className="w-4 h-4 text-secondary rounded border-outline-variant/30 focus:ring-secondary"
                        />
                        <span className="text-xs font-bold text-[#0F172A]">{module.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="pt-6 flex gap-3">
                  <button type="button" onClick={() => { setShowUserModal(false); setEditingUser(null); }} className="flex-1 py-3 px-4 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl font-bold transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" className="flex-[2] py-3 px-4 bg-secondary text-white rounded-xl font-bold hover:bg-secondary/90 transition-colors shadow-lg shadow-secondary/20">
                    Guardar Usuario
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Dashboard = ({ setCurrentPage, inventory, salesHistory, setViewingSale, currentUser, users, setCurrentUser, currentStore, currentPOS }: { setCurrentPage: (page: any) => void, inventory: any[], salesHistory: any[], setViewingSale: (sale: any) => void, currentUser: any, users: any[], setCurrentUser: any, currentStore: any, currentPOS: any }) => {
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
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto p-8">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black text-[#0F172A] font-headline mb-1">Mi <span className="text-secondary">Negocio</span></h2>
            <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-3">PANEL &gt; MI NEGOCIO</p>
            <p className="text-[#0F172A]/70 font-bold text-lg">Resumen ejecutivo de tu negocio en tiempo real.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f2f3ff] transition-colors relative">
              <Bell className="w-5 h-5 text-on-surface-variant" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
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
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-outline-variant/10 hover:shadow-md transition-shadow group relative">
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
          <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-outline-variant/10">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-black text-[#0F172A] font-headline">Tendencia de Ventas</h3>
                <p className="text-sm text-[#0F172A]/60 font-bold uppercase tracking-widest">Últimos 7 días</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-black">
                <TrendingUp className="w-3 h-3" />
                <span>+12.5%</span>
              </div>
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
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-outline-variant/10">
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
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-outline-variant/10">
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

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-outline-variant/10">
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
    </div>
  );
};

const KPIsDashboard = ({ setCurrentPage, inventory, salesHistory, cashRegister, setShowCashRegisterModal, currentUser, users, setCurrentUser, cashHistory, currentStore, currentPOS }: { setCurrentPage: (page: any) => void, inventory: any[], salesHistory: any[], cashRegister: any, setShowCashRegisterModal: any, currentUser: any, users: any[], setCurrentUser: any, cashHistory: any[], currentStore: any, currentPOS: any }) => {
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

  const salesToday = salesHistory.filter(sale => new Date(sale.date).toDateString() === new Date().toDateString()).length;
  
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
    
    // Products that have stock but haven't been sold in the last 15 days
    return inventory.filter(p => !soldProductIds.has(p.id) && p.stock > 0)
      .sort((a, b) => (b.stock * b.cost) - (a.stock * a.cost)); // Sort by highest stuck capital
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

  const peakHoursData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0, total: 0 }));
    filteredSales.forEach(sale => {
      const hour = new Date(sale.date).getHours();
      hours[hour].count += 1;
      hours[hour].total += sale.total;
    });
    
    // Filter to only show hours between 8 AM and 10 PM for better visualization
    const businessHours = hours.filter(h => h.hour >= 8 && h.hour <= 22);
    const maxCount = Math.max(...businessHours.map(h => h.count), 1);
    
    return businessHours.map(h => ({
      ...h,
      intensity: h.count / maxCount, // 0 to 1
      label: `${h.hour}:00`
    }));
  }, [filteredSales]);

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
          {/* Transacciones Totales */}
          <div 
            onClick={() => setShowTransactionsModal(true)}
            className="bg-white p-5 rounded-3xl border border-outline-variant/10 hover:border-secondary/30 transition-all flex flex-col justify-between group shadow-sm cursor-pointer"
          >
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

          {/* Nivel de Rotación */}
          <div 
            onClick={() => setShowRotationModal(true)}
            className="bg-white p-5 rounded-3xl border border-outline-variant/10 hover:border-secondary/30 transition-all flex flex-col justify-between group shadow-sm cursor-pointer"
          >
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

          {/* Stock Crítico */}
          <div 
            onClick={() => setShowCriticalStockModal(true)}
            className="bg-white p-5 rounded-3xl border border-outline-variant/10 hover:border-error/30 transition-all flex flex-col justify-between group shadow-sm cursor-pointer"
          >
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

          {/* Ingresos Totales */}
          <div 
            onClick={() => setShowRevenueModal(true)}
            className="bg-white p-5 rounded-3xl border border-outline-variant/10 hover:border-secondary/30 transition-all flex flex-col justify-between group shadow-sm cursor-pointer"
          >
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

          {/* Utilidad del Mes */}
          <div 
            onClick={() => setShowProfitModal(true)}
            className="bg-white p-5 rounded-3xl border border-outline-variant/10 hover:border-secondary/30 transition-all flex flex-col justify-between group shadow-sm cursor-pointer"
          >
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
          {/* Main Chart: Ventas por Período */}
          <div className="xl:col-span-3 bg-white p-8 rounded-[2rem] shadow-sm border border-outline-variant/10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black font-headline text-[#0F172A]">Ventas por <span className="text-secondary">Período</span></h3>
                <p className="text-sm text-[#0F172A] font-bold">Comparativa de ingresos en el tiempo</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex p-1 bg-surface-container-low rounded-xl">
                  <button 
                    onClick={() => setTimeFilter('day')}
                    className={`px-5 py-2 text-xs font-black rounded-lg transition-all ${timeFilter === 'day' ? 'bg-white shadow-sm text-secondary' : 'text-on-surface-variant hover:text-[#0F172A]'}`}
                  >
                    Día
                  </button>
                  <button 
                    onClick={() => setTimeFilter('week')}
                    className={`px-5 py-2 text-xs font-black rounded-lg transition-all ${timeFilter === 'week' ? 'bg-white shadow-sm text-secondary' : 'text-on-surface-variant hover:text-[#0F172A]'}`}
                  >
                    Semana
                  </button>
                  <button 
                    onClick={() => setTimeFilter('month')}
                    className={`px-5 py-2 text-xs font-black rounded-lg transition-all ${timeFilter === 'month' ? 'bg-white shadow-sm text-secondary' : 'text-on-surface-variant hover:text-[#0F172A]'}`}
                  >
                    Mes
                  </button>
                  <button 
                    onClick={() => setTimeFilter('custom')}
                    className={`px-5 py-2 text-xs font-black rounded-lg transition-all flex items-center gap-2 ${timeFilter === 'custom' ? 'bg-white shadow-sm text-secondary' : 'text-on-surface-variant hover:text-[#0F172A]'}`}
                  >
                    <Calendar className="w-3 h-3" /> Personalizado
                  </button>
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
            {/* Real Chart UI */}
            <div className="h-80 w-full flex items-end justify-between gap-4 px-2 relative border-b border-outline-variant/20">
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
              <button 
                onClick={() => setCurrentPage('history')}
                className="font-black text-secondary cursor-pointer flex items-center gap-1 hover:underline"
              >
                Ver detalles de transacciones 
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List: Productos más Vendidos */}
          <div className="xl:col-span-1 bg-white p-8 rounded-[2rem] shadow-sm border border-outline-variant/10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black font-headline text-[#0F172A]">Top <span className="text-secondary">Productos</span></h3>
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
            <button 
              onClick={() => setCurrentPage('inventory')}
              className="w-full mt-10 py-3.5 bg-surface-container-low text-secondary font-black text-xs rounded-xl hover:bg-secondary hover:text-white transition-all uppercase tracking-widest shadow-sm"
            >
              Ver Inventario Completo
            </button>
          </div>
        </div>

        {/* Secondary Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-white p-8 rounded-[2rem] border border-outline-variant/10 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black font-headline text-[#0F172A]">Estado de <span className="text-secondary">Inventario Local</span></h3>
              <div className={`flex items-center gap-2 text-xs font-black px-3 py-1.5 rounded-lg ${inventoryHealth.critical > 20 ? 'bg-red-50 text-error' : 'bg-green-50 text-[#0F172A]'}`}>
                <span className={`w-2 h-2 rounded-full ${inventoryHealth.critical > 20 ? 'bg-error' : 'bg-green-500'}`}></span>
                {inventoryHealth.critical > 20 ? 'Atención Requerida' : 'Optimizado'}
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-black uppercase tracking-wider text-[#0F172A]">
                  <span>Stock Saludable</span>
                  <span className="text-green-600">{inventoryHealth.healthy}%</span>
                </div>
                <div className="h-2.5 w-full bg-surface-container-low rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${inventoryHealth.healthy}%` }}></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-black uppercase tracking-wider text-[#0F172A]">
                  <span>Stock Bajo (Alerta)</span>
                  <span className="text-secondary">{inventoryHealth.low}%</span>
                </div>
                <div className="h-2.5 w-full bg-surface-container-low rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${inventoryHealth.low}%` }}></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-black uppercase tracking-wider text-[#0F172A]">
                  <span>Sin Stock (Crítico)</span>
                  <span className="text-error">{inventoryHealth.critical}%</span>
                </div>
                <div className="h-2.5 w-full bg-surface-container-low rounded-full overflow-hidden">
                  <div className="h-full bg-error rounded-full transition-all" style={{ width: `${inventoryHealth.critical}%` }}></div>
                </div>
              </div>
            </div>
            <div 
              onClick={() => setShowCriticalStockModal(true)}
              className="mt-8 p-5 bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer rounded-2xl flex items-start gap-4 border border-outline-variant/10"
            >
              <div className="p-2 bg-secondary/5 rounded-lg">
                <Zap className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-black text-[#0F172A]">Recomendación de Compra</p>
                <p className="text-xs text-[#0F172A] font-bold mt-1 leading-relaxed">
                  {lowStockProducts.length > 0 
                    ? `Se sugiere reponer ${lowStockProducts[0].name} y otros ${lowStockProducts.length - 1} productos para evitar quiebre de stock.`
                    : 'El inventario se encuentra en niveles óptimos. No hay recomendaciones de compra urgentes.'}
                </p>
              </div>
            </div>

            {/* Inventario Estancado */}
            <div 
              onClick={() => setShowStagnantModal(true)}
              className={`mt-4 p-5 bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer rounded-2xl flex items-start gap-4 border ${stagnantProducts.length > 0 ? 'border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'border-outline-variant/10'}`}
            >
              <div className="relative">
                {stagnantProducts.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                  </span>
                )}
                <div className="p-2 bg-orange-50 rounded-lg">
                  <History className="w-5 h-5 text-orange-500" />
                </div>
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
                      <circle 
                        className="text-green-400 transition-all duration-1000" 
                        cx="40" cy="40" fill="transparent" r="34" stroke="currentColor" 
                        strokeDasharray="213.6" 
                        strokeDashoffset={213.6 - (213.6 * profitMargin) / 100} 
                        strokeLinecap="round" strokeWidth="6" transform="rotate(-90 40 40)"
                      ></circle>
                    </svg>
                    <span className="absolute text-sm font-black text-green-400">{profitMargin}%</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Abstract Design Elements */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-secondary/10 rounded-full blur-[80px]"></div>
            <div className="absolute -left-20 -top-20 w-64 h-64 bg-blue-500/5 rounded-full blur-[60px]"></div>
          </div>
        </div>
      </main>

      {/* Transactions Modal */}
      <AnimatePresence>
        {showTransactionsModal && (
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
              className="bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl max-h-[80vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-[#0F172A] font-headline">Transacciones <span className="text-secondary">Totales</span></h3>
                  <p className="text-sm font-bold text-[#0F172A]/70">Detalle de ventas en el período seleccionado</p>
                </div>
                <button onClick={() => setShowTransactionsModal(false)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
                  <X className="w-6 h-6 text-[#0F172A]" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 pr-2">
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6 flex gap-3 items-start">
                  <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-blue-900">¿Qué estoy viendo?</p>
                    <p className="text-xs text-blue-800 mt-1">Este es el registro de cada venta individual que has realizado. Te ayuda a entender el volumen de actividad de tu negocio. Cada fila representa un cliente que pasó por caja.</p>
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
                            <span className={`px-3 py-1 rounded-full text-xs font-black ${sale.paymentMethod === 'Efectivo' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                              {sale.paymentMethod}
                            </span>
                          </td>
                          <td className="py-4 text-sm font-black text-[#0F172A] text-right">${sale.total.toLocaleString('es-CL')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-[#0F172A]/60 font-bold">No hay transacciones en este período.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Critical Stock Modal */}
      <AnimatePresence>
        {showCriticalStockModal && (
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
              className="bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl max-h-[80vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-[#0F172A] font-headline">Stock <span className="text-secondary">Crítico</span> y <span className="text-orange-500">Proyecciones</span></h3>
                  <p className="text-sm font-bold text-[#0F172A]/70">Productos por agotarse o con menos de 10 unidades</p>
                </div>
                <button onClick={() => setShowCriticalStockModal(false)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
                  <X className="w-6 h-6 text-[#0F172A]" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 pr-2">
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl mb-6 flex gap-3 items-start">
                  <Info className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-red-900">Inteligencia de Inventario</p>
                    <p className="text-xs text-red-800 mt-1">El sistema calcula tu <strong>velocidad de venta</strong> basándose en los últimos 30 días. Aquí verás productos que ya tienen menos de 10 unidades, o aquellos que, según su ritmo de venta actual, se agotarán en los próximos 7 días.</p>
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
                          {product.stock === 0 ? (
                            <span className="px-3 py-1 bg-error text-white text-xs font-black rounded-lg">Agotado</span>
                          ) : product.daysUntilDepletion === Infinity ? (
                            <span className="px-3 py-1 bg-surface-container-low text-[#0F172A] text-xs font-black rounded-lg">Sin ventas</span>
                          ) : (
                            <div className="text-center">
                              <p className={`text-2xl font-black tabular-nums leading-none ${product.daysUntilDepletion <= 3 ? 'text-orange-600' : 'text-[#0F172A]'}`}>{product.daysUntilDepletion}</p>
                              <p className="text-[10px] font-black uppercase tracking-wider text-[#0F172A]/50 mt-1">Días para agotar</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="inline-flex p-4 bg-green-50 rounded-full mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <p className="text-[#0F172A] font-black text-lg">¡Todo en orden!</p>
                    <p className="text-[#0F172A]/60 font-bold">No hay productos con stock crítico.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Revenue Modal */}
      <AnimatePresence>
        {showRevenueModal && (
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
              className="bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl max-h-[80vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-[#0F172A] font-headline">Ingresos <span className="text-secondary">Totales</span></h3>
                  <p className="text-sm font-bold text-[#0F172A]/70">Desglose de ingresos por método de pago</p>
                </div>
                <button onClick={() => setShowRevenueModal(false)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
                  <X className="w-6 h-6 text-[#0F172A]" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 pr-2">
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6 flex gap-3 items-start">
                  <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-blue-900">¿Qué significan estos números?</p>
                    <p className="text-xs text-blue-800 mt-1">Es todo el dinero que ha entrado a tu caja, separado por cómo te pagaron. Esto es vital para cuadrar tu caja al final del día y saber cuánto dinero físico debes tener vs. cuánto está en tus cuentas bancarias.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Banknote className="w-5 h-5 text-green-700" />
                      </div>
                      <h4 className="font-black text-[#0F172A]">Efectivo</h4>
                    </div>
                    <p className="text-3xl font-black font-headline tabular-nums text-[#0F172A]">
                      ${(revenueByMethod['Efectivo'] || 0).toLocaleString('es-CL')}
                    </p>
                  </div>
                  <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <CreditCard className="w-5 h-5 text-blue-700" />
                      </div>
                      <h4 className="font-black text-[#0F172A]">Débito / Tarjeta</h4>
                    </div>
                    <p className="text-3xl font-black font-headline tabular-nums text-[#0F172A]">
                      ${(revenueByMethod['Débito'] || 0).toLocaleString('es-CL')}
                    </p>
                  </div>
                </div>
                
                <div className="bg-[#0F172A] p-6 rounded-2xl text-white flex justify-between items-center">
                  <div>
                    <p className="text-xs font-black text-white/50 uppercase tracking-wider mb-1">Total Ingresos</p>
                    <p className="text-4xl font-black font-headline tabular-nums">${totalSales.toLocaleString('es-CL')}</p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-secondary/50" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profit Modal */}
      <AnimatePresence>
        {showProfitModal && (
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
              className="bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl max-h-[80vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-[#0F172A] font-headline">Utilidad <span className="text-secondary">Total</span></h3>
                  <p className="text-sm font-bold text-[#0F172A]/70">Productos que generaron mayor ganancia en el período</p>
                </div>
                <button onClick={() => setShowProfitModal(false)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
                  <X className="w-6 h-6 text-[#0F172A]" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 pr-2">
                <div className="bg-green-50 border border-green-100 p-4 rounded-xl mb-6 flex gap-3 items-start">
                  <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-green-900">¿Cómo se calcula mi ganancia?</p>
                    <p className="text-xs text-green-800 mt-1">La utilidad es tu ganancia real. Se calcula tomando el precio al que vendiste un producto y restándole lo que te costó comprarlo. Aquí puedes ver cuáles son los productos "estrella" que más dinero dejan en tu bolsillo.</p>
                  </div>
                </div>
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

                <h4 className="font-black text-[#0F172A] mb-4 text-sm uppercase tracking-wider">Top Productos por Utilidad</h4>
                {profitByProduct.length > 0 ? (
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
                        <div className="text-right">
                          <p className="text-base font-black text-green-600">+${product.profit.toLocaleString('es-CL')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-[#0F172A]/60 font-bold">No hay datos de utilidad para este período.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rotation Modal */}
      <AnimatePresence>
        {showRotationModal && (
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
              className="bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl max-h-[80vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-[#0F172A] font-headline">Nivel de <span className="text-amber-600">Rotación</span></h3>
                  <p className="text-sm font-bold text-[#0F172A]/70">Análisis de fluidez de inventario</p>
                </div>
                <button onClick={() => setShowRotationModal(false)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
                  <X className="w-6 h-6 text-[#0F172A]" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 pr-2">
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl mb-6 flex gap-3 items-start">
                  <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-900">¿Qué es la rotación?</p>
                    <p className="text-xs text-amber-800 mt-1">La rotación indica qué tan rápido vendes tu stock. Un 100% significaría que vendiste todo lo que tenías. Un porcentaje bajo indica que tienes productos que no se están moviendo, lo que inmoviliza tu capital.</p>
                  </div>
                </div>

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

                <h4 className="font-black text-[#0F172A] mb-4 text-sm uppercase tracking-wider">Productos con Mayor Rotación</h4>
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
                        <div className="text-right">
                          <p className="text-base font-black text-amber-600">{product.rate}%</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stagnant Inventory Modal */}
      <AnimatePresence>
        {showStagnantModal && (
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
              className="bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl max-h-[80vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-[#0F172A] font-headline">Inventario <span className="text-orange-500">Estancado</span></h3>
                  <p className="text-sm font-bold text-[#0F172A]/70">Productos sin ventas en los últimos 15 días</p>
                </div>
                <button onClick={() => setShowStagnantModal(false)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
                  <X className="w-6 h-6 text-[#0F172A]" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 pr-2">
                <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl mb-6 flex gap-3 items-start">
                  <Info className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-orange-900">¿Por qué es importante esta métrica?</p>
                    <p className="text-xs text-orange-800 mt-1">Estos productos no se han vendido nada en los últimos 15 días. Esto significa que tienes <strong>Capital Inmovilizado</strong> (dinero atrapado en mercancía que no rota). Considera hacer promociones, armar combos o liquidarlos para recuperar tu inversión y comprar productos que sí se vendan.</p>
                  </div>
                </div>

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

                <h4 className="font-black text-[#0F172A] mb-4 text-sm uppercase tracking-wider">Detalle de Productos Estancados</h4>
                {stagnantProducts.length > 0 ? (
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
                          <p className="text-[10px] font-black text-[#0F172A]/50 uppercase tracking-tighter">Inmovilizado</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="inline-flex p-4 bg-green-50 rounded-full mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <p className="text-[#0F172A] font-black text-lg">¡Excelente Rotación!</p>
                    <p className="text-[#0F172A]/60 font-bold">Todos tus productos han tenido movimiento en este período.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cash History Modal */}
      <AnimatePresence>
        {showCashHistoryModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-[#0F172A] font-headline">Historial de <span className="text-secondary">Cierres de Caja</span></h3>
                  <p className="text-sm font-bold text-[#0F172A]/70">Registro detallado de aperturas, cierres y discrepancias detectadas.</p>
                </div>
                <button onClick={() => setShowCashHistoryModal(false)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
                  <X className="w-6 h-6 text-[#0F172A]" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {cashHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-4">
                      <Banknote className="w-10 h-10 text-[#0F172A]/20" />
                    </div>
                    <p className="text-lg font-black text-[#0F172A]/40">No hay registros de cierres aún.</p>
                  </div>
                ) : (
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
                              <div className="text-sm font-black text-[#0F172A]">
                                {new Date(record.closedAt).toLocaleDateString('es-CL')}
                              </div>
                              <div className="text-[10px] font-bold text-[#0F172A]/50">
                                {new Date(record.closedAt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm font-bold text-[#0F172A]">{record.user}</div>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <div className="text-sm font-medium text-[#0F172A]/70">${record.initialCash.toLocaleString('es-CL')}</div>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <div className="text-sm font-black text-[#0F172A]">${record.expectedCash.toLocaleString('es-CL')}</div>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <div className="text-sm font-black text-secondary">${record.actualCash.toLocaleString('es-CL')}</div>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <div className={`text-sm font-black ${record.difference === 0 ? 'text-green-600' : (record.difference > 0 ? 'text-blue-600' : 'text-error')}`}>
                                {record.difference > 0 ? '+' : ''}{record.difference.toLocaleString('es-CL')}
                              </div>
                            </td>
                            <td className="px-4 py-4 rounded-r-2xl text-center">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                record.status === 'Cuadrada' ? 'bg-green-100 text-green-700' : 
                                (record.status === 'Sobrante' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700')
                              }`}>
                                {record.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Critical Stock Modal */}
    </div>
  );
};

const SalesHistory = ({ setCurrentPage, salesHistory, setViewingSale, currentUser, users, setCurrentUser, currentStore, currentPOS }: { setCurrentPage: (page: any) => void, salesHistory: any[], setViewingSale: (product: any) => void, currentUser: any, users: any[], setCurrentUser: any, currentStore: any, currentPOS: any }) => {
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
            <div className="h-8 w-px bg-outline-variant/30 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-black text-[#0F172A]">Admin Vantory</p>
                <p className="text-xs text-secondary font-bold">Soporte Técnico</p>
              </div>
              <img 
                className="w-10 h-10 rounded-full border-2 border-surface-container-highest object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPTOJksruGaNQm6gW0cTKsmHx_gthleGI0Hy70R56Q1oJ4i9lW0iL4JU8oXMoZAshoKE8S3a1-5NvKCV26POVasYgktSZtJpP6RHaMYbMEtqakjdL7rtnYFQso4Kzl5w6R3449pD-nViJIAngGkUqQijX4Zz9xtfKBk4SztlssTnGEGmOQeqPZsahAs-DUJ7tdh68w9VguZXCBAxiCk5XRvvm-GQdW31C8hvfujnZJlbpJ3SVzXGcnVimo2ARlMqv9ks88IY_RN2o_" 
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

const StockEntries = ({ setCurrentPage, inventory, setInventory, stockEntries, setStockEntries, setViewingSale, currentUser, users, setCurrentUser, currentStore, currentPOS }: { 
  setCurrentPage: (page: any) => void, 
  inventory: any[], 
  setInventory: (inv: any[]) => void,
  stockEntries: any[],
  setStockEntries: (entries: any[]) => void,
  setViewingSale: (sale: any) => void,
  currentUser: any,
  users: any[],
  setCurrentUser: any,
  currentStore: any,
  currentPOS: any
}) => {
  const [barcode, setBarcode] = useState('');
  const [manualProduct, setManualProduct] = useState('');
  const [manualQuantity, setManualQuantity] = useState('');
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    sku: '',
    category: 'General',
    cost: '',
    price: '',
    image: 'https://picsum.photos/seed/product/200/200',
    stock: ''
  });

  const [receivingCart, setReceivingCart] = useState<any[]>([]);
  const [isScanned, setIsScanned] = useState(false);

  const todayStr = new Date().toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: '2-digit' });
  const entriesToday = stockEntries.filter(entry => entry.date === todayStr).length;

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = inventory.find(p => p.sku === barcode);
    if (product) {
      const existing = receivingCart.find(item => item.id === product.id);
      if (existing) {
        setReceivingCart(receivingCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
        setReceivingCart([...receivingCart, { ...product, quantity: 1, newCost: product.cost }]);
      }
      setBarcode('');
      setIsScanned(true);
      setTimeout(() => setIsScanned(false), 500);
      const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
      audio.play().catch(() => {});
    } else {
      setNewProductForm({ ...newProductForm, sku: barcode });
      setShowNewProductModal(true);
    }
  };

  const handleUpdateCartItem = (id: number, field: string, value: number) => {
    setReceivingCart(receivingCart.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleRemoveCartItem = (id: number) => {
    setReceivingCart(receivingCart.filter(item => item.id !== id));
  };

  const handleConfirmReception = () => {
    if (receivingCart.length === 0) return;

    const newEntries = receivingCart.map(item => ({
      id: Date.now() + Math.random(),
      folio: `ENT-${Math.floor(Math.random() * 9000) + 1000}`,
      productName: item.name,
      productId: item.id,
      quantity: item.quantity,
      cost: item.newCost,
      date: new Date().toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: '2-digit' }),
      user: currentUser?.name || 'Admin User',
      image: item.image
    }));

    setStockEntries([...newEntries, ...stockEntries]);

    const updatedInventory = inventory.map(invItem => {
      const cartItem = receivingCart.find(c => c.id === invItem.id);
      if (cartItem) {
        return { ...invItem, stock: invItem.stock + cartItem.quantity, cost: cartItem.newCost };
      }
      return invItem;
    });
    setInventory(updatedInventory);
    setReceivingCart([]);
  };

  const handleNewProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const costNum = parseInt(newProductForm.cost);
    const priceNum = parseInt(newProductForm.price);
    const stockNum = parseInt(newProductForm.stock) || 0;
    
    const newProduct = {
      id: Date.now(),
      name: newProductForm.name,
      sku: newProductForm.sku,
      category: newProductForm.category,
      cost: costNum,
      price: priceNum,
      stock: stockNum,
      image: newProductForm.image,
      margin: Math.round(((priceNum - costNum) / priceNum) * 100)
    };

    setInventory([...inventory, newProduct]);
    
    // Also record the entry
    const newEntry = {
      id: Date.now() + 1,
      folio: `ENT-${Math.floor(Math.random() * 9000) + 1000}`,
      productName: newProduct.name,
      productId: newProduct.id,
      quantity: stockNum,
      cost: costNum,
      date: new Date().toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: '2-digit' }),
      user: currentUser?.name || 'Admin User',
      image: newProduct.image
    };
    setStockEntries([newEntry, ...stockEntries]);
    
    setShowNewProductModal(false);
    setNewProductForm({
      name: '',
      sku: '',
      category: 'General',
      cost: '',
      price: '',
      image: 'https://picsum.photos/seed/product/200/200',
      stock: ''
    });
    setBarcode('');
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = inventory.find(p => p.id === parseInt(manualProduct));
    if (product && manualQuantity) {
      const quantity = parseInt(manualQuantity);
      const newEntry = {
        id: Date.now(),
        folio: `ENT-${Math.floor(Math.random() * 9000) + 1000}`,
        productName: product.name,
        productId: product.id,
        quantity,
        date: new Date(manualDate).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: '2-digit' }),
        user: currentUser?.name || 'Admin User',
        image: product.image
      };
      setStockEntries([newEntry, ...stockEntries]);
      setInventory(inventory.map(p => p.id === product.id ? { ...p, stock: p.stock + quantity } : p));
      setManualProduct('');
      setManualQuantity('');
    }
  };

  const totalReceptionCost = receivingCart.reduce((sum, item) => sum + (item.newCost * item.quantity), 0);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-body">
      <SideNavBar currentPage="entries" setCurrentPage={setCurrentPage} currentUser={currentUser} users={users} setCurrentUser={setCurrentUser} currentStore={currentStore} currentPOS={currentPOS} />
      
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-2xl font-black text-slate-900 font-headline flex items-center gap-2">
              <Package className="w-6 h-6 text-secondary" />
              Ingreso de <span className="text-secondary">Mercadería</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">LOGÍSTICA &gt; RECEPCIÓN</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-secondary/10 px-4 py-2 rounded-xl border border-secondary/20">
              <p className="text-[10px] font-bold text-secondary uppercase leading-none mb-1">Entradas Hoy</p>
              <p className="text-lg font-black text-secondary leading-none">{entriesToday}</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row p-6 gap-6">
          {/* Left Side: Scanning and Cart */}
          <div className="flex-1 flex flex-col gap-6 overflow-hidden">
            {/* Scanner Area */}
            <div className={`rounded-3xl p-8 shadow-2xl border-2 transition-all duration-300 ${isScanned ? 'bg-green-900/20 border-green-500 shadow-green-500/20' : 'bg-[#131b2e] border-secondary/30 shadow-secondary/10'}`}>
              <h2 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Scan className="w-4 h-4 text-secondary" /> Escanear Productos
              </h2>
              <form onSubmit={handleBarcodeSubmit} className="relative">
                <input 
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="Escanea el código de barras o ingresa SKU..."
                  autoFocus
                  className={`w-full pl-14 pr-4 py-5 bg-white/5 border-2 rounded-2xl text-xl font-bold text-white focus:ring-4 outline-none transition-all placeholder:text-white/20 ${isScanned ? 'border-green-500 ring-green-500/20' : 'border-white/10 focus:border-secondary focus:ring-secondary/10'}`}
                />
                <Barcode className={`absolute left-5 top-1/2 -translate-y-1/2 w-7 h-7 transition-colors ${isScanned ? 'text-green-500' : 'text-white/30'}`} />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-secondary text-white px-6 py-3 rounded-xl font-black hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20">
                  Agregar
                </button>
              </form>
              <div className="mt-6 flex items-center justify-between">
                <button 
                  onClick={() => setShowNewProductModal(true)}
                  className="text-xs font-bold text-secondary hover:text-secondary/80 flex items-center gap-2 transition-colors"
                >
                  <PlusCircle className="w-4 h-4" /> Crear producto inexistente
                </button>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isScanned ? 'bg-green-500 animate-ping' : 'bg-secondary'}`}></div>
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Sistema Listo</span>
                </div>
              </div>
            </div>

            {/* Receiving Cart */}
            <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" /> Productos en Recepción
                </h2>
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                  {receivingCart.length} Items
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                {receivingCart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                      <Package className="w-10 h-10" />
                    </div>
                    <p className="font-bold">No hay productos escaneados aún</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {receivingCart.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-secondary/30 transition-all">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-white shadow-sm" referrerPolicy="no-referrer" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-black text-slate-900 truncate">{item.name}</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{item.sku}</p>
                          <div className="mt-2 flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Costo:</span>
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
                                <input 
                                  type="number" 
                                  value={item.newCost}
                                  onChange={(e) => handleUpdateCartItem(item.id, 'newCost', parseInt(e.target.value))}
                                  className="w-24 pl-5 pr-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold focus:border-secondary outline-none"
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Cant:</span>
                              <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
                                <button 
                                  onClick={() => handleUpdateCartItem(item.id, 'quantity', Math.max(1, item.quantity - 1))}
                                  className="px-2 py-1 hover:bg-slate-100 text-slate-400"
                                >-</button>
                                <input 
                                  type="number" 
                                  value={item.quantity}
                                  onChange={(e) => handleUpdateCartItem(item.id, 'quantity', parseInt(e.target.value))}
                                  className="w-12 text-center text-xs font-bold outline-none"
                                />
                                <button 
                                  onClick={() => handleUpdateCartItem(item.id, 'quantity', item.quantity + 1)}
                                  className="px-2 py-1 hover:bg-slate-100 text-slate-400"
                                >+</button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-400 mb-1">Subtotal</p>
                          <p className="text-lg font-black text-slate-900">${(item.newCost * item.quantity).toLocaleString()}</p>
                        </div>
                        <button 
                          onClick={() => handleRemoveCartItem(item.id)}
                          className="p-2 text-slate-300 hover:text-error transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Costo Total de Recepción</p>
                    <p className="text-3xl font-black text-slate-900">${totalReceptionCost.toLocaleString()}</p>
                  </div>
                  <button 
                    onClick={handleConfirmReception}
                    disabled={receivingCart.length === 0}
                    className="px-8 py-4 bg-secondary text-white font-black rounded-2xl shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                  >
                    <CheckCircle className="w-6 h-6" />
                    Confirmar Recepción
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: History and Manual Entry */}
          <div className="w-full lg:w-96 flex flex-col gap-6 overflow-hidden">
            {/* Manual Entry Form */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <PlusCircle className="w-4 h-4" /> Ingreso Manual
              </h2>
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Producto</label>
                  <select 
                    value={manualProduct}
                    onChange={(e) => setManualProduct(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-secondary"
                  >
                    <option value="">Seleccionar producto...</option>
                    {inventory.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cantidad</label>
                    <input 
                      type="number"
                      value={manualQuantity}
                      onChange={(e) => setManualQuantity(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Fecha</label>
                    <input 
                      type="date"
                      value={manualDate}
                      onChange={(e) => setManualDate(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-secondary"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all">
                  Registrar Entrada
                </button>
              </form>
            </div>

            {/* Recent Entries */}
            <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <History className="w-4 h-4" /> Últimos Ingresos
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {stockEntries.slice(0, 10).map((entry) => (
                  <div key={entry.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <img src={entry.image} alt="" className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-slate-900 truncate">{entry.productName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-secondary">+{entry.quantity} un.</span>
                        <span className="text-[10px] font-medium text-slate-400">{entry.date}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Folio</p>
                      <p className="text-xs font-black text-slate-900 leading-none">{entry.folio}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="p-4 text-xs font-bold text-secondary hover:bg-secondary/5 transition-colors border-t border-slate-100">
                Ver historial completo
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* New Product Modal */}
      <AnimatePresence>
        {showNewProductModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-slate-900 font-headline">Nuevo <span className="text-secondary">Producto</span></h3>
                <button onClick={() => setShowNewProductModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleNewProductSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre del Producto</label>
                    <input 
                      type="text" 
                      required
                      value={newProductForm.name}
                      onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">SKU / Barcode</label>
                    <input 
                      type="text" 
                      required
                      value={newProductForm.sku}
                      onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Categoría</label>
                    <select 
                      value={newProductForm.category}
                      onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-secondary"
                    >
                      <option value="General">General</option>
                      <option value="Bebidas">Bebidas</option>
                      <option value="Snacks">Snacks</option>
                      <option value="Lácteos">Lácteos</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Costo de Compra</label>
                    <input 
                      type="number" 
                      required
                      value={newProductForm.cost}
                      onChange={(e) => setNewProductForm({ ...newProductForm, cost: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Precio de Venta</label>
                    <input 
                      type="number" 
                      required
                      value={newProductForm.price}
                      onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-secondary"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Stock Inicial</label>
                    <input 
                      type="number" 
                      value={newProductForm.stock}
                      onChange={(e) => setNewProductForm({ ...newProductForm, stock: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-secondary"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-4 bg-secondary text-white font-black rounded-xl shadow-lg shadow-secondary/20 hover:scale-[1.02] transition-transform mt-4">
                  Crear y Agregar a Recepción
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InventoryDashboard = ({ setCurrentPage, inventory, setInventory, currentUser, users, setCurrentUser, categories, setCategories, currentStore, currentPOS }: { setCurrentPage: (page: any) => void, inventory: any[], setInventory: (inv: any[]) => void, currentUser: any, users: any[], setCurrentUser: any, categories: string[], setCategories: any, currentStore: any, currentPOS: any }) => {
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [viewingProduct, setViewingProduct] = useState<any | null>(null);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todas las Categorías');

  const handleDelete = (id: number) => {
    setInventory(inventory.filter(p => p.id !== id));
    setProductToDelete(null);
  };

  const toggleFavorite = (id: number) => {
    setInventory(inventory.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  const handleSave = (product: any) => {
    if (product.id) {
      setInventory(inventory.map(p => p.id === product.id ? product : p));
    } else {
      setInventory([...inventory, { ...product, id: Date.now() }]);
    }
    setEditingProduct(null);
    setShowAddProduct(false);
  };

  const handleExport = () => {
    const headers = ['sku', 'nombre', 'categoria', 'costo', 'precio', 'stock', 'imagen_url', 'favorito'];
    const delimiter = ';';
    const csvContent = [
      headers.join(delimiter),
      ...inventory.map(p => [p.sku, p.name, p.category, p.cost, p.price, p.stock, p.image, p.isFavorite ? 'SI' : 'NO'].join(delimiter))
    ].join('\n');
    
    // Add UTF-8 BOM for Excel to recognize special characters
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'plantilla_inventario.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const newItems = jsonData.map((row: any) => ({
        id: Date.now() + Math.random(),
        sku: String(row.sku || row.SKU || ''),
        name: String(row.nombre || row.Nombre || 'Producto Nuevo'),
        category: String(row.categoria || row.Categoría || 'General'),
        cost: parseInt(row.costo || row.Costo || 0),
        price: parseInt(row.precio || row.Precio || 0),
        stock: parseInt(row.stock || row.Stock || 0),
        isFavorite: String(row.favorito || row.Favorito || '').toUpperCase() === 'SI',
        image: String(row.imagen_url || row.Imagen || 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=100&q=80'),
        margin: row.precio && row.costo ? Math.round(((parseInt(row.precio) - parseInt(row.costo)) / parseInt(row.precio)) * 100) : 0
      })).filter(item => item.sku !== '');

      if (newItems.length > 0) {
        setInventory([...inventory, ...newItems]);
        setShowBulkUpload(false);
        alert(`Se han importado ${newItems.length} productos exitosamente.`);
      }
    };
    reader.readAsBinaryString(file);
  };

  const filteredInventory = inventory.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLowStock = filterLowStock ? p.stock < 10 : true;
    const matchesCategory = selectedCategory === 'Todas las Categorías' ? true : p.category === selectedCategory;
    return matchesSearch && matchesLowStock && matchesCategory;
  });

  const totalProducts = inventory.length;
  const inventoryValue = inventory.reduce((sum, item) => sum + (item.cost * item.stock), 0);
  const lowStockCount = inventory.filter(item => item.stock < 10).length;
  const avgMargin = inventory.length > 0 
    ? (inventory.reduce((sum, item) => sum + item.margin, 0) / inventory.length).toFixed(1) 
    : 0;

  return (
    <div className="flex min-h-screen bg-surface text-on-surface font-body">
      <SideNavBar currentPage="inventory" setCurrentPage={setCurrentPage} currentUser={currentUser} users={users} setCurrentUser={setCurrentUser} currentStore={currentStore} currentPOS={currentPOS} />
      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto p-8">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black text-[#0F172A] font-headline mb-1">Inventario de <span className="text-secondary">Productos</span></h2>
            <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-3">INVENTARIO &gt; PRODUCTOS</p>
            <p className="text-[#0F172A]/70 font-bold text-lg">Administra tu catálogo, precios y niveles de stock global.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <input 
                className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-secondary/20 focus:bg-surface-container-lowest transition-all" 
                placeholder="Buscar en inventario..." 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f2f3ff] transition-colors relative">
              <Bell className="w-5 h-5 text-on-surface-variant" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
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
              />
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-error-container/20 text-error transition-colors ml-2" title="Cerrar Sesión">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-surface-container-lowest p-6 rounded-2xl flex flex-col justify-between min-h-[140px] transition-all shadow-sm border border-outline-variant/10 hover:border-secondary/30 group">
            <div>
              <span className="text-[#0F172A] font-black text-xs uppercase tracking-widest mb-2 block">Total Productos</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-headline tabular-nums text-on-surface">{totalProducts.toLocaleString()}</span>
                <span className="text-tertiary-container text-xs font-bold px-2 py-0.5 rounded-full bg-tertiary-fixed-dim/20">Sincronizado</span>
              </div>
            </div>
            <p className="text-xs text-[#0F172A] font-bold mt-2 leading-tight">Cantidad total de artículos distintos registrados en tu catálogo actual.</p>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl flex flex-col justify-between min-h-[140px] transition-all shadow-sm border border-outline-variant/10 hover:border-secondary/30">
            <div>
              <span className="text-[#0F172A] font-black text-xs uppercase tracking-widest mb-2 block">Valor Inventario</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-headline tabular-nums text-on-surface">
                  {inventoryValue >= 1000000 
                    ? `$${(inventoryValue / 1000000).toFixed(1)}M` 
                    : `$${inventoryValue.toLocaleString('es-CL')}`}
                </span>
                <span className="text-[#0F172A] text-xs font-black uppercase">CLP</span>
              </div>
            </div>
            <p className="text-xs text-[#0F172A] font-bold mt-2 leading-tight">Inversión total basada en el costo de compra por la cantidad de unidades en stock.</p>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl flex flex-col justify-between min-h-[140px] transition-all shadow-sm border border-outline-variant/10 hover:border-secondary/30">
            <div>
              <span className="text-[#0F172A] font-black text-xs uppercase tracking-widest mb-2 block">Bajo Stock</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-headline tabular-nums text-on-surface">{lowStockCount}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${lowStockCount > 0 ? 'text-error bg-error-container/40' : 'text-success bg-success-container/40'}`}>
                  {lowStockCount > 0 ? 'Crítico' : 'Óptimo'}
                </span>
              </div>
            </div>
            <p className="text-xs text-[#0F172A] font-bold mt-2 leading-tight">Productos que requieren reposición inmediata (menos de 10 unidades disponibles).</p>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl flex flex-col justify-between min-h-[140px] transition-all border-2 border-secondary/20 shadow-md">
            <div>
              <span className="text-secondary font-black text-xs uppercase tracking-widest mb-2 block">Margen Promedio</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-headline tabular-nums text-secondary">{avgMargin}%</span>
                <TrendingUp className="text-secondary w-4 h-4" />
              </div>
            </div>
            <p className="text-xs text-[#0F172A] font-bold mt-2 leading-tight">Promedio de rentabilidad de tus productos (diferencia entre costo y precio de venta).</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-surface-container-low rounded-2xl p-4 mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm">
            <Filter className="text-outline w-5 h-5" />
            <span className="text-sm font-bold font-label">Filtros Avanzados</span>
          </div>
          <div className="h-6 w-px bg-outline-variant/30 hidden md:block"></div>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent border-none text-sm font-black focus:ring-0 text-[#0F172A] outline-none"
          >
            <option>Todas las Categorías</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select className="bg-transparent border-none text-sm font-black focus:ring-0 text-[#0F172A] outline-none">
            <option>Estado: Todos</option>
            <option>En Stock</option>
            <option>Bajo Stock</option>
            <option>Agotado</option>
          </select>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-[#0F172A] font-black">Mostrando 1-10 de 1,284</span>
            <div className="flex gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-all">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-[#0F172A] font-label">Producto</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-[#0F172A] font-label">Código</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-[#0F172A] font-label text-center">Stock</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-[#0F172A] font-label">Costo</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-[#0F172A] font-label">Precio Venta</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-[#0F172A] font-label">Margen</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-[#0F172A] font-label text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filteredInventory.map((product) => (
                <tr key={product.id} className="hover:bg-surface-container-high transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => toggleFavorite(product.id)}
                        className={`p-1 rounded-full transition-colors ${product.isFavorite ? 'text-yellow-500 bg-yellow-50' : 'text-outline-variant hover:text-yellow-500'}`}
                      >
                        <Star className={`w-4 h-4 ${product.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                      <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center overflow-hidden">
                        <img className="w-full h-full object-cover" alt={product.name} src={product.image} referrerPolicy="no-referrer"/>
                      </div>
                      <div>
                        <p className="font-bold text-on-surface text-base">{product.name}</p>
                        <p className="text-xs text-[#0F172A] font-black">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#0F172A]">{product.sku}</span>
                      <div className="flex gap-0.5 mt-1">
                        {[1,2,3,4,5,6].map(i => <div key={i} className="w-[2px] h-3 bg-[#0F172A]/40"></div>)}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black ${product.stock > 10 ? 'bg-tertiary-fixed-dim/20 text-on-tertiary-container' : product.stock > 0 ? 'bg-error-container text-on-error-container' : 'bg-surface-dim text-[#0F172A]'}`}>
                      {product.stock} Unidades
                    </div>
                  </td>
                  <td className="px-8 py-6 font-medium font-body text-on-surface tabular-nums">${product.cost.toLocaleString('es-CL')}</td>
                  <td className="px-8 py-6 font-bold font-body text-on-surface tabular-nums">${product.price.toLocaleString('es-CL')}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden w-20">
                        <div className="bg-secondary h-full" style={{width: `${product.margin}%`}}></div>
                      </div>
                      <span className="text-sm font-bold text-secondary">{product.margin}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => setViewingProduct(product)}
                      className="p-2 text-outline hover:text-secondary transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setEditingProduct(product)}
                      className="p-2 text-outline hover:text-secondary transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setProductToDelete(product.id)}
                      className="p-2 text-outline hover:text-error transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Table Footer */}
          <div className="px-8 py-6 bg-surface-container-low/30 border-t border-outline-variant/10 flex justify-between items-center">
            <p className="text-sm text-on-surface-variant font-medium">Página 1 de 128</p>
            <div className="flex items-center gap-1">
              <button className="px-4 py-2 text-sm font-bold rounded-xl bg-surface-container-lowest shadow-sm hover:bg-white transition-all">Anterior</button>
              <div className="flex px-2">
                <button className="w-8 h-8 rounded-lg bg-secondary text-white text-xs font-bold">1</button>
                <button className="w-8 h-8 rounded-lg text-on-surface-variant text-xs font-bold hover:bg-surface-container-high">2</button>
                <button className="w-8 h-8 rounded-lg text-on-surface-variant text-xs font-bold hover:bg-surface-container-high">3</button>
                <span className="w-8 h-8 flex items-center justify-center text-on-surface-variant">...</span>
                <button className="w-8 h-8 rounded-lg text-on-surface-variant text-xs font-bold hover:bg-surface-container-high">128</button>
              </div>
              <button className="px-4 py-2 text-sm font-bold rounded-xl bg-surface-container-lowest shadow-sm hover:bg-white transition-all">Siguiente</button>
            </div>
          </div>
        </div>

        {/* Quick Access Widgets */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div 
            onClick={() => setFilterLowStock(!filterLowStock)}
            className={`p-8 rounded-3xl border-2 transition-all flex items-center justify-between cursor-pointer hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] ${filterLowStock ? 'bg-secondary/10 border-secondary' : 'bg-white border-secondary/20 hover:border-secondary/40'}`}
          >
            <div>
              <h3 className="text-xl font-black font-headline mb-2 text-[#0F172A]">Asistente de <span className="text-secondary">Reposición</span></h3>
              <p className="text-[#0F172A] font-medium text-sm max-w-sm mb-4">
                {filterLowStock 
                  ? 'Mostrando solo productos con stock bajo (< 10 unidades).' 
                  : 'Se han identificado productos que requieren atención inmediata basada en la velocidad de venta.'}
              </p>
              <button 
                className="text-secondary font-bold text-sm flex items-center gap-1 hover:underline"
              >
                {filterLowStock ? 'Ver todo el inventario' : 'Ver sugerencias'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${filterLowStock ? 'bg-secondary text-white' : 'bg-secondary-container text-white'}`}>
              <Zap className="w-10 h-10 fill-current" />
            </div>
          </div>
          <div 
            onClick={() => setShowBulkUpload(true)}
            className="bg-white p-8 rounded-3xl border-2 border-outline-variant/20 flex items-center justify-between cursor-pointer hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] hover:border-secondary/40 transition-all"
          >
            <div>
              <h3 className="text-xl font-black font-headline mb-2 text-[#0F172A]">Importación <span className="text-secondary">Masiva</span></h3>
              <p className="text-[#0F172A] font-medium text-sm max-w-sm mb-4">Actualiza los precios o el stock de múltiples productos a la vez mediante un archivo Excel o CSV.</p>
              <button 
                className="text-secondary font-bold text-sm flex items-center gap-1 hover:underline"
              >
                Subir archivo <UploadCloud className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-surface-container-highest w-24 h-24 rounded-full flex items-center justify-center text-secondary">
              <Cloud className="w-10 h-10" />
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => setShowAddProduct(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-secondary to-blue-800 text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-105 active:scale-95 transition-all"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Modals */}
      <AnimatePresence>
        {productToDelete && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProductToDelete(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-surface w-full max-w-md rounded-3xl shadow-2xl p-8 text-center"
            >
              <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center text-error mx-auto mb-6">
                <Trash2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black font-headline mb-2">¿Eliminar Producto?</h3>
              <p className="text-on-surface-variant mb-8">Esta acción no se puede deshacer. El producto será removido permanentemente del inventario.</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setProductToDelete(null)}
                  className="flex-1 py-3 bg-surface-container-high rounded-xl font-bold hover:bg-surface-container-highest transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => handleDelete(productToDelete)}
                  className="flex-1 py-3 bg-error text-white rounded-xl font-bold shadow-lg shadow-error/20 hover:opacity-90 transition-all"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {(editingProduct || showAddProduct) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setEditingProduct(null); setShowAddProduct(false); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-surface w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black font-headline">
                    {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                  </h3>
                  <button onClick={() => { setEditingProduct(null); setShowAddProduct(false); }} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const data = Object.fromEntries(formData.entries());
                  handleSave({
                    ...(editingProduct || {}),
                    name: data.name,
                    sku: data.sku,
                    category: data.category,
                    stock: parseInt(data.stock as string),
                    cost: parseInt(data.cost as string),
                    price: parseInt(data.price as string),
                    margin: Math.round(((parseInt(data.price as string) - parseInt(data.cost as string)) / parseInt(data.price as string)) * 100),
                    image: data.image || 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=100&q=80'
                  });
                }} className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Nombre del Producto</label>
                    <input name="name" defaultValue={editingProduct?.name} required className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-secondary/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">SKU</label>
                    <input name="sku" defaultValue={editingProduct?.sku} required className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-secondary/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Categoría</label>
                    <select 
                      name="category" 
                      defaultValue={editingProduct?.category} 
                      required 
                      className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-secondary/20"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Costo (CLP)</label>
                    <input name="cost" type="number" defaultValue={editingProduct?.cost} required className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-secondary/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Precio Venta (CLP)</label>
                    <input name="price" type="number" defaultValue={editingProduct?.price} required className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-secondary/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Stock Inicial</label>
                    <input name="stock" type="number" defaultValue={editingProduct?.stock} required className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-secondary/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">URL Imagen</label>
                    <input name="image" defaultValue={editingProduct?.image} className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-secondary/20" />
                  </div>
                  <div className="col-span-2 mt-4">
                    <button type="submit" className="w-full bg-secondary text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                      {editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {viewingProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingProduct(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-surface w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-8"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black font-headline text-[#0F172A]">Detalle de Venta</h3>
                  <p className="text-secondary font-bold text-sm">Folio: #{viewingProduct.id.toString().slice(-8)}</p>
                </div>
                <button onClick={() => setViewingProduct(null)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase">Fecha</p>
                  <p className="font-bold text-sm">{new Date(viewingProduct.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase">Hora</p>
                  <p className="font-bold text-sm">{new Date(viewingProduct.date).toLocaleTimeString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase">Vendedor</p>
                  <p className="font-bold text-sm">Admin Vantory</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase">Medio Pago</p>
                  <p className="font-bold text-sm">{viewingProduct.paymentMethod}</p>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-4">Productos</p>
                <div className="space-y-3">
                  {viewingProduct.cart.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center bg-surface-container-low p-4 rounded-xl">
                      <div>
                        <p className="font-bold text-sm">{item.name}</p>
                        <p className="text-xs text-on-surface-variant">Cant: {item.quantity} x ${item.price.toLocaleString('es-CL')}</p>
                      </div>
                      <p className="font-black text-sm">${(item.price * item.quantity).toLocaleString('es-CL')}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 mb-8 border-t border-outline-variant/20 pt-4">
                <div className="flex justify-between text-sm">
                  <p className="text-on-surface-variant">Subtotal</p>
                  <p className="font-bold">${Math.round(viewingProduct.total / 1.19).toLocaleString('es-CL')}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-on-surface-variant">IVA (19%)</p>
                  <p className="font-bold">${Math.round(viewingProduct.total - (viewingProduct.total / 1.19)).toLocaleString('es-CL')}</p>
                </div>
                <div className="flex justify-between text-lg pt-2">
                  <p className="font-black">TOTAL</p>
                  <p className="font-black text-secondary">${viewingProduct.total.toLocaleString('es-CL')}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showBulkUpload && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBulkUpload(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-surface w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black font-headline">Carga <span className="text-secondary">Masiva</span></h3>
                  <button onClick={() => setShowBulkUpload(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="bg-secondary/5 border-2 border-dashed border-secondary/20 rounded-3xl p-10 flex flex-col items-center text-center mb-6">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center text-secondary mb-4">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">Arrastra tu archivo aquí</h4>
                  <p className="text-sm text-on-surface-variant mb-6">Soporta formatos .xlsx, .xls y .csv</p>
                  <input 
                    type="file" 
                    id="bulk-file" 
                    className="hidden" 
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                  />
                  <label 
                    htmlFor="bulk-file"
                    className="bg-secondary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-secondary/20 cursor-pointer hover:opacity-90 transition-all"
                  >
                    Seleccionar Archivo
                  </label>
                </div>

                <div className="bg-surface-container-low p-4 rounded-2xl mb-8">
                  <h5 className="text-xs font-black uppercase tracking-widest mb-3 text-secondary">Estructura Requerida (Encabezados)</h5>
                  <div className="flex flex-wrap gap-2">
                    {['sku', 'nombre', 'categoria', 'costo', 'precio', 'stock', 'imagen_url'].map(h => (
                      <span key={h} className="bg-white px-3 py-1 rounded-lg text-[10px] font-bold border border-outline-variant/20">{h}</span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 text-secondary font-bold text-sm hover:underline">Descargar Plantilla</button>
                  <button onClick={() => setShowBulkUpload(false)} className="px-8 py-3 bg-surface-container-high rounded-xl font-bold">Cancelar</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const UsersManagement = ({ setCurrentPage, users, setUsers, currentUser, setCurrentUser, stores, currentStore, currentPOS }: { setCurrentPage: (page: any) => void, users: any[], setUsers: any, currentUser: any, setCurrentUser: any, stores: any[], currentStore: any, currentPOS: any }) => {
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value;
    const role = (form.elements.namedItem('role') as HTMLSelectElement).value;
    const status = (form.elements.namedItem('status') as HTMLSelectElement).value;
    const storeId = (form.elements.namedItem('storeId') as HTMLSelectElement).value;
    
    const modulesCheckboxes = form.querySelectorAll('input[name="modules"]:checked') as NodeListOf<HTMLInputElement>;
    let modules = Array.from(modulesCheckboxes).map(cb => cb.value);

    // If no modules selected, use defaults based on role
    if (modules.length === 0) {
      if (role === 'Cajero') {
        modules = ['sales', 'history', 'fiados'];
      } else if (role === 'Supervisor') {
        modules = ['inventory', 'sales', 'history', 'entries', 'fiados'];
      } else {
        modules = ['dashboard', 'inventory', 'sales', 'history', 'entries', 'kpis', 'users', 'fiados'];
      }
    }

    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, name, email, role, status, modules, storeId: storeId ? parseInt(storeId) : null, ...(password ? { password } : {}) } : u));
    } else {
      setUsers([...users, { 
        id: Date.now(), 
        name, 
        email, 
        password,
        role, 
        status, 
        modules,
        storeId: storeId ? parseInt(storeId) : null,
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80' 
      }]);
    }
    setShowUserModal(false);
    setEditingUser(null);
  };

  return (
    <div className="flex min-h-screen bg-surface text-on-surface font-body">
      <SideNavBar currentPage="users" setCurrentPage={setCurrentPage} currentUser={currentUser} users={users} setCurrentUser={setCurrentUser} currentStore={currentStore} currentPOS={currentPOS} />
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto p-8">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black text-[#0F172A] font-headline mb-1">Gestión de <span className="text-secondary">Usuarios</span></h1>
            <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-3">SISTEMA &gt; CONFIGURACIÓN</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f2f3ff] transition-colors relative">
              <Bell className="w-5 h-5 text-on-surface-variant" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-outline-variant/30 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-on-surface leading-none">Admin Vantory</p>
                <p className="text-[10px] text-on-surface-variant">Soporte Técnico</p>
              </div>
              <img 
                alt="User profile" 
                className="w-10 h-10 rounded-full border-2 border-surface-container-highest object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPTOJksruGaNQm6gW0cTKsmHx_gthleGI0Hy70R56Q1oJ4i9lW0iL4JU8oXMoZAshoKE8S3a1-5NvKCV26POVasYgktSZtJpP6RHaMYbMEtqakjdL7rtnYFQso4Kzl5w6R3449pD-nViJIAngGkUqQijX4Zz9xtfKBk4SztlssTnGEGmOQeqPZsahAs-DUJ7tdh68w9VguZXCBAxiCk5XRvvm-GQdW31C8hvfujnZJlbpJ3SVzXGcnVimo2ARlMqv9ks88IY_RN2o_" 
              />
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-error-container/20 text-error transition-colors ml-2" title="Cerrar Sesión">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="w-full space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <p className="text-[#0F172A]/70 font-bold text-lg max-w-lg">Administra el acceso y permisos de tu equipo. Crea nuevos perfiles y define roles específicos.</p>
            <button 
              onClick={() => { setEditingUser(null); setShowUserModal(true); }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-secondary to-on-secondary-container text-white font-bold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
            >
              <UserPlus className="w-5 h-5" />
              <span>Nuevo Usuario</span>
            </button>
          </div>

          <section className="bg-white rounded-3xl overflow-hidden shadow-sm border border-outline-variant/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-secondary text-white text-xs uppercase tracking-wider font-bold">
                    <th className="px-8 py-5">Usuario</th>
                    <th className="px-8 py-5">Email</th>
                    <th className="px-8 py-5">Rol</th>
                    <th className="px-8 py-5">Estado</th>
                    <th className="px-8 py-5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-surface-container-high/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <img className="w-10 h-10 rounded-full object-cover border border-outline-variant/20" src={user.image} alt={user.name} />
                          <span className="font-bold text-on-surface">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-on-surface-variant font-medium">{user.email}</td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${
                          user.role === 'Admin' ? 'bg-indigo-600 text-white shadow-sm' : 
                          user.role === 'Cajero' ? 'bg-emerald-500 text-white shadow-sm' :
                          user.role === 'Supervisor' ? 'bg-amber-500 text-white shadow-sm' :
                          'bg-slate-500 text-white shadow-sm'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${user.status === 'Activo' ? 'bg-green-500' : 'bg-outline-variant'}`}></span>
                          <span className={`text-sm font-semibold ${user.status === 'Activo' ? 'text-green-700' : 'text-outline'}`}>{user.status}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => { setEditingUser(user); setShowUserModal(true); }}
                            className="p-2 hover:bg-surface-container rounded-lg text-secondary transition-colors"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => {
                              if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
                                setUsers(users.filter(u => u.id !== user.id));
                              }
                            }}
                            className="p-2 hover:bg-error-container text-error rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-on-surface font-headline">Permisos por <span className="text-secondary">Rol</span></h2>
              <button className="text-secondary text-sm font-bold hover:underline">Gestionar Roles Especiales</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-surface-container-low rounded-3xl p-8 border border-secondary/5">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary-container text-white flex items-center justify-center rounded-2xl animate-pulse">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-on-surface animate-pulse">Administrador</h3>
                    <div className="h-0.5 w-16 bg-secondary mt-1"></div>
                    <p className="text-xs text-on-surface-variant font-medium mt-2">Control total sobre el sistema y finanzas.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {['Gestión de Inventario', 'Ventas y Facturación', 'Márgenes y KPIs Financieros', 'Historial y Eliminación de Datos'].map((perm) => (
                    <div key={perm} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-outline-variant/10">
                      <span className="text-sm font-semibold text-on-surface-variant">{perm}</span>
                      <CheckCircle className="w-5 h-5 text-green-600 fill-green-600/10" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface-container-low rounded-3xl p-8 border border-secondary/5">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-secondary text-white flex items-center justify-center rounded-2xl animate-pulse">
                    <Monitor className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-on-surface animate-pulse">Vendedor</h3>
                    <div className="h-0.5 w-16 bg-secondary mt-1"></div>
                    <p className="text-xs text-on-surface-variant font-medium mt-2">Acceso limitado a la sala de ventas.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-outline-variant/10">
                    <span className="text-sm font-semibold text-on-surface-variant">Gestión de Inventario (Solo lectura)</span>
                    <CheckCircle className="w-5 h-5 text-green-600 fill-green-600/10" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-outline-variant/10">
                    <span className="text-sm font-semibold text-on-surface-variant">Ventas y Facturación</span>
                    <CheckCircle className="w-5 h-5 text-green-600 fill-green-600/10" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-outline-variant/10 opacity-60">
                    <span className="text-sm font-semibold text-on-surface-variant">Márgenes y KPIs Financieros</span>
                    <X className="w-5 h-5 text-error" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-outline-variant/10 opacity-60">
                    <span className="text-sm font-semibold text-on-surface-variant">Historial y Eliminación de Datos</span>
                    <X className="w-5 h-5 text-error" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="bg-surface-container-high/40 p-8 rounded-3xl flex items-center gap-6 border border-outline-variant/10">
            <div className="p-4 bg-white rounded-full text-secondary shadow-sm">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-on-surface">¿Necesitas perfiles personalizados?</h4>
              <p className="text-sm text-on-surface-variant font-medium">Puedes crear roles con permisos granulares desde la sección de Roles Avanzados si tu suscripción lo permite.</p>
            </div>
            <button className="ml-auto px-6 py-3 bg-white text-secondary text-sm font-bold rounded-xl border border-outline-variant/20 hover:bg-surface-container-low transition-all shadow-sm">
              Ver Documentación
            </button>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showUserModal && (
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
                  <h3 className="text-2xl font-black text-[#0F172A] font-headline">{editingUser ? 'Editar' : 'Nuevo'} <span className="text-secondary">Usuario</span></h3>
                </div>
                <button onClick={() => setShowUserModal(false)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
                  <X className="w-6 h-6 text-[#0F172A]" />
                </button>
              </div>

              <form onSubmit={handleSaveUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#0F172A] mb-1">Nombre Completo</label>
                    <input 
                      name="name"
                      type="text" 
                      required
                      defaultValue={editingUser?.name}
                      className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-sm font-medium text-[#0F172A] focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0F172A] mb-1">Correo Electrónico</label>
                    <input 
                      name="email"
                      type="email" 
                      required
                      defaultValue={editingUser?.email}
                      className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-sm font-medium text-[#0F172A] focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0F172A] mb-1">Contraseña {editingUser && <span className="text-xs text-outline-variant font-normal">(Opcional)</span>}</label>
                    <input 
                      name="password"
                      type="password" 
                      required={!editingUser}
                      className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-sm font-medium text-[#0F172A] focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0F172A] mb-1">Rol</label>
                    <select 
                      name="role"
                      required
                      defaultValue={editingUser?.role || 'Cajero'}
                      className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-sm font-medium text-[#0F172A] focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                    >
                      <option value="Administrador">Administrador</option>
                      <option value="Supervisor">Supervisor</option>
                      <option value="Cajero">Cajero</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0F172A] mb-1">Local Asignado</label>
                    <select 
                      name="storeId"
                      defaultValue={editingUser?.storeId || ''}
                      className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-sm font-medium text-[#0F172A] focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                    >
                      <option value="">Todos los locales (Global)</option>
                      {stores.map((store: any) => (
                        <option key={store.id} value={store.id}>{store.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0F172A] mb-1">Estado</label>
                    <select 
                      name="status"
                      required
                      defaultValue={editingUser?.status || 'Activo'}
                      className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-sm font-medium text-[#0F172A] focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0F172A] mb-2">Módulos Permitidos</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'dashboard', label: 'Dashboard' },
                      { id: 'inventory', label: 'Inventario' },
                      { id: 'sales', label: 'Ventas' },
                      { id: 'history', label: 'Historial' },
                      { id: 'entries', label: 'Entradas' },
                      { id: 'kpis', label: 'KPIs' },
                      { id: 'users', label: 'Usuarios' },
                      { id: 'fiados', label: 'Fiados' }
                    ].map(module => (
                      <label key={module.id} className="flex items-center gap-2 p-2 bg-surface-container-low rounded-lg cursor-pointer hover:bg-surface-container-high transition-colors">
                        <input 
                          type="checkbox" 
                          name="modules" 
                          value={module.id} 
                          defaultChecked={editingUser ? editingUser.modules?.includes(module.id) : ['sales', 'history'].includes(module.id)}
                          className="w-4 h-4 text-secondary rounded border-outline-variant/30 focus:ring-secondary"
                        />
                        <span className="text-xs font-bold text-[#0F172A]">{module.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowUserModal(false)} className="flex-1 py-3 px-4 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl font-bold transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" className="flex-[2] py-3 px-4 bg-secondary text-white rounded-xl font-bold hover:bg-secondary/90 transition-colors shadow-lg shadow-secondary/20">
                    Guardar Usuario
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FiadosDashboard = ({ setCurrentPage, fiados, setFiados, currentUser, users, setCurrentUser, currentStore, currentPOS }: { setCurrentPage: (page: any) => void, fiados: any[], setFiados: any, currentUser: any, users: any[], setCurrentUser: any, currentStore: any, currentPOS: any }) => {
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
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto p-8">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black text-[#0F172A] font-headline mb-1">Gestión de <span className="text-secondary">Fiados</span></h1>
            <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-3">OPERACIONES &gt; FIADOS</p>
          </div>
        </header>

        <div className="w-full space-y-8">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-outline-variant/10 flex flex-col">
              <span className="text-xs font-black text-outline-variant uppercase tracking-widest mb-2">Total por Cobrar</span>
              <span className="text-4xl font-black text-error">${totalDebtAll.toLocaleString('es-CL')}</span>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-outline-variant/10 flex flex-col">
              <span className="text-xs font-black text-outline-variant uppercase tracking-widest mb-2">Clientes con Deuda</span>
              <span className="text-4xl font-black text-[#0F172A]">{clientsWithDebt}</span>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-outline-variant/10 flex flex-col">
              <span className="text-xs font-black text-outline-variant uppercase tracking-widest mb-2">Abonado este Mes</span>
              <span className="text-4xl font-black text-green-600">${totalPaidThisMonth.toLocaleString('es-CL')}</span>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-outline-variant/10">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant" />
              <input 
                type="text" 
                placeholder="Buscar por nombre o teléfono..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-sm font-medium text-[#0F172A] focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
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

          <section className="bg-white rounded-3xl overflow-hidden shadow-sm border border-outline-variant/10">
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
    </div>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'features' | 'blog' | 'login' | 'lobby' | 'sales' | 'customer-view' | 'inventory' | 'dashboard' | 'history' | 'entries' | 'kpis' | 'users' | 'fiados' | 'superadmin-dashboard' | 'superadmin-clients' | 'superadmin-client-profile' | 'suspended'>('home');
  const [vantoryClients, setVantoryClients] = useState(() => {
    const saved = localStorage.getItem('vantory_saas_clients');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Minimarket Don Tito', email: 'duoc@gmail.com', maxStores: 3, maxPosPerStore: 2, status: 'Activo', mrr: 49990, joinDate: '2024-01-15' },
      { id: 2, name: 'Ferretería San Juan', email: 'contacto@sanjuan.cl', maxStores: 1, maxPosPerStore: 1, status: 'Activo', mrr: 29990, joinDate: '2024-02-20' },
      { id: 3, name: 'Botillería El Paso', email: 'admin@elpaso.cl', maxStores: 1, maxPosPerStore: 2, status: 'Suspendido', mrr: 29990, joinDate: '2023-11-05' }
    ];
  });
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [stores, setStores] = useState(() => {
    const saved = localStorage.getItem('vantory_stores');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Local Centro', pin: '1234', address: 'Av. Principal 123' },
      { id: 2, name: 'Sucursal Norte', pin: '1234', address: 'Plaza Norte 456' },
      { id: 3, name: 'Bodega Sur', pin: '1234', address: 'Parque Industrial 789' }
    ];
  });
  const [posMachines, setPosMachines] = useState(() => {
    const saved = localStorage.getItem('vantory_pos');
    return saved ? JSON.parse(saved) : [
      { id: 1, storeId: 1, name: 'Caja 1' },
      { id: 2, storeId: 1, name: 'Caja 2' },
      { id: 3, storeId: 2, name: 'Caja 1' },
      { id: 4, storeId: 3, name: 'Caja 1' }
    ];
  });
  const [currentStore, setCurrentStore] = useState<any>(null);
  const [currentPOS, setCurrentPOS] = useState<any>(null);
  const [salesHistory, setSalesHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('vantory_sales_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [stockEntries, setStockEntries] = useState<any[]>(() => {
    const saved = localStorage.getItem('vantory_stock_entries');
    return saved ? JSON.parse(saved) : [
      { id: 1, clientId: 1, folio: 'ENT-4829', productName: 'iPhone 15 Pro Max 256GB', productId: 101, quantity: 24, date: '27 Oct, 23', user: 'J. Delgado', image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=100&q=80' },
      { id: 2, clientId: 1, folio: 'ENT-4828', productName: 'MacBook Air M2 13"', productId: 102, quantity: 10, date: '27 Oct, 23', user: 'A. María', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=100&q=80' },
    ];
  });
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('vantory_inventory');
    return saved ? JSON.parse(saved) : [
      { id: 1, clientId: 1, name: 'Cerveza Corona 330cc', category: 'Cerveza', cost: 900, price: 1500, stock: 48, sku: '7801', isFavorite: true, image: 'https://images.unsplash.com/photo-1614315584058-2200ed432b4b?auto=format&fit=crop&w=100&q=80' },
      { id: 2, clientId: 1, name: 'Pisco Mistral 35° 750cc', category: 'Licor', cost: 5000, price: 8500, stock: 12, sku: '7802', isFavorite: true, image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=100&q=80' },
      { id: 3, clientId: 1, name: 'Coca Cola 1.5L', category: 'Bebida', cost: 1200, price: 2100, stock: 5, sku: '7803', isFavorite: true, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=100&q=80' },
      { id: 4, clientId: 1, name: 'Papas Lays Clásicas 250g', category: 'Snacks', cost: 1500, price: 2800, stock: 15, sku: '7804', isFavorite: false, image: 'https://images.unsplash.com/photo-1566478989037-e924e5bbc31e?auto=format&fit=crop&w=100&q=80' },
    ];
  });
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('vantory_categories');
    return saved ? JSON.parse(saved) : ['Cerveza', 'Licor', 'Bebida', 'Snacks', 'Abarrotes', 'Limpieza'];
  });
  const [cashRegisters, setCashRegisters] = useState<any[]>(() => {
    const saved = localStorage.getItem('vantory_cash_registers');
    return saved ? JSON.parse(saved) : [];
  });
  const [cashHistory, setCashHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('vantory_cash_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [showCashRegisterModal, setShowCashRegisterModal] = useState(false);
  const [users, setUsers] = useState<any[]>(() => {
    const saved = localStorage.getItem('vantory_users');
    let parsedUsers = saved ? JSON.parse(saved) : [
      { id: 1, clientId: 1, name: 'Admin Duoc', email: 'duoc@gmail.com', role: 'Administrador', status: 'Activo', modules: ['dashboard', 'inventory', 'sales', 'history', 'entries', 'kpis', 'users', 'fiados'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfLVv6ohrtIE1tV50hhfzyQoC_-ADrxKzmlZGDV-3q0wsLG0oX1rxHZAoGZubgfK_a8kAW7lNR4uR2hH9puFiqXk8uIk4cma4AtWee_CyfKF6Xp6ht64UImKASzqOvK5H9W5VV4O0aN6kidyheXojT3g5eweScDgb6ozL_VXSkV-76BPplDQ5Tv0RM7pj3-HTx49aYz2-_7Ugx32bVbSsdFpsgKrwX2L-igWxXkTVYVROb1d68R9o1_2kMqMveMbfIrDNeV36iemdh' },
      { id: 2, clientId: 1, name: 'Ricardo Soto', email: 'ricardo.soto@vantory.com', role: 'Cajero', status: 'Activo', modules: ['sales', 'history', 'fiados'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANLhG_VqVE9P2D6Y4Abt1EQQ6w4JzEk58-YOcokpbSuUEffULDW93Tw8zOeyen6LcqT2ayW9xRArIzn3W-KFIUxncjNunCHp2r_o96Hu_0uTQJSeiJ6GZjbjwK3MFaluU-O9uZ7_Z0QkaSIgWB-RJ59ueEM2ZWmfnQumxlTlZm14o7Xp9Cm7OV1h37XpeU73u-13lIgfcLTX9O8vZ5rdQR7M0FTTitZ449lqKcBW58Xa0BL9dGUdzP20WogyQUNh3Y-hFEXEsYYeJU' },
      { id: 3, clientId: 1, name: 'Camila Torres', email: 'camila.torres@vantory.com', role: 'Supervisor', status: 'Inactivo', modules: ['inventory', 'sales', 'history', 'entries', 'fiados'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2YwVdB_b2QnQwBF9HvODyoio55om9Cz0GFv0X3U2Aixo5U7V8wifpn0nvDDQxr5Gz6yK3VeFBp3iffrOS8ZIZO02de7auqPEKchOxNsqfbuG_sxCaWPhIu0aI4e29svlAFLeM3foK1ZJmTx2cjqxn20Gwvk8M_DxY-aSiFRSb491Fy2oZeUx-y6AambRwHtW_cc7CgrjDmVX3Cfk6FrosdizQqEglYknaujnW2wXppRO5p5DSk_wKyY2_0HzLqI9ryegATyXQYzhD' },
    ];
    
    // Auto-grant fiados to Admin if missing
    parsedUsers = parsedUsers.map((u: any) => {
      if (u.role === 'Administrador' && !u.modules.includes('fiados')) {
        return { ...u, modules: [...u.modules, 'fiados'] };
      }
      return u;
    });
    
    return parsedUsers;
  });
  const [fiados, setFiados] = useState<any[]>(() => {
    const saved = localStorage.getItem('vantory_fiados');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('vantory_sales_history', JSON.stringify(salesHistory));
  }, [salesHistory]);

  useEffect(() => {
    localStorage.setItem('vantory_stock_entries', JSON.stringify(stockEntries));
  }, [stockEntries]);

  useEffect(() => {
    localStorage.setItem('vantory_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('vantory_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('vantory_cash_registers', JSON.stringify(cashRegisters));
  }, [cashRegisters]);

  useEffect(() => {
    localStorage.setItem('vantory_fiados', JSON.stringify(fiados));
  }, [fiados]);

  useEffect(() => {
    localStorage.setItem('vantory_cash_history', JSON.stringify(cashHistory));
  }, [cashHistory]);

  useEffect(() => {
    localStorage.setItem('vantory_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('vantory_saas_clients', JSON.stringify(vantoryClients));
  }, [vantoryClients]);

  useEffect(() => {
    localStorage.setItem('vantory_stores', JSON.stringify(stores));
  }, [stores]);

  useEffect(() => {
    localStorage.setItem('vantory_pos', JSON.stringify(posMachines));
  }, [posMachines]);

  // Cross-tab sync: reload inventory/sales when another tab makes changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'vantory_inventory' && e.newValue) setInventory(JSON.parse(e.newValue));
      if (e.key === 'vantory_sales_history' && e.newValue) setSalesHistory(JSON.parse(e.newValue));
      if (e.key === 'vantory_stock_entries' && e.newValue) setStockEntries(JSON.parse(e.newValue));
      if (e.key === 'vantory_cash_registers' && e.newValue) setCashRegisters(JSON.parse(e.newValue));
      if (e.key === 'vantory_fiados' && e.newValue) setFiados(JSON.parse(e.newValue));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loginError, setLoginError] = useState<string>('');

  // Route protection
  useEffect(() => {
    if (currentUser && currentUser.modules) {
      const protectedPages = ['dashboard', 'inventory', 'sales', 'history', 'entries', 'kpis', 'users', 'fiados'];
      if (protectedPages.includes(currentPage) && !currentUser.modules.includes(currentPage)) {
        setCurrentPage(currentUser.modules[0] || 'sales');
      }
    }
  }, [currentPage, currentUser]);

  // --- Data Isolation Helpers ---
  const activeClientId = currentUser?.clientId || 1;
  const activePosId = currentPOS?.id || 1;

  const createClientSetter = (globalSetter: any) => (action: any) => {
    globalSetter((prev: any[]) => {
      const otherData = prev.filter((item: any) => item.clientId !== activeClientId);
      const clientData = prev.filter((item: any) => item.clientId === activeClientId);
      let newClientData = typeof action === 'function' ? action(clientData) : action;
      newClientData = newClientData.map((item: any) => ({ ...item, clientId: activeClientId }));
      return [...otherData, ...newClientData];
    });
  };

  const clientInventory = inventory.filter(i => i.clientId === activeClientId);
  const setClientInventory = createClientSetter(setInventory);

  const clientSalesHistory = salesHistory.filter(s => s.clientId === activeClientId);
  const setClientSalesHistory = createClientSetter(setSalesHistory);

  const clientStockEntries = stockEntries.filter(e => e.clientId === activeClientId);
  const setClientStockEntries = createClientSetter(setStockEntries);

  const clientStores = stores.filter(s => s.clientId === activeClientId);
  const setClientStores = createClientSetter(setStores);

  const clientUsers = users.filter(u => u.clientId === activeClientId);
  const setClientUsers = createClientSetter(setUsers);

  const clientFiados = fiados.filter(f => f.clientId === activeClientId);
  const setClientFiados = createClientSetter(setFiados);

  const clientCashHistory = cashHistory.filter(h => h.clientId === activeClientId && h.posId === activePosId);
  const setClientCashHistory = (action: any) => {
    setCashHistory((prev: any[]) => {
      const otherData = prev.filter((item: any) => !(item.clientId === activeClientId && item.posId === activePosId));
      const clientData = prev.filter((item: any) => item.clientId === activeClientId && item.posId === activePosId);
      let newClientData = typeof action === 'function' ? action(clientData) : action;
      newClientData = newClientData.map((item: any) => ({ ...item, clientId: activeClientId, posId: activePosId }));
      return [...otherData, ...newClientData];
    });
  };

  const clientCashRegister = cashRegisters.find(cr => cr.posId === activePosId) || { isOpen: false, initialCash: 0, currentCash: 0, openedAt: null };
  const setClientCashRegister = (newRegister: any) => {
    setCashRegisters(prev => {
      const others = prev.filter(cr => cr.posId !== activePosId);
      return [...others, { ...newRegister, posId: activePosId }];
    });
  };
  // ------------------------------

  useEffect(() => {
    if (users.length > 0 && !currentUser) {
      setCurrentUser(users[0]);
    }
  }, [users, currentUser]);

  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | null>(null);
  const [showCookies, setShowCookies] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [viewingSale, setViewingSale] = useState<any | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'customer') {
      setCurrentPage('customer-view');
    }
  }, []);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowCookies(true);
    }
  }, []);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const FeaturesPage = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-24"
    >
      <div className="container mx-auto px-6 md:px-12">
        <motion.button 
          onClick={() => setCurrentPage('home')}
          whileHover={{ x: -5 }}
          className="flex items-center gap-2 text-secondary font-bold mb-12 group"
        >
          <ArrowLeft className="w-5 h-5" /> Volver al inicio
        </motion.button>

        <div className="max-w-4xl mb-20">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tighter text-on-surface font-headline mb-6"
          >
            Funcionalidades <span className="text-secondary">Avanzadas</span>
          </motion.h1>
          <p className="text-xl md:text-2xl text-on-surface-variant leading-relaxed">
            Una plataforma diseñada para cubrir cada ángulo de tu negocio, desde el almacén hasta la pantalla del cliente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature Cards */}
          <FeatureCard 
            icon={<Database className="w-6 h-6" />}
            title="Carga Masiva"
            description="Importa miles de SKUs en segundos con nuestra herramienta de validación inteligente de inventario."
          />
          <FeatureCard 
            icon={<LineChart className="w-6 h-6" />}
            title="KPIs en Tiempo Real"
            description="Visualiza métricas clave de rendimiento al instante para tomar decisiones basadas en datos reales."
          />
          <FeatureCard 
            icon={<Globe className="w-6 h-6" />}
            title="Inventario Cloud"
            description="Accede y gestiona tu stock desde cualquier lugar del país con conexión a internet (Versión Cloud)."
          />
          <FeatureCard 
            icon={<Laptop className="w-6 h-6" />}
            title="Sincronización Local"
            description="Visualización en tiempo real de forma local para máxima velocidad y estabilidad (Versión Local)."
          />
          <FeatureCard 
            icon={<History className="w-6 h-6" />}
            title="Trazabilidad Completa"
            description="Registro detallado de todas las entradas y salidas. Control total sobre el historial de cada producto."
          />
          <FeatureCard 
            icon={<TrendingUp className="w-6 h-6" />}
            title="Dashboards de Venta"
            description="Paneles interactivos con reportes diarios, semanales y mensuales de tu rendimiento comercial."
          />
          <FeatureCard 
            icon={<Barcode className="w-6 h-6" />}
            title="Picking con Código de Barras"
            description="Agiliza tus ventas utilizando lectores de códigos de barras para una facturación rápida y sin errores."
          />
          <FeatureCard 
            icon={<Zap className="w-6 h-6" />}
            title="Cálculo Inteligente"
            description="Gestión automática de totales y cálculo exacto de vuelto para una atención al cliente impecable."
          />
          <FeatureCard 
            icon={<Monitor className="w-6 h-6" />}
            title="Pantalla del Cliente"
            description="Segunda pantalla dedicada para que el cliente vea su carrito de compras y total en tiempo real."
          />
          <FeatureCard 
            icon={<Users className="w-6 h-6" />}
            title="Roles y Permisos"
            description="Configuración avanzada de usuarios. Decide exactamente quién puede ver y editar cada módulo."
          />
        </div>

        {/* Detailed Comparison Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 bg-surface-container-low rounded-[3rem] p-12 md:p-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold font-headline mb-6">Flexibilidad en el <span className="text-secondary">Despliegue</span></h2>
              <p className="text-lg text-on-surface-variant mb-8">
                Entendemos que cada negocio tiene necesidades diferentes. Por eso ofrecemos dos modalidades de implementación que mantienen la misma potencia operativa.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <Cloud className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-1">Versión Cloud</h4>
                    <p className="text-on-surface-variant">Ideal para dueños que necesitan supervisar múltiples sucursales desde cualquier lugar.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <Laptop className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-1">Versión Local</h4>
                    <p className="text-on-surface-variant">Perfecta para alta velocidad de respuesta en el punto de venta sin depender de internet.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-surface-container-low">
              <img 
                className="rounded-2xl w-full" 
                alt="System interface" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuByeH3TDQgG2kDmuNrOYsxPnO0wZIbVR703AosmigU2pginGG_BZ-k0MV0TNPF5km--ReWQbAEvZigZ9ZpHgCjmRRHW4TuKFvZ5bv9-S9eM4-pMcXnFs8P00LP4ankeWQT8mMkZnKmkPoEst49nG2FVyKXWPtwyBbDNLz3Mc1672wX0Z6TVX-EiOoSUzk_W4kHMxK3GFUKHyyGXmBskXIGPsgNDHI59kyMBzXqpi7nF-k_lTuWUG5qxd7DqVQf1cUdavBkp3y3-FeCX" 
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  const BlogPage = () => {
    const posts = [
      {
        id: 1,
        title: "La Revolución del POS en la Nube: Más que una Tendencia",
        date: "15 Oct, 2024",
        category: "Tecnología",
        excerpt: "¿Por qué las empresas chilenas están migrando masivamente a sistemas Cloud? Analizamos la eficiencia, escalabilidad y seguridad de la nube.",
        content: `
          <p class="text-lg mb-6">El panorama del retail en Chile está cambiando a una velocidad sin precedentes. Ya no basta con tener una caja registradora; hoy se necesita un centro de comando inteligente. La migración a sistemas POS basados en la nube no es solo una cuestión de modernidad, sino de supervivencia competitiva.</p>
          
          <h3 class="text-2xl font-bold text-on-surface mb-4">Inventario en Tiempo Real desde Cualquier Lugar</h3>
          <p class="mb-6">Con la versión Cloud de VANTORY POS 360, puedes supervisar tu stock en tiempo real desde cualquier rincón del país. Ya sea que estés en Arica o Punta Arenas, mientras tengas conexión a internet, tendrás el control total de tus existencias.</p>
          
          <div class="bg-secondary/5 border-l-4 border-secondary p-6 my-8 rounded-r-2xl italic text-on-surface-variant">
            "La nube permite que el pequeño comerciante tenga las mismas herramientas de análisis que las grandes cadenas de retail, sin importar su ubicación geográfica."
          </div>

          <h3 class="text-2xl font-bold text-on-surface mb-4">Seguridad y Trazabilidad</h3>
          <p class="mb-6">Nuestro sistema registra cada entrada y salida de productos, ofreciendo una trazabilidad completa. Sabrás exactamente quién, cuándo y por qué se movió un artículo, eliminando las pérdidas desconocidas y optimizando la reposición.</p>
        `,
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: 2,
        title: "Optimización de Inventario con Inteligencia Artificial",
        date: "02 Oct, 2024",
        category: "Innovación",
        excerpt: "Cómo el aprendizaje automático está ayudando a predecir quiebres de stock antes de que ocurran y optimizar tus compras.",
        content: `
          <p class="text-lg mb-6">El exceso de stock inmoviliza capital, mientras que la falta de stock hace perder ventas. La Inteligencia Artificial aplicada a VANTORY POS 360 resuelve este dilema analizando patrones históricos de venta.</p>
          
          <h3 class="text-2xl font-bold text-on-surface mb-4">Carga Masiva y KPIs en Tiempo Real</h3>
          <p class="mb-6">Olvídate de las horas ingresando productos manualmente. Nuestra funcionalidad de carga masiva te permite importar miles de SKUs en segundos. Además, nuestros dashboards te muestran KPIs en tiempo real para que veas el pulso de tu negocio al instante.</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div class="bg-white p-6 rounded-2xl border border-secondary/10 shadow-sm">
              <div class="text-secondary font-bold text-3xl mb-2">30%</div>
              <div class="text-sm text-on-surface-variant">Reducción promedio en mermas por vencimiento.</div>
            </div>
            <div class="bg-white p-6 rounded-2xl border border-secondary/10 shadow-sm">
              <div class="text-secondary font-bold text-3xl mb-2">15%</div>
              <div class="text-sm text-on-surface-variant">Aumento en la rotación de inventario.</div>
            </div>
          </div>

          <h3 class="text-2xl font-bold text-on-surface mb-4">Dashboards de Ventas Personalizados</h3>
          <p class="mb-6">Visualiza tus ventas diarias, semanales y mensuales con gráficos intuitivos. Identifica tus productos estrella y aquellos que necesitan un impulso, todo desde un panel centralizado y fácil de usar.</p>
        `,
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: 3,
        title: "Eficiencia en el Punto de Venta: Rapidez y Precisión",
        date: "28 Sep, 2024",
        category: "Operaciones",
        excerpt: "Descubre cómo agilizar la atención al cliente con herramientas de picking y pantallas secundarias.",
        content: `
          <p class="text-lg mb-6">La rapidez en la caja es fundamental para la satisfacción del cliente. VANTORY POS 360 integra herramientas diseñadas específicamente para acelerar el proceso de venta sin sacrificar la precisión.</p>
          
          <h3 class="text-2xl font-bold text-on-surface mb-4">Picking con Código de Barras</h3>
          <p class="mb-6">Utiliza lectores de códigos de barras para registrar productos al instante. El sistema calcula automáticamente el total y el vuelto exacto, reduciendo errores humanos y tiempos de espera.</p>
          
          <h3 class="text-2xl font-bold text-on-surface mb-4">Transparencia para el Cliente</h3>
          <p class="mb-6">Nuestra configuración permite una pantalla secundaria donde el cliente puede ver su carrito de compras en tiempo real. Esto genera confianza y mejora la experiencia de compra al permitirle verificar cada ítem y su precio antes de pagar.</p>
        `,
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: 4,
        title: "Gestión de Usuarios y Roles de Seguridad",
        date: "10 Sep, 2024",
        category: "Seguridad",
        excerpt: "Controla quién accede a qué información en tu sistema con una gestión de roles avanzada.",
        content: `
          <p class="text-lg mb-6">No todos los empleados necesitan acceso a toda la información financiera o de inventario. La seguridad de tu negocio comienza con un control de acceso granular.</p>
          
          <h3 class="text-2xl font-bold text-on-surface mb-4">Configuración de Usuarios con Roles</h3>
          <p class="mb-6">VANTORY POS 360 te permite crear usuarios con roles específicos. Decide quién puede ver el dashboard de ventas, quién puede realizar cargas masivas de inventario y quién solo tiene acceso al módulo de ventas.</p>
          
          <h3 class="text-2xl font-bold text-on-surface mb-4">Control Total y Auditoría</h3>
          <p class="mb-6">Cada acción en el sistema queda registrada, permitiendo auditorías rápidas y efectivas. Protege la integridad de tus datos y asegura que cada operación sea realizada por personal autorizado.</p>
        `,
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80"
      }
    ];

    if (selectedPost) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="pt-24 pb-24"
        >
          <div className="container mx-auto px-6 md:px-12">
            <button 
              onClick={() => {
                setSelectedPost(null);
                window.scrollTo(0, 0);
              }}
              className="flex items-center gap-2 text-secondary font-bold mb-8 hover:translate-x-[-4px] transition-transform"
            >
              <ArrowLeft className="w-5 h-5" /> Volver al Blog
            </button>

            <div className="max-w-4xl mx-auto">
              <div className="mb-12">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-on-surface font-headline leading-[1.1] mb-6">
                  {selectedPost.title}
                </h1>
                <div className="flex items-center gap-3 mb-8">
                  <span className="px-4 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full uppercase tracking-wider">
                    {selectedPost.category}
                  </span>
                  <span className="text-on-surface-variant text-sm font-medium">{selectedPost.date}</span>
                </div>
                <div className="aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl mb-12">
                  <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>

              <div 
                className="prose prose-lg max-w-none text-on-surface-variant leading-relaxed"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              />

              <div className="mt-20 p-12 bg-secondary/5 rounded-[3rem] border border-secondary/10 text-center">
                <h3 className="text-2xl font-bold mb-4 font-headline">¿Te interesó este tema?</h3>
                <p className="text-on-surface-variant mb-8">Descubre cómo VANTORY POS 360 puede aplicar estas innovaciones en tu negocio hoy mismo.</p>
                <button 
                  onClick={() => {
                    setCurrentPage('home');
                    setSelectedPost(null);
                  }}
                  className="px-8 py-4 bg-secondary text-white font-bold rounded-2xl shadow-xl hover:shadow-secondary/20 transition-all"
                >
                  Ver Soluciones
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pt-24 pb-24"
      >
        <div className="container mx-auto px-6 md:px-12">
          <motion.button 
            onClick={() => setCurrentPage('home')}
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-secondary font-bold mb-12 group"
          >
            <ArrowLeft className="w-5 h-5" /> Volver al inicio
          </motion.button>

          <div className="max-w-4xl mb-16">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-on-surface font-headline mb-6">
              Blog de <span className="text-secondary">Innovación</span>
            </h1>
            <p className="text-xl text-on-surface-variant leading-relaxed">
              Explora las últimas tendencias en tecnología para retail, gestión de inventarios y el futuro de los puntos de venta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {posts.map((post, i) => (
              <motion.article 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => {
                  setSelectedPost(post);
                  window.scrollTo(0, 0);
                }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-[2rem] mb-6 aspect-video">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold text-secondary">
                    {post.date}
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-secondary/60">{post.category}</span>
                  <div className="w-1 h-1 rounded-full bg-secondary/30"></div>
                </div>
                <h3 className="text-2xl font-bold mb-3 font-headline group-hover:text-secondary transition-colors leading-tight">{post.title}</h3>
                <p className="text-on-surface-variant leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                <span className="text-secondary font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                  Leer artículo completo <ArrowRight className="w-4 h-4" />
                </span>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <motion.div 
      whileHover={{ y: -8, borderColor: 'var(--color-secondary)', boxShadow: '0 20px 25px -5px rgba(51, 95, 157, 0.15)' }}
      className="bg-white p-8 rounded-3xl border-2 border-secondary/20 shadow-sm hover:shadow-lg transition-all"
    >
      <div className="w-12 h-12 rounded-xl bg-secondary/5 flex items-center justify-center text-secondary mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 font-headline">{title}</h3>
      <p className="text-on-surface-variant text-sm leading-relaxed">{description}</p>
    </motion.div>
  );

  const LegalModal = ({ type, onClose }: { type: 'privacy' | 'terms', onClose: () => void }) => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-on-surface/20 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white w-full max-w-3xl max-h-[80vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="p-8 border-b border-surface-container-low flex justify-between items-center bg-surface-container-lowest">
          <div className="flex items-center gap-3">
            {type === 'privacy' ? <Shield className="text-secondary" /> : <FileText className="text-secondary" />}
            <h2 className="text-2xl font-bold font-headline">
              {type === 'privacy' ? 'Política de Privacidad' : 'Términos y Condiciones'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto text-on-surface-variant leading-relaxed space-y-6">
          {type === 'privacy' ? (
            <>
              <p>En <strong>VANTORY POS 360</strong>, operado por Vantory Digital, nos tomamos muy en serio la privacidad de sus datos. Esta política detalla cómo recopilamos, usamos y protegemos su información personal conforme a la Ley N° 19.628 sobre Protección de la Vida Privada en Chile.</p>
              <h4 className="font-bold text-on-surface">1. Recopilación de Datos</h4>
              <p>Recopilamos información necesaria para la prestación del servicio, incluyendo nombres, correos electrónicos y datos operativos de su negocio. Estos datos son tratados con estricta confidencialidad.</p>
              <h4 className="font-bold text-on-surface">2. Uso de la Información</h4>
              <p>La información se utiliza exclusivamente para: mejorar la eficiencia del sistema, proporcionar soporte técnico, y enviar actualizaciones críticas del software.</p>
              <h4 className="font-bold text-on-surface">3. Seguridad</h4>
              <p>Implementamos protocolos de seguridad de grado bancario y cifrado SSL para asegurar que su información esté protegida contra accesos no autorizados.</p>
              <h4 className="font-bold text-on-surface">4. Derechos ARCO</h4>
              <p>Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos en cualquier momento escribiendo a contacto@vantorydigital.cl.</p>
            </>
          ) : (
            <>
              <p>Al utilizar <strong>VANTORY POS 360</strong>, usted acepta los siguientes términos y condiciones de uso. Por favor, léalos atentamente.</p>
              <h4 className="font-bold text-on-surface">1. Licencia de Uso</h4>
              <p>Vantory Digital otorga una licencia limitada, no exclusiva y revocable para el uso del software según el plan contratado.</p>
              <h4 className="font-bold text-on-surface">2. Responsabilidades del Usuario</h4>
              <p>El usuario es responsable de mantener la confidencialidad de sus credenciales y de toda la actividad que ocurra bajo su cuenta.</p>
              <h4 className="font-bold text-on-surface">3. Propiedad Intelectual</h4>
              <p>Todo el código, diseño, logotipos y funcionalidades de VANTORY POS 360 son propiedad exclusiva de Vantory Digital y están protegidos por leyes de propiedad intelectual.</p>
              <h4 className="font-bold text-on-surface">4. Limitación de Responsabilidad</h4>
              <p>Vantory Digital no se hace responsable por pérdidas indirectas de datos o lucro cesante derivados del uso del software, aunque garantizamos un uptime del 99.9%.</p>
            </>
          )}
        </div>
        <div className="p-6 border-t border-surface-container-low text-center">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-secondary text-white font-bold rounded-xl hover:shadow-lg transition-all"
          >
            Entendido
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  const CookieBanner = () => (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-[100] bg-white/98 backdrop-blur-3xl p-8 shadow-[0_-25px_60px_-15px_rgba(0,0,0,0.2)] border-t-2 border-secondary/20"
    >
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex gap-6 items-center max-w-3xl">
          <div className="w-16 h-16 shrink-0 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shadow-inner">
            <Shield className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold text-on-surface font-headline">Tu Privacidad es Nuestra Prioridad</h4>
            <p className="text-sm md:text-base text-secondary font-bold leading-relaxed">
              Utilizamos cookies para optimizar tu experiencia, analizar el tráfico y personalizar las funcionalidades de VANTORY POS 360. Al aceptar, nos permites ofrecerte un servicio más rápido y seguro.
            </p>
          </div>
        </div>
        <div className="flex gap-4 w-full lg:w-auto">
          <button 
            onClick={() => {
              localStorage.setItem('cookie-consent', 'false');
              setShowCookies(false);
            }}
            className="flex-1 lg:flex-none px-10 py-4 text-on-surface-variant text-sm font-bold hover:text-secondary transition-all border-2 border-surface-container-high rounded-2xl hover:bg-surface-container-low"
          >
            Rechazar
          </button>
          <button 
            onClick={() => {
              localStorage.setItem('cookie-consent', 'true');
              setShowCookies(false);
            }}
            className="flex-1 lg:flex-none px-12 py-4 bg-secondary text-white text-sm font-bold rounded-2xl shadow-xl shadow-secondary/30 hover:shadow-2xl hover:scale-[1.02] transition-all"
          >
            Aceptar
          </button>
        </div>
      </div>
    </motion.div>
  );

  const LoginPage = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-surface"
    >
      {/* Subtle Background Element for Architectural Depth */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-surface-container-low rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-primary-fixed opacity-30 blur-3xl"></div>
      </div>
      
      {/* Main Content Canvas */}
      <main className="relative z-10 w-full max-w-[480px] px-6 py-12">
        {/* Brand Identity Section */}
        <div className="text-center mb-10">
          <h1 className="font-headline font-extrabold text-2xl tracking-tighter text-on-surface mb-2">VANTORY POS 360</h1>
          <p className="font-label font-medium text-on-surface-variant text-sm tracking-wide">Administración Central</p>
        </div>
        
        {/* Login Card */}
        <div className="bg-surface-container-lowest rounded-xl p-10 shadow-[0_32px_64px_-12px_rgba(19,27,46,0.06)] relative overflow-hidden">
          <div className="mb-6">
            <button 
              onClick={() => setCurrentPage('home')}
              className="inline-flex items-center gap-2 text-secondary hover:text-on-secondary-fixed-variant transition-colors duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 font-bold group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-label font-semibold text-xs tracking-wide uppercase">Volver al inicio</span>
            </button>
          </div>
          
          <header className="mb-8">
            <h2 className="font-headline font-bold text-xl text-on-surface tracking-tight mb-1">Iniciar Sesión</h2>
            <p className="text-on-surface-variant text-sm">Ingrese sus credenciales para continuar.</p>
          </header>
          
          <form className="space-y-6" onSubmit={(e) => { 
            e.preventDefault(); 
            const form = e.target as HTMLFormElement;
            const email = (form.elements.namedItem('usuario') as HTMLInputElement).value;
            const password = (form.elements.namedItem('password') as HTMLInputElement).value;
            
            // Super Admin Login
            if (email === 'contacto@vantorydigital.cl' && password === '1234') {
              setCurrentUser({ name: 'Vantory Admin', email: 'contacto@vantorydigital.cl', role: 'SuperAdmin', modules: [] });
              setCurrentPage('superadmin-dashboard');
              return;
            }

            // Allow duoc@gmail.com / 1234 or existing users
            let user = users.find(u => u.email === email);
            if (!user && email === 'duoc@gmail.com') {
              user = users[0]; // Fallback to admin if not found
            }

            if (!user) {
              setLoginError('Credenciales incorrectas. Verifique su correo y contraseña.');
              return;
            }

            // Check if user's client is suspended
            const userClient = vantoryClients.find((c: any) => c.id === user!.clientId);
            if (userClient?.status === 'Suspendido') {
              setCurrentUser(user);
              setCurrentPage('suspended');
              return;
            }

            setLoginError('');
            setCurrentUser(user);

            // Invisible Scalability Logic
            const clientStoresForLogin = stores.filter((s: any) => s.clientId === user!.clientId || (!s.clientId && user!.clientId === 1));
            if (clientStoresForLogin.length === 1) {
              const storePos = posMachines.filter(p => p.storeId === clientStoresForLogin[0].id);
              if (storePos.length === 1) {
                // Auto-bypass
                setCurrentStore(clientStoresForLogin[0]);
                setCurrentPOS(storePos[0]);
                setCurrentPage('dashboard');
                return;
              }
            }

            // Go to Lobby
            setCurrentPage('lobby');
          }}>
            {/* User Field */}
            <div className="space-y-2">
              <label className="font-label font-medium text-xs text-on-surface-variant tracking-wider" htmlFor="usuario">CORREO ELECTRÓNICO</label>
              <div className="relative group">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-on-primary-container w-5 h-5" />
                <input 
                  className="w-full bg-surface-container-highest/40 border-0 rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-secondary/20 focus:bg-surface-container-lowest transition-all duration-200 outline-none" 
                  id="usuario" 
                  name="usuario" 
                  defaultValue="duoc@gmail.com"
                  placeholder="ejemplo@vantory.com" 
                  type="email"
                  required
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-label font-medium text-xs text-on-surface-variant tracking-wider" htmlFor="password">CONTRASEÑA</label>
                <a className="text-secondary font-medium text-xs hover:underline" href="#">¿Olvidó su contraseña?</a>
              </div>
              <div className="relative group">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-on-primary-container w-5 h-5" />
                <input 
                  className="w-full bg-surface-container-highest/40 border-0 rounded-lg py-4 pl-12 pr-12 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-secondary/20 focus:bg-surface-container-lowest transition-all duration-200 outline-none" 
                  id="password" 
                  name="password" 
                  defaultValue="1234"
                  placeholder="••••••••" 
                  type={showPassword ? "text" : "password"}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            {loginError && (
              <div className="bg-error/10 border border-error/20 text-error text-sm font-bold rounded-lg px-4 py-3">
                {loginError}
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-2">
              <button
                className="bg-gradient-secondary w-full py-4 rounded-lg font-headline font-bold text-white shadow-lg shadow-secondary/20 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                type="submit"
              >
                <span>Ingresar</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
          
          <footer className="mt-10 pt-8 border-t border-surface-container-low text-center">
            <p className="text-on-surface-variant text-sm">
              ¿No tiene una cuenta? <a className="text-secondary font-bold hover:underline" href="mailto:soporte@vantorydigital.cl">Contactar Soporte</a>
            </p>
          </footer>
        </div>
        
        {/* System Status/Metadata */}
        <div className="mt-12 flex flex-col items-center gap-6 opacity-60">
          <div className="flex items-center gap-8 text-xs font-label font-medium text-on-surface-variant">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Acceso Seguro SSL</span>
            </div>
            <div className="flex items-center gap-2">
              <History className="w-4 h-4" />
              <span>v2.4.0 Stable</span>
            </div>
          </div>
          <div className="h-[1px] w-12 bg-outline-variant/30"></div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Desarrollado por Vantory Digital</p>
            <p className="text-[9px] text-on-surface-variant mt-1">Santiago, Chile — 2024</p>
          </div>
        </div>
      </main>
      
      {/* Side Illustration/Texture (Hidden on small screens) */}
      <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1/3 bg-surface-container-low z-0">
        <div className="h-full w-full flex items-center justify-center p-12">
          <div className="space-y-4 max-w-xs">
            <div className="w-16 h-1 bg-secondary rounded-full"></div>
            <h3 className="font-headline font-extrabold text-3xl tracking-tight text-on-surface leading-tight">Gestión Inteligente en un solo lugar.</h3>
            <p className="text-on-surface-variant text-lg font-light leading-relaxed">Simplifica tus ventas e inventarios con la arquitectura más robusta del mercado.</p>
            <div className="pt-8 grid grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest p-4 rounded-xl">
                <LineChart className="text-secondary w-8 h-8 mb-2" />
                <p className="text-xs font-bold text-on-surface">Reportes Real-time</p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl">
                <Package className="text-secondary w-8 h-8 mb-2" />
                <p className="text-xs font-bold text-on-surface">Control de Stock</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const SalesDashboard = ({ inventory, setInventory, onSaleComplete, setCurrentPage, cashRegister, setCashRegister, setShowCashRegisterModal, currentUser, users, setCurrentUser, fiados, setFiados, currentStore, currentPOS }: { inventory: any[], setInventory: (inv: any[]) => void, onSaleComplete: (sale: any) => void, setCurrentPage: (page: any) => void, cashRegister: any, setCashRegister: any, setShowCashRegisterModal: any, currentUser: any, users: any[], setCurrentUser: any, fiados: any[], setFiados: any, currentStore: any, currentPOS: any }) => {
    const [cart, setCart] = useState<any[]>([]);
    const [barcode, setBarcode] = useState('');
    const [showCashModal, setShowCashModal] = useState(false);
    const [amountReceived, setAmountReceived] = useState('');
    const [showCustomerView, setShowCustomerView] = useState(false);
    const [lastScanned, setLastScanned] = useState<{name: string, price: number} | null>(null);

    const [showFiadoModal, setShowFiadoModal] = useState(false);
    const [selectedFiadoClient, setSelectedFiadoClient] = useState('');
    const [newFiadoClient, setNewFiadoClient] = useState({ name: '', phone: '', observation: '', creditLimit: '' });
    const [fiadoDueDate, setFiadoDueDate] = useState(() => {
      const date = new Date();
      date.setDate(date.getDate() + 30); // Default 30 days
      return date.toISOString().split('T')[0];
    });
    const [surcharge, setSurcharge] = useState('');
    const [pausedSales, setPausedSales] = useState<{cart: any[], total: number, timestamp: Date}[]>([]);
    const [showPausedModal, setShowPausedModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [lastSale, setLastSale] = useState<{cart: any[], total: number, change: number, date: Date} | null>(null);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'F10') {
          e.preventDefault();
          if (cart.length > 0) {
            if (!cashRegister.isOpen) {
              setShowCashRegisterModal(true);
              return;
            }
            setShowCashModal(true);
          }
        }
        if (e.key === 'Delete') {
          setCart([]);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [cart]);

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + (parseInt(surcharge) || 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const change = amountReceived ? Math.max(0, parseInt(amountReceived.replace(/\D/g, '')) - total) : 0;

    const playBeep = () => {
      const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
      audio.play().catch(() => {});
    };

    const handleAddToCart = (product: any) => {
      playBeep();
      setLastScanned({ name: product.name, price: product.price });
      const existing = cart.find(item => item.id === product.id);
      if (existing) {
        setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
        setCart([...cart, { ...product, quantity: 1 }]);
      }
    };

    const updateQuantity = (index: number, delta: number) => {
      const newCart = [...cart];
      newCart[index].quantity += delta;
      if (newCart[index].quantity <= 0) {
        newCart.splice(index, 1);
      }
      setCart(newCart);
    };

    const handleScan = () => {
      if (!barcode) return;
      playBeep();
      const product = inventory.find(p => p.sku === barcode || p.name.toLowerCase().includes(barcode.toLowerCase()));
      if (product) {
        handleAddToCart(product);
      } else {
        const newProduct = { 
          id: Date.now(), 
          name: `Producto ${barcode}`, 
          sku: barcode, 
          cost: Math.floor(Math.random() * 1000) + 500, // Default cost for unknown products
          price: Math.floor(Math.random() * 5000) + 1000, 
          quantity: 1 
        };
        setCart([...cart, newProduct]);
        setLastScanned({ name: newProduct.name, price: newProduct.price });
      }
      setBarcode('');
    };

    const handleConfirmSale = (method: string) => {
      if (!cashRegister.isOpen) {
        setShowCashRegisterModal(true);
        return;
      }

      if (cart.length === 0) return;

      // Calculate profit for this sale
      const saleProfit = cart.reduce((sum, item) => {
        const cost = item.cost || 0;
        return sum + ((item.price - cost) * item.quantity);
      }, 0);

      // Deduct from inventory
      const updatedInventory = inventory.map(invItem => {
        const cartItem = cart.find(c => c.id === invItem.id);
        if (cartItem) {
          return { ...invItem, stock: Math.max(0, invItem.stock - cartItem.quantity) };
        }
        return invItem;
      });
      setInventory(updatedInventory);

      // Save last sale for ticket
      const saleData = {
        id: Date.now(),
        cart: [...cart],
        total,
        profit: saleProfit,
        change,
        date: new Date().toISOString(),
        paymentMethod: method
      };
      
      if (method === 'Efectivo') {
        setCashRegister((prev: any) => ({ ...prev, currentCash: prev.currentCash + total }));
      } else if (method === 'Fiado') {
        let updatedFiados = [...fiados];
        if (selectedFiadoClient === 'new') {
          updatedFiados.push({
            id: Date.now(),
            name: newFiadoClient.name,
            phone: newFiadoClient.phone,
            observation: newFiadoClient.observation,
            creditLimit: newFiadoClient.creditLimit ? parseInt(newFiadoClient.creditLimit) : 0,
            totalDebt: total,
            history: [{
              id: Date.now(),
              date: new Date().toISOString(),
              dueDate: fiadoDueDate,
              amount: total,
              type: 'charge',
              cart: [...cart]
            }]
          });
        } else {
          updatedFiados = updatedFiados.map(client => {
            if (client.id.toString() === selectedFiadoClient) {
              return {
                ...client,
                totalDebt: client.totalDebt + total,
                history: [...client.history, {
                  id: Date.now(),
                  date: new Date().toISOString(),
                  dueDate: fiadoDueDate,
                  amount: total,
                  type: 'charge',
                  cart: [...cart]
                }]
              };
            }
            return client;
          });
        }
        setFiados(updatedFiados);
      }

      setLastSale({ ...saleData, date: new Date(saleData.date) });
      onSaleComplete(saleData);
      setShowTicketModal(true);

      // Reset state
      setCart([]);
      setShowCashModal(false);
      setShowFiadoModal(false);
      setSelectedFiadoClient('');
      setNewFiadoClient({ name: '', phone: '', observation: '', creditLimit: '' });
      setAmountReceived('');
      setSurcharge('');
      setLastScanned(null);
    };

    const handlePauseSale = () => {
      if (cart.length === 0) return;
      setPausedSales([...pausedSales, { cart, total, timestamp: new Date() }]);
      setCart([]);
      setSurcharge('');
    };

    const handleResumeSale = (index: number) => {
      const saleToResume = pausedSales[index];
      setCart(saleToResume.cart);
      setPausedSales(pausedSales.filter((_, i) => i !== index));
      setShowPausedModal(false);
    };

    const formatCurrency = (num: number) => `$${num.toLocaleString('es-CL')}`;

    return (
    <div className="flex min-h-screen bg-surface text-on-surface font-body">
      <SideNavBar currentPage="sales" setCurrentPage={setCurrentPage} currentUser={currentUser} users={users} setCurrentUser={setCurrentUser} currentStore={currentStore} currentPOS={currentPOS} />
      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto p-8">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black text-[#0F172A] font-headline mb-1">Terminal de <span className="text-secondary">Ventas</span></h2>
            <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-3">PUNTO DE VENTA &gt; CAJA</p>
            <p className="text-[#0F172A]/70 font-bold text-lg">Escanea productos o selecciónalos manualmente para procesar una venta.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowCashRegisterModal(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${cashRegister.isOpen ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}
            >
              <Banknote className="w-5 h-5" />
              <span>{cashRegister.isOpen ? 'Caja Abierta' : 'Abrir Caja'}</span>
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary font-bold rounded-lg hover:bg-secondary/20 transition-colors"
              onClick={() => window.open('?view=customer', '_blank')}
            >
              <Monitor className="w-5 h-5" />
              <span className="hidden sm:inline">Pantalla Cliente</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f2f3ff] transition-colors relative">
              <Bell className="w-5 h-5 text-on-surface-variant" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
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
        <div className="bg-[#ced5ff] h-[1px] w-full"></div>

        {/* POS Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Side: Sales Operations */}
          <section className="flex-[1.8] p-6 overflow-y-auto flex flex-col gap-6">
            {/* Shortcuts Info */}
            <div className="flex items-center gap-4 text-sm text-[#0F172A] font-bold">
              <div className="flex items-center gap-2"><kbd className="bg-surface-container-low px-2 py-1 rounded border border-outline-variant/40 font-mono text-xs">F10</kbd> Cobrar en efectivo</div>
              <div className="flex items-center gap-2"><kbd className="bg-surface-container-low px-2 py-1 rounded border border-outline-variant/40 font-mono text-xs">Supr</kbd> Limpiar carrito</div>
            </div>

            {/* Barcode Area */}
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-secondary/20">
              <div className="relative flex items-center">
                <input 
                  className="w-full pl-4 pr-32 py-3 bg-transparent border-2 border-secondary rounded-lg text-lg font-bold focus:ring-4 focus:ring-secondary/10 placeholder:text-[#0F172A]/50 outline-none transition-all" 
                  placeholder="Escanea o escribe código / nombre del producto..." 
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                />
                <button onClick={handleScan} className="absolute right-2 bg-secondary text-white px-6 py-2 rounded-md font-bold flex items-center justify-center hover:bg-secondary/90 transition-colors">
                  <Plus className="w-4 h-4 mr-2" /> Agregar
                </button>
              </div>
            </div>

            {/* Favorites Section */}
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-secondary/10">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <h3 className="text-sm font-black text-[#0F172A] uppercase tracking-widest">Favoritos / Acceso Rápido</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {inventory.filter(p => p.isFavorite).map(product => (
                  <button
                    key={product.id}
                    onClick={() => handleAddToCart(product)}
                    className="px-4 py-2 bg-white border border-outline-variant/30 rounded-lg text-sm font-bold text-[#0F172A] hover:border-secondary hover:bg-secondary/5 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <div className="w-6 h-6 rounded bg-surface-container-low overflow-hidden">
                      <img src={product.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    {product.name}
                  </button>
                ))}
                {inventory.filter(p => p.isFavorite).length === 0 && (
                  <p className="text-xs text-on-surface-variant italic">No hay productos marcados como favoritos.</p>
                )}
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-xl shadow-sm">
                <Filter className="text-outline w-4 h-4" />
                <span className="text-xs font-bold">Filtrar por Categoría</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button 
                  onClick={() => setSearchTerm('')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${searchTerm === '' ? 'bg-secondary text-white' : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'}`}
                >
                  Todos
                </button>
                {Array.from(new Set(inventory.map(p => p.category))).map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSearchTerm(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${searchTerm === cat ? 'bg-secondary text-white' : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {inventory
                .filter(p => 
                  p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  p.category.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((product) => (
                <button 
                  key={product.id}
                  onClick={() => handleAddToCart(product)}
                  className="bg-surface-container-lowest p-0 rounded-xl border border-outline-variant/20 shadow-sm hover:border-secondary hover:shadow-md transition-all text-left flex flex-col h-full group overflow-hidden"
                >
                  <div className="aspect-square w-full bg-surface-container-low overflow-hidden relative">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {product.stock < 10 && (
                      <div className="absolute top-2 right-2 bg-error text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg">
                        BAJO STOCK
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h4 className="font-bold text-on-surface text-sm leading-tight mb-1 group-hover:text-secondary transition-colors line-clamp-2">{product.name}</h4>
                    <p className="text-xs text-[#0F172A] font-black mb-3">{product.category}</p>
                    <div className="mt-auto">
                      <p className="text-lg font-black text-green-600 mb-1">{formatCurrency(product.price)}</p>
                      <p className={`text-xs font-black ${product.stock < 10 ? 'text-error' : 'text-[#0F172A]'}`}>
                        Stock: {product.stock} {product.stock < 10 && '⚠'}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Right Side: Cart / Summary */}
          <section className="flex-1 bg-surface-container-low p-6 flex flex-col border-l border-outline-variant/20">
            <div className="bg-surface-container-lowest flex-1 rounded-2xl flex flex-col shadow-sm border border-outline-variant/20 overflow-hidden">
              {/* Cart List */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-lowest sticky top-0 z-10">
                  <h3 className="text-sm font-black text-[#0F172A] tracking-widest uppercase"><span className="text-secondary">CARRITO</span> <span className="text-[#0F172A]/70">({totalItems})</span></h3>
                  <div className="flex gap-2">
                    {pausedSales.length > 0 && (
                      <button onClick={() => setShowPausedModal(true)} className="text-xs font-bold text-blue-600 border border-blue-600/30 px-3 py-1 rounded-full hover:bg-blue-600/5 transition-colors">
                        Recuperar ({pausedSales.length})
                      </button>
                    )}
                    <button 
                      onClick={handlePauseSale}
                      disabled={cart.length === 0}
                      className="text-xs font-bold text-secondary border border-secondary/30 px-3 py-1 rounded-full hover:bg-secondary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Pausar
                    </button>
                    <button onClick={() => setCart([])} className="text-xs font-bold text-error border border-error/30 px-3 py-1 rounded-full hover:bg-error/5 transition-colors">Limpiar</button>
                  </div>
                </div>
                <div className="p-4 overflow-y-auto flex-1 space-y-4">
                  {cart.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex justify-between items-center group py-2 border-b border-outline-variant/10 last:border-0">
                      <div className="flex-1 pr-4">
                        <p className="font-bold text-on-surface text-sm leading-tight line-clamp-1">{item.name}</p>
                        <p className="text-xs text-[#0F172A] font-black">{formatCurrency(item.price)} c/u</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-surface-container-low rounded-lg p-1 border border-outline-variant/20">
                          <button onClick={() => updateQuantity(index, -1)} className="w-6 h-6 flex items-center justify-center hover:bg-surface-container-high rounded text-on-surface font-bold">-</button>
                          <span className="w-4 text-center text-sm font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(index, 1)} className="w-6 h-6 flex items-center justify-center hover:bg-surface-container-high rounded text-on-surface font-bold">+</button>
                        </div>
                        <div className="w-20 text-right">
                          <p className="font-black text-on-surface text-sm">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                        <button 
                          onClick={() => setCart(cart.filter((_, i) => i !== index))}
                          className="text-error hover:bg-error/10 p-1 rounded transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {cart.length === 0 && (
                    <div className="text-center py-10 text-[#0F172A]">
                      <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="font-black">El carrito está vacío</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment & Checkout */}
              <div className="bg-surface-container-lowest p-6 border-t border-outline-variant/20">
                <div className="flex items-center gap-4 mb-6 bg-[#fff9e6] p-3 rounded-lg border border-[#fce49c]">
                  <span className="text-xs font-black text-[#0F172A]">Recargo ($)</span>
                  <input 
                    type="number" 
                    value={surcharge}
                    onChange={(e) => setSurcharge(e.target.value)}
                    className="w-24 bg-white border border-outline-variant/30 rounded px-2 py-1 text-sm font-bold text-right outline-none focus:border-secondary"
                  />
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-center text-[#0F172A]">
                    <span className="text-sm font-bold">Subtotal</span>
                    <span className="text-sm font-bold">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-black text-[#0F172A]">Total</span>
                    <span className="text-3xl font-black text-green-600">{formatCurrency(total)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => {
                      if (!cashRegister.isOpen) {
                        setShowCashRegisterModal(true);
                        return;
                      }
                      setShowCashModal(true);
                    }}
                    disabled={cart.length === 0}
                    className="flex items-center justify-center gap-2 py-4 bg-[#0f9d58] hover:bg-[#0b8043] text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#0f9d58]/20"
                  >
                    <Banknote className="w-5 h-5" />
                    Efectivo (F10)
                  </button>
                  <button 
                    onClick={() => {
                      if (!cashRegister.isOpen) {
                        setShowCashRegisterModal(true);
                        return;
                      }
                      handleConfirmSale('Débito');
                    }}
                    disabled={cart.length === 0}
                    className="flex items-center justify-center gap-2 py-4 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#3b82f6]/20"
                  >
                    <CreditCard className="w-5 h-5" />
                    Débito
                  </button>
                  <button 
                    onClick={() => {
                      if (!cashRegister.isOpen) {
                        setShowCashRegisterModal(true);
                        return;
                      }
                      handleConfirmSale('Pluxee');
                    }}
                    disabled={cart.length === 0}
                    className="flex items-center justify-center gap-2 py-3 bg-[#ff5e00] hover:bg-[#cc4b00] text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#ff5e00]/20 text-sm"
                  >
                    <CreditCard className="w-4 h-4" />
                    Pluxee
                  </button>
                  <button 
                    onClick={() => {
                      if (!cashRegister.isOpen) {
                        setShowCashRegisterModal(true);
                        return;
                      }
                      handleConfirmSale('AmiPass');
                    }}
                    disabled={cart.length === 0}
                    className="flex items-center justify-center gap-2 py-3 bg-[#e91e63] hover:bg-[#c2185b] text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#e91e63]/20 text-sm"
                  >
                    <CreditCard className="w-4 h-4" />
                    AmiPass
                  </button>
                  <button 
                    onClick={() => {
                      if (!cashRegister.isOpen) {
                        setShowCashRegisterModal(true);
                        return;
                      }
                      setShowFiadoModal(true);
                    }}
                    disabled={cart.length === 0}
                    className="col-span-2 flex items-center justify-center gap-2 py-3 bg-surface-container-highest hover:bg-outline-variant/30 text-on-surface rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm"
                  >
                    <Wallet className="w-4 h-4" />
                    Fiado
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Cash Payment Modal */}
      <AnimatePresence>
        {showCashModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center">
                <h2 className="text-2xl font-black text-[#0F172A]">Pago en <span className="text-secondary">Efectivo</span></h2>
                <button onClick={() => setShowCashModal(false)} className="p-2 hover:bg-surface-container rounded-full transition-colors">
                  <X className="w-6 h-6 text-outline-variant" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-6 text-center">
                  <p className="text-xs font-black text-[#0F172A] uppercase tracking-widest mb-2">TOTAL A PAGAR</p>
                  <p className="text-4xl font-black text-[#0F172A]">{formatCurrency(total)}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-black text-[#0F172A] uppercase tracking-widest mb-2">MONTO RECIBIDO</label>
                  <input 
                    type="text" 
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value)}
                    className="w-full border-2 border-secondary rounded-xl py-4 px-6 text-2xl font-bold text-center focus:ring-4 focus:ring-secondary/20 outline-none transition-all"
                    placeholder="Ej. 10000"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[1000, 5000, 10000, 20000].map(amt => (
                    <button 
                      key={amt}
                      onClick={() => {
                        const current = parseInt(amountReceived.replace(/\D/g, '')) || 0;
                        setAmountReceived((current + amt).toString());
                      }}
                      className="py-3 bg-surface-container-low hover:bg-surface-container-high rounded-lg font-bold text-[#0F172A] transition-colors border border-outline-variant/20"
                    >
                      +{formatCurrency(amt)}
                    </button>
                  ))}
                  <button 
                    onClick={() => setAmountReceived(total.toString())}
                    className="py-3 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-lg font-bold transition-colors border border-secondary/20"
                  >
                    Exacto
                  </button>
                  <button 
                    onClick={() => setAmountReceived('')}
                    className="py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-bold transition-colors border border-red-200"
                  >
                    Borrar
                  </button>
                </div>

                {amountReceived && (
                  <div className={`p-6 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${parseInt(amountReceived.replace(/\D/g, '')) >= total ? 'bg-green-600 text-white shadow-xl shadow-green-600/20' : 'bg-red-50 border-2 border-red-200 text-red-700'}`}>
                    <span className="text-xs font-black uppercase tracking-[0.2em] opacity-80">
                      {parseInt(amountReceived.replace(/\D/g, '')) >= total ? 'VUELTO A ENTREGAR' : 'FALTA POR PAGAR'}
                    </span>
                    <span className="text-5xl font-black tabular-nums">
                      {formatCurrency(Math.abs(parseInt(amountReceived.replace(/\D/g, '')) - total))}
                    </span>
                  </div>
                )}

                <button 
                  onClick={() => {
                    setShowCashModal(false);
                    handleConfirmSale('Efectivo');
                  }}
                  disabled={!amountReceived || parseInt(amountReceived.replace(/\D/g, '')) < total}
                  className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-surface-container-high disabled:text-outline-variant disabled:cursor-not-allowed text-white rounded-xl font-black text-lg transition-colors shadow-lg shadow-green-600/20 disabled:shadow-none"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fiado Modal */}
      <AnimatePresence>
        {showFiadoModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-[#0F172A]">Registrar <span className="text-secondary">Fiado</span></h2>
                <button onClick={() => setShowFiadoModal(false)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
                  <X className="w-6 h-6 text-[#0F172A]" />
                </button>
              </div>
              
              <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-6 mb-6 text-center">
                <p className="text-xs font-black text-[#0F172A] uppercase tracking-widest mb-2">MONTO A FIAR</p>
                <p className="text-4xl font-black text-[#0F172A]">{formatCurrency(total)}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-bold text-[#0F172A] mb-1">Seleccionar Cliente</label>
                  <select 
                    value={selectedFiadoClient}
                    onChange={(e) => setSelectedFiadoClient(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-sm font-medium text-[#0F172A] focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                  >
                    <option value="">-- Seleccione un cliente --</option>
                    <option value="new">+ Crear Nuevo Cliente</option>
                    {fiados.map(client => {
                      const available = client.creditLimit ? client.creditLimit - client.totalDebt : null;
                      const limitText = available !== null ? ` (Disp: $${available.toLocaleString('es-CL')})` : '';
                      return (
                        <option key={client.id} value={client.id}>{client.name} - Deuda: ${client.totalDebt.toLocaleString('es-CL')}{limitText}</option>
                      );
                    })}
                  </select>
                </div>

                {selectedFiadoClient && selectedFiadoClient !== 'new' && fiados.find(c => c.id.toString() === selectedFiadoClient)?.creditLimit > 0 && (
                  <div className={`p-3 rounded-lg text-sm font-bold ${
                    (fiados.find(c => c.id.toString() === selectedFiadoClient)?.creditLimit - fiados.find(c => c.id.toString() === selectedFiadoClient)?.totalDebt) < total 
                    ? 'bg-red-100 text-red-700 border border-red-200' 
                    : 'bg-green-100 text-green-700 border border-green-200'
                  }`}>
                    Crédito Disponible: ${(fiados.find(c => c.id.toString() === selectedFiadoClient)?.creditLimit - fiados.find(c => c.id.toString() === selectedFiadoClient)?.totalDebt).toLocaleString('es-CL')}
                    {((fiados.find(c => c.id.toString() === selectedFiadoClient)?.creditLimit - fiados.find(c => c.id.toString() === selectedFiadoClient)?.totalDebt) < total) && (
                      <span className="block mt-1 text-xs">⚠️ El monto de la venta supera el crédito disponible.</span>
                    )}
                  </div>
                )}

                {selectedFiadoClient === 'new' && (
                  <div className="space-y-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant/20">
                    <div>
                      <label className="block text-sm font-bold text-[#0F172A] mb-1">Nombre del Cliente *</label>
                      <input 
                        type="text" 
                        required
                        value={newFiadoClient.name}
                        onChange={(e) => setNewFiadoClient({...newFiadoClient, name: e.target.value})}
                        className="w-full px-4 py-2 bg-white border border-outline-variant/30 rounded-lg text-sm font-medium text-[#0F172A] focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#0F172A] mb-1">Teléfono (Opcional)</label>
                      <input 
                        type="tel" 
                        value={newFiadoClient.phone}
                        onChange={(e) => setNewFiadoClient({...newFiadoClient, phone: e.target.value})}
                        className="w-full px-4 py-2 bg-white border border-outline-variant/30 rounded-lg text-sm font-medium text-[#0F172A] focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#0F172A] mb-1">Observación (Opcional)</label>
                      <input 
                        type="text" 
                        value={newFiadoClient.observation}
                        onChange={(e) => setNewFiadoClient({...newFiadoClient, observation: e.target.value})}
                        className="w-full px-4 py-2 bg-white border border-outline-variant/30 rounded-lg text-sm font-medium text-[#0F172A] focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#0F172A] mb-1">Límite de Crédito ($) (Opcional)</label>
                      <input 
                        type="number" 
                        placeholder="Ej. 50000 (0 = Sin límite)"
                        value={newFiadoClient.creditLimit}
                        onChange={(e) => setNewFiadoClient({...newFiadoClient, creditLimit: e.target.value})}
                        className="w-full px-4 py-2 bg-white border border-outline-variant/30 rounded-lg text-sm font-medium text-[#0F172A] focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {selectedFiadoClient && (
                  <div>
                    <label className="block text-sm font-bold text-[#0F172A] mb-1">Fecha de Vencimiento</label>
                    <input 
                      type="date" 
                      value={fiadoDueDate}
                      onChange={(e) => setFiadoDueDate(e.target.value)}
                      className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-sm font-medium text-[#0F172A] focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowFiadoModal(false)}
                  className="flex-1 py-4 bg-surface-container-low hover:bg-surface-container-high text-on-surface rounded-xl font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => handleConfirmSale('Fiado')}
                  disabled={
                    !selectedFiadoClient || 
                    (selectedFiadoClient === 'new' && !newFiadoClient.name) ||
                    (selectedFiadoClient !== 'new' && fiados.find(c => c.id.toString() === selectedFiadoClient)?.creditLimit > 0 && (fiados.find(c => c.id.toString() === selectedFiadoClient)?.creditLimit - fiados.find(c => c.id.toString() === selectedFiadoClient)?.totalDebt) < total)
                  }
                  className="flex-1 py-4 bg-secondary hover:bg-on-secondary-container text-white rounded-xl font-black transition-colors shadow-lg shadow-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirmar Fiado
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paused Sales Modal */}
      <AnimatePresence>
        {showTicketModal && lastSale && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="bg-secondary p-6 text-white text-center relative">
                <div className="absolute -bottom-3 left-0 right-0 flex justify-around">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-white rounded-full"></div>
                  ))}
                </div>
                <CheckCircle className="w-12 h-12 mx-auto mb-3" />
                <h2 className="text-2xl font-black tracking-tight">¡Venta <span className="text-secondary">Exitosa!</span></h2>
                <p className="text-white/80 text-sm">{lastSale.date.toLocaleString()}</p>
              </div>

              <div className="p-8 pt-10 flex-1 overflow-y-auto max-h-[60vh]">
                <div className="border-b-2 border-dashed border-outline-variant/30 pb-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-outline-variant uppercase tracking-widest">Detalle</span>
                    <span className="text-xs font-bold text-outline-variant uppercase tracking-widest">Subtotal</span>
                  </div>
                  {lastSale.cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between mb-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#0F172A]">{item.name}</span>
                        <span className="text-[10px] text-outline-variant">{item.quantity} x {formatCurrency(item.price)}</span>
                      </div>
                      <span className="text-sm font-bold text-[#0F172A]">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-outline-variant font-medium">Subtotal</span>
                    <span className="font-bold">{formatCurrency(lastSale.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-outline-variant font-medium">IVA (19%)</span>
                    <span className="font-bold">{formatCurrency(Math.round(lastSale.total * 0.19))}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-outline-variant/10">
                    <span className="text-lg font-black text-[#0F172A]">TOTAL</span>
                    <span className="text-2xl font-black text-green-600">{formatCurrency(lastSale.total)}</span>
                  </div>
                  {lastSale.change > 0 && (
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm font-bold text-secondary">Vuelto</span>
                      <span className="text-lg font-black text-secondary">{formatCurrency(lastSale.change)}</span>
                    </div>
                  )}
                </div>

                <div className="text-center space-y-4">
                  <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                    <p className="text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-1">Código de Operación</p>
                    <p className="text-xs font-mono font-bold">#VT-{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-surface-container-low flex flex-col gap-3">
                <button 
                  onClick={() => {
                    window.print();
                  }}
                  className="w-full py-4 bg-[#0F172A] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#1e293b] transition-all"
                >
                  <Printer className="w-5 h-5" />
                  Imprimir Ticket
                </button>
                <button 
                  onClick={() => setShowTicketModal(false)}
                  className="w-full py-4 bg-white text-secondary border-2 border-secondary/20 rounded-2xl font-bold hover:bg-secondary/5 transition-all"
                >
                  Nueva Venta
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paused Sales Modal */}
      <AnimatePresence>
        {showPausedModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center">
                <h2 className="text-2xl font-black text-[#0F172A]">Ventas <span className="text-secondary">Pausadas</span></h2>
                <button onClick={() => setShowPausedModal(false)} className="p-2 hover:bg-surface-container rounded-full transition-colors">
                  <X className="w-6 h-6 text-outline-variant" />
                </button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                {pausedSales.map((sale, index) => (
                  <div key={index} className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-on-surface">Venta Pausada #{index + 1}</p>
                      <p className="text-xs text-outline-variant">{sale.timestamp.toLocaleTimeString()} - {sale.cart.length} productos</p>
                      <p className="text-sm font-bold text-secondary mt-1">{formatCurrency(sale.total)}</p>
                    </div>
                    <button 
                      onClick={() => handleResumeSale(index)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
                    >
                      Recuperar
                    </button>
                  </div>
                ))}
                {pausedSales.length === 0 && (
                  <p className="text-center text-outline-variant py-8">No hay ventas pausadas.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customer View Overlay (Fallback if not opened in new tab) */}
      <AnimatePresence>
        {showCustomerView && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#0f172a] flex flex-col"
          >
            <header className="p-6 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black tracking-tighter text-white">Vantory <span className="text-secondary">POS</span></span>
              </div>
              <div className="text-outline-variant font-medium">
                {new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
              <button 
                onClick={() => setShowCustomerView(false)}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </header>
            
            <main className="flex-1 flex flex-col items-center justify-center p-6">
              {cart.length === 0 ? (
                <div className="text-center animate-pulse">
                  <div className="w-32 h-32 mx-auto mb-8 bg-white/5 rounded-3xl flex items-center justify-center">
                    <Package className="w-16 h-16 text-secondary" />
                  </div>
                  <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Bienvenido</h1>
                  <p className="text-xl text-outline-variant">Esperando productos...</p>
                </div>
              ) : (
                <div className="w-full max-w-4xl bg-white/5 rounded-3xl p-8 flex gap-8">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-6">Tu Compra</h2>
                    <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-4">
                      {cart.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-white/90 text-lg border-b border-white/10 pb-4">
                          <div className="flex gap-4">
                            <span className="font-bold text-secondary">{item.quantity}x</span>
                            <span>{item.name}</span>
                          </div>
                          <span className="font-bold">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="w-80 bg-secondary/20 rounded-2xl p-6 flex flex-col justify-center">
                    <p className="text-secondary font-bold uppercase tracking-widest mb-2">Total a Pagar</p>
                    <p className="text-6xl font-black text-white">{formatCurrency(total)}</p>
                  </div>
                </div>
              )}
            </main>
            
            <footer className="p-6 flex justify-between items-center border-t border-white/10">
              <div className="flex items-center gap-2 text-sm text-outline-variant">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Conectado · Visor de Cliente
              </div>
              <div className="text-sm text-outline-variant">
                Desarrollado por <span className="font-bold text-white">VANTORY DIGITAL</span> · vantorydigital.cl
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body selection:bg-secondary/20 selection:text-secondary">
      {/* Top Bar Navigation */}
      {['home', 'features', 'blog'].includes(currentPage) && (
        <nav className={`fixed top-0 left-0 right-0 h-16 z-50 transition-all duration-500 flex justify-between items-center px-6 md:px-12 border-b ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl border-secondary/10 shadow-lg py-2' 
            : 'bg-secondary/[0.03] backdrop-blur-2xl border-transparent py-4'
        }`}>
          <div className="flex items-center gap-2">
            <Logo onClick={() => setCurrentPage('home')} />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => setCurrentPage('features')}
              className={`text-sm font-medium transition-colors relative group ${currentPage === 'features' ? 'text-secondary' : 'text-on-surface-variant hover:text-secondary'}`}
            >
              Funcionalidades
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-secondary transition-all ${currentPage === 'features' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </button>
            <button 
              onClick={() => setCurrentPage('blog')}
              className={`text-sm font-medium transition-colors relative group ${currentPage === 'blog' ? 'text-secondary' : 'text-on-surface-variant hover:text-secondary'}`}
            >
              Blog
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-secondary transition-all ${currentPage === 'blog' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </button>
            <motion.button 
              onClick={() => setCurrentPage('login')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 text-sm font-bold text-white bg-gradient-secondary rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              Acceder
            </motion.button>
          </div>
          <button className="md:hidden p-2 text-on-surface">
            <Menu className="w-6 h-6" />
          </button>
        </nav>
      )}

      <AnimatePresence mode="wait">
        {currentPage === 'customer-view' ? (
          <motion.div 
            key="customer-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#0f172a] flex flex-col"
          >
            <header className="p-6 flex justify-between items-center bg-white/5 backdrop-blur-md border-b border-white/10">
              <div className="flex flex-col">
                <span className="text-3xl font-black tracking-tighter text-white">Vantory <span className="text-secondary">POS</span></span>
                {currentStore && (
                  <div className="flex items-center gap-2 mt-1">
                    <Globe className="w-3 h-3 text-secondary" />
                    <span className="text-[10px] font-bold text-outline-variant uppercase tracking-widest">{currentStore.name} · {currentPOS?.name}</span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-white font-black text-xl">
                  {new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-outline-variant text-xs font-medium">
                  {new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
              </div>
            </header>
            
            <main className="flex-1 flex flex-col items-center justify-center p-6">
              <div className="text-center animate-pulse">
                <div className="w-32 h-32 mx-auto mb-8 bg-white/5 rounded-3xl flex items-center justify-center">
                  <Package className="w-16 h-16 text-secondary" />
                </div>
                <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Bienvenido</h1>
                <p className="text-xl text-outline-variant">Esperando productos...</p>
              </div>
            </main>
            
            <footer className="p-6 flex justify-between items-center border-t border-white/10">
              <div className="flex items-center gap-2 text-sm text-outline-variant">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Conectado · Visor de Cliente
              </div>
              <div className="text-sm text-outline-variant">
                Desarrollado por <span className="font-bold text-white">VANTORY DIGITAL</span> · vantorydigital.cl
              </div>
            </footer>
          </motion.div>
        ) : currentPage === 'inventory' ? (
          <motion.div 
            key="inventory"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
          >
            <InventoryDashboard setCurrentPage={setCurrentPage} inventory={clientInventory} setInventory={setClientInventory} currentUser={currentUser} users={clientUsers} setCurrentUser={setCurrentUser} categories={categories} setCategories={setCategories} currentStore={currentStore} currentPOS={currentPOS} />
          </motion.div>
        ) : currentPage === 'sales' ? (
          <motion.div 
            key="sales"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
          >
            <SalesDashboard 
              inventory={clientInventory} 
              setInventory={setClientInventory} 
              onSaleComplete={(sale) => setClientSalesHistory((prev: any[]) => [sale, ...prev])}
              setCurrentPage={setCurrentPage}
              cashRegister={clientCashRegister}
              setCashRegister={setClientCashRegister}
              setShowCashRegisterModal={setShowCashRegisterModal}
              currentUser={currentUser}
              users={clientUsers}
              setCurrentUser={setCurrentUser}
              fiados={clientFiados}
              setFiados={setClientFiados}
              currentStore={currentStore}
              currentPOS={currentPOS}
            />
          </motion.div>
        ) : currentPage === 'dashboard' ? (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
          >
            <Dashboard setCurrentPage={setCurrentPage} inventory={clientInventory} salesHistory={clientSalesHistory} setViewingSale={setViewingSale} currentUser={currentUser} users={clientUsers} setCurrentUser={setCurrentUser} currentStore={currentStore} currentPOS={currentPOS} />
          </motion.div>
        ) : currentPage === 'history' ? (
          <motion.div 
            key="history"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
          >
            <SalesHistory setCurrentPage={setCurrentPage} salesHistory={clientSalesHistory} setViewingSale={setViewingSale} currentUser={currentUser} users={clientUsers} setCurrentUser={setCurrentUser} currentStore={currentStore} currentPOS={currentPOS} />
          </motion.div>
        ) : currentPage === 'entries' ? (
          <motion.div 
            key="entries"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
          >
            <StockEntries 
              setCurrentPage={setCurrentPage} 
              inventory={clientInventory} 
              setInventory={setClientInventory}
              stockEntries={clientStockEntries}
              setStockEntries={setClientStockEntries}
              setViewingSale={setViewingSale}
              currentUser={currentUser}
              users={clientUsers}
              setCurrentUser={setCurrentUser}
              currentStore={currentStore}
              currentPOS={currentPOS}
            />
          </motion.div>
        ) : currentPage === 'kpis' ? (
          <motion.div 
            key="kpis"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
          >
            <KPIsDashboard 
              setCurrentPage={setCurrentPage} 
              inventory={clientInventory} 
              salesHistory={clientSalesHistory} 
              cashRegister={clientCashRegister}
              setShowCashRegisterModal={setShowCashRegisterModal}
              currentUser={currentUser}
              users={clientUsers}
              setCurrentUser={setCurrentUser}
              cashHistory={clientCashHistory}
              currentStore={currentStore}
              currentPOS={currentPOS}
            />
          </motion.div>
        ) : currentPage === 'users' ? (
          <motion.div 
            key="users"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
          >
            <UsersManagement setCurrentPage={setCurrentPage} users={clientUsers} setUsers={setClientUsers} currentUser={currentUser} setCurrentUser={setCurrentUser} stores={clientStores} currentStore={currentStore} currentPOS={currentPOS} />
          </motion.div>
        ) : currentPage === 'fiados' ? (
          <motion.div 
            key="fiados"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
          >
            <FiadosDashboard setCurrentPage={setCurrentPage} fiados={clientFiados} setFiados={setClientFiados} currentUser={currentUser} users={clientUsers} setCurrentUser={setCurrentUser} currentStore={currentStore} currentPOS={currentPOS} />
          </motion.div>
        ) : currentPage === 'home' ? (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <main className="relative pt-16">
              {/* Hero Section */}
              <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-secondary/[0.05] to-surface">
                {/* Background Elements */}
                <div className="absolute inset-0 z-0">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute top-0 right-0 w-2/3 h-full bg-surface-container-low rounded-bl-[120px]"
                  ></motion.div>
                  <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-secondary/5 blur-[120px] rounded-full"></div>
                </div>
                <div className="container mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high rounded-full border border-outline-variant/30">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-secondary">Nuevo v3.0</span>
                      <div className="w-1 h-1 rounded-full bg-secondary"></div>
                      <span className="text-[10px] font-medium text-on-surface-variant">Gestión en tiempo real</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-[#0F172A] tracking-tighter leading-[0.85] font-headline">
                      <motion.div className="flex flex-wrap gap-x-4">
                        {["VANTORY", "POS", "360"].map((word, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ 
                              duration: 0.8, 
                              delay: 0.2 + (i * 0.1),
                              ease: [0.215, 0.61, 0.355, 1]
                            }}
                            className={word !== "VANTORY" ? "text-secondary" : ""}
                          >
                            {word}
                          </motion.span>
                        ))}
                      </motion.div>
                    </h1>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className="text-xl md:text-2xl text-on-surface-variant font-medium leading-relaxed max-w-lg"
                    >
                      Sistema inteligente de ventas e inventario diseñado para la eficiencia operativa moderna.
                    </motion.p>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                      className="flex flex-col sm:flex-row gap-4 pt-4"
                    >
                      <motion.button 
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-10 py-5 text-lg font-bold text-white bg-gradient-secondary rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                      >
                        Iniciar sesión <ArrowRight className="w-5 h-5" />
                      </motion.button>
                      <motion.button 
                        onClick={() => setCurrentPage('features')}
                        whileHover={{ scale: 1.02, backgroundColor: 'var(--color-surface-container-low)' }}
                        whileTap={{ scale: 0.98 }}
                        className="px-10 py-5 text-lg font-bold text-secondary border border-secondary/20 bg-white rounded-xl transition-all"
                      >
                        Ver Funcionalidades
                      </motion.button>
                    </motion.div>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 1.2 }}
                      className="text-sm font-medium text-on-surface-variant/60 italic pt-6"
                    >
                      Desarrollado por <a className="underline decoration-secondary/30 hover:text-secondary transition-colors" href="https://www.vantorydigital.cl">Vantory Digital</a>
                    </motion.p>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative"
                  >
                    {/* Glassmorphism Preview Card */}
                    <div className="relative z-20 transform lg:translate-x-12 lg:scale-110">
                      <div className="bg-white p-4 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border-4 border-secondary/10 overflow-hidden group hover:border-secondary/30 transition-all duration-500">
                        <motion.img 
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.6 }}
                          className="w-full h-auto rounded-[1.8rem] shadow-inner cursor-zoom-in" 
                          alt="POS interface" 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU7w9NDgL-E-K7HcroAnvmr9C8v5Jzwx83fvUXFG5PmcsEct21Nk-BAzyV6cw8KOcxDPR8yVe6U_lcucCHzBcrEoiBljlIMol2cqYsSDgeLFQ3DGVlKzqK1omr5sFebm4Sr9il-xWkOOywq_HxKpmvwqKIOGSq8pIcBzA7_eXIPu3ClXtM4yY5CHMQtDWHIS0vvo5NFCW6SfOCE3XmLr83lAgs7EUJ9RJX8ydJ2_L3qjTYWAtS9lZy4sSE0vxEZ79P_1keLCMBQ4Z8"
                          referrerPolicy="no-referrer"
                        />
                        {/* Floating Data Badge */}
                        <motion.div 
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 1.5 }}
                          className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl flex items-center gap-4 border-2 border-surface-container-low"
                        >
                          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <TrendingUp className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-[#0F172A] uppercase tracking-wider">Ventas Hoy</p>
                            <p className="text-2xl font-black text-[#0F172A]">+24.8%</p>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* Bento Grid Features Section */}
              <section className="py-24 bg-surface-container-low/30">
                <div className="container mx-auto px-6 md:px-12">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-2xl mb-16"
                  >
                    <h2 className="text-4xl font-bold tracking-tight text-on-surface mb-4 font-headline">Arquitectura diseñada <span className="text-secondary">para el rendimiento</span></h2>
                    <p className="text-on-surface-variant text-lg">Eliminamos el ruido visual para que tu equipo se enfoque en lo que importa: vender y crecer.</p>
                  </motion.div>
                  
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-6"
                  >
                    {/* Bento Item 1: Inventario Real & Preciso */}
                    <motion.div 
                      variants={itemVariants}
                      whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                      className="md:col-span-6 md:row-span-2 bg-white p-8 rounded-3xl border border-outline-variant/20 shadow-sm transition-all group"
                    >
                      <div className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center mb-6 text-secondary">
                        <Package className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-black text-[#0F172A] mb-4 font-headline">Inventario <span className="text-secondary">Real & Preciso</span></h3>
                      <p className="text-[#0F172A] font-medium mb-8 leading-relaxed">Sincronización instantánea de cada SKU. Olvídate de los descuadres y toma decisiones basadas en datos vivos, no en reportes de ayer.</p>
                      <div className="rounded-2xl overflow-hidden bg-surface-container-low border border-outline-variant/10">
                        <img 
                          src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=800&q=80" 
                          alt="Inventario" 
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </motion.div>

                    {/* Bento Item 2: Escaneo QR/Barras */}
                    <motion.div 
                      variants={itemVariants}
                      whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                      className="md:col-span-3 bg-white p-8 rounded-3xl border border-outline-variant/20 shadow-sm transition-all"
                    >
                      <div className="w-10 h-10 bg-surface-container-high rounded-lg flex items-center justify-center mb-4 text-secondary">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-black text-[#0F172A] mb-2 font-headline">Escaneo <span className="text-secondary">QR/Barras</span></h3>
                      <p className="text-[#0F172A] text-sm font-medium">Agilidad total en recepción y despacho con compatibilidad universal de hardware.</p>
                    </motion.div>

                    {/* Bento Item 3: Gestión Pedidos */}
                    <motion.div 
                      variants={itemVariants}
                      whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                      className="md:col-span-3 bg-white p-8 rounded-3xl border border-outline-variant/20 shadow-sm transition-all"
                    >
                      <div className="w-10 h-10 bg-surface-container-high rounded-lg flex items-center justify-center mb-4 text-secondary">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-black text-[#0F172A] mb-2 font-headline">Gestión <span className="text-secondary">Pedidos</span></h3>
                      <p className="text-[#0F172A] text-sm font-medium">Flujos automatizados desde la orden hasta el 'last mile' delivery.</p>
                    </motion.div>

                    {/* Bento Item 4: Reportes & KPIs */}
                    <motion.div 
                      variants={itemVariants}
                      whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                      className="md:col-span-6 bg-white p-8 rounded-3xl border border-outline-variant/20 shadow-sm transition-all flex items-center gap-8"
                    >
                      <div className="flex-1">
                        <div className="w-10 h-10 bg-surface-container-high rounded-lg flex items-center justify-center mb-4 text-secondary">
                          <BarChart3 className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-black text-[#0F172A] mb-2 font-headline">Reportes <span className="text-secondary">& KPIs</span></h3>
                        <p className="text-[#0F172A] text-sm font-medium">Visualiza el rendimiento de tu equipo y la rotación de inventario con dashboards personalizables.</p>
                      </div>
                      <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center text-secondary border border-outline-variant/10">
                        <TrendingUp className="w-10 h-10" />
                      </div>
                    </motion.div>

                    {/* Bento Item 5: Multiusuario */}
                    <motion.div 
                      variants={itemVariants}
                      whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                      className="md:col-span-3 bg-white p-8 rounded-3xl border border-outline-variant/20 shadow-sm transition-all"
                    >
                      <div className="w-10 h-10 bg-surface-container-high rounded-lg flex items-center justify-center mb-4 text-secondary">
                        <Users className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-black text-[#0F172A] mb-2 font-headline">Acceso <span className="text-secondary">Multiusuario</span></h3>
                      <p className="text-[#0F172A] text-sm font-medium">Roles y permisos granulares para cada nivel de tu organización logística.</p>
                    </motion.div>

                    {/* Bento Item 6: Nube Segura */}
                    <motion.div 
                      variants={itemVariants}
                      whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                      className="md:col-span-3 bg-white p-8 rounded-3xl border border-outline-variant/20 shadow-sm transition-all"
                    >
                      <div className="w-10 h-10 bg-surface-container-high rounded-lg flex items-center justify-center mb-4 text-secondary">
                        <Cloud className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-black text-[#0F172A] mb-2 font-headline">Nube <span className="text-secondary">Segura</span></h3>
                      <p className="text-[#0F172A] text-sm font-medium">Acceso global 24/7 con cifrado de grado bancario y backups automáticos.</p>
                    </motion.div>
                  </motion.div>
                </div>
              </section>

              {/* Product Preview Section */}
              <section className="py-24 bg-surface">
                <div className="container mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-16">
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="lg:w-1/2 space-y-6"
                  >
                    <h2 className="text-4xl font-bold text-on-surface leading-tight font-headline">Gestión visual <span className="text-secondary">sin distracciones</span></h2>
                    <p className="text-on-surface-variant text-lg">Nuestra interfaz utiliza capas tonales para separar la información. No usamos bordes innecesarios, lo que reduce la fatiga visual de tus operadores.</p>
                    <ul className="space-y-4 pt-4">
                      {[
                        "Diseño adaptativo para tablets y desktops",
                        "Carga masiva de SKUs con validación automática",
                        "Integración directa con impresoras térmicas"
                      ].map((text, i) => (
                        <motion.li 
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          viewport={{ once: true }}
                          className="flex items-start gap-4"
                        >
                          <div className="mt-1 w-5 h-5 rounded-full bg-secondary flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                          </div>
                          <p className="font-medium">{text}</p>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="lg:w-1/2 bg-surface-container-low p-2 rounded-[2.5rem] shadow-inner"
                  >
                    <div className="overflow-hidden rounded-[2rem] shadow-sm group">
                      <motion.img 
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.8 }}
                        className="w-full h-auto cursor-zoom-in" 
                        alt="Dashboard preview" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuByeH3TDQgG2kDmuNrOYsxPnO0wZIbVR703AosmigU2pginGG_BZ-k0MV0TNPF5km--ReWQbAEvZigZ9ZpHgCjmRRHW4TuKFvZ5bv9-S9eM4-pMcXnFs8P00LP4ankeWQT8mMkZnKmkPoEst49nG2FVyKXWPtwyBbDNLz3Mc1672wX0Z6TVX-EiOoSUzk_W4kHMxK3GFUKHyyGXmBskXIGPsgNDHI59kyMBzXqpi7nF-k_lTuWUG5qxd7DqVQf1cUdavBkp3y3-FeCX"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* CTA Section */}
              <section className="py-24 container mx-auto px-6 md:px-12">
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-primary-container text-on-primary-fixed rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1]
                      }}
                      transition={{ duration: 8, repeat: Infinity }}
                      className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#335f9d_0%,_transparent_50%)]"
                    ></motion.div>
                  </div>
                  <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-none text-white font-headline">¿Listo para transformar <span className="text-secondary-container">tu operación?</span></h2>
                    <p className="text-on-primary-container text-xl md:text-2xl font-medium">Únete a cientos de empresas que ya utilizan VANTORY POS 360 para escalar sus ventas.</p>
                    <div className="pt-6">
                      <motion.a 
                        href="https://wa.me/56920182313?text=Hola,%20me%20gustar%C3%ADa%20saber%20c%C3%B3mo%20funciona%20VANTORY%20POS%20360%20y%20consultar%20sus%20valores."
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block px-12 py-6 text-xl font-bold text-white bg-gradient-secondary rounded-2xl shadow-2xl hover:shadow-secondary/20 transition-all"
                      >
                        Comenzar ahora
                      </motion.a>
                    </div>
                    <p className="text-on-primary-container/60 text-sm">Sin contratos forzosos. Prueba gratuita por 14 días.</p>
                  </div>
                </motion.div>
              </section>
            </main>
          </motion.div>
        ) : currentPage === 'features' ? (
          <FeaturesPage />
        ) : currentPage === 'blog' ? (
          <BlogPage />
        ) : currentPage === 'suspended' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex items-center justify-center bg-surface">
            <div className="max-w-md w-full mx-6 text-center">
              <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
              </div>
              <h2 className="text-2xl font-black text-on-surface mb-3 font-headline">Cuenta Suspendida</h2>
              <p className="text-on-surface-variant mb-2 font-medium">Tu cuenta ha sido suspendida temporalmente.</p>
              <p className="text-sm text-on-surface-variant mb-8">Para reactivar el servicio, comunícate con soporte técnico de Vantory.</p>
              <a href="mailto:soporte@vantorydigital.cl" className="inline-flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-xl font-bold hover:bg-secondary/90 transition-colors shadow-lg mb-4 mr-3">Contactar Soporte</a>
              <button onClick={() => setCurrentPage('login')} className="inline-flex items-center gap-2 bg-surface-container-high text-on-surface px-6 py-3 rounded-xl font-bold hover:bg-surface-container-highest transition-colors">Volver al Login</button>
            </div>
          </motion.div>
        ) : currentPage === 'lobby' ? (
          <Lobby stores={stores.filter((s: any) => s.clientId === currentUser?.clientId || (!s.clientId && currentUser?.clientId === 1))} posMachines={posMachines} setCurrentStore={setCurrentStore} setCurrentPOS={setCurrentPOS} setCurrentPage={setCurrentPage} currentUser={currentUser} />
        ) : currentPage === 'superadmin-dashboard' ? (
          <SuperAdminDashboard setCurrentPage={setCurrentPage} vantoryClients={vantoryClients} currentUser={currentUser} />
        ) : currentPage === 'superadmin-clients' ? (
          <SuperAdminClients setCurrentPage={setCurrentPage} vantoryClients={vantoryClients} setVantoryClients={setVantoryClients} setCurrentUser={setCurrentUser} setSelectedClient={setSelectedClient} />
        ) : currentPage === 'superadmin-client-profile' && selectedClient ? (
          <SuperAdminClientProfile client={vantoryClients.find((c: any) => c.id === selectedClient.id) || selectedClient} setCurrentPage={setCurrentPage} stores={stores} setStores={setStores} posMachines={posMachines} setPosMachines={setPosMachines} vantoryClients={vantoryClients} setVantoryClients={setVantoryClients} users={users} setUsers={setUsers} />
        ) : (
          <LoginPage />
        )}
      </AnimatePresence>

      {/* Footer */}
      {['home', 'features', 'blog'].includes(currentPage) && (
        <footer className="bg-secondary/5 py-16 px-6 md:px-12 border-t border-secondary/10">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Logo onClick={() => setCurrentPage('home')} />
            <p className="text-on-surface-variant text-sm leading-relaxed">Software de gestión integral para retail y almacenes modernos. Tecnología chilena para el mundo.</p>
            <div className="flex gap-4 pt-2">
              <motion.a
                href="https://wa.me/56920182313?text=Hola,%20me%20gustaría%20recibir%20más%20información%20sobre%20VANTORY%20POS%20360."
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                animate={{ 
                  boxShadow: ["0 0 0 0px rgba(34, 197, 94, 0.2)", "0 0 0 10px rgba(34, 197, 94, 0)", "0 0 0 0px rgba(34, 197, 94, 0)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 border border-green-500/20 shadow-sm"
              >
                <MessageCircle className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://www.instagram.com/vantorydg?igsh=MXViNWEwemZocG45cA%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                animate={{ 
                  boxShadow: ["0 0 0 0px rgba(217, 70, 239, 0.2)", "0 0 0 10px rgba(217, 70, 239, 0)", "0 0 0 0px rgba(217, 70, 239, 0)"]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-600 border border-pink-500/20 shadow-sm"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
            </div>
          </div>
          {[
            { title: 'Producto', links: ['Ventas', 'Inventario', 'Reportes'] },
            { title: 'Compañía', links: [
              { label: 'Vantory Digital', href: 'https://www.vantorydigital.cl' },
              { label: 'Blog: Innovación Retail', onClick: () => setCurrentPage('blog') },
              { label: 'contacto@vantorydigital.cl', href: 'mailto:contacto@vantorydigital.cl' }
            ] },
            { title: 'Soporte', links: [
              { label: 'Centro de Ayuda', href: '#' },
              { label: 'Estado del Sistema: 100% Online', href: '#' }
            ] }
          ].map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="font-bold text-on-surface font-headline">{section.title}</h4>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                {section.links.map((link) => {
                  const label = typeof link === 'string' ? link : link.label;
                  const href = typeof link === 'string' ? '#' : (link.href || '#');
                  const onClick = typeof link === 'string' ? undefined : link.onClick;
                  return (
                    <li key={label}>
                      <a 
                        className="hover:text-secondary transition-colors cursor-pointer" 
                        href={href}
                        onClick={(e) => {
                          if (onClick) {
                            e.preventDefault();
                            onClick();
                          }
                        }}
                      >
                        {label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="container mx-auto mt-16 pt-8 border-t border-secondary/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-on-surface-variant/60">© 2024 Vantory Digital. Todos los derechos reservados. Made in Chile.</p>
          <div className="flex flex-wrap justify-center md:justify-end gap-6 text-xs text-on-surface-variant/60">
            <button onClick={() => setActiveModal('privacy')} className="hover:text-secondary transition-colors">Política de Privacidad</button>
            <button onClick={() => setActiveModal('terms')} className="hover:text-secondary transition-colors">Términos y Condiciones</button>
            <button onClick={() => setShowCookies(true)} className="hover:text-secondary transition-colors">Cookies</button>
          </div>
        </div>

        {/* Developer Credit Banner */}
        <div className="container mx-auto mt-12 flex justify-center">
          <motion.a 
            href="https://www.vantorydigital.cl"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02, y: -2 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-50 text-secondary rounded-full shadow-sm hover:shadow-md transition-all border border-blue-100 group"
          >
            <span className="text-[10px] font-black tracking-widest uppercase opacity-60 group-hover:opacity-100 transition-opacity">Desarrollado por</span>
            <span className="text-sm font-black tracking-tight">VANTORY DIGITAL</span>
            <div className="w-1.5 h-1.5 rounded-full bg-secondary/30"></div>
            <span className="text-[10px] font-bold text-secondary/70 italic">Creamos tu web</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </motion.a>
        </div>
      </footer>
      )}

      {/* Legal Modals */}
      <AnimatePresence>
        {activeModal && (
          <LegalModal type={activeModal} onClose={() => setActiveModal(null)} />
        )}
      </AnimatePresence>

      {/* Cookie Banner */}
      <AnimatePresence>
        {showCookies && <CookieBanner />}
      </AnimatePresence>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-secondary text-white rounded-full shadow-2xl shadow-secondary/40 flex items-center justify-center border border-white/20 backdrop-blur-sm"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cash Register Modal */}
      <AnimatePresence>
        {showCashRegisterModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-[#0F172A] font-headline">{clientCashRegister.isOpen ? 'Cierre' : 'Apertura'} de <span className="text-secondary">Caja</span></h3>
                  <p className="text-sm font-bold text-[#0F172A]/70">{clientCashRegister.isOpen ? 'Cuadre de caja al final del turno' : 'Ingresa el monto inicial para comenzar'}</p>
                </div>
                <button onClick={() => setShowCashRegisterModal(false)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
                  <X className="w-6 h-6 text-[#0F172A]" />
                </button>
              </div>

              {!clientCashRegister.isOpen ? (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const initial = parseInt((form.elements.namedItem('initialCash') as HTMLInputElement).value);
                  setClientCashRegister({ isOpen: true, initialCash: initial, currentCash: initial, openedAt: new Date().toISOString() });
                  setShowCashRegisterModal(false);
                }} className="space-y-6">
                  <div>
                    <label className="block text-sm font-black text-[#0F172A] mb-2">Monto Inicial en Efectivo (Sencillo)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F172A]/50 font-black">$</span>
                      <input 
                        name="initialCash"
                        type="number" 
                        required
                        min="0"
                        className="w-full pl-8 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-lg font-black text-[#0F172A] focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                        placeholder="Ej. 50000"
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-4 bg-gradient-secondary text-white font-black rounded-xl shadow-lg shadow-secondary/20 hover:scale-[1.02] transition-transform">
                    Abrir Caja
                  </button>
                </form>
              ) : (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const actual = parseInt((form.elements.namedItem('actualCash') as HTMLInputElement).value);
                  const expected = clientCashRegister.currentCash;
                  const diff = actual - expected;
                  
                  if (diff !== 0) {
                    const type = diff > 0 ? 'sobrante' : 'faltante';
                    if (!window.confirm(`⚠️ ADVERTENCIA: Hay un ${type} de $${Math.abs(diff).toLocaleString('es-CL')}.\n\nEfectivo Esperado: $${expected.toLocaleString('es-CL')}\nEfectivo Real: $${actual.toLocaleString('es-CL')}\n\n¿Deseas registrar este cierre con la diferencia?`)) {
                      return;
                    }
                  } else {
                    alert('¡Caja cuadrada perfectamente!');
                  }
                  
                  // Save to history
                  const closingRecord = {
                    id: Date.now(),
                    openedAt: clientCashRegister.openedAt,
                    closedAt: new Date().toISOString(),
                    initialCash: clientCashRegister.initialCash,
                    expectedCash: expected,
                    actualCash: actual,
                    difference: diff,
                    user: currentUser?.name || 'Sistema',
                    status: diff === 0 ? 'Cuadrada' : (diff > 0 ? 'Sobrante' : 'Faltante')
                  };
                  
                  setClientCashHistory((prev: any[]) => [closingRecord, ...prev]);
                  setClientCashRegister({ isOpen: false, initialCash: 0, currentCash: 0, openedAt: null });
                  setShowCashRegisterModal(false);
                }} className="space-y-6">
                  <div className="bg-surface-container-low p-4 rounded-xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-[#0F172A]/70">Monto Inicial:</span>
                      <span className="text-sm font-black text-[#0F172A]">${clientCashRegister.initialCash.toLocaleString('es-CL')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-[#0F172A]/70">Ventas en Efectivo:</span>
                      <span className="text-sm font-black text-green-600">+${(clientCashRegister.currentCash - clientCashRegister.initialCash).toLocaleString('es-CL')}</span>
                    </div>
                    <div className="h-px bg-outline-variant/20 w-full"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-base font-black text-[#0F172A]">Efectivo Esperado:</span>
                      <span className="text-lg font-black text-secondary">${clientCashRegister.currentCash.toLocaleString('es-CL')}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-black text-[#0F172A] mb-2">Efectivo Real en Caja</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F172A]/50 font-black">$</span>
                      <input 
                        name="actualCash"
                        type="number" 
                        required
                        min="0"
                        className="w-full pl-8 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-lg font-black text-[#0F172A] focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                        placeholder="Ingresa el monto contado"
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-4 bg-error text-white font-black rounded-xl shadow-lg shadow-error/20 hover:scale-[1.02] transition-transform">
                    Cerrar Caja
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
