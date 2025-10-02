import { useFetchAlarm, type Alarm } from '@/entities/alarm'
import { type BaseProps } from '@/shared/types'

interface AlarmDetailProps extends BaseProps {
  alarmId: number
}

export default function AlarmDetail({ alarmId }: AlarmDetailProps) {
  const { data } = useFetchAlarm(alarmId)
  const content = data?.content ?? ({} as Alarm)

  return (
    <ul>
      <li>아이디: {content.id}</li>
      <li>제목: {content.title}</li>
      <li>설명: {content.description}</li>
      <li>타입: {content.type}</li>
    </ul>
  )
}
