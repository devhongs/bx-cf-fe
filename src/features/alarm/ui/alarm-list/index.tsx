import type { Alarm } from '@/entities/alarm';
import { useFetchAlarmList } from '@/entities/alarm';
import { AlarmCard } from '@/entities/alarm/ui/alarm-card';
import { useModal } from '@/shared/hooks';
import type { BaseProps } from '@/shared/types';

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
