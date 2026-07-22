import { useState } from 'react';

import { SignupForm, type SignupPayload } from '@/features/auth/ui/signup-form';

import styles from './index.module.css';

export function FormPage() {
  const [payload, setPayload] = useState<SignupPayload | null>(null);
  const handleSubmit = (nextPayload: SignupPayload) => {
    setPayload(nextPayload);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div>
          <h1 className={styles.title}>Form</h1>
          <p className={styles.subtitle}>폼 샘플</p>
        </div>

        <div className={styles.layout}>
          <section className={styles.panel}>
            <SignupForm onSubmit={handleSubmit} />
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Submit Payload</h2>
              <span className={styles.status}>{payload ? 'SUCCESS' : 'EMPTY'}</span>
            </div>
            <pre className={styles.payload}>{JSON.stringify(payload, null, 2)}</pre>
          </section>
        </div>
      </div>
    </div>
  );
}
