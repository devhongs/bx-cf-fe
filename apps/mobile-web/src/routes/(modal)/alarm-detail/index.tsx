import { AlarmDetail } from '@/features/alarm/ui/alarm-detail';
import type { ModalConfig } from '@bx/shared';
import { Modal } from '@bx/shared';

interface AlarmDetailModalProps extends ModalConfig {
  dummy?: any;
}

export function AlarmDetailModal({ props }: AlarmDetailModalProps) {
  const { id: alarmId } = props;
  return (
    <Modal>
      <Modal.Title>알람 상세</Modal.Title>
      <Modal.Body>
        <AlarmDetail alarmId={alarmId} />
      </Modal.Body>
    </Modal>
  );
}
