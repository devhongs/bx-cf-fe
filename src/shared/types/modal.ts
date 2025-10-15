import type { ReactNode } from 'react'

export type ModalSize =
  | 'auto'
  | 's'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'full'
  | 'respon'
  | 'm_full'
  | 'm_bottom_sheet' // s : 400px , sm : 600px , md : 800px, lg : 1024px, xl : 1400px, m_full : 모바일 full , m_bottom_sheet : 모바일 bottom sheet
export type ModalHeight = 'auto' | 'sm' | 'md' | 'lg' | 'full' | 'fix'

export interface ModalConfig<T = any> {
  /**
   * 모달 컴포넌트 경로
   */
  path?: string

  /**
   * content 영역
   * 모달에 표시할 내용
   */
  content?: ReactNode

  /**
   * 해더 버튼 영역 커스텀 하게 사용시 설정
   * (닫기 버튼 외에 추가적인 버튼을 제공할 수 있는 영역)
   */
  headerActionNode?: ReactNode

  /**
   * 모달 컴포넌트 클래스명
   */
  className?: string

  /**
   * 상태관리시 modal 구분하기 위해 사용
   * (modal.hook 에서 open시 자동생성)
   */
  id?: string

  /**
   * 모달 제목
   */
  title?: string

  /**
   * 모달의 너비 설정
   * 예: 'sm', 'md', 'lg' 등의 크기 옵션
   */
  width?: ModalSize

  /**
   * 모달의 높이 설정
   * 기본적으로 자동으로 높이가 맞춰지지만, 고정 높이를 설정할 수 있음
   */
  height?: ModalHeight

  /**
   * 모달 컴포넌트에 전달할 추가 프로퍼티
   */
  props?: any

  /**
   * 닫기 버튼 숨기기 여부
   * true로 설정하면 닫기 버튼이 표시되지 않음
   */
  hideCloseButton?: boolean

  /**
   * 모달이 닫힐 때 실행될 콜백 함수
   * 모달이 닫힐 때 전달할 데이터와 함께 호출됨
   */
  onClose?: (data?: ModalClose<T>) => void

  /**
   * 모달 외부 영역 클릭으로 모달 창 닫을 수 있게 설정
   */
  closeOnOutsideClick?: boolean
}

export interface ModalClose<T = any> {
  data?: T
}

export interface useModalReturnValue {
  modals: Array<ModalConfig>
  open: (props: ModalConfig | (() => ModalConfig)) => Promise<any>
  close: (data?: any) => void
  closeAll: () => void
  // alert: (props: AlertComponentProps | string) => Promise<boolean>;
  // confirm: (props: AlertComponentProps | string) => Promise<boolean>;
  // showSaveComplete: (props?: AlertComponentProps) => Promise<boolean>;
  // showUpdateComplete: (props?: AlertComponentProps) => Promise<boolean>;
  // showDeleteComplete: (props?: AlertComponentProps) => Promise<boolean>;
}
