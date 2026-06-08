import { AlarmList } from '@/features/alarm/ui/alarm-list';
import type { ModalConfig } from '@bx/shared';
import { Button, Modal } from '@bx/shared';

interface AlarmListModalProps extends ModalConfig {}

export function AlarmListModal({ onClose }: AlarmListModalProps) {
  return (
    <Modal>
      <Modal.Title>알람 리스트</Modal.Title>
      <Modal.Body>
        <AlarmList />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => onClose?.({ data: 'confirm click' })}>확인</Button>
      </Modal.Footer>
    </Modal>
  );
}

