import React, { useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Monitor, ArrowLeft, X } from 'lucide-react';

const useRipple = () => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const addRipple = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples([...ripples, { id, x, y }]);
    setTimeout(() => setRipples(r => r.filter(ripple => ripple.id !== id)), 600);
  };

  return { ripples, addRipple };
};

interface LobbyProps {
  stores: any[];
  posMachines: any[];
  setCurrentStore: (store: any) => void;
  setCurrentPOS: (pos: any) => void;
  setCurrentPage: (page: any) => void;
  currentUser: any;
}

export const Lobby = ({
  stores,
  posMachines,
  setCurrentStore,
  setCurrentPOS,
  setCurrentPage,
  currentUser
}: LobbyProps) => {
  const [step, setStep] = useState<'select-store' | 'enter-pin' | 'select-pos'>('select-store');
  const [selectedStoreTemp, setSelectedStoreTemp] = useState<any>(null);
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');
  const { ripples, addRipple } = useRipple();

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
        <div className="flex justify-center items-center gap-2 mb-8">
          {[
            { label: 'Sucursal', number: 1, key: 'select-store' },
            { label: 'PIN', number: 2, key: 'enter-pin' },
            { label: 'Caja', number: 3, key: 'select-pos' }
          ].map((item, idx) => (
            <React.Fragment key={item.key}>
              <motion.div
                animate={{ opacity: step === item.key ? 1 : 0.4 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-1"
              >
                <motion.div
                  animate={{
                    backgroundColor: step === item.key ? 'rgb(51, 95, 157)' : 'rgb(242, 243, 255)',
                    color: step === item.key ? 'white' : 'rgb(69, 70, 77)',
                    scale: step === item.key ? 1.1 : 1
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all"
                >
                  {item.number}
                </motion.div>
                <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
              </motion.div>
              {idx < 2 && (
                <motion.div
                  animate={{
                    backgroundColor: step !== 'select-store' && idx === 0 || step === 'select-pos' && idx === 1 ? 'rgb(51, 95, 157)' : 'rgb(242, 243, 255)',
                    width: step !== 'select-store' && idx === 0 || step === 'select-pos' && idx === 1 ? '32px' : '32px'
                  }}
                  transition={{ duration: 0.4 }}
                  className="h-1"
                />
              )}
            </React.Fragment>
          ))}
        </div>

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
                {stores.map((store: any, idx: number) => (
                  <motion.button
                    key={store.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => handleStoreSelect(store)}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-6 text-left rounded-xl border-2 border-secondary/25 hover:border-secondary/70 hover:bg-secondary/5 transition-all group relative overflow-hidden card-hover-enhance"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100"
                      animate={{ opacity: [0, 0.05, 0] }}
                      transition={{ duration: 4, repeat: Infinity, delay: idx * 0.2 }}
                    />
                    <div className="flex items-center gap-4 mb-2 relative z-10">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 8 }}
                        className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors"
                      >
                        <Globe className="w-6 h-6" />
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-lg text-on-surface">{store.name}</h3>
                        <p className="text-sm text-on-surface-variant">{store.address}</p>
                      </div>
                    </div>
                  </motion.button>
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
                      <motion.button
                        key={num}
                        type="button"
                        onClick={(e) => {
                          if (pinInput.length < 4) setPinInput(prev => prev + num);
                          addRipple(e);
                        }}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        className="py-4 text-2xl font-bold bg-surface-container-low hover:bg-surface-container-high rounded-xl transition-colors relative overflow-hidden group"
                      >
                        <span className="relative">{num}</span>
                        {ripples.map(ripple => (
                          <motion.span
                            key={ripple.id}
                            className="absolute w-1 h-1 rounded-full bg-secondary/50"
                            style={{ left: ripple.x, top: ripple.y }}
                            animate={{ scale: [1, 40], opacity: [0.6, 0] }}
                            transition={{ duration: 0.6 }}
                          />
                        ))}
                      </motion.button>
                    ))}
                    <motion.button
                      type="button"
                      onClick={() => setStep('select-store')}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      className="py-4 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center rounded-xl hover:bg-surface-container-low"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={(e) => {
                        if (pinInput.length < 4) setPinInput(prev => prev + '0');
                        addRipple(e);
                      }}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      className="py-4 text-2xl font-bold bg-surface-container-low hover:bg-surface-container-high rounded-xl transition-colors relative overflow-hidden"
                    >
                      <span className="relative">0</span>
                      {ripples.map(ripple => (
                        <motion.span
                          key={ripple.id}
                          className="absolute w-1 h-1 rounded-full bg-secondary/50"
                          style={{ left: ripple.x, top: ripple.y }}
                          animate={{ scale: [1, 40], opacity: [0.6, 0] }}
                          transition={{ duration: 0.6 }}
                        />
                      ))}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setPinInput(prev => prev.slice(0, -1))}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      className="py-4 text-sm font-bold text-error hover:bg-error/10 rounded-xl transition-colors flex items-center justify-center"
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
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
                {posMachines.filter((p: any) => p.storeId === selectedStoreTemp?.id).map((pos: any, idx: number) => (
                  <motion.button
                    key={pos.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => handlePosSelect(pos)}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-6 flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-secondary/25 hover:border-secondary/70 hover:bg-secondary/5 transition-all group relative overflow-hidden card-hover-enhance"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100"
                      animate={{ opacity: [0, 0.05, 0] }}
                      transition={{ duration: 4, repeat: Infinity, delay: idx * 0.2 }}
                    />
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: -8 }}
                      className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors relative z-10"
                    >
                      <Monitor className="w-8 h-8" />
                    </motion.div>
                    <h3 className="font-bold text-xl text-on-surface relative z-10">{pos.name}</h3>
                  </motion.button>
                ))}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: posMachines.filter((p: any) => p.storeId === selectedStoreTemp?.id).length * 0.1 }}
                  onClick={() => setStep('select-store')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-6 flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-outline-variant/30 hover:border-outline-variant hover:bg-surface-container-low/50 transition-all text-on-surface-variant"
                >
                  <ArrowLeft className="w-8 h-8" />
                  <span className="font-bold">Volver</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
