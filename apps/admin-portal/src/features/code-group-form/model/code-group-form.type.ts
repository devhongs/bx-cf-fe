/**
 * 폼이 들고 있는 코드 행. sortSeq는 배열 순서로 확정하므로 입력받지 않는다.
 *
 * 저장이 그룹 단위 전체 교체라 기존 행의 codeId는 보낼 필요가 없다.
 * 화면에서 지운 행은 payload에서 빠지는 것으로 삭제된다.
 */
export interface CodeRowValues {
  code: string;
  codeNm: string;
  useYn: 'Y' | 'N';
}

export interface CodeGroupFormValues {
  groupCd: string;
  groupNm: string;
  groupDesc: string;
  useYn: 'Y' | 'N';
  codes: CodeRowValues[];
}
