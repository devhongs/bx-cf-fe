import { afterEach, describe, expect, it, vi } from 'vitest';

import { toast } from '../../ui/toast';

import { DEFAULT_SUCCESS_MESSAGE, handleMutationSuccess } from './handleMutationSuccess';

describe('handleMutationSuccess', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('meta.success가 없으면 조용하다 (기본 = 토스트 없음)', () => {
    const spy = vi.spyOn(toast, 'success').mockImplementation(() => '');

    handleMutationSuccess(undefined);

    expect(spy).not.toHaveBeenCalled();
  });

  it('meta.success === true 면 공통 문구로 토스트한다', () => {
    const spy = vi.spyOn(toast, 'success').mockImplementation(() => '');

    handleMutationSuccess(true);

    expect(spy).toHaveBeenCalledWith(DEFAULT_SUCCESS_MESSAGE);
  });

  it('meta.success 가 message 를 주면 문구를 오버라이드한다', () => {
    const spy = vi.spyOn(toast, 'success').mockImplementation(() => '');

    handleMutationSuccess({ message: '전송되었습니다.' });

    expect(spy).toHaveBeenCalledWith('전송되었습니다.');
  });

  it('빈 객체({})는 공통 문구를 쓴다', () => {
    const spy = vi.spyOn(toast, 'success').mockImplementation(() => '');

    handleMutationSuccess({});

    expect(spy).toHaveBeenCalledWith(DEFAULT_SUCCESS_MESSAGE);
  });
});
