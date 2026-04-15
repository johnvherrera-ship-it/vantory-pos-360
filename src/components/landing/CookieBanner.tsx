import React from 'react';
import { motion } from 'framer-motion';
import { Shield, X } from 'lucide-react';

export const CookieBanner = () => {
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-8 left-8 right-8 md:left-auto md:right-8 md:max-w-md z-[100]"
    >
      <div className="bg-white rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-outline-variant/20 flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-black text-[#0F172A] font-headline">Configuración de Cookies</h4>
            <p className="text-xs text-on-surface-variant font-medium leading-relaxed">Utilizamos cookies para mejorar tu experiencia y analizar el tráfico de nuestro sistema POS.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 py-3 bg-secondary text-white text-xs font-black rounded-xl hover:scale-[1.02] transition-transform">
            Aceptar Todo
          </button>
          <button className="flex-1 py-3 bg-surface-container-low text-on-surface-variant text-xs font-black rounded-xl hover:bg-surface-container-high transition-colors">
            Personalizar
          </button>
        </div>
      </div>
    </motion.div>
  );
};
