import { describe, expect, it, vi } from 'vitest';

const replaceGlobalStorage = (key: 'localStorage' | 'sessionStorage') => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, key);
  Object.defineProperty(globalThis, key, {
    configurable: true,
    value: undefined,
  });

  return () => {
    if (descriptor) {
      Object.defineProperty(globalThis, key, descriptor);
      return;
    }
    Reflect.deleteProperty(globalThis, key);
  };
};

describe('storage util', () => {
  it('can be imported and called without browser storage globals', async () => {
    vi.resetModules();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const restoreLocalStorage = replaceGlobalStorage('localStorage');
    const restoreSessionStorage = replaceGlobalStorage('sessionStorage');

    try {
      const { local, session } = await import('./storage-util');

      expect(local.get('missing')).toBeNull();
      expect(local.has('missing')).toBe(false);
      expect(local.keys()).toEqual([]);
      expect(() => local.set('key', 'value')).not.toThrow();
      expect(() => local.remove('key')).not.toThrow();
      expect(() => local.clear()).not.toThrow();

      expect(session.get('missing')).toBeNull();
      expect(session.has('missing')).toBe(false);
      expect(session.keys()).toEqual([]);
      expect(consoleError).not.toHaveBeenCalled();
      expect(consoleWarn).not.toHaveBeenCalled();
    } finally {
      restoreLocalStorage();
      restoreSessionStorage();
      consoleError.mockRestore();
      consoleWarn.mockRestore();
    }
  });
});
