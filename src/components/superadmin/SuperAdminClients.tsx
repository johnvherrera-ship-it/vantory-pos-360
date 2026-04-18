import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  LogOut, 
  Plus, 
  Globe, 
  Monitor, 
  Eye, 
  LogIn, 
  Edit, 
  MinusCircle, 
  CheckCircle, 
  Trash2,
  X 
} from 'lucide-react';
import { Logo } from '../layout/Logo';
import { supabaseService } from '../../services/supabaseService';

interface SuperAdminClientsProps {
  setCurrentPage: (page: any) => void;
  vantoryClients: any[];
  setVantoryClients: (clients: any[]) => void;
  setCurrentUser: (user: any) => void;
  setSelectedClient: (client: any) => void;
}

const SuperAdminClients = ({
  setCurrentPage,
  vantoryClients,
  setVantoryClients,
  setCurrentUser,
  setSelectedClient
}: SuperAdminClientsProps) => {
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ show: boolean; clientId: number | null }>({ show: false, clientId: null });
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const handleSaveClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const newClient = {
      id: editingClient ? editingClient.id : Date.now(),
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      maxStores: parseInt((form.elements.namedItem('maxStores') as HTMLInputElement).value),
      maxPosPerStore: parseInt((form.elements.namedItem('maxPosPerStore') as HTMLInputElement).value),
      mrr: parseInt((form.elements.namedItem('mrr') as HTMLInputElement).value),
      status: editingClient ? editingClient.status : 'Activo',
      joinDate: editingClient ? editingClient.joinDate : new Date().toISOString().split('T')[0],
    };

    try {
      if (editingClient) {
        await supabaseService.upsertClient(newClient);
        setVantoryClients(vantoryClients.map((c: any) => c.id === editingClient.id ? newClient : c));
      } else {
        const { id: _, ...supabaseData } = newClient;
        const savedClient = await supabaseService.upsertClient(supabaseData);
        if (savedClient) {
          const updated = vantoryClients.map((c: any) => c.email === savedClient.email ? { ...c, id: savedClient.id } : c);
          setVantoryClients(updated);

          await supabaseService.createUser({
            clientId: savedClient.id,
            name: `Admin ${savedClient.name}`,
            email: adminEmail || savedClient.email,
            password: adminPassword || undefined,
            role: 'Administrador',
            modules: ['dashboard', 'inventory', 'sales', 'history', 'entries', 'kpis', 'users', 'fiados'],
            status: 'active',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfLVv6ohrtIE1tV50hhfzyQoC_-ADrxKzmlZGDV-3q0wsLG0oX1rxHZAoGZubgfK_a8kAW7lNR4uR2hH9puFiqXk8uIk4cma4AtWee_CyfKF6Xp6ht64UImKASzqOvK5H9W5VV4O0aN6kidyheXojT3g5eweScDgb6ozL_VXSkV-76BPplDQ5Tv0RM7pj3-HTx49aYz2-_7Ugx32bVbSsdFpsgKrwX2L-igWxXkTVYVROb1d68R9o1_2kMqMveMbfIrDNeV36iemdh'
          });
        }
      }
      setShowModal(false);
      setEditingClient(null);
      setAdminEmail('');
      setAdminPassword('');
    } catch (error) {
      console.error('Error syncing client with Supabase:', error);
      alert('Error al guardar cliente: ' + (error instanceof Error ? error.message : 'Desconocido'));
    }
  };

  const handleDeleteClient = async (clientId: number) => {
    try {
      await supabaseService.deleteClient(clientId);
      setVantoryClients(vantoryClients.filter((c: any) => c.id !== clientId));
      setConfirmDialog({ show: false, clientId: null });
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Error al eliminar cliente: ' + (error instanceof Error ? error.message : 'Desconocido'));
    }
  };

  const toggleStatus = async (id: number) => {
    const updatedClients = vantoryClients.map((c: any) => {
      if (c.id === id) {
        const newStatus = c.status === 'Activo' ? 'Suspendido' : 'Activo';
        const updated = { ...c, status: newStatus };
        // Sync with Supabase
        supabaseService.upsertClient(updated).catch(err => console.error('Error toggling status in Supabase:', err));
        return updated;
      }
      return c;
    });
    setVantoryClients(updatedClients);
  };

  const impersonateClient = (client: any) => {
    // Mock impersonation: set current user to the client's admin email and go to dashboard
    setCurrentUser({ 
      name: client.name, 
      email: client.email, 
      role: 'Administrador', 
      modules: ['dashboard', 'inventory', 'sales', 'history', 'entries', 'kpis', 'users', 'fiados'], 
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfLVv6ohrtIE1tV50hhfzyQoC_-ADrxKzmlZGDV-3q0wsLG0oX1rxHZAoGZubgfK_a8kAW7lNR4uR2hH9puFiqXk8uIk4cma4AtWee_CyfKF6Xp6ht64UImKASzqOvK5H9W5VV4O0aN6kidyheXojT3g5eweScDgb6ozL_VXSkV-76BPplDQ5Tv0RM7pj3-HTx49aYz2-_7Ugx32bVbSsdFpsgKrwX2L-igWxXkTVYVROb1d68R9o1_2kMqMveMbfIrDNeV36iemdh' 
    });
    setCurrentPage('dashboard'); // Bypass lobby for impersonation simplicity
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
            <h2 className="text-3xl font-black text-[#0F172A] font-headline mb-1">Gestión de <span className="text-secondary">Clientes</span></h2>
            <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-3">PANEL MAESTRO &gt; CLIENTES SAAS</p>
          </div>
          <button onClick={() => { setEditingClient(null); setAdminEmail(''); setAdminPassword(''); setShowModal(true); }} className="bg-secondary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-secondary/90 transition-colors shadow-lg">
            <Plus className="w-5 h-5" />
            Nuevo Cliente
          </button>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-outline-variant/20">
                  <th className="p-4 font-bold text-on-surface-variant text-sm">Empresa</th>
                  <th className="p-4 font-bold text-on-surface-variant text-sm">Límites (Locales/Cajas)</th>
                  <th className="p-4 font-bold text-on-surface-variant text-sm">MRR</th>
                  <th className="p-4 font-bold text-on-surface-variant text-sm">Estado</th>
                  <th className="p-4 font-bold text-on-surface-variant text-sm text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {vantoryClients.map((client: any) => (
                  <tr key={client.id} className={`border-b border-outline-variant/10 hover:bg-surface-container-lowest/50 transition-colors ${client.status === 'Suspendido' ? 'opacity-60' : ''}`}>
                    <td className="p-4">
                      <p className="font-bold text-on-surface">{client.name}</p>
                      <p className="text-xs text-on-surface-variant">{client.email}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3 text-sm font-medium">
                        <span className="flex items-center gap-1"><Globe className="w-4 h-4 text-on-surface-variant" /> {client.maxStores}</span>
                        <span className="flex items-center gap-1"><Monitor className="w-4 h-4 text-on-surface-variant" /> {client.maxPosPerStore}</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-on-surface">
                      ${client.mrr.toLocaleString('es-CL')}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${client.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setSelectedClient(client); setCurrentPage('superadmin-client-profile'); }} title="Ver Perfil Completo" className="p-2 text-on-surface-variant hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button onClick={() => impersonateClient(client)} title="Ingresar como Cliente" className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                          <LogIn className="w-5 h-5" />
                        </button>
                        <button onClick={() => { setEditingClient(client); setShowModal(true); }} title="Editar Licencia" className="p-2 text-on-surface-variant hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => toggleStatus(client.id)} title={client.status === 'Activo' ? 'Suspender' : 'Activar'} className={`p-2 rounded-lg transition-colors ${client.status === 'Activo' ? 'text-error hover:bg-error/10' : 'text-green-600 hover:bg-green-100'}`}>
                          {client.status === 'Activo' ? <MinusCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                        </button>
                        <button onClick={() => setConfirmDialog({ show: true, clientId: client.id })} title="Eliminar Cliente" className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Client Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20"
            >
              <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-lowest">
                <h3 className="text-2xl font-black font-headline">
                  {editingClient ? 'Editar Cliente SaaS' : 'Nuevo Cliente SaaS'}
                </h3>
                <button onClick={() => { setShowModal(false); setEditingClient(null); setAdminEmail(''); setAdminPassword(''); }} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSaveClient} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-on-surface-variant mb-1">Nombre de la Empresa</label>
                    <input name="name" defaultValue={editingClient?.name} required className="w-full p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary outline-none font-medium" placeholder="Ej. Minimarket Don Tito" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-on-surface-variant mb-1">Correo Administrador</label>
                    <input type="email" name="email" defaultValue={editingClient?.email} required className="w-full p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary outline-none font-medium" placeholder="admin@empresa.cl" />
                  </div>
                  {!editingClient && (
                    <>
                      <div className="col-span-2">
                        <label className="block text-sm font-bold text-on-surface-variant mb-1">Email del Admin (Opcional)</label>
                        <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="w-full p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary outline-none font-medium" placeholder="Si no especificas, usará el email del cliente" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-bold text-on-surface-variant mb-1">Contraseña del Admin (Opcional)</label>
                        <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary outline-none font-medium" placeholder="Si no especificas, usará: temp123" />
                      </div>
                    </>
                  )}
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-on-surface-variant mb-1">MRR (Mensualidad $)</label>
                    <input type="number" name="mrr" defaultValue={editingClient?.mrr || 29990} required className="w-full p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary outline-none font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-on-surface-variant mb-1">Locales Máximos</label>
                    <input type="number" name="maxStores" defaultValue={editingClient?.maxStores || 1} required min="1" className="w-full p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary outline-none font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-on-surface-variant mb-1">Cajas por Local</label>
                    <input type="number" name="maxPosPerStore" defaultValue={editingClient?.maxPosPerStore || 1} required min="1" className="w-full p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-secondary outline-none font-medium" />
                  </div>
                </div>

                <div className="pt-6 flex gap-3">
                  <button type="button" onClick={() => { setShowModal(false); setEditingClient(null); setAdminEmail(''); setAdminPassword(''); }} className="flex-1 py-3 px-4 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl font-bold transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" className="flex-1 py-3 px-4 bg-secondary hover:bg-secondary/90 text-white rounded-xl font-bold transition-colors shadow-md">
                    Guardar Cliente
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {confirmDialog.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20"
            >
              <div className="p-6 text-center">
                <h3 className="text-xl font-black font-headline text-on-surface mb-2">Eliminar Cliente</h3>
                <p className="text-on-surface-variant mb-6">¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmDialog({ show: false, clientId: null })}
                    className="flex-1 py-3 px-4 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl font-bold transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => confirmDialog.clientId && handleDeleteClient(confirmDialog.clientId)}
                    className="flex-1 py-3 px-4 bg-error hover:bg-error/90 text-white rounded-xl font-bold transition-colors shadow-md"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SuperAdminClients;
