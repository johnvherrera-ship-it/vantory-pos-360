import { queueService, QueuedOperation } from './queueService';
import { supabaseService } from './supabaseService';

export function registerQueueHandlers() {
  queueService.registerHandler('sale', async (op: QueuedOperation) => {
    const { sale, clientId } = op.data;
    if (sale.id) {
      await supabaseService.updateSale(sale);
    } else {
      await supabaseService.createSale(sale);
    }
  });

  queueService.registerHandler('inventory', async (op: QueuedOperation) => {
    const { product, clientId } = op.data;
    try {
      console.log('📦 Sincronizando inventario:', product);
      await supabaseService.upsertProduct(product);
      console.log('✅ Inventario sincronizado:', product.id);
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
    } catch (error) {
      console.error('❌ Error sincronizando entrada:', error);
      throw error;
    }
  });

  queueService.registerHandler('fiado', async (op: QueuedOperation) => {
    const { action, data } = op.data;
    if (action === 'create') {
      await supabaseService.createFiado(data);
    } else if (action === 'update') {
      await supabaseService.updateFiado(data);
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
