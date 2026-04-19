import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Scan, 
  Barcode, 
  PlusCircle, 
  ShoppingCart, 
  Trash2, 
  CheckCircle, 
  History, 
  X 
} from 'lucide-react';
import { SideNavBar } from '../layout/SideNavBar';
import { useAppContexts } from '../../hooks/useAppContexts';
import { supabaseService } from '../../services/supabaseService';

interface StockEntriesProps {}

export const StockEntries = ({}: StockEntriesProps) => {
  const { ui, pos, app } = useAppContexts();
  const { setCurrentPage, setViewingSale } = ui;
  const { currentUser, setCurrentUser, currentStore, currentPOS } = pos;
  const { clientInventory: inventory, setClientInventory: setInventory, clientStockEntries: stockEntries, setClientStockEntries: setStockEntries, clientUsers: users } = app;
  const [barcode, setBarcode] = useState('');
  const [manualProduct, setManualProduct] = useState('');
  const [manualQuantity, setManualQuantity] = useState('');
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    sku: '',
    category: 'General',
    cost: '',
    price: '',
    image: 'https://picsum.photos/seed/product/200/200',
    stock: ''
  });

  const [receivingCart, setReceivingCart] = useState<any[]>([]);
  const [isScanned, setIsScanned] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const entriesToday = stockEntries.filter(entry => entry.date?.split('T')[0] === todayStr).length;

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = inventory.find(p => p.sku === barcode);
    if (product) {
      const existing = receivingCart.find(item => item.id === product.id);
      if (existing) {
        setReceivingCart(receivingCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
        setReceivingCart([...receivingCart, { ...product, quantity: 1, newCost: product.cost }]);
      }
      setBarcode('');
      setIsScanned(true);
      setTimeout(() => setIsScanned(false), 500);
      const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
      audio.play().catch(() => {});
    } else {
      setNewProductForm({ ...newProductForm, sku: barcode });
      setShowNewProductModal(true);
    }
  };

  const handleUpdateCartItem = (id: number, field: string, value: number) => {
    setReceivingCart(receivingCart.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleRemoveCartItem = (id: number) => {
    setReceivingCart(receivingCart.filter(item => item.id !== id));
  };

  const handleConfirmReception = async () => {
    if (receivingCart.length === 0) return;
    const clientId = currentUser?.clientId;
    if (!clientId) {
      alert('Error: cliente no activo');
      return;
    }

    const nowDate = new Date().toISOString();
    const newEntries = receivingCart.map(item => ({
      folio: `ENT-${Math.floor(Math.random() * 9000) + 1000}`,
      productName: item.name,
      productId: item.id,
      quantity: item.quantity,
      cost: item.newCost,
      date: nowDate,
      user: currentUser?.name || 'Admin User',
      image: item.image,
      clientId,
      storeId: currentStore?.id ?? 0
    }));

    const productsToUpdate = receivingCart.map(item => {
      const current = inventory.find(p => p.id === item.id);
      return {
        id: item.id,
        clientId,
        storeId: currentStore?.id ?? 0,
        name: current?.name ?? item.name,
        sku: current?.sku ?? item.sku,
        category: current?.category ?? item.category,
        price: current?.price ?? item.price,
        cost: item.newCost,
        stock: (current?.stock ?? 0) + item.quantity,
        image: current?.image ?? item.image
      };
    });

    try {
      const [savedEntries, savedProducts] = await Promise.all([
        supabaseService.bulkCreateStockEntries(newEntries),
        supabaseService.bulkUpsertProducts(productsToUpdate)
      ]);

      const finalEntries = (savedEntries && savedEntries.length ? savedEntries : newEntries.map((e, i) => ({ ...e, id: Date.now() + i }))) as any[];
      setStockEntries([...finalEntries, ...stockEntries]);

      const savedById = new Map(savedProducts.map((p: any) => [p.id, p]));
      const updatedInventory = inventory.map(invItem => {
        const saved = savedById.get(invItem.id);
        return saved ? saved : invItem;
      });
      setInventory(updatedInventory);
      setReceivingCart([]);
    } catch (err) {
      console.error('Error guardando recepción:', err);
      alert('Error al guardar la recepción en la base de datos');
    }
  };

  const handleNewProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clientId = currentUser?.clientId;
    if (!clientId) {
      alert('Error: cliente no activo');
      return;
    }
    const costNum = parseInt(newProductForm.cost) || 0;
    const priceNum = parseInt(newProductForm.price) || 0;
    const stockNum = parseInt(newProductForm.stock) || 0;

    try {
      const savedProduct = await supabaseService.upsertProduct({
        clientId,
        storeId: currentStore?.id ?? 0,
        name: newProductForm.name,
        sku: newProductForm.sku,
        category: newProductForm.category,
        cost: costNum,
        price: priceNum,
        stock: stockNum,
        image: newProductForm.image
      } as any);

      setInventory([...inventory, savedProduct]);

      const entry = {
        folio: `ENT-${Math.floor(Math.random() * 9000) + 1000}`,
        productName: savedProduct.name,
        productId: savedProduct.id,
        quantity: stockNum,
        cost: costNum,
        date: new Date().toISOString(),
        user: currentUser?.name || 'Admin User',
        image: savedProduct.image,
        clientId,
        storeId: currentStore?.id ?? 0
      };
      try {
        const saved = await supabaseService.createStockEntry(entry);
        setStockEntries([saved || { ...entry, id: Date.now() + 1 }, ...stockEntries]);
      } catch {
        setStockEntries([{ ...entry, id: Date.now() + 1 }, ...stockEntries]);
      }

      setShowNewProductModal(false);
      setNewProductForm({
        name: '',
        sku: '',
        category: 'General',
        cost: '',
        price: '',
        image: 'https://picsum.photos/seed/product/200/200',
        stock: ''
      });
      setBarcode('');
    } catch (err) {
      console.error('Error creando producto:', err);
      alert('Error al crear el producto en la base de datos');
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clientId = currentUser?.clientId;
    const product = inventory.find(p => p.id === parseInt(manualProduct));
    if (!clientId || !product || !manualQuantity) return;

    const quantity = parseInt(manualQuantity);
    const entry = {
      folio: `ENT-${Math.floor(Math.random() * 9000) + 1000}`,
      productName: product.name,
      productId: product.id,
      quantity,
      date: new Date(manualDate).toISOString(),
      user: currentUser?.name || 'Admin User',
      image: product.image,
      clientId,
      storeId: currentStore?.id ?? 0
    };

    try {
      const [savedEntry, savedProduct] = await Promise.all([
        supabaseService.createStockEntry(entry),
        supabaseService.upsertProduct({
          id: product.id,
          clientId,
          storeId: currentStore?.id ?? 0,
          name: product.name,
          sku: product.sku,
          category: product.category,
          price: product.price,
          cost: product.cost,
          stock: product.stock + quantity,
          image: product.image
        } as any)
      ]);
      setStockEntries([savedEntry || { ...entry, id: Date.now() }, ...stockEntries]);
      setInventory(inventory.map(p => (p.id === product.id ? savedProduct : p)));
      setManualProduct('');
      setManualQuantity('');
    } catch (err) {
      console.error('Error registrando entrada manual:', err);
      alert('Error al registrar la entrada en la base de datos');
    }
  };

  const totalReceptionCost = receivingCart.reduce((sum, item) => sum + (item.newCost * item.quantity), 0);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-body">
      <SideNavBar currentPage="entries" setCurrentPage={setCurrentPage} currentUser={currentUser} users={users} setCurrentUser={setCurrentUser} currentStore={currentStore} currentPOS={currentPOS} />
      
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-2xl font-black text-slate-900 font-headline flex items-center gap-2">
              <Package className="w-6 h-6 text-secondary" />
              Ingreso de <span className="text-secondary">Mercadería</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">LOGÍSTICA &gt; RECEPCIÓN</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-secondary/10 px-4 py-2 rounded-xl border border-secondary/20">
              <p className="text-[10px] font-bold text-secondary uppercase leading-none mb-1">Entradas Hoy</p>
              <p className="text-lg font-black text-secondary leading-none">{entriesToday}</p>
            </div>
          </div>
        </header>

        <div className="flex-1 min-h-0 overflow-hidden flex flex-col lg:flex-row p-6 gap-6">
          {/* Left Side: Scanning and Cart */}
          <div className="flex-1 min-h-0 flex flex-col gap-4 overflow-hidden">
            {/* Scanner Area */}
            <div className={`rounded-3xl p-4 shadow-2xl border-2 transition-all duration-300 shrink-0 overflow-hidden relative ${isScanned ? 'bg-green-900/20 border-green-500 shadow-green-500/20' : 'bg-[#131b2e] border-secondary/30 shadow-secondary/10'}`}>
              <div className="absolute inset-0 animate-bright-shine pointer-events-none"></div>
              <h2 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Scan className="w-4 h-4 text-secondary" /> Escanear Productos
              </h2>
              <form onSubmit={handleBarcodeSubmit} className="relative">
                <input 
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="Escanea el código de barras o ingresa SKU..."
                  autoFocus
                  className={`w-full pl-14 pr-4 py-5 bg-white/5 border-2 rounded-2xl text-xl font-bold text-white focus:ring-4 outline-none transition-all placeholder:text-white/20 ${isScanned ? 'border-green-500 ring-green-500/20' : 'border-white/10 focus:border-secondary focus:ring-secondary/10'}`}
                />
                <Barcode className={`absolute left-5 top-1/2 -translate-y-1/2 w-7 h-7 transition-colors ${isScanned ? 'text-green-500' : 'text-white/30'}`} />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-secondary text-white px-6 py-3 rounded-xl font-black hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20">
                  Agregar
                </button>
              </form>
              <div className="mt-6 flex items-center justify-between">
                <button 
                  onClick={() => setShowNewProductModal(true)}
                  className="text-xs font-bold text-secondary hover:text-secondary/80 flex items-center gap-2 transition-colors"
                >
                  <PlusCircle className="w-4 h-4" /> Crear producto inexistente
                </button>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isScanned ? 'bg-green-500 animate-ping' : 'bg-secondary'}`}></div>
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Sistema Listo</span>
                </div>
              </div>
            </div>

            {/* Receiving Cart */}
            <div className="flex-1 min-h-0 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" /> Productos en Recepción
                </h2>
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                  {receivingCart.length} Items
                </span>
              </div>

              <div className="flex-1 min-h-0 overflow-hidden p-4">
                {receivingCart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                      <Package className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-bold">No hay productos escaneados</p>
                  </div>
                ) : (
                  <div className="space-y-2 h-full overflow-y-auto">
                    {receivingCart.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100 group hover:border-secondary/30 transition-all">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-white shadow-sm" referrerPolicy="no-referrer" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 text-xs truncate">{item.name}</h3>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">{item.sku}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <span className="text-[8px] font-bold text-slate-400 uppercase">$:</span>
                              <div className="relative">
                                <input
                                  type="number"
                                  value={item.newCost}
                                  onChange={(e) => handleUpdateCartItem(item.id, 'newCost', parseInt(e.target.value))}
                                  className="w-14 px-1 py-0.5 bg-white border border-slate-200 rounded text-xs font-bold focus:border-secondary outline-none"
                                />
                              </div>
                            </div>
                            <div className="flex items-center bg-white border border-slate-200 rounded overflow-hidden">
                              <button
                                onClick={() => handleUpdateCartItem(item.id, 'quantity', Math.max(1, item.quantity - 1))}
                                className="px-1 py-0.5 hover:bg-slate-100 text-slate-400 text-xs"
                              >-</button>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleUpdateCartItem(item.id, 'quantity', parseInt(e.target.value))}
                                className="w-8 text-center text-xs font-bold outline-none"
                              />
                              <button
                                onClick={() => handleUpdateCartItem(item.id, 'quantity', item.quantity + 1)}
                                className="px-1 py-0.5 hover:bg-slate-100 text-slate-400 text-xs"
                              >+</button>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-400 mb-1">Subtotal</p>
                          <p className="text-lg font-black text-slate-900">${(item.newCost * item.quantity).toLocaleString()}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[9px] font-bold text-slate-400 leading-none">${(item.newCost * item.quantity).toLocaleString()}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveCartItem(item.id)}
                          className="p-1 text-slate-300 hover:text-error transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-200 shrink-0">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Costo Total de Recepción</p>
                    <p className="text-3xl font-black text-slate-900">${totalReceptionCost.toLocaleString()}</p>
                  </div>
                  <button 
                    onClick={handleConfirmReception}
                    disabled={receivingCart.length === 0}
                    className="px-8 py-4 bg-secondary text-white font-black rounded-2xl shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                  >
                    <CheckCircle className="w-6 h-6" />
                    Confirmar Recepción
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: History and Manual Entry */}
          <div className="w-full lg:w-96 min-h-0 flex flex-col gap-6 overflow-hidden">
            {/* Manual Entry Form */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <PlusCircle className="w-4 h-4" /> Ingreso Manual
              </h2>
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Producto</label>
                  <select 
                    value={manualProduct}
                    onChange={(e) => setManualProduct(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-secondary"
                  >
                    <option value="">Seleccionar producto...</option>
                    {inventory.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cantidad</label>
                    <input 
                      type="number"
                      value={manualQuantity}
                      onChange={(e) => setManualQuantity(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Fecha</label>
                    <input 
                      type="date"
                      value={manualDate}
                      onChange={(e) => setManualDate(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-secondary"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all">
                  Registrar Entrada
                </button>
              </form>
            </div>

            {/* Recent Entries */}
            <div className="flex-1 min-h-0 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-100 shrink-0">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <History className="w-4 h-4" /> Últimos Ingresos
                </h2>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
                {stockEntries.slice(0, 10).map((entry) => (
                  <div key={entry.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <img src={entry.image} alt="" className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-slate-900 truncate">{entry.productName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-secondary">+{entry.quantity} un.</span>
                        <span className="text-[10px] font-medium text-slate-400">{entry.date}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Folio</p>
                      <p className="text-xs font-black text-slate-900 leading-none">{entry.folio}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowHistoryModal(true)} className="p-4 text-xs font-bold text-secondary hover:bg-secondary/5 transition-colors border-t border-slate-100">
                Ver historial completo
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* New Product Modal */}
      <AnimatePresence>
        {showNewProductModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-slate-900 font-headline">Nuevo <span className="text-secondary">Producto</span></h3>
                <button onClick={() => setShowNewProductModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleNewProductSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre del Producto</label>
                    <input 
                      type="text" 
                      required
                      value={newProductForm.name}
                      onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">SKU / Barcode</label>
                    <input 
                      type="text" 
                      required
                      value={newProductForm.sku}
                      onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Categoría</label>
                    <select 
                      value={newProductForm.category}
                      onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-secondary"
                    >
                      <option value="General">General</option>
                      <option value="Bebidas">Bebidas</option>
                      <option value="Snacks">Snacks</option>
                      <option value="Lácteos">Lácteos</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Costo de Compra</label>
                    <input 
                      type="number" 
                      required
                      value={newProductForm.cost}
                      onChange={(e) => setNewProductForm({ ...newProductForm, cost: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Precio de Venta</label>
                    <input 
                      type="number" 
                      required
                      value={newProductForm.price}
                      onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-secondary"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Stock Inicial</label>
                    <input 
                      type="number" 
                      value={newProductForm.stock}
                      onChange={(e) => setNewProductForm({ ...newProductForm, stock: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-secondary"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-4 bg-secondary text-white font-black rounded-xl shadow-lg shadow-secondary/20 hover:scale-[1.02] transition-transform mt-4">
                  Crear y Agregar a Recepción
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {showHistoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
            onClick={() => setShowHistoryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 shrink-0 flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-secondary" /> Historial Completo de Ingresos
                </h2>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-2">
                {stockEntries.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    <p className="text-sm">No hay ingresos registrados</p>
                  </div>
                ) : (
                  stockEntries.map((entry) => (
                    <div key={entry.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                      <img src={entry.image} alt="" className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-slate-900 truncate">{entry.productName}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs font-bold text-secondary">+{entry.quantity} un.</span>
                          <span className="text-xs font-medium text-slate-400">{entry.date}</span>
                          <span className="text-xs font-medium text-slate-500">por {entry.user}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Folio</p>
                        <p className="text-sm font-black text-slate-900 leading-none">{entry.folio}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
