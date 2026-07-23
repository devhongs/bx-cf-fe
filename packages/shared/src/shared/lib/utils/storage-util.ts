/**
 * Storage Utility
 * sessionStorage, localStorage를 통합된 API로 제공
 */

// 로깅 헬퍼
const log = (level: 'error' | 'warn', message: string, error?: unknown): void => {
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

const getWebStorage = (
  storageKey: 'localStorage' | 'sessionStorage',
): globalThis.Storage | null => {
  if (typeof window === 'undefined') return null;

  try {
    return window[storageKey] ?? null;
  } catch {
    return null;
  }
};

// Web Storage 기반 구현 (sessionStorage, localStorage)
const createWebStorage = (storageKey: 'localStorage' | 'sessionStorage'): Storage => ({
  get<T = unknown>(key: string): T | null {
    const storage = getWebStorage(storageKey);
    if (!storage) return null;

    try {
      const value = storage.getItem(key);
      return safeJsonParse<T>(value);
    } catch (error) {
      log('error', '[Storage] Get error:', error);
      return null;
    }
  },

  set<T = unknown>(key: string, value: T): void {
    const storage = getWebStorage(storageKey);
    if (!storage) return;

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
    const storage = getWebStorage(storageKey);
    if (!storage) return;

    try {
      storage.removeItem(key);
    } catch (error) {
      log('error', '[Storage] Remove error:', error);
    }
  },

  clear(): void {
    const storage = getWebStorage(storageKey);
    if (!storage) return;

    try {
      storage.clear();
    } catch (error) {
      log('error', '[Storage] Clear error:', error);
    }
  },

  has(key: string): boolean {
    const storage = getWebStorage(storageKey);
    if (!storage) return false;

    try {
      return storage.getItem(key) !== null;
    } catch (error) {
      log('error', '[Storage] Has error:', error);
      return false;
    }
  },

  keys(): Array<string> {
    const storage = getWebStorage(storageKey);
    if (!storage) return [];

    try {
      return Object.keys(storage);
    } catch (error) {
      log('error', '[Storage] Keys error:', error);
      return [];
    }
  },
});

// 통합 스토리지 export
export const session = createWebStorage('sessionStorage');
export const local = createWebStorage('localStorage');

// 타입 export
export type { Storage };
