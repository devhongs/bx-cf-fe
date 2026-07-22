import { useState } from 'react';

import { RotateCcw, Save, Search } from 'lucide-react';

import { Button } from '@bx/shared';

import {
  SignupForm,
  type SignupFormValues,
  type SignupPayload,
} from '@/features/auth/ui/signup-form';

import styles from './index.module.css';

const FORM_ID = 'pc-form-sample';

const queryResult: SignupFormValues = {
  userId: 'tester01',
  name: '홍길동',
  email: 'tester@example.com',
  password: 'password1',
  passwordConfirm: 'password1',
  userType: 'personal',
};

export function FormPage() {
  const [payload, setPayload] = useState<SignupPayload | null>(null);
  const [defaultValues, setDefaultValues] = useState<SignupFormValues | null>(null);
  const [formKey, setFormKey] = useState(0);

  const handleQuery = () => {
    setPayload(null);
    setDefaultValues(queryResult);
    setFormKey((current) => current + 1);
  };

  const handleSubmit = (nextPayload: SignupPayload) => {
    setPayload(nextPayload);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Form</h1>
            <p className={styles.subtitle}>폼 샘플</p>
          </div>

          <div className={styles.pageActions}>
            <Button type="button" variant="outline" onClick={handleQuery}>
              <Search aria-hidden="true" />
              조회
            </Button>
            <Button type="reset" form={FORM_ID} variant="secondary">
              <RotateCcw aria-hidden="true" />
              초기화
            </Button>
            <Button type="submit" form={FORM_ID} variant="submit">
              <Save aria-hidden="true" />
              저장
            </Button>
          </div>
        </header>

        <div className={styles.layout}>
          <section className={styles.panel}>
            <SignupForm
              key={formKey}
              id={FORM_ID}
              defaultValues={defaultValues ?? undefined}
              showSubmitButton={false}
              onSubmit={handleSubmit}
            />
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
