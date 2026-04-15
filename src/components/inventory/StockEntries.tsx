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

  const todayStr = new Date().toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: '2-digit' });
  const entriesToday = stockEntries.filter(entry => entry.date === todayStr).length;

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

  const handleConfirmReception = () => {
    if (receivingCart.length === 0) return;

    const newEntries = receivingCart.map(item => ({
      id: Date.now() + Math.random(),
      folio: `ENT-${Math.floor(Math.random() * 9000) + 1000}`,
      productName: item.name,
      productId: item.id,
      quantity: item.quantity,
      cost: item.newCost,
      date: new Date().toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: '2-digit' }),
      user: currentUser?.name || 'Admin User',
      image: item.image
    }));

    setStockEntries([...newEntries, ...stockEntries]);

    const updatedInventory = inventory.map(invItem => {
      const cartItem = receivingCart.find(c => c.id === invItem.id);
      if (cartItem) {
        return { ...invItem, stock: invItem.stock + cartItem.quantity, cost: cartItem.newCost };
      }
      return invItem;
    });
    setInventory(updatedInventory);
    setReceivingCart([]);
  };

  const handleNewProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const costNum = parseInt(newProductForm.cost);
    const priceNum = parseInt(newProductForm.price);
    const stockNum = parseInt(newProductForm.stock) || 0;
    
    const newProduct = {
      id: Date.now(),
      name: newProductForm.name,
      sku: newProductForm.sku,
      category: newProductForm.category,
      cost: costNum,
      price: priceNum,
      stock: stockNum,
      image: newProductForm.image,
      margin: Math.round(((priceNum - costNum) / priceNum) * 100)
    };

    setInventory([...inventory, newProduct]);
    
    // Also record the entry
    const newEntry = {
      id: Date.now() + 1,
      folio: `ENT-${Math.floor(Math.random() * 9000) + 1000}`,
      productName: newProduct.name,
      productId: newProduct.id,
      quantity: stockNum,
      cost: costNum,
      date: new Date().toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: '2-digit' }),
      user: currentUser?.name || 'Admin User',
      image: newProduct.image
    };
    setStockEntries([newEntry, ...stockEntries]);
    
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
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = inventory.find(p => p.id === parseInt(manualProduct));
    if (product && manualQuantity) {
      const quantity = parseInt(manualQuantity);
      const newEntry = {
        id: Date.now(),
        folio: `ENT-${Math.floor(Math.random() * 9000) + 1000}`,
        productName: product.name,
        productId: product.id,
        quantity,
        date: new Date(manualDate).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: '2-digit' }),
        user: currentUser?.name || 'Admin User',
        image: product.image
      };
      setStockEntries([newEntry, ...stockEntries]);
      setInventory(inventory.map(p => p.id === product.id ? { ...p, stock: p.stock + quantity } : p));
      setManualProduct('');
      setManualQuantity('');
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

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row p-6 gap-6">
          {/* Left Side: Scanning and Cart */}
          <div className="flex-1 flex flex-col gap-6 overflow-hidden">
            {/* Scanner Area */}
            <div className={`rounded-3xl p-8 shadow-2xl border-2 transition-all duration-300 ${isScanned ? 'bg-green-900/20 border-green-500 shadow-green-500/20' : 'bg-[#131b2e] border-secondary/30 shadow-secondary/10'}`}>
              <h2 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-6 flex items-center gap-2">
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
            <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" /> Productos en Recepción
                </h2>
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                  {receivingCart.length} Items
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                {receivingCart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                      <Package className="w-10 h-10" />
                    </div>
                    <p className="font-bold">No hay productos escaneados aún</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {receivingCart.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-secondary/30 transition-all">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-white shadow-sm" referrerPolicy="no-referrer" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-black text-slate-900 truncate">{item.name}</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{item.sku}</p>
                          <div className="mt-2 flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Costo:</span>
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
                                <input 
                                  type="number" 
                                  value={item.newCost}
                                  onChange={(e) => handleUpdateCartItem(item.id, 'newCost', parseInt(e.target.value))}
                                  className="w-24 pl-5 pr-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold focus:border-secondary outline-none"
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Cant:</span>
                              <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
                                <button 
                                  onClick={() => handleUpdateCartItem(item.id, 'quantity', Math.max(1, item.quantity - 1))}
                                  className="px-2 py-1 hover:bg-slate-100 text-slate-400"
                                >-</button>
                                <input 
                                  type="number" 
                                  value={item.quantity}
                                  onChange={(e) => handleUpdateCartItem(item.id, 'quantity', parseInt(e.target.value))}
                                  className="w-12 text-center text-xs font-bold outline-none"
                                />
                                <button 
                                  onClick={() => handleUpdateCartItem(item.id, 'quantity', item.quantity + 1)}
                                  className="px-2 py-1 hover:bg-slate-100 text-slate-400"
                                >+</button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-400 mb-1">Subtotal</p>
                          <p className="text-lg font-black text-slate-900">${(item.newCost * item.quantity).toLocaleString()}</p>
                        </div>
                        <button 
                          onClick={() => handleRemoveCartItem(item.id)}
                          className="p-2 text-slate-300 hover:text-error transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-200">
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
          <div className="w-full lg:w-96 flex flex-col gap-6 overflow-hidden">
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
            <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <History className="w-4 h-4" /> Últimos Ingresos
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
              <button className="p-4 text-xs font-bold text-secondary hover:bg-secondary/5 transition-colors border-t border-slate-100">
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
    </div>
  );
};
