/**
 * Storage Utility
 * sessionStorage, localStorage, IndexedDB를 통합된 API로 제공
 */

// 설정 인터페이스
interface StorageConfig {
  dbName?: string;
  dbVersion?: number;
  storeName?: string;
  enableLogging?: boolean;
}

// 기본 설정
const DEFAULT_CONFIG: Required<StorageConfig> = {
  dbName: 'app-storage',
  dbVersion: 1,
  storeName: 'key-value-store',
  enableLogging: true,
};

let config: Required<StorageConfig> = { ...DEFAULT_CONFIG };

// 설정 함수
export const configureStorage = (options: StorageConfig): void => {
  config = { ...config, ...options };
};

// 로깅 헬퍼
const log = (level: 'error' | 'warn', message: string, error?: unknown): void => {
  if (!config.enableLogging) return;
  if (level === 'error') {
    console.error(message, error);
  } else {
    console.warn(message, error);
  }
};

// 공통 스토리지 인터페이스
interface Storage {
  get: <T = unknown>(key: string) => T | null;
  set: <T = unknown>(key: string, value: T) => void;
  remove: (key: string) => void;
  clear: () => void;
  has: (key: string) => boolean;
  keys: () => Array<string>;
}

interface AsyncStorage {
  get: <T = unknown>(key: string) => Promise<T | null>;
  set: <T = unknown>(key: string, value: T) => Promise<void>;
  remove: (key: string) => Promise<void>;
  clear: () => Promise<void>;
  has: (key: string) => Promise<boolean>;
  keys: () => Promise<Array<string>>;
}

// IndexedDB 싱글톤 인스턴스
let dbInstance: IDBDatabase | null = null;

// IndexedDB 초기화
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(config.dbName, config.dbVersion);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(config.storeName)) {
        db.createObjectStore(config.storeName);
      }
    };
  });
};

// IndexedDB 인스턴스 가져오기 (싱글톤)
const getDB = async (): Promise<IDBDatabase> => {
  if (!dbInstance || dbInstance.version !== config.dbVersion) {
    dbInstance = await initDB();
  }
  return dbInstance;
};

// IndexedDB 트랜잭션 실행 헬퍼
const executeTransaction = async <T>(
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([config.storeName], mode);
    const store = transaction.objectStore(config.storeName);
    const request = callback(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// JSON 파싱 헬퍼 함수
const safeJsonParse = <T = unknown>(value: string | null): T | null => {
  if (value === null) return null;

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    log('warn', '[Storage] JSON parse error:', error);
    return value as T;
  }
};

// JSON 문자열화 헬퍼 함수
const safeJsonStringify = <T = unknown>(value: T): string => {
  try {
    return JSON.stringify(value);
  } catch (error) {
    log('warn', '[Storage] JSON stringify error:', error);
    return String(value);
  }
};

// Web Storage 기반 구현 (sessionStorage, localStorage)
const createWebStorage = (storage: globalThis.Storage): Storage => ({
  get<T = unknown>(key: string): T | null {
    try {
      const value = storage.getItem(key);
      return safeJsonParse<T>(value);
    } catch (error) {
      log('error', '[Storage] Get error:', error);
      return null;
    }
  },

  set<T = unknown>(key: string, value: T): void {
    try {
      const stringValue = safeJsonStringify(value);
      storage.setItem(key, stringValue);
    } catch (error) {
      log('error', '[Storage] Set error:', error);
      // QuotaExceededError 처리
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        log('warn', '[Storage] Storage quota exceeded');
      }
    }
  },

  remove(key: string): void {
    try {
      storage.removeItem(key);
    } catch (error) {
      log('error', '[Storage] Remove error:', error);
    }
  },

  clear(): void {
    try {
      storage.clear();
    } catch (error) {
      log('error', '[Storage] Clear error:', error);
    }
  },

  has(key: string): boolean {
    try {
      return storage.getItem(key) !== null;
    } catch (error) {
      log('error', '[Storage] Has error:', error);
      return false;
    }
  },

  keys(): Array<string> {
    try {
      return Object.keys(storage);
    } catch (error) {
      log('error', '[Storage] Keys error:', error);
      return [];
    }
  },
});

// IndexedDB 구현
const createIndexedDBStorage = (): AsyncStorage => ({
  async get<T = unknown>(key: string): Promise<T | null> {
    try {
      const result = await executeTransaction<T | undefined>('readonly', (store) => store.get(key));

      if (result === undefined) {
        return null;
      }if (typeof result === 'string') {
        return safeJsonParse<T>(result);
      }
        return result;
    } catch (error) {
      log('error', '[IndexedDB] Get error:', error);
      return null;
    }
  },

  async set<T = unknown>(key: string, value: T): Promise<void> {
    try {
      // 객체는 그대로, 기본 타입은 JSON 문자열로 저장
      const storageValue =
        typeof value === 'object' && value !== null ? value : safeJsonStringify(value);

      await executeTransaction('readwrite', (store) => store.put(storageValue, key));
    } catch (error) {
      log('error', '[IndexedDB] Set error:', error);
      throw error;
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await executeTransaction('readwrite', (store) => store.delete(key));
    } catch (error) {
      log('error', '[IndexedDB] Remove error:', error);
      throw error;
    }
  },

  async clear(): Promise<void> {
    try {
      await executeTransaction('readwrite', (store) => store.clear());
    } catch (error) {
      log('error', '[IndexedDB] Clear error:', error);
      throw error;
    }
  },

  async has(key: string): Promise<boolean> {
    try {
      const count = await executeTransaction<number>('readonly', (store) => store.count(key));
      return count > 0;
    } catch (error) {
      log('error', '[IndexedDB] Has error:', error);
      return false;
    }
  },

  async keys(): Promise<Array<string>> {
    try {
      const result = await executeTransaction<Array<IDBValidKey>>('readonly', (store) =>
        store.getAllKeys(),
      );
      return result as Array<string>;
    } catch (error) {
      log('error', '[IndexedDB] Keys error:', error);
      return [];
    }
  },
});

// 통합 스토리지 export
export const session = createWebStorage(sessionStorage);
export const local = createWebStorage(localStorage);
export const db = createIndexedDBStorage();

// 타입 export
export type { Storage, AsyncStorage, StorageConfig };
