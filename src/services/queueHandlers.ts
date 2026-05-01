import { queueService, QueuedOperation } from './queueService';
import { supabaseService } from './supabaseService';
import { cacheService } from './cacheService';

export const CACHE_INVALIDATED_EVENT = 'vantory:cache-invalidated';

export function registerQueueHandlers() {
  queueService.registerHandler('sale', async (op: QueuedOperation) => {
    const { sale, clientId } = op.data;
    try {
      if (sale.id) {
        await supabaseService.updateSale(sale);
      } else {
        await supabaseService.createSale(sale);
      }
      cacheService.delete(`sales_${clientId}`);
      window.dispatchEvent(new CustomEvent(CACHE_INVALIDATED_EVENT, { detail: { table: 'sales', clientId } }));
    } catch (error) {
      console.error('❌ Error sincronizando venta:', error);
      throw error;
    }
  });

  queueService.registerHandler('inventory', async (op: QueuedOperation) => {
    const { product, clientId } = op.data;
    try {
      console.log('📦 Sincronizando inventario:', product);
      await supabaseService.upsertProduct(product);
      console.log('✅ Inventario sincronizado:', product.id);
      cacheService.delete(`products_${clientId}`);
      window.dispatchEvent(new CustomEvent(CACHE_INVALIDATED_EVENT, { detail: { table: 'products', clientId } }));
    } catch (error) {
      console.error('❌ Error sincronizando inventario:', error);
      throw error;
    }
  });

  queueService.registerHandler('entry', async (op: QueuedOperation) => {
    const { entry, clientId } = op.data;
    try {
      console.log('📝 Sincronizando entrada de stock:', entry);
      await supabaseService.createStockEntry(entry);
      console.log('✅ Entrada sincronizada:', entry.folio);
      cacheService.delete(`stockEntries_${clientId}`);
      window.dispatchEvent(new CustomEvent(CACHE_INVALIDATED_EVENT, { detail: { table: 'stockEntries', clientId } }));
    } catch (error) {
      console.error('❌ Error sincronizando entrada:', error);
      throw error;
    }
  });

  queueService.registerHandler('fiado', async (op: QueuedOperation) => {
    const { action, data, clientId } = op.data;
    try {
      if (action === 'create') {
        await supabaseService.createFiado(data);
      } else if (action === 'update') {
        await supabaseService.updateFiado(data);
      }
      cacheService.delete(`fiados_${clientId}_${data.storeId}`);
      window.dispatchEvent(new CustomEvent(CACHE_INVALIDATED_EVENT, { detail: { table: 'fiados', clientId } }));
    } catch (error) {
      console.error('❌ Error sincronizando fiado:', error);
      throw error;
    }
  });

  queueService.registerHandler('cash_history', async (op: QueuedOperation) => {
    const { record } = op.data;
    await supabaseService.createCashHistory(record);
  });

  queueService.registerHandler('cash_register_open', async (op: QueuedOperation) => {
    const { clientId, storeId, posId, initialCash, openedAt } = op.data;
    await supabaseService.createCashRegister({
      clientId,
      storeId,
      posId,
      initialCash,
      openedAt
    });
  });
}
