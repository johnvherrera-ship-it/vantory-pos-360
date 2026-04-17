import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, CheckCircle, ShoppingCart, Banknote, CreditCard, Wallet } from 'lucide-react';

interface CustomerViewProps {
  setCompletedSale: (sale: any) => void;
  completedSale: any;
  showThankYou: boolean;
}

export function CustomerView({ setCompletedSale, completedSale, showThankYou }: CustomerViewProps) {
  const [clockTime, setClockTime] = useState(new Date());
  const [storeInfo, setStoreInfo] = useState<{ storeName?: string; posName?: string } | null>(null);
  const [paymentInProgress, setPaymentInProgress] = useState<any>(null);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setClockTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Listen for localStorage updates
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const storedInfo = localStorage.getItem('pos-store-info');
        setStoreInfo(storedInfo ? JSON.parse(storedInfo) : null);
      } catch { setStoreInfo(null); }

      try {
        const storedPayment = localStorage.getItem('pos-payment');
        setPaymentInProgress(storedPayment ? JSON.parse(storedPayment) : null);
      } catch { setPaymentInProgress(null); }

      try {
        const storedSale = localStorage.getItem('pos-sale-completed');
        setCompletedSale(storedSale ? JSON.parse(storedSale) : null);
      } catch { setCompletedSale(null); }
    };

    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [setCompletedSale]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[#0b1120] flex flex-col overflow-hidden"
    >
      {/* HEADER */}
      <header className="flex-shrink-0 flex justify-between items-center px-8 py-3 bg-white/5 border-b border-white/10">
        <div>
          <span className="text-2xl font-black tracking-tighter text-white">Vantory <span className="text-secondary">POS</span></span>
          {storeInfo && (storeInfo.storeName || storeInfo.posName) && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <Globe className="w-3 h-3 text-secondary/70" />
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{storeInfo.storeName} · {storeInfo.posName}</span>
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-white font-black text-2xl tabular-nums">
            {clockTime.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div className="text-white/30 text-[11px] font-medium capitalize">
            {clockTime.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex items-center justify-center overflow-hidden px-8 py-4">
        <AnimatePresence mode="wait">
          {showThankYou && completedSale ? (
            <ThankYouView sale={completedSale} storeInfo={storeInfo} />
          ) : completedSale ? (
            <CompletedSaleView sale={completedSale} />
          ) : paymentInProgress ? (
            <PaymentView payment={paymentInProgress} />
          ) : null}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="flex-shrink-0 px-8 py-4 bg-white/5 border-t border-white/10 text-center text-xs text-white/20">
        <div>
          Conectado · Visor de Cliente
        </div>
        <div className="text-xs text-white/20">
          Desarrollado por <span className="font-bold text-white/35">VANTORY DIGITAL</span> · vantorydigital.cl
        </div>
      </footer>
    </motion.div>
  );
}

function ThankYouView({ sale, storeInfo }: { sale: any; storeInfo: any }) {
  return (
    <motion.div
      key="thankyou"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full h-full flex flex-col items-center justify-center text-center relative overflow-hidden"
    >
      {[...Array(16)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${8 + (i % 4) * 6}px`,
            height: `${8 + (i % 4) * 6}px`,
            left: `${(i * 6.25) % 100}%`,
            background: ['#6366f1','#22c55e','#f59e0b','#ec4899','#3b82f6','#14b8a6'][i % 6],
            opacity: 0.7,
          }}
          initial={{ y: '110vh', opacity: 0 }}
          animate={{ y: '-20vh', opacity: [0, 0.8, 0.8, 0] }}
          transition={{
            duration: 3.5 + (i % 4) * 0.8,
            delay: (i * 0.18) % 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}

      <motion.div
        animate={{ scale: [1, 1.4, 1], opacity: [0.05, 0.12, 0.05] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-[600px] h-[600px] rounded-full bg-secondary"
      />

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18, duration: 0.6 }}
          className="w-28 h-28 rounded-full bg-green-500/20 border-4 border-green-500/50 flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(34,197,94,0.3)]"
        >
          <CheckCircle className="w-16 h-16 text-green-400" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-8xl font-black text-white tracking-tight leading-none mb-4"
        >
          ¡Gracias!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-3xl font-medium text-white/50"
        >
          Vuelve Pronto
        </motion.p>

        {sale.total > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: 'spring' }}
            className="mt-10 px-8 py-4 bg-white/8 border border-white/15 rounded-2xl"
          >
            <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Total pagado</p>
            <p className="text-secondary font-black text-4xl tabular-nums">${sale.total.toLocaleString('es-CL')}</p>
          </motion.div>
        )}

        {storeInfo?.storeName && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ delay: 1 }}
            className="mt-8 text-white text-sm font-bold uppercase tracking-[0.3em]"
          >
            {storeInfo.storeName}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

function CompletedSaleView({ sale }: { sale: any }) {
  return (
    <motion.div
      key="completed"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-5xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-14 h-14 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center flex-shrink-0"
          >
            <CheckCircle className="w-8 h-8 text-green-400" />
          </motion.div>
          <div>
            <h2 className="text-4xl font-black text-white leading-none">¡Venta Exitosa!</h2>
            <p className="text-white/40 text-sm mt-0.5">{new Date(sale.date).toLocaleString('es-CL')}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white/30 text-xs uppercase tracking-widest">Código de operación</p>
          <p className="text-white font-mono font-black text-xl">#VT-{sale.id?.toString().slice(-6).padStart(6, '0')}</p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 bg-white/8 border border-white/12 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-secondary" />
            <span className="text-white font-black text-sm uppercase tracking-widest">Productos</span>
            <span className="ml-auto text-white/30 text-xs">{sale.cart.length} ítem{sale.cart.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="divide-y divide-white/8">
            {sale.cart.slice(0, 6).map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center px-5 py-3">
                <div className="min-w-0">
                  <p className="text-white font-bold text-sm truncate">{item.name}</p>
                  <p className="text-white/40 text-xs">{item.quantity} × ${item.price.toLocaleString('es-CL')}</p>
                </div>
                <p className="text-secondary font-black ml-4 flex-shrink-0">${(item.price * item.quantity).toLocaleString('es-CL')}</p>
              </div>
            ))}
            {sale.cart.length > 6 && (
              <div className="px-5 py-2 text-center text-white/30 text-xs">
                +{sale.cart.length - 6} producto{sale.cart.length - 6 !== 1 ? 's' : ''} más
              </div>
            )}
          </div>
        </div>

        <div className="col-span-2 flex flex-col gap-3">
          <div className="bg-white/8 border border-white/12 rounded-2xl p-5 flex-1">
            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Subtotal</span>
                <span className="text-white font-bold">${(sale.subtotal ?? sale.total).toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">IVA (19%)</span>
                <span className="text-white font-bold">${Math.round((sale.subtotal ?? sale.total) * 0.19).toLocaleString('es-CL')}</span>
              </div>
            </div>
            <div className="border-t border-white/15 pt-3">
              <div className="flex justify-between items-baseline">
                <span className="text-white/60 font-bold text-sm uppercase tracking-wider">Total</span>
                <span className="text-green-400 font-black text-3xl">${sale.total.toLocaleString('es-CL')}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/8 border border-white/12 rounded-2xl p-5">
            <p className="text-white/30 text-xs uppercase tracking-widest mb-3">Método de Pago</p>
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${
              sale.paymentMethod === 'Efectivo' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
              sale.paymentMethod === 'Débito' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
              sale.paymentMethod === 'Fiado' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
              'bg-secondary/20 text-secondary border border-secondary/30'
            }`}>
              {sale.paymentMethod === 'Efectivo' ? <Banknote className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
              {sale.paymentMethod}
            </span>
          </div>
        </div>
      </div>

      <p className="text-center text-white/20 text-sm mt-4 italic">¡Gracias por su compra! Vuelva pronto.</p>
    </motion.div>
  );
}

function PaymentView({ payment }: { payment: any }) {
  return (
    <motion.div
      key="payment"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-2xl"
    >
      <div className="text-center mb-8">
        <div className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-full font-bold mb-6 border ${
          payment.method === 'Efectivo'
            ? 'bg-green-500/15 text-green-300 border-green-500/30'
            : 'bg-orange-500/15 text-orange-300 border-orange-500/30'
        }`}>
          {payment.method === 'Efectivo'
            ? <Banknote className="w-5 h-5" />
            : <Wallet className="w-5 h-5" />}
          Pago en {payment.method}
        </div>
        <p className="text-white/40 text-lg mb-1">Total a pagar</p>
        <p className="text-7xl font-black text-white tabular-nums">
          ${payment.total.toLocaleString('es-CL')}
        </p>
      </div>

      {payment.method === 'Efectivo' && payment.amountReceived > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="bg-white/10 border border-white/15 rounded-2xl p-6 text-center">
            <p className="text-white/40 text-sm uppercase tracking-widest mb-2">Recibido</p>
            <p className="text-white font-black text-4xl tabular-nums">
              ${payment.amountReceived.toLocaleString('es-CL')}
            </p>
          </div>
          <motion.div
            animate={payment.sufficient ? { scale: [1, 1.03, 1] } : {}}
            transition={{ duration: 0.4 }}
            className={`rounded-2xl p-6 text-center border-2 ${
              payment.sufficient
                ? 'bg-green-500/20 border-green-500/50'
                : 'bg-red-500/15 border-red-500/30'
            }`}
          >
            <p className={`text-sm uppercase tracking-widest mb-2 ${payment.sufficient ? 'text-green-300/70' : 'text-red-300/70'}`}>
              {payment.sufficient ? 'Vuelto' : 'Falta'}
            </p>
            <p className={`font-black text-4xl tabular-nums ${payment.sufficient ? 'text-green-300' : 'text-red-400'}`}>
              ${payment.change.toLocaleString('es-CL')}
            </p>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
