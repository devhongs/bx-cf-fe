import * as Primitive from '@radix-ui/react-dialog';
import { IcoClose02 } from '@learnway/icons';
import React from 'react';

import { ModalConfig } from './type';
import { cn } from '@learnway/shared';
import styles from './modal.module.css';
import { Button } from '../button/button';

const ModalComponent: React.FC<ModalConfig> = ({
  content,
  headerActionNode,
  onClose,
  width = 'auto',
  height,
  hideCloseButton = false,
  closeOnOutsideClick = false,
  id,
}) => {
  // 닫기 버튼 클릭 시 onClose 콜백 호출
  const handleOpenChange = () => onClose?.();

  // 외부 클릭 이벤트 핸들러
  const handleOutsideClick = (e: Event) => {
    if (closeOnOutsideClick) {
      // 외부 클릭으로 닫기가 활성화된 경우 그대로 진행
      // (기본 동작 허용)
    } else {
      // 외부 클릭으로 닫기가 비활성화된 경우 이벤트 중단
      e.preventDefault();
    }
  };
  return (
    <Primitive.Root defaultOpen onOpenChange={handleOpenChange}>
      <Primitive.Portal>
        <Primitive.Overlay className={styles.overlay} />
        <Primitive.Content
          className={cn(
            styles.content,
            'nlp--modal',
            width && styles[width],
            height && styles[height],
          )}
          onInteractOutside={handleOutsideClick}
          onEscapeKeyDown={(e) => {
            if (React.isValidElement(content) && (content.type as any)?.displayName === 'Alert') {
              return;
            }
            e.preventDefault();
          }}
          onOpenAutoFocus={(e) => e.preventDefault()}
          id={`nlp--modal-${id}`}
        >
          {/* 모달 콘텐츠 */}
          <div className={cn(styles.content_body, width && styles[width])}>{content}</div>

          {/* 헤더 액션 노드 영역 (커스텀 사용 가능) */}
          {headerActionNode && (
            <div className={cn(styles.header_action_node, 'nlp--modal-header-action-node')}>
              {headerActionNode}
            </div>
          )}

          {/* 닫기 버튼 */}
          {!hideCloseButton && (
            <Primitive.Close asChild>
              <Button className={styles.btn_close} aria-label="Close" onlyIcon>
                <IcoClose02 width={24} height={24} stroke="#131C30" />
              </Button>
            </Primitive.Close>
          )}
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  );
};

export const Modal = ModalComponent;
