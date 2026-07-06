import { useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';
const DEFAULT_THEME: Theme = 'dark';
const listeners = new Set<() => void>();

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') {
    return DEFAULT_THEME;
  }
  return window.localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : DEFAULT_THEME;
}

export function applyTheme(theme: Theme = getStoredTheme()) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function setTheme(theme: Theme) {
  window.localStorage.setItem(STORAGE_KEY, theme);
  applyTheme(theme);
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getStoredTheme, () => DEFAULT_THEME);
  return { theme, setTheme };
}
