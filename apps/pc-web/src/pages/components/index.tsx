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
      </div>
    </div>
  );
}
