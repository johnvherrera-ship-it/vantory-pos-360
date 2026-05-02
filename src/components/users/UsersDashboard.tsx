
import React, { useState } from 'react';
import { 
  Bell, Settings, LogOut, UserPlus, Edit, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SideNavBar } from '../layout/SideNavBar';

export const UsersManagement = ({ setCurrentPage, users, setUsers, currentUser, setCurrentUser, stores, currentStore, currentPOS }: { setCurrentPage: (page: any) => void, users: any[], setUsers: any, currentUser: any, setCurrentUser: any, stores: any[], currentStore: any, currentPOS: any }) => {
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
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto p-8">
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
                          <img className="w-10 h-10 rounded-full object-cover border border-outline-variant/20" src={user.image} alt={user.name} />
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
                                setUsers(users.filter((u: any) => u.id !== user.id));
                              }
                            }}
                            className="p-2 hover:bg-surface-container rounded-lg text-error transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      <AnimatePresence>
        {showUserModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowUserModal(false); setEditingUser(null); }}
              className="absolute inset-0 bg-[#0F172A]/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-black font-headline text-[#0F172A]">
                    {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                  </h3>
                  <button onClick={() => { setShowUserModal(false); setEditingUser(null); }} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <form onSubmit={handleSaveUser} className="grid grid-cols-2 gap-8">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-black uppercase tracking-widest text-[#0F172A]/50 mb-3">Nombre Completo</label>
                    <input name="name" defaultValue={editingUser?.name} required className="w-full bg-surface-container-low border-none rounded-xl py-3.5 px-5 outline-none focus:ring-2 focus:ring-secondary/20 font-bold" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-black uppercase tracking-widest text-[#0F172A]/50 mb-3">Email Corporativo</label>
                    <input name="email" type="email" defaultValue={editingUser?.email} required className="w-full bg-surface-container-low border-none rounded-xl py-3.5 px-5 outline-none focus:ring-2 focus:ring-secondary/20 font-bold" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-black uppercase tracking-widest text-[#0F172A]/50 mb-3">Contraseña {editingUser && '(Opcional)'}</label>
                    <input name="password" type="password" required={!editingUser} className="w-full bg-surface-container-low border-none rounded-xl py-3.5 px-5 outline-none focus:ring-2 focus:ring-secondary/20 font-bold" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-black uppercase tracking-widest text-[#0F172A]/50 mb-3">Rol del Sistema</label>
                    <select name="role" defaultValue={editingUser?.role || 'Cajero'} className="w-full bg-surface-container-low border-none rounded-xl py-3.5 px-5 outline-none focus:ring-2 focus:ring-secondary/20 font-bold">
                      <option value="Admin">Administrador</option>
                      <option value="Supervisor">Supervisor</option>
                      <option value="Cajero">Cajero</option>
                    </select>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-black uppercase tracking-widest text-[#0F172A]/50 mb-3">Estado</label>
                    <select name="status" defaultValue={editingUser?.status || 'Activo'} className="w-full bg-surface-container-low border-none rounded-xl py-3.5 px-5 outline-none focus:ring-2 focus:ring-secondary/20 font-bold">
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-black uppercase tracking-widest text-[#0F172A]/50 mb-3">Tienda Asignada</label>
                    <select name="storeId" defaultValue={editingUser?.storeId || ''} className="w-full bg-surface-container-low border-none rounded-xl py-3.5 px-5 outline-none focus:ring-2 focus:ring-secondary/20 font-bold">
                      <option value="">Todas las Tiendas</option>
                      {stores.map((s: any) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-[#0F172A]/50 mb-4">Módulos Permitidos</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { id: 'dashboard', label: 'Dashboard' },
                        { id: 'inventory', label: 'Inventario' },
                        { id: 'sales', label: 'POS Ventas' },
                        { id: 'history', label: 'Historial' },
                        { id: 'entries', label: 'Recepciones' },
                        { id: 'kpis', label: 'Analítica' },
                        { id: 'users', label: 'Usuarios' },
                        { id: 'fiados', label: 'Fiados' }
                      ].map(module => (
                        <label key={module.id} className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl cursor-pointer hover:bg-surface-container-high transition-colors">
                          <input 
                            type="checkbox" 
                            name="modules" 
                            value={module.id} 
                            defaultChecked={editingUser?.modules?.includes(module.id)}
                            className="w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary" 
                          />
                          <span className="text-xs font-bold text-[#0F172A]">{module.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2 mt-6">
                    <button type="submit" className="w-full bg-[#0F172A] text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all">
                      {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
