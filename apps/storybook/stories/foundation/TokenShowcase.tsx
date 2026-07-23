import type { CSSProperties } from 'react';

import styles from './TokenShowcase.module.css';

export const tokenNames = [
  '--background',
  '--surface',
  '--surface-raised',
  '--foreground',
  '--muted',
  '--border',
  '--accent',
  '--accent-hover',
  '--success',
  '--warning',
  '--danger',
] as const;

export function TokenShowcase() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>BX-CF Foundations</p>
        <h1>Semantic tokens</h1>
        <p>Use the Theme toolbar to compare light and dark values.</p>
      </header>

      <section className={styles.grid}>
        {tokenNames.map((token) => (
          <article className={styles.card} key={token}>
            <div
              className={styles.swatch}
              style={{ '--token-value': `var(${token})` } as CSSProperties}
            />
            <code>{token}</code>
          </article>
        ))}
      </section>
    </main>
  );
}
