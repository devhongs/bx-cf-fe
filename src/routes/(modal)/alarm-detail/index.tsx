import { AlarmDetail } from '@/features/alarm/ui/alarm-detail';
import type { ModalConfig } from '@/shared/types';
import { Modal } from '@/shared/ui/modal/Modal';

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

