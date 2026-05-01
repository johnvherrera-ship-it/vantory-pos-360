import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    
    if (user) {
      setCurrentUser(user);
    } else {
      setCurrentUser(users[0]);
    }

    // Invisible Scalability Logic
    if (stores.length === 1) {
      const storePos = posMachines.filter(p => p.storeId === stores[0].id);
      if (storePos.length === 1) {
        // Auto-bypass
        setCurrentStore(stores[0]);
        setCurrentPOS(storePos[0]);
        setCurrentPage('dashboard');
        return;
      }
    }
    
    // Go to Lobby
    setCurrentPage('lobby');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-surface relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-surface-container-low rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-primary-fixed opacity-30 blur-3xl"></div>
      </div>

      <main className="relative z-10 w-full max-w-lg px-6 py-12 flex flex-col items-center">
        <div className="mb-12">
          <Logo onClick={() => setCurrentPage('home')} />
        </div>
        
        <div className="w-full bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-slate-300/40 border border-slate-200">
          <header className="mb-8">
            <h2 className="font-headline font-bold text-xl text-on-surface tracking-tight mb-1">Iniciar Sesión</h2>
            <p className="text-on-surface-variant text-sm">Ingrese sus credenciales para continuar.</p>
          </header>
          
          <form className="space-y-6" onSubmit={handleLogin}>
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
};
