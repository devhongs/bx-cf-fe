import SampleLogo from '@/assets/sample-logo.svg?react';

import styles from './index.module.css';

const componentSamples = ['Button', 'Input', 'Select', 'Modal'];

export function ComponentsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div>
          <h1 className={styles.title}>Components</h1>
          <p className={styles.subtitle}>컴포넌트 샘플</p>
        </div>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Components</h2>
          </div>
          <div className={styles.grid}>
            {componentSamples.map((name) => (
              <div key={name} className={styles.sample}>
                <span className={styles.sampleName}>{name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>SVGR</h2>
          </div>
          <div className={styles.grid}>
            {/* SVG를 React 컴포넌트로 import — props(크기)와 CSS color(currentColor)로 제어 */}
            <div className={`${styles.sample} ${styles.svgSample}`}>
              <SampleLogo width={40} height={40} aria-hidden="true" />
              <span className={styles.sampleName}>sample-logo.svg?react</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
