import React from 'react';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';

interface LogoProps {
  onClick?: () => void;
  className?: string;
  light?: boolean;
}

export const Logo = ({ onClick, className = "", light = false }: LogoProps) => (
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
