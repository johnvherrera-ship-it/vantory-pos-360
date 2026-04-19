import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Bell, 
  Settings, 
  LogOut, 
  TrendingUp, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  UploadCloud, 
  Zap, 
  Cloud, 
  ArrowRight, 
  X 
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { SideNavBar } from '../layout/SideNavBar';
import { NotificationsPanel } from '../shared/NotificationsPanel';
import { useAppContexts } from '../../hooks/useAppContexts';
import { supabaseService } from '../../services/supabaseService';

interface InventoryDashboardProps {}

export const InventoryDashboard = ({}: InventoryDashboardProps) => {
  const { ui, pos, app } = useAppContexts();
  const { setCurrentPage, setShowNotificationsPanel } = ui;
  const { currentUser, setCurrentUser, currentStore, currentPOS } = pos;
  const { clientInventory: inventory, setClientInventory: setInventory, categories, setCategories, clientUsers: users } = app;

  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [viewingProduct, setViewingProduct] = useState<any | null>(null);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todas las Categorías');
  const [filterStatus, setFilterStatus] = useState('Estado: Todos');
  const [pageNumber, setPageNumber] = useState(1);
  const ITEMS_PER_PAGE = 15;

  const handleDelete = async (id: number) => {
    try {
      await supabaseService.deleteProduct(id);
      setInventory(inventory.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product from Supabase:', error);
      alert('Error al eliminar el producto de la base de datos.');
    } finally {
      setProductToDelete(null);
    }
  };

  const toggleFavorite = (id: number) => {
    setInventory(inventory.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  const handleSave = async (product: any) => {
    const clientId = currentUser?.clientId;
    if (!clientId) {
      alert('Error: No se puede guardar el producto sin un cliente activo');
      return;
    }

    try {
      const savedProduct = await supabaseService.upsertProduct({ ...product, clientId } as any);
      if (product.id) {
        setInventory((prev: any[]) =>
          prev.map(p => (p.id === product.id || p.id === savedProduct.id ? savedProduct : p))
        );
      } else {
        setInventory((prev: any[]) => [...prev, savedProduct]);
      }
      setEditingProduct(null);
      setShowAddProduct(false);
    } catch (error) {
      console.error('Error guardando producto:', error);
      alert('Error al guardar el producto en la base de datos');
    }
  };

  const handleExport = () => {
    const headers = ['sku', 'nombre', 'categoria', 'costo', 'precio', 'stock', 'imagen_url', 'favorito'];
    const delimiter = ';';
    const csvContent = [
      headers.join(delimiter),
      ...inventory.map(p => [p.sku, p.name, p.category, p.cost, p.price, p.stock, p.image, p.isFavorite ? 'SI' : 'NO'].join(delimiter))
    ].join('\n');
    
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'plantilla_inventario.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const clientId = currentUser?.clientId;
    if (!clientId) {
      alert('Error: No se puede importar sin un cliente activo');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const newItems = jsonData.map((row: any) => {
          const cost = parseInt(row.costo || row.Costo || 0) || 0;
          const price = parseInt(row.precio || row.Precio || 0) || 0;
          return {
            clientId,
            sku: String(row.sku || row.SKU || ''),
            name: String(row.nombre || row.Nombre || 'Producto Nuevo'),
            category: String(row.categoria || row.Categoría || 'General'),
            cost,
            price,
            stock: parseInt(row.stock || row.Stock || 0) || 0,
            isFavorite: String(row.favorito || row.Favorito || '').toUpperCase() === 'SI',
            image: String(row.imagen_url || row.Imagen || 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=100&q=80'),
            margin: price && cost ? Math.round(((price - cost) / price) * 100) : 0
          };
        }).filter(item => item.sku !== '');

        if (newItems.length === 0) {
          alert('No se encontraron productos válidos en el archivo.');
          return;
        }

        const saved = await supabaseService.bulkUpsertProducts(newItems as any);
        setInventory((prev: any[]) => [...prev, ...saved]);
        setShowBulkUpload(false);
        alert(`Se han importado ${saved.length} productos exitosamente.`);
      } catch (err) {
        console.error('Bulk upload error:', err);
        alert('Error al importar productos a la base de datos');
      }
    };
    reader.readAsBinaryString(file);
  };

  const filteredInventory = inventory.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLowStock = filterLowStock ? p.stock < 10 : true;
    const matchesCategory = selectedCategory === 'Todas las Categorías' ? true : p.category === selectedCategory;
    let matchesStatus = true;
    if (filterStatus === 'En Stock') matchesStatus = p.stock > 10;
    else if (filterStatus === 'Bajo Stock') matchesStatus = p.stock > 0 && p.stock <= 10;
    else if (filterStatus === 'Agotado') matchesStatus = p.stock === 0;
    return matchesSearch && matchesLowStock && matchesCategory && matchesStatus;
  });

  React.useEffect(() => {
    setPageNumber(1);
  }, [searchTerm, filterLowStock, selectedCategory, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredInventory.length / ITEMS_PER_PAGE));
  const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedInventory = filteredInventory.slice(startIndex, endIndex);

  const totalProducts = inventory.length;
  const inventoryValue = inventory.reduce((sum, item) => sum + (item.cost * item.stock), 0);
  const lowStockCount = inventory.filter(item => item.stock < 10).length;
  const avgMargin = inventory.length > 0
    ? (inventory.reduce((sum, item) => {
        const margin = item.price > 0 ? ((item.price - item.cost) / item.price * 100) : 0;
        return sum + margin;
      }, 0) / inventory.length).toFixed(1)
    : 0;
  const totalProfit = inventory.reduce((sum, item) => {
    const profitPerUnit = item.price - item.cost;
    return sum + (profitPerUnit * item.stock);
  }, 0);

  return (
    <div className="flex min-h-screen bg-surface text-on-surface font-body">
      <SideNavBar currentPage="inventory" setCurrentPage={setCurrentPage} currentUser={currentUser} users={users} setCurrentUser={setCurrentUser} currentStore={currentStore} currentPOS={currentPOS} />
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen p-4 md:p-8 pt-20 md:pt-8 pb-20 md:pb-0">
        <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-[#0F172A] font-headline mb-1">Inventario de <span className="text-secondary">Productos</span></h2>
            <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-3">INVENTARIO &gt; PRODUCTOS</p>
            <p className="text-[#0F172A]/70 font-bold text-sm md:text-lg">Administra tu catálogo, precios y niveles de stock global.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <input
                className="pl-10 pr-4 py-2 md:py-2 bg-surface-container-low border border-secondary/20 rounded-lg text-sm w-full sm:w-64 focus:ring-2 focus:ring-secondary/20 focus:bg-surface-container-lowest focus:border-secondary transition-all"
                placeholder="Buscar en inventario..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button onClick={() => setShowNotificationsPanel(true)} className="w-12 h-12 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-[#f2f3ff] transition-colors relative flex-shrink-0">
              <Bell className="w-5 h-5 text-on-surface-variant" />
              {lowStockCount > 0 && <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-error rounded-full text-white text-[9px] font-black flex items-center justify-center border border-white">{lowStockCount > 9 ? '9+' : lowStockCount}</span>}
            </button>
            <button onClick={() => setCurrentPage('users')} className="w-12 h-12 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-[#f2f3ff] transition-colors flex-shrink-0">
              <Settings className="w-5 h-5 text-on-surface-variant" />
            </button>
            <div className="h-8 w-px bg-outline-variant/30 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-black text-[#0F172A]">{currentUser?.name || 'Admin Vantory'}</p>
                <p className="text-xs text-secondary font-bold">{currentUser?.role || 'Soporte Técnico'}</p>
              </div>
              <img
                className="w-10 h-10 rounded-full border-2 border-surface-container-highest object-cover"
                src={currentUser?.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuAPTOJksruGaNQm6gW0cTKsmHx_gthleGI0Hy70R56Q1oJ4i9lW0iL4JU8oXMoZAshoKE8S3a1-5NvKCV26POVasYgktSZtJpP6RHaMYbMEtqakjdL7rtnYFQso4Kzl5w6R3449pD-nViJIAngGkUqQijX4Zz9xtfKBk4SztlssTnGEGmOQeqPZsahAs-DUJ7tdh68w9VguZXCBAxiCk5XRvvm-GQdW31C8hvfujnZJlbpJ3SVzXGcnVimo2ARlMqv9ks88IY_RN2o_"}
                alt="User"
                referrerPolicy="no-referrer"
              />
            </div>
            <button onClick={() => { setCurrentUser(null); setCurrentPage('home'); }} className="w-12 h-12 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-error-container/20 text-error transition-colors ml-2 flex-shrink-0" title="Cerrar Sesión">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-surface-container-lowest p-4 rounded-2xl flex flex-col justify-between min-h-[120px] transition-all shadow-md border border-secondary/20 hover:shadow-lg hover:border-opacity-60">
            <div>
              <span className="text-[#0F172A] font-black text-xs uppercase tracking-widest mb-2 block">Total Productos</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold font-headline tabular-nums text-on-surface">{totalProducts.toLocaleString()}</span>
                <span className="text-tertiary-container text-xs font-bold px-2 py-0.5 rounded-full bg-tertiary-fixed-dim/20">Sincronizado</span>
              </div>
            </div>
            <p className="text-xs text-[#0F172A] font-bold mt-2 leading-tight">Cantidad total de artículos distintos registrados en tu catálogo actual.</p>
          </div>

          <div className="bg-surface-container-lowest p-4 rounded-2xl flex flex-col justify-between min-h-[120px] transition-all shadow-md border border-secondary/20 hover:shadow-lg hover:border-opacity-60">
            <div>
              <span className="text-[#0F172A] font-black text-xs uppercase tracking-widest mb-2 block">Valor Inventario</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold font-headline tabular-nums text-on-surface">
                  {inventoryValue >= 1000000 
                    ? `$${(inventoryValue / 1000000).toFixed(1)}M` 
                    : `$${inventoryValue.toLocaleString('es-CL')}`}
                </span>
                <span className="text-[#0F172A] text-xs font-black uppercase">CLP</span>
              </div>
            </div>
            <p className="text-xs text-[#0F172A] font-bold mt-2 leading-tight">Inversión total basada en el costo de compra por la cantidad de unidades en stock.</p>
          </div>

          <div className="bg-surface-container-lowest p-4 rounded-2xl flex flex-col justify-between min-h-[120px] transition-all shadow-md border border-error/20 hover:shadow-lg hover:border-opacity-60">
            <div>
              <span className="text-[#0F172A] font-black text-xs uppercase tracking-widest mb-2 block">Bajo Stock</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold font-headline tabular-nums text-on-surface">{lowStockCount}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${lowStockCount > 0 ? 'text-error bg-error-container/40' : 'text-success bg-success-container/40'}`}>
                  {lowStockCount > 0 ? 'Crítico' : 'Óptimo'}
                </span>
              </div>
            </div>
            <p className="text-xs text-[#0F172A] font-bold mt-2 leading-tight">Productos que requieren reposición inmediata (menos de 10 unidades disponibles).</p>
          </div>

          <div className="bg-surface-container-lowest p-4 rounded-2xl flex flex-col justify-between min-h-[120px] transition-all border border-secondary/10 shadow-md">
            <div>
              <span className="text-secondary font-black text-xs uppercase tracking-widest mb-2 block">Margen Promedio</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold font-headline tabular-nums text-secondary">{avgMargin}%</span>
                <TrendingUp className="text-secondary w-4 h-4" />
              </div>
            </div>
            <p className="text-xs text-[#0F172A] font-bold mt-2 leading-tight">Promedio de rentabilidad de tus productos (diferencia entre costo y precio de venta).</p>
          </div>

          <div className="bg-surface-container-lowest p-4 rounded-2xl flex flex-col justify-between min-h-[120px] transition-all border-2 border-green-400/30 shadow-md bg-green-50/30">
            <div>
              <span className="text-green-700 font-black text-xs uppercase tracking-widest mb-2 block">Ganancia Total</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold font-headline tabular-nums text-green-700">
                  {totalProfit >= 1000000
                    ? `$${(totalProfit / 1000000).toFixed(1)}M`
                    : `$${totalProfit.toLocaleString('es-CL')}`}
                </span>
              </div>
            </div>
            <p className="text-xs text-[#0F172A] font-bold mt-2 leading-tight">Ganancia potencial total si vendes todo el stock actual (precio venta - costo).</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-surface-container-low rounded-2xl p-4 mb-6 flex flex-wrap items-center gap-4 border border-secondary/10 shadow-md">
          <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm">
            <Filter className="text-outline w-5 h-5" />
            <span className="text-sm font-bold font-label">Filtros Avanzados</span>
          </div>
          <div className="h-6 w-px bg-outline-variant/30 hidden md:block"></div>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent border-none text-sm font-black focus:ring-0 text-[#0F172A] outline-none"
          >
            <option>Todas las Categorías</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-transparent border-none text-sm font-black focus:ring-0 text-[#0F172A] outline-none cursor-pointer"
          >
            <option>Estado: Todos</option>
            <option>En Stock</option>
            <option>Bajo Stock</option>
            <option>Agotado</option>
          </select>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-[#0F172A] font-black">Mostrando {filteredInventory.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredInventory.length)} de {filteredInventory.length}</span>
            <div className="flex gap-1">
              <button
                onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                disabled={pageNumber === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPageNumber(Math.min(totalPages, pageNumber + 1))}
                disabled={pageNumber === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-surface-container-lowest rounded-3xl overflow-x-auto md:overflow-hidden shadow-md border border-secondary/15">
          <table className="w-full text-left border-collapse min-w-max md:min-w-0">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-3 md:px-8 py-3 md:py-5 text-xs font-black uppercase tracking-widest text-[#0F172A] font-label">Producto</th>
                <th className="px-3 md:px-8 py-3 md:py-5 text-xs font-black uppercase tracking-widest text-[#0F172A] font-label hidden sm:table-cell">Código</th>
                <th className="px-3 md:px-8 py-3 md:py-5 text-xs font-black uppercase tracking-widest text-[#0F172A] font-label text-center">Stock</th>
                <th className="px-3 md:px-8 py-3 md:py-5 text-xs font-black uppercase tracking-widest text-[#0F172A] font-label hidden md:table-cell">Costo</th>
                <th className="px-3 md:px-8 py-3 md:py-5 text-xs font-black uppercase tracking-widest text-[#0F172A] font-label hidden lg:table-cell">Precio Venta</th>
                <th className="px-3 md:px-8 py-3 md:py-5 text-xs font-black uppercase tracking-widest text-[#0F172A] font-label hidden lg:table-cell">Margen</th>
                <th className="px-3 md:px-8 py-3 md:py-5 text-xs font-black uppercase tracking-widest text-[#0F172A] font-label hidden lg:table-cell">Ganancia</th>
                <th className="px-3 md:px-8 py-3 md:py-5 text-xs font-black uppercase tracking-widest text-[#0F172A] font-label text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {paginatedInventory.map((product) => (
                <tr key={product.id} className="hover:bg-secondary/5 transition-all group text-xs md:text-sm">
                  <td className="px-3 md:px-8 py-3 md:py-6">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => toggleFavorite(product.id)}
                        className={`p-1 rounded-full transition-colors ${product.isFavorite ? 'text-yellow-500 bg-yellow-50' : 'text-outline-variant hover:text-yellow-500'}`}
                      >
                        <Star className={`w-4 h-4 ${product.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                      <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center overflow-hidden">
                        <img className="w-full h-full object-cover" alt={product.name} src={product.image} referrerPolicy="no-referrer"/>
                      </div>
                      <div>
                        <p className="font-bold text-on-surface text-base">{product.name}</p>
                        <p className="text-xs text-[#0F172A] font-black">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#0F172A]">{product.sku}</span>
                      <div className="flex gap-0.5 mt-1">
                        {[1,2,3,4,5,6].map(i => <div key={i} className="w-[2px] h-3 bg-[#0F172A]/40"></div>)}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black ${product.stock > 10 ? 'bg-tertiary-fixed-dim/20 text-on-tertiary-container' : product.stock > 0 ? 'bg-error-container text-on-error-container' : 'bg-surface-dim text-[#0F172A]'}`}>
                      {product.stock} Unidades
                    </div>
                  </td>
                  <td className="px-8 py-6 font-medium font-body text-on-surface tabular-nums">${product.cost.toLocaleString('es-CL')}</td>
                  <td className="px-8 py-6 font-bold font-body text-on-surface tabular-nums">${product.price.toLocaleString('es-CL')}</td>
                  <td className="px-8 py-6">
                    {(() => {
                      const margin = product.price > 0 ? Math.round(((product.price - product.cost) / product.price) * 100) : 0;
                      return (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden w-20">
                            <div className="bg-secondary h-full" style={{width: `${margin}%`}}></div>
                          </div>
                          <span className="text-sm font-bold text-secondary">{margin}%</span>
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-8 py-6 font-bold text-green-700">
                    {(() => {
                      const profitPerUnit = product.price - product.cost;
                      const totalProfit = profitPerUnit * product.stock;
                      return `$${totalProfit.toLocaleString('es-CL')}`;
                    })()}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => setViewingProduct(product)}
                      title="Ver detalles"
                      className="p-2 text-outline hover:text-secondary transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setEditingProduct(product)}
                      title="Editar producto"
                      className="p-2 text-outline hover:text-secondary transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setProductToDelete(product.id)}
                      title="Eliminar producto"
                      className="p-2 text-outline hover:text-error transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-8 py-6 bg-surface-container-low/30 border-t border-secondary/10 flex justify-between items-center">
            <p className="text-sm text-on-surface-variant font-medium">Página {pageNumber} de {totalPages}</p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                disabled={pageNumber === 1}
                className="px-4 py-2 text-sm font-bold rounded-xl bg-surface-container-lowest shadow-sm hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <div className="flex px-2 gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setPageNumber(page)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        pageNumber === page
                          ? 'bg-secondary text-white'
                          : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPageNumber(Math.min(totalPages, pageNumber + 1))}
                disabled={pageNumber === totalPages}
                className="px-4 py-2 text-sm font-bold rounded-xl bg-surface-container-lowest shadow-sm hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>

        {/* Quick Access Widgets */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div 
            onClick={() => setFilterLowStock(!filterLowStock)}
            className={`p-8 rounded-3xl border-2 transition-all flex items-center justify-between cursor-pointer hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] ${filterLowStock ? 'bg-secondary/10 border-secondary' : 'bg-white border-secondary/20 hover:border-secondary/40'}`}
          >
            <div>
              <h3 className="text-xl font-black font-headline mb-2 text-[#0F172A]">Asistente de <span className="text-secondary">Reposición</span></h3>
              <p className="text-[#0F172A] font-medium text-sm max-w-sm mb-4">
                {filterLowStock 
                  ? 'Mostrando solo productos con stock bajo (< 10 unidades).' 
                  : 'Se han identificado productos que requieren atención inmediata basada en la velocidad de venta.'}
              </p>
              <button 
                className="text-secondary font-bold text-sm flex items-center gap-1 hover:underline"
              >
                {filterLowStock ? 'Ver todo el inventario' : 'Ver sugerencias'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${filterLowStock ? 'bg-secondary text-white' : 'bg-secondary-container text-white'}`}>
              <Zap className="w-10 h-10 fill-current" />
            </div>
          </div>
          <div 
            onClick={() => setShowBulkUpload(true)}
            className="bg-white p-8 rounded-3xl border-2 border-outline-variant/20 flex items-center justify-between cursor-pointer hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] hover:border-secondary/40 transition-all"
          >
            <div>
              <h3 className="text-xl font-black font-headline mb-2 text-[#0F172A]">Importación <span className="text-secondary">Masiva</span></h3>
              <p className="text-[#0F172A] font-medium text-sm max-w-sm mb-4">Actualiza los precios o el stock de múltiples productos a la vez mediante un archivo Excel o CSV.</p>
              <button 
                className="text-secondary font-bold text-sm flex items-center gap-1 hover:underline"
              >
                Subir archivo <UploadCloud className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-surface-container-highest w-24 h-24 rounded-full flex items-center justify-center text-secondary">
              <Cloud className="w-10 h-10" />
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowAddProduct(true)}
        className="fixed bottom-24 md:bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-secondary to-blue-800 text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-105 active:scale-95 transition-all"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Modals */}
      <AnimatePresence>
        {productToDelete && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProductToDelete(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-surface w-full max-w-md rounded-3xl shadow-2xl p-8 text-center"
            >
              <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center text-error mx-auto mb-6">
                <Trash2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black font-headline mb-2">¿Eliminar Producto?</h3>
              <p className="text-on-surface-variant mb-8">Esta acción no se puede deshacer. El producto será removido permanentemente del inventario.</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setProductToDelete(null)}
                  className="flex-1 py-3 bg-surface-container-high rounded-xl font-bold hover:bg-surface-container-highest transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => handleDelete(productToDelete)}
                  className="flex-1 py-3 bg-error text-white rounded-xl font-bold shadow-lg shadow-error/20 hover:opacity-90 transition-all"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {(editingProduct || showAddProduct) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setEditingProduct(null); setShowAddProduct(false); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-surface w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black font-headline">
                    {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                  </h3>
                  <button onClick={() => { setEditingProduct(null); setShowAddProduct(false); }} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const data = Object.fromEntries(formData.entries());
                  handleSave({
                    ...(editingProduct || {}),
                    name: data.name,
                    sku: data.sku,
                    category: data.category,
                    stock: parseInt(data.stock as string),
                    cost: parseInt(data.cost as string),
                    price: parseInt(data.price as string),
                    margin: Math.round(((parseInt(data.price as string) - parseInt(data.cost as string)) / parseInt(data.price as string)) * 100),
                    image: data.image || 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=100&q=80'
                  });
                }} className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Nombre del Producto</label>
                    <input name="name" defaultValue={editingProduct?.name} required className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-secondary/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">SKU</label>
                    <input name="sku" defaultValue={editingProduct?.sku} required className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-secondary/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Categoría</label>
                    <select 
                      name="category" 
                      defaultValue={editingProduct?.category} 
                      required 
                      className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-secondary/20"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Costo (CLP)</label>
                    <input name="cost" type="number" defaultValue={editingProduct?.cost} required className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-secondary/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Precio Venta (CLP)</label>
                    <input name="price" type="number" defaultValue={editingProduct?.price} required className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-secondary/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Stock Inicial</label>
                    <input name="stock" type="number" defaultValue={editingProduct?.stock} required className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-secondary/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">URL Imagen</label>
                    <input name="image" defaultValue={editingProduct?.image} className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-secondary/20" />
                  </div>
                  <div className="col-span-2 mt-4">
                    <button type="submit" className="w-full bg-secondary text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                      {editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {viewingProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingProduct(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-surface w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-8"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black font-headline text-[#0F172A]">Detalle de Producto</h3>
                  <p className="text-secondary font-bold text-sm">SKU: {viewingProduct.sku}</p>
                </div>
                <button onClick={() => setViewingProduct(null)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="w-full h-48 bg-surface-container-low rounded-2xl overflow-hidden">
                   <img src={viewingProduct.image} alt={viewingProduct.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase">Categoría</p>
                    <p className="font-bold text-sm">{viewingProduct.category}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase">Stock Actual</p>
                    <p className="font-bold text-sm">{viewingProduct.stock} unidades</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase">Costo</p>
                    <p className="font-bold text-sm">${viewingProduct.cost.toLocaleString('es-CL')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase">Precio Venta</p>
                    <p className="font-bold text-sm">${viewingProduct.price.toLocaleString('es-CL')}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showBulkUpload && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBulkUpload(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-surface w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black font-headline">Carga <span className="text-secondary">Masiva</span></h3>
                  <button onClick={() => setShowBulkUpload(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="bg-secondary/5 border-2 border-dashed border-secondary/20 rounded-3xl p-10 flex flex-col items-center text-center mb-6">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center text-secondary mb-4">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">Arrastra tu archivo aquí</h4>
                  <p className="text-sm text-on-surface-variant mb-6">Soporta formatos .xlsx, .xls y .csv</p>
                  <input 
                    type="file" 
                    id="bulk-file" 
                    className="hidden" 
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                  />
                  <label 
                    htmlFor="bulk-file"
                    className="bg-secondary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-secondary/20 cursor-pointer hover:opacity-90 transition-all"
                  >
                    Seleccionar Archivo
                  </label>
                </div>

                <div className="bg-surface-container-low p-4 rounded-2xl mb-8">
                  <h5 className="text-xs font-black uppercase tracking-widest mb-3 text-secondary">Estructura Requerida (Encabezados)</h5>
                  <div className="flex flex-wrap gap-2">
                    {['sku', 'nombre', 'categoria', 'costo', 'precio', 'stock', 'imagen_url'].map(h => (
                      <span key={h} className="bg-white px-3 py-1 rounded-lg text-[10px] font-bold border border-outline-variant/20">{h}</span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={handleExport} className="flex-1 text-secondary font-bold text-sm hover:underline">Descargar Plantilla</button>
                  <button onClick={() => setShowBulkUpload(false)} className="px-8 py-3 bg-surface-container-high rounded-xl font-bold">Cancelar</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <NotificationsPanel />
    </div>
  );
};
