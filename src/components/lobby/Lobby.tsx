
import React, { useState } from 'react';
import { Globe, Monitor, ArrowLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Lobby = ({ stores, posMachines, setCurrentStore, setCurrentPOS, setCurrentPage, currentUser }: any) => {
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
                {stores.map((store: any) => {
                  const suspended = store.status === 'Suspendido';
                  return (
                    <button
                      key={store.id}
                      onClick={() => !suspended && handleStoreSelect(store)}
                      disabled={suspended}
                      className={`p-6 text-left rounded-xl border-2 transition-all group ${suspended ? 'border-error/20 bg-error/5 opacity-70 cursor-not-allowed' : 'border-outline-variant/20 hover:border-secondary hover:bg-secondary/5 cursor-pointer'}`}
                    >
                      <div className="flex items-center gap-4 mb-2">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${suspended ? 'bg-error/10 text-error' : 'bg-surface-container-low group-hover:bg-secondary group-hover:text-white'}`}>
                          <Globe className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg text-on-surface">{store.name}</h3>
                            {suspended && <span className="text-[10px] font-black uppercase bg-error/15 text-error px-2 py-0.5 rounded-full tracking-wider">Suspendido</span>}
                          </div>
                          <p className="text-sm text-on-surface-variant">{store.address}</p>
                          {suspended && <p className="text-xs text-error font-medium mt-1">Este local está suspendido. Contacta a tu administrador.</p>}
                        </div>
                      </div>
                    </button>
                  );
                })}
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
