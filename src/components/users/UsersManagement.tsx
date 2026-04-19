import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Settings, 
  LogOut, 
  UserPlus, 
  Edit, 
  Trash2, 
  Shield, 
  Monitor, 
  CheckCircle, 
  X, 
  Info 
} from 'lucide-react';
import { SideNavBar } from '../layout/SideNavBar';
import { useAppContexts } from '../../hooks/useAppContexts';

interface UsersManagementProps {}

export const UsersManagement = ({}: UsersManagementProps) => {
  const { ui, pos, app } = useAppContexts();
  const { setCurrentPage } = ui;
  const { currentUser, setCurrentUser, currentStore, currentPOS } = pos;
  const { clientUsers: users, setClientUsers: setUsers, clientStores: stores } = app;
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
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen p-4 md:p-8 pt-20 md:pt-8">
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
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f2f3ff] transition-colors">
              <Settings className="w-5 h-5 text-on-surface-variant" />
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
                referrerPolicy="no-referrer"
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
                          <img className="w-10 h-10 rounded-full object-cover border border-outline-variant/20" src={user.image} alt={user.name} referrerPolicy="no-referrer" />
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
