import React from 'react';
import { motion } from 'motion/react';

interface LogoProps {
  onClick?: () => void;
  className?: string;
  light?: boolean;
}

const VantoeyIcon = ({ light = false }) => (
  <svg viewBox="0 0 40 40" className="w-6 h-6" fill={light ? "white" : "currentColor"}>
    {/* Modern V shape */}
    <path d="M12 8 L20 28 L28 8" stroke={light ? "white" : "currentColor"} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    {/* Accent dot */}
    <circle cx="20" cy="22" r="1.5" fill={light ? "white" : "currentColor"} opacity="0.6" />
  </svg>
);

export const Logo = ({ onClick, className = "", light = false }: LogoProps) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 font-headline cursor-pointer group ${className}`}
  >
    <div className="relative">
      <div className={`w-10 h-10 ${light ? 'bg-white/20 text-white' : 'bg-secondary text-white'} rounded-xl flex items-center justify-center shadow-lg ${light ? 'shadow-white/10' : 'shadow-secondary/20'} group-hover:rotate-12 transition-transform duration-500`}>
        <VantoeyIcon light={light} />
      </div>
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        className={`absolute -inset-1 ${light ? 'bg-white/20' : 'bg-secondary/30'} blur-md rounded-xl -z-10`}
      ></motion.div>
    </div>
    <div className="flex flex-col leading-tight">
      <span className={`text-2xl font-black tracking-tighter whitespace-nowrap ${light ? 'text-white' : 'text-[#0F172A]'} group-hover:text-secondary transition-colors`}>VANTORY</span>
      <div className="flex items-center gap-2">
        <span className={`text-[11px] font-bold tracking-[0.2em] whitespace-nowrap ${light ? 'text-white/80' : 'text-secondary'} uppercase`}>POS 360</span>
        <motion.div
          animate={{ width: [8, 20, 8] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`h-0.5 ${light ? 'bg-white/50' : 'bg-secondary'} rounded-full flex-shrink-0`}
        ></motion.div>
      </div>
    </div>
  </div>
);
