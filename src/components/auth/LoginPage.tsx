import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Shield, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  History, 
  LineChart, 
  Package 
} from 'lucide-react';
import { Logo } from '../layout/Logo';

interface LoginPageProps {
  users: any[];
  stores: any[];
  posMachines: any[];
  setCurrentUser: (user: any) => void;
  setCurrentPage: (page: any) => void;
  setCurrentStore: (store: any) => void;
  setCurrentPOS: (pos: any) => void;
}

export const LoginPage = ({ 
  users, 
  stores, 
  posMachines, 
  setCurrentUser, 
  setCurrentPage, 
  setCurrentStore, 
  setCurrentPOS 
}: LoginPageProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('usuario') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    // Super Admin Login - Uses environment variables for demo credentials
    const adminEmail = import.meta.env.VITE_DEMO_SUPERADMIN_EMAIL;
    const adminPassword = import.meta.env.VITE_DEMO_SUPERADMIN_PASSWORD;

    if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
      setCurrentUser({
        id: 0,
        name: 'Vantory Admin',
        email: adminEmail,
        role: 'SuperAdmin',
        modules: [],
        clientId: 0,
        status: 'active'
      });
      setCurrentPage('superadmin-dashboard');
      return;
    }

    // Regular user login
    const user = users.find(u => u.email === email);

    if (!user) {
      // No user found - show error (TODO: add error feedback UI)
      console.warn('Usuario no encontrado:', email);
      return;
    }

    // TODO: In production, validate password against hashed value from backend
    // For now, accept any password if user exists (development only)
    setCurrentUser(user);

    // Auto-navigate if single store/POS
    if (stores.length === 1) {
      const storePos = posMachines.filter(p => p.storeId === stores[0].id);
      if (storePos.length === 1) {
        setCurrentStore(stores[0]);
        setCurrentPOS(storePos[0]);
        setCurrentPage('dashboard');
        return;
      }
    }

    // Go to store/POS selection
    setCurrentPage('lobby');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="auth-page-wrapper min-h-screen flex items-center justify-center bg-gradient-to-br from-surface via-surface to-surface-container-low/50 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute top-[-15%] right-[-10%] w-[700px] h-[700px] bg-secondary/10 rounded-full opacity-40 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.3 }}
          className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-secondary/5 rounded-full opacity-30 blur-3xl"
        />
      </div>

      <main className="relative z-10 w-full max-w-lg px-6 py-4 flex flex-col items-center">
        <div className="mb-6">
          <Logo onClick={() => setCurrentPage('home')} />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full bg-gradient-to-br from-white to-surface-container-lowest/40 rounded-[2rem] p-6 md:p-8 shadow-[0_40px_80px_-15px_rgba(38,124,220,0.15)] border border-secondary/15 hover:border-secondary/30 transition-all"
        >
          <header className="mb-6">
            <motion.h2 className="font-headline font-black text-2xl text-on-surface tracking-tight mb-1">Iniciar Sesión</motion.h2>
            <p className="text-on-surface-variant text-xs font-medium">Ingrese sus credenciales para continuar.</p>
          </header>
          
          <form className="space-y-4" onSubmit={handleLogin}>
            {/* User Field */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <label className="font-label font-bold text-xs text-on-surface-variant tracking-widest uppercase" htmlFor="usuario">Correo Electrónico</label>
              <div className="relative group">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/50 group-focus-within:text-secondary w-5 h-5 transition-colors" />
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  className="w-full bg-surface-container-highest/30 border-2 border-surface-container-high/50 hover:border-secondary/30 focus:border-secondary rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0 focus:bg-white transition-all duration-200 outline-none font-medium"
                  id="usuario"
                  name="usuario"
                  placeholder="correo@empresa.com"
                  type="email"
                  required
                />
              </div>
            </motion.div>
            
            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <label className="font-label font-bold text-xs text-on-surface-variant tracking-widest uppercase" htmlFor="password">Contraseña</label>
                <span className="text-on-surface-variant/60 font-medium text-[10px]">¿Olvido su contraseña?</span>
              </div>
              <div className="relative group">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/50 group-focus-within:text-secondary w-5 h-5 transition-colors" />
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  className="w-full bg-surface-container-highest/30 border-2 border-surface-container-high/50 hover:border-secondary/30 focus:border-secondary rounded-xl py-4 pl-12 pr-12 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0 focus:bg-white transition-all duration-200 outline-none font-medium"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  required
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </div>
            </motion.div>
            
            {/* Submit Action */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-secondary w-full py-4 rounded-xl font-headline font-bold text-white shadow-lg shadow-secondary/30 hover:shadow-2xl hover:shadow-secondary/40 transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group"
                type="submit"
              >
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 0.1, x: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 bg-white/10"
                />
                <span className="relative text-lg">Ingresar</span>
                <motion.div className="relative" whileHover={{ x: 4 }}>
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.button>
            </motion.div>
          </form>
          
          <footer className="mt-8 pt-6 border-t border-surface-container-low text-center">
            <p className="text-on-surface-variant text-xs">
              ¿No tiene una cuenta? <a className="text-secondary font-bold hover:underline" href="mailto:soporte@vantorydigital.cl">Soporte</a>
            </p>
          </footer>
        </motion.div>

        {/* System Status/Metadata */}
        <div className="mt-8 flex flex-col items-center gap-4 opacity-60">
          <div className="flex items-center gap-6 text-[10px] font-label font-medium text-on-surface-variant">
            <div className="flex items-center gap-2">
              <Shield className="w-3 h-3" />
              <span>Acceso Seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <History className="w-3 h-3" />
              <span>v2.4.0</span>
            </div>
          </div>
          <div className="h-[1px] w-8 bg-outline-variant/30"></div>
          <div className="text-center">
            <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Vantory Digital</p>
          </div>
        </div>
      </main>
      
      {/* Side Illustration/Texture (Hidden on small screens) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="hidden md:block absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-bl from-secondary/[0.08] to-surface-container-low z-0"
      >
        <div className="h-full w-full flex items-center justify-center p-12 relative">
          {/* Decorative Elements */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-10 right-10 w-20 h-20 bg-secondary/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
            className="absolute bottom-20 right-20 w-32 h-32 bg-secondary/5 rounded-full blur-2xl"
          />

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-6 max-w-xs relative z-10"
          >
            <motion.div className="w-16 h-1 bg-gradient-to-r from-secondary to-secondary/40 rounded-full" />
            <h3 className="font-headline font-black text-4xl tracking-tight text-on-surface leading-tight">Gestión Inteligente en un solo lugar.</h3>
            <p className="text-on-surface-variant text-base font-medium leading-relaxed">Simplifica tus ventas e inventarios con la arquitectura más robusta del mercado.</p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="pt-8 grid grid-cols-2 gap-4"
            >
              <motion.div
                whileHover={{ y: -6 }}
                className="bg-gradient-to-br from-white to-surface-container-low/50 p-5 rounded-2xl shadow-lg hover:shadow-xl border border-secondary/10 transition-all"
              >
                <LineChart className="text-secondary w-8 h-8 mb-3" />
                <p className="text-xs font-bold text-on-surface">Reportes Real-time</p>
              </motion.div>
              <motion.div
                whileHover={{ y: -6 }}
                className="bg-gradient-to-br from-white to-surface-container-low/50 p-5 rounded-2xl shadow-lg hover:shadow-xl border border-secondary/10 transition-all"
              >
                <Package className="text-secondary w-8 h-8 mb-3" />
                <p className="text-xs font-bold text-on-surface">Control Stock</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};
