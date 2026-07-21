import { beforeEach, describe, expect, it } from 'vitest';

import { openAlert, openConfirm, useAlertStore } from './alert.store';

beforeEach(() => {
  useAlertStore.setState({ queue: [] });
});

const current = () => useAlertStore.getState().queue[0];

describe('alert.store', () => {
  it('여러 번 열면 큐에 쌓이고 앞에서부터 닫힌다', async () => {
    const first = openAlert({ message: '첫 번째' });
    openAlert({ message: '두 번째' });

    expect(useAlertStore.getState().queue.map((entry) => entry.message)).toEqual([
      '첫 번째',
      '두 번째',
    ]);

    useAlertStore.getState().close();
    await first;

    expect(current().message).toBe('두 번째');
  });

  it('빈 큐에서 close해도 아무 일도 일어나지 않는다', () => {
    expect(() => useAlertStore.getState().close()).not.toThrow();
    expect(useAlertStore.getState().queue).toHaveLength(0);
  });
});

describe('openConfirm', () => {
  it('취소 버튼을 위해 cancelText가 기본으로 붙는다', () => {
    openConfirm({ message: '삭제할까요?' });

    expect(current().cancelText).toBe('취소');
  });

  it('cancelText를 직접 지정하면 기본값을 덮어쓴다', () => {
    openConfirm({ message: '삭제할까요?', cancelText: '아니오' });

    expect(current().cancelText).toBe('아니오');
  });

  it('close(true)면 true로 resolve된다', async () => {
    const confirmed = openConfirm({ message: '삭제할까요?' });

    useAlertStore.getState().close(true);

    await expect(confirmed).resolves.toBe(true);
  });

  it('인자 없이 close하면 취소로 본다 (ESC·오버레이 클릭 경로)', async () => {
    const confirmed = openConfirm({ message: '삭제할까요?' });

    useAlertStore.getState().close();

    await expect(confirmed).resolves.toBe(false);
  });
});

describe('openAlert', () => {
  it('cancelText 없이 열려서 확인만 있는 알럿이 된다', () => {
    openAlert({ message: '저장했습니다.' });

    expect(current().cancelText).toBeUndefined();
  });
});
