// @vitest-environment jsdom

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useAppForm } from './useAppForm';

interface Values {
  name: string;
}

const defaultValues: Values = { name: '' };

describe('useAppForm', () => {
  it('드로어를 닫았다 다시 열면 직전 입력을 버리고 초기값으로 되돌린다', () => {
    const { result, rerender } = renderHook(
      ({ open }: { open: boolean }) => useAppForm<Values>({ open, defaultValues }),
      { initialProps: { open: true } },
    );

    act(() => {
      result.current.form.setValue('name', '입력값');
    });
    expect(result.current.form.getValues('name')).toBe('입력값');

    rerender({ open: false });
    rerender({ open: true });

    expect(result.current.form.getValues('name')).toBe('');
  });

  it('열려 있는 동안에는 리렌더가 나도 입력을 유지한다', () => {
    const { result, rerender } = renderHook(
      ({ open }: { open: boolean }) => useAppForm<Values>({ open, defaultValues }),
      { initialProps: { open: true } },
    );

    act(() => {
      result.current.form.setValue('name', '입력값');
    });

    rerender({ open: true });

    expect(result.current.form.getValues('name')).toBe('입력값');
  });

  it('open을 넘기지 않으면 리셋 동작에 관여하지 않는다', () => {
    const { result, rerender } = renderHook(() => useAppForm<Values>({ defaultValues }));

    act(() => {
      result.current.form.setValue('name', '입력값');
    });

    rerender();

    expect(result.current.form.getValues('name')).toBe('입력값');
  });
});
