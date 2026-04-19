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
    await supabaseService.upsertProduct(product);
  });

  queueService.registerHandler('entry', async (op: QueuedOperation) => {
    const { entry, clientId } = op.data;
    await supabaseService.createStockEntry(entry);
  });

  queueService.registerHandler('fiado', async (op: QueuedOperation) => {
    const { action, data } = op.data;
    if (action === 'create') {
      await supabaseService.createFiado(data);
    } else if (action === 'update') {
      await supabaseService.updateFiado(data);
    }
  });
}
