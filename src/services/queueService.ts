import { networkService } from './networkService';

export interface QueuedOperation {
  id: string;
  type: 'sale' | 'inventory' | 'fiado' | 'entry';
  data: any;
  timestamp: number;
  retries: number;
  maxRetries: number;
}

type OperationHandler = (op: QueuedOperation) => Promise<void>;

class QueueService {
  private queue: Map<string, QueuedOperation> = new Map();
  private handlers: Map<string, OperationHandler> = new Map();
  private processing = false;
  private STORAGE_KEY = 'vantory_operation_queue';

  constructor() {
    this.loadQueue();
    networkService.subscribe((isOnline) => {
      if (isOnline) {
        this.processQueue();
      }
    });
  }

  registerHandler(type: string, handler: OperationHandler) {
    this.handlers.set(type, handler);
  }

  enqueue(operation: Omit<QueuedOperation, 'id' | 'timestamp' | 'retries'>) {
    const id = `${operation.type}_${Date.now()}_${Math.random()}`;
    const queuedOp: QueuedOperation = {
      ...operation,
      id,
      timestamp: Date.now(),
      retries: 0,
      maxRetries: operation.maxRetries || 3,
    };

    this.queue.set(id, queuedOp);
    this.saveQueue();

    if (networkService.isConnected()) {
      this.processQueue();
    }

    return id;
  }

  private async processQueue() {
    if (this.processing || !networkService.isConnected()) return;

    this.processing = true;
    const operations = Array.from(this.queue.values());

    for (const op of operations) {
      if (!networkService.isConnected()) break;

      try {
        const handler = this.handlers.get(op.type);
        if (handler) {
          await networkService.withRetry(() => handler(op), 2, 1000);
          this.queue.delete(op.id);
        }
      } catch (error) {
        op.retries++;
        if (op.retries >= op.maxRetries) {
          this.queue.delete(op.id);
        }
      }
    }

    this.processing = false;
    this.saveQueue();
  }

  private saveQueue() {
    try {
      const ops = Array.from(this.queue.values());
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ops));
    } catch {}
  }

  private loadQueue() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const ops = JSON.parse(data) as QueuedOperation[];
        ops.forEach(op => this.queue.set(op.id, op));
      }
    } catch {}
  }

  getPendingCount(): number {
    return this.queue.size;
  }

  getQueue(): QueuedOperation[] {
    return Array.from(this.queue.values());
  }
}

export const queueService = new QueueService();
