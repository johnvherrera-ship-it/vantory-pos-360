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
    const { fiado, clientId } = op.data;
    if (fiado.id) {
      await supabaseService.updateFiado(fiado);
    } else {
      await supabaseService.createFiado(fiado);
    }
  });
}
