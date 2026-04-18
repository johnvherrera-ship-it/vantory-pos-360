import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  LogOut, 
  ArrowLeft, 
  Plus, 
  Globe, 
  Monitor, 
  UserPlus, 
  Edit, 
  X, 
  Info 
} from 'lucide-react';
import { Logo } from '../layout/Logo';
import { supabaseService } from '../../services/supabaseService';

interface SuperAdminClientProfileProps {
  client: any;
  setCurrentPage: (page: any) => void;
  stores: any[];
  setStores: (stores: any[]) => void;
  posMachines: any[];
  setPosMachines: (pos: any[]) => void;
  vantoryClients: any[];
  setVantoryClients: (clients: any[]) => void;
  users: any[];
  setUsers: (users: any[]) => void;
}

const SuperAdminClientProfile = ({ 
  client, 
  setCurrentPage, 
  stores, 
  setStores, 
  posMachines, 
  setPosMachines, 
  vantoryClients, 
  setVantoryClients, 
  users, 
  setUsers 
}: SuperAdminClientProfileProps) => {
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showPosModal, setShowPosModal] = useState(false);
  const [selectedStoreForPos, setSelectedStoreForPos] = useState<number | null>(null);
  
  const [storeError, setStoreError] = useState('');
  const [posError, setPosError] = useState('');
  
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  // Local state for this client's data (separate from global app state)
  const [localStores, setLocalStores] = useState<any[]>([]);
  const [localPos, setLocalPos] = useState<any[]>([]);
  const [localUsers, setLocalUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClientData = async () => {
      setLoading(true);
      try {
        const [storesData, posData, usersData] = await Promise.all([
          supabaseService.getStores(client.id),
          supabaseService.getPOSMachines(client.id),
          supabaseService.getUsers(client.id)
        ]);
        setLocalStores(storesData);
        setLocalPos(posData);
        setLocalUsers(usersData);
      } catch (error) {
        console.error('Error loading client data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadClientData();
  }, [client.id]);

  const handleSaveUser = async (e: React.FormEvent) => {
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
      await supabaseService.updateUser(editingUser.id, { name, email, role, status, modules, storeId: storeId ? parseInt(storeId) : null });
      setLocalUsers(localUsers.map((u: any) => u.id === editingUser.id ? { ...u, name, email, role, status, modules, storeId: storeId ? parseInt(storeId) : null } : u));
    } else {
      try {
        const newUser = {
          clientId: client.id,
          storeId: storeId ? parseInt(storeId) : null,
          name,
          email,
          password,
          role,
          status,
          modules,
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80'
        };
        const saved = await supabaseService.createUser(newUser);
        setLocalUsers([...localUsers, { ...newUser, id: saved.id }]);
      } catch (error) {
        console.error('Error creating user:', error);
        alert('Error al crear usuario. Revise que el email sea único.');
        return;
      }
    }
    setShowUserModal(false);
    setEditingUser(null);
  };

  const handleAddStore = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const storeData = {
      client_id: client.id,
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      address: (form.elements.namedItem('address') as HTMLInputElement).value,
      pin: (form.elements.namedItem('pin') as HTMLInputElement).value,
    };
    
    try {
      const savedStore = await supabaseService.createStore(storeData);
      setLocalStores([...localStores, savedStore]);
      setShowStoreModal(false);
      setStoreError('');
    } catch (error) {
      console.error('Error creating store:', error);
      setStoreError('Error al guardar el local en la base de datos.');
    }
  };

  const handleAddPos = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedStoreForPos) {
      setPosError('Debe seleccionar una tienda');
      return;
    }

    const form = e.currentTarget;
    const posData = {
      client_id: client.id,
      storeId: selectedStoreForPos,
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
    };

    try {
      const savedPos = await supabaseService.createPOS(posData);
      setLocalPos([...localPos, savedPos]);
      setShowPosModal(false);
      setPosError('');
      form.reset();
    } catch (error) {
      console.error('Error creating POS:', error);
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      setPosError(errorMsg);
    }
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
          <button onClick={() => setCurrentPage('superadmin-dashboard')} className={`w-full flex items-center gap-3 py-3 px-6 my-1 transition-all cursor-pointer rounded-xl mx-4 text-white/70 hover:bg-white/10 hover:text-white`}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-base font-bold font-body">Métricas</span>
          </button>
          <button onClick={() => setCurrentPage('superadmin-clients')} className={`w-full flex items-center gap-3 py-3 px-6 my-1 transition-all cursor-pointer rounded-xl mx-4 bg-white/20 text-white shadow-lg`}>
            <Users className="w-5 h-5" />
            <span className="text-base font-bold font-body">Clientes SaaS</span>
          </button>
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
                disabled={localStores.length >= client.maxStores}
                title={localStores.length >= client.maxStores ? "Límite de locales alcanzado" : "Crear nuevo local"}
                className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg ${localStores.length >= client.maxStores ? 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed' : 'bg-secondary text-white hover:bg-secondary/90'}`}
             >
                <Plus className="w-5 h-5" />
                Nuevo Local
             </button>
          </div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20">
            <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4">Suscripción</h3>
            <p className="text-2xl font-black text-on-surface mb-1">${(client?.mrr || 0).toLocaleString('es-CL')}/mes</p>
            <p className="text-sm font-medium text-on-surface-variant">Facturación mensual</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20">
            <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4">Locales (Uso / Límite)</h3>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-black text-on-surface">{localStores.length}</p>
              <p className="text-xl font-bold text-on-surface-variant mb-1">/ {client?.maxStores || 0}</p>
            </div>
            <div className="w-full bg-surface-container-highest h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: `${((localStores.length || 0) / (client?.maxStores || 1)) * 100}%` }}></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20">
            <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4">Cajas por Local (Límite)</h3>
            <p className="text-3xl font-black text-on-surface mb-1">{client?.maxPosPerStore || 0}</p>
            <p className="text-sm font-medium text-on-surface-variant">Máximo permitido por sucursal</p>
          </div>
        </div>

        <h3 className="text-xl font-black font-headline mb-6">Infraestructura del Cliente</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {localStores.map((store: any) => {
            const storePos = localPos.filter((p: any) => p.storeId === store.id);
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
          
          {localStores.length === 0 && (
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
              {localUsers.map((user: any) => (
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
              {localUsers.length === 0 && (
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
                  <input name="pin" required pattern="[0-9]{4}" maxLength={4} className="w-full p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary outline-none font-medium font-mono" placeholder="1234" />
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
                      {localStores.map((s: any) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
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

export default SuperAdminClientProfile;
