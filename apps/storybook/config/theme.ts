export interface ThemeRoot {
  classList: Pick<DOMTokenList, 'toggle'>;
}

export function applyStorybookTheme(root: ThemeRoot, theme: unknown) {
  root.classList.toggle('dark', theme === 'dark');
}
