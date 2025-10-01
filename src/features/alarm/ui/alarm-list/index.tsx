import AlarmCard from '@/entities/alarm/ui/alarm-card'
import { type BaseProps } from '@/shared/types'

import { useModal } from '@/shared/hooks'
import styles from './index.module.css'

interface AlarmListProps extends BaseProps {
  dummy?: any
}

export default function AlarmList({ dummy }: AlarmListProps) {
  const { open: openModal } = useModal()

  const alarmData = fetchAlarmData()

  const handleClickAlarmCard = (data: any) => {
    openModal({
      path: 'alarm-detail',
      props: {
        data,
      },
    })
  }

  return (
    <div className={styles.start}>
      {alarmData.map((d) => (
        <AlarmCard
          key={d.id}
          data={d}
          onClick={() => handleClickAlarmCard(d)}
        />
      ))}
    </div>
  )
}

// TODO: API 연동 후 삭제
const fetchAlarmData = () =>
  Array(3)
    .fill(0)
    .map((_, index) => ({
      id: index + 1,
      title: `alarm ${index + 1}`,
      description: `alarm ${index + 1} description`,
    }))
