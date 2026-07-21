// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { openAlert, openConfirm, useAlertStore } from '../../model/alert/alert.store';

import { AlertHost } from './AlertHost';

beforeEach(() => {
  useAlertStore.setState({ queue: [] });
});

afterEach(cleanup);

const clickButton = (name: string) => fireEvent.click(screen.getByRole('button', { name }));

/** 스토어를 React 밖에서 건드리므로 렌더 반영을 act로 감싼다. */
const open = <T,>(fn: () => Promise<T>): Promise<T> => {
  let result!: Promise<T>;
  act(() => {
    result = fn();
  });
  return result;
};

describe('AlertHost', () => {
  it('큐가 비어 있으면 아무것도 렌더하지 않는다', () => {
    render(<AlertHost />);

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('알럿은 확인 버튼만 보여준다', () => {
    render(<AlertHost />);
    open(() => openAlert({ message: '저장했습니다.' }));

    expect(screen.getByText('저장했습니다.')).toBeTruthy();
    expect(screen.getByRole('button', { name: '확인' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: '취소' })).toBeNull();
  });

  it('confirm은 취소 버튼이 함께 보이고 확인 시 true로 resolve된다', async () => {
    render(<AlertHost />);
    const confirmed = open(() => openConfirm({ message: '삭제할까요?' }));

    clickButton('확인');

    await expect(confirmed).resolves.toBe(true);
  });

  it('취소를 누르면 false로 resolve된다', async () => {
    render(<AlertHost />);
    const confirmed = open(() => openConfirm({ message: '삭제할까요?' }));

    clickButton('취소');

    await expect(confirmed).resolves.toBe(false);
  });

  it('버튼 문구를 지정할 수 있다', () => {
    render(<AlertHost />);
    open(() => openConfirm({ message: '삭제할까요?', confirmText: '삭제', cancelText: '유지' }));

    expect(screen.getByRole('button', { name: '삭제' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '유지' })).toBeTruthy();
  });

  it('앞의 알럿을 닫으면 다음 알럿이 이어서 뜬다', () => {
    render(<AlertHost />);
    open(() => openAlert({ message: '첫 번째' }));
    open(() => openAlert({ message: '두 번째' }));

    clickButton('확인');

    expect(screen.getByText('두 번째')).toBeTruthy();
  });
});
