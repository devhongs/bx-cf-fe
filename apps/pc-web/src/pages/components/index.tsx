import { useQueryClient } from '@tanstack/react-query';
import { EyeOffIcon, PlayIcon } from 'lucide-react';
import { useState } from 'react';

import { Button, fetchProductList, withGlobalLoading } from '@bx/shared';

import SampleLogo from '@/assets/sample-logo.svg?react';

import styles from './index.module.css';

const componentSamples = ['Button', 'Input', 'Select', 'Modal'];
const LOADING_TEST_DURATION_MS = 1000;

type LoadingTestMode = 'default' | 'silent';

const wait = (duration: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, duration));

const withMinimumDuration = async <T,>(operation: () => Promise<T>): Promise<T> => {
  const minimumDuration = wait(LOADING_TEST_DURATION_MS);

  try {
    return await operation();
  } finally {
    await minimumDuration;
  }
};

export function ComponentsPage() {
  const queryClient = useQueryClient();
  const [pendingMode, setPendingMode] = useState<LoadingTestMode | null>(null);
  const [resultMessage, setResultMessage] = useState('대기 중');

  const runLoadingTest = async (mode: LoadingTestMode) => {
    const startedAt = performance.now();
    setPendingMode(mode);
    setResultMessage('요청 중');

    try {
      const products = await queryClient.fetchQuery({
        queryKey: ['components', 'loading-overlay-test', mode, Date.now()],
        queryFn: () =>
          mode === 'silent'
            ? withMinimumDuration(() => fetchProductList(undefined, { showSpinner: false }))
            : withGlobalLoading(() => withMinimumDuration(() => fetchProductList())),
      });
      const elapsed = Math.round(performance.now() - startedAt);
      setResultMessage(`완료 · ${products.length}건 · ${elapsed}ms`);
    } catch {
      setResultMessage('요청 실패');
    } finally {
      setPendingMode(null);
    }
  };

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
            <h2 className={styles.panelTitle}>Global loading overlay</h2>
          </div>
          <div className={styles.loadingSample}>
            <div className={styles.loadingActions}>
              <Button
                type="button"
                disabled={pendingMode !== null}
                onClick={() => void runLoadingTest('default')}
              >
                <PlayIcon aria-hidden="true" size={16} />
                {pendingMode === 'default' ? '요청 중' : '기본 스피너 요청'}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={pendingMode !== null}
                onClick={() => void runLoadingTest('silent')}
              >
                <EyeOffIcon aria-hidden="true" size={16} />
                {pendingMode === 'silent' ? '요청 중' : '스피너 제외 요청'}
              </Button>
            </div>
            <output className={styles.loadingResult} aria-live="polite">
              {resultMessage}
            </output>
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
