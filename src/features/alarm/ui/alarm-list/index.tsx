import {  useFetchAlarms } from '@/entities/alarm'
import type {Alarm} from '@/entities/alarm';
import AlarmCard from '@/entities/alarm/ui/alarm-card'
import { useModal } from '@/shared/hooks'
import type {BaseProps} from '@/shared/types';

import styles from './index.module.css'

interface AlarmListProps extends BaseProps {
  dummy?: any
}

export default function AlarmList({ dummy }: AlarmListProps) {
  const { open: openModal } = useModal()

  const { data } = useFetchAlarms()
  const content = data?.content ?? []

  const handleClickAlarmCard = (d: Alarm) => {
    openModal({
      path: 'alarm-detail',
      props: d,
    })
  }

  return (
    <div className={styles.start}>
      {content.map((d: Alarm) => (
        <AlarmCard
          key={d.id}
          data={d}
          onClick={() => handleClickAlarmCard(d)}
        />
      ))}
    </div>
  )
}
