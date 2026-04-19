interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CacheService {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private STORAGE_PREFIX = 'vantory_cache_';

  set<T>(key: string, data: T, ttlMinutes: number = 30) {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000,
    };
    this.cache.set(key, entry);
    try {
      localStorage.setItem(this.STORAGE_PREFIX + key, JSON.stringify(entry));
    } catch {}
  }

  get<T>(key: string): T | null {
    let entry = this.cache.get(key);

    if (!entry) {
      try {
        const stored = localStorage.getItem(this.STORAGE_PREFIX + key);
        if (stored) {
          entry = JSON.parse(stored);
          this.cache.set(key, entry);
        }
      } catch {}
    }

    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.delete(key);
      return null;
    }

    return entry.data as T;
  }

  delete(key: string) {
    this.cache.delete(key);
    try {
      localStorage.removeItem(this.STORAGE_PREFIX + key);
    } catch {}
  }

  clear() {
    this.cache.clear();
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith(this.STORAGE_PREFIX))
        .forEach(k => localStorage.removeItem(k));
    } catch {}
  }

  getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlMinutes: number = 30
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached) return Promise.resolve(cached);

    return fetcher().then(data => {
      this.set(key, data, ttlMinutes);
      return data;
    });
  }
}

export const cacheService = new CacheService();
