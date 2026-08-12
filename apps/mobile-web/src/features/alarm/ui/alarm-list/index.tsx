import type { Alarm, BaseProps } from '@bx/shared';
import { AlarmCard, useFetchAlarmList, useModal } from '@bx/shared';

import styles from './index.module.css';

interface AlarmListProps extends BaseProps {}

export function AlarmList(_props: AlarmListProps) {
  const { open: openModal } = useModal();

  const { data } = useFetchAlarmList();
  const content = data ?? [];

  const handleClickAlarmCard = (d: Alarm) => {
    openModal({
      path: 'alarm-detail',
      props: d,
    });
  };

  return (
    <div className={styles.layout}>
      {content.map((d: Alarm) => (
        <AlarmCard key={d.id} data={d} onClick={() => handleClickAlarmCard(d)} />
      ))}
    </div>
  );
}
