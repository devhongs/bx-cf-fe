// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';

import { CONFIG } from '../../constants/siteConfig';

import { $codeUtils } from './common.code';
import { session } from './storage-util';

afterEach(() => {
  session.remove(CONFIG.SESSION.CODE);
});

describe('code utils > local code fallback', () => {
  it('서버 코드 그룹이 없으면 로컬 코드 그룹을 반환한다', () => {
    expect($codeUtils.getCodes('USE_YN')).toEqual([
      { codeField: 'Y', labelField: '사용' },
      { codeField: 'N', labelField: '미사용' },
    ]);
  });

  it('서버 코드 그룹이 빈 배열로 존재하면 로컬 코드로 대체하지 않는다', () => {
    session.set(CONFIG.SESSION.CODE, { USE_YN: [] });

    expect($codeUtils.getCodes('USE_YN')).toEqual([]);
  });

  it('이전 대상 로컬 코드 그룹을 모두 제공한다', () => {
    const groupCds = [
      'ACCOUNT_TYPE',
      'BANK',
      'DATE_RANGE',
      'MENU_TYPE',
      'SIGNUP_USER_TYPE',
      'USER_STATUS',
      'USER_TYPE',
      'USE_YN',
      'VISIBLE_YN',
    ];

    expect(groupCds.filter((groupCd) => $codeUtils.getCodes(groupCd).length > 0)).toEqual(groupCds);
  });
});
