export interface CodeItem {
  codeField: string;
  labelField: string;
  label?: string;
}

export interface AddDay {
  year?: number;
  month?: number;
  day?: number;
}

// 사용자 정보
export interface User {
  rntmEnvDsCd: string;
  chnlDscd: string;
  txDt: string;
  lngCd: string;
  sysIntrfcId: string;
  staffId: string;
  staffNm: string;
  deptId: string;
  deptNm: string;
  userGrpCd: string;
  sssnId: string;
  lastLoinDtm: string;
  tmpPswdYn: string;
  pswdExprDudtYn: string;
  pswdExprYn: string;
  mgrRoleYn: string;
  roleList: string;
  loginComplete: boolean;
}

// 메뉴 정보
export interface BxuiMenu {
  key?: string; // (FE)메뉴번호
  title?: string; // (FE)메뉴명
  menuId: string; // 메뉴번호
  menuNm?: string; // 메뉴명
  upperMenuId: string; // 상위메뉴ID
  level: number; // 화면레벨
  menuFl?: string; // 메뉴여부
  menuSort?: string; // 메뉴정렬순서
  menuHideFl?: string; // 메뉴숨김여부
  scrnId?: string; // 화면ID
  menuLink?: string; // 메뉴Link
  description?: string; // 메뉴설명
  selected?: boolean; // 메뉴선택여부
  children?: BxuiMenu[]; // eslint-disable-line @typescript-eslint/array-type
}

export interface ValidCondition {
  value: boolean; // test 조건
  message: string; // 에러메세지
}

export interface AnyObject {
  [key: string]: any;
}

export interface FunnelProps {
  funnel?: string;
  funnelList?: Array<string>;
  funnelParam?: any;
  setFunnelParam?: (param: any) => void;
  onNext?: (nextFunnel: string) => void;
  onPrev?: (prevFunnel?: string) => void;
  onLeaveFunnel?: (_onLeaveCallback: () => void) => void;
}
