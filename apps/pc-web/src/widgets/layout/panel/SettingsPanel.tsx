import { $codeUtils, Select, useTheme } from '@bx/shared';
import { X } from 'lucide-react';
import { useState } from 'react';

import { useLayout } from '@/shared/context/LayoutContext';
import styles from './SettingsPanel.module.css';

const THEMES = [
  { value: 'light', label: '라이트' },
  { value: 'dark', label: '다크' },
] as const;

export function SettingsPanel() {
  const dateRanges = $codeUtils.getCodes('DATE_RANGE');
  const { settingsPanelOpen, toggleSettingsPanel } = useLayout();
  const [accountType, setAccountType] = useState('');
  const [dateRange, setDateRange] = useState('ONE_MONTH');
  const [transferAmount, setTransferAmount] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [alertEnabled, setAlertEnabled] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <aside className={`${styles.panel} ${!settingsPanelOpen ? styles.collapsed : ''}`}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>빠른 설정</span>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={toggleSettingsPanel}
          title="패널 닫기"
        >
          <X size={16} />
        </button>
      </div>

      <div className={styles.body}>
        {/* 계좌 유형 */}
        <div className={styles.section}>
          <label className={styles.label}>계좌 유형</label>
          <Select
            className={styles.select}
            value={accountType}
            groupCd="ACCOUNT_TYPE"
            onChange={(e) => setAccountType(e.target.value)}
          />
        </div>

        {/* 조회 기간 */}
        <div className={styles.section}>
          <label className={styles.label}>조회 기간</label>
          <div className={styles.chipGroup}>
            {dateRanges.map(({ codeField, labelField }) => (
              <button
                key={codeField}
                type="button"
                className={`${styles.chip} ${dateRange === codeField ? styles.chipActive : ''}`}
                onClick={() => setDateRange(codeField)}
              >
                {labelField}
              </button>
            ))}
          </div>
        </div>

        {/* 테마 */}
        <div className={styles.section}>
          <label className={styles.label}>테마</label>
          <div className={styles.chipGroup}>
            {THEMES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                className={`${styles.chip} ${theme === value ? styles.chipActive : ''}`}
                onClick={() => setTheme(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.divider} />

        {/* 빠른 이체 */}
        <div className={styles.section}>
          <label className={styles.label}>빠른 이체</label>
          <input
            type="text"
            className={styles.input}
            placeholder="이체 금액 입력"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
          />
          <button type="button" className={styles.transferBtn}>
            이체하기
          </button>
        </div>

        <div className={styles.divider} />

        {/* 자동 갱신 */}
        <div className={styles.section}>
          <div className={styles.toggleRow}>
            <div>
              <p className={styles.toggleLabel}>자동 갱신</p>
              <p className={styles.toggleDesc}>5분마다 잔액 업데이트</p>
            </div>
            <button
              type="button"
              className={`${styles.toggle} ${autoRefresh ? styles.toggleOn : ''}`}
              onClick={() => setAutoRefresh(!autoRefresh)}
            />
          </div>
        </div>

        {/* 알림 */}
        <div className={styles.section}>
          <div className={styles.toggleRow}>
            <div>
              <p className={styles.toggleLabel}>거래 알림</p>
              <p className={styles.toggleDesc}>입출금 발생 시 알림</p>
            </div>
            <button
              type="button"
              className={`${styles.toggle} ${alertEnabled ? styles.toggleOn : ''}`}
              onClick={() => setAlertEnabled(!alertEnabled)}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
