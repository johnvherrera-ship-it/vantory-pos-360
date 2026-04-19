type NetworkListener = (isOnline: boolean) => void;

class NetworkService {
  private isOnline = navigator.onLine;
  private listeners: Set<NetworkListener> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 2000;

  constructor() {
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
    this.startHealthCheck();
  }

  private handleOnline() {
    this.isOnline = true;
    this.reconnectAttempts = 0;
    this.notifyListeners(true);
  }

  private handleOffline() {
    this.isOnline = false;
    this.notifyListeners(false);
  }

  private notifyListeners(online: boolean) {
    this.listeners.forEach(listener => listener(online));
  }

  private startHealthCheck() {
    setInterval(() => {
      if (!navigator.onLine && this.isOnline) {
        this.handleOffline();
      } else if (navigator.onLine && !this.isOnline) {
        this.handleOnline();
      }
    }, 3000);
  }

  subscribe(listener: NetworkListener): () => void {
    this.listeners.add(listener);
    listener(this.isOnline);
    return () => this.listeners.delete(listener);
  }

  isConnected(): boolean {
    return this.isOnline && navigator.onLine;
  }

  async withRetry<T>(
    fn: () => Promise<T>,
    maxAttempts = 3,
    delayMs = 1000
  ): Promise<T> {
    let lastError: any;
    for (let i = 0; i < maxAttempts; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (i < maxAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, delayMs * (i + 1)));
        }
      }
    }
    throw lastError;
  }
}

export const networkService = new NetworkService();
