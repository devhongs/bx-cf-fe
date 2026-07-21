// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { CONFIG } from '../../constants/siteConfig';
import { session } from '../../lib/utils/storage-util';

import { SELECT_EMPTY_OPTION_LABEL, SELECT_EMPTY_OPTION_VALUE, Select } from './Select';

const options = [
  { value: 'Y', label: '사용' },
  { value: 'N', label: '미사용' },
];

const getOption = (label: string) =>
  screen.getByRole('option', { name: label }) as HTMLOptionElement;

afterEach(() => {
  cleanup();
  session.remove(CONFIG.SESSION.CODE);
});

describe('Select > placeholder', () => {
  it('required면 되돌아갈 수 없도록 disabled로 렌더된다', () => {
    render(<Select options={options} placeholder="선택" required />);

    const placeholder = getOption('선택');
    expect(placeholder.disabled).toBe(true);
    expect(placeholder.value).toBe('');
  });

  it('required가 아니면 다시 고를 수 있도록 disabled를 붙이지 않는다', () => {
    render(<Select options={options} placeholder="선택 안 함" />);

    expect(getOption('선택 안 함').disabled).toBe(false);
  });
});

describe('Select > emptyOption', () => {
  it('true면 기본값으로 선택 가능한 항목이 렌더된다', () => {
    render(<Select options={options} emptyOption />);

    const empty = getOption(SELECT_EMPTY_OPTION_LABEL);
    expect(empty.disabled).toBe(false);
    expect(empty.value).toBe(SELECT_EMPTY_OPTION_VALUE);
  });

  it('value와 label을 각각 덮어쓸 수 있다', () => {
    const { rerender } = render(<Select options={options} emptyOption={{ value: 'ALL' }} />);
    expect(getOption(SELECT_EMPTY_OPTION_LABEL).value).toBe('ALL');

    rerender(<Select options={options} emptyOption={{ label: '전체 지점' }} />);
    expect(getOption('전체 지점').value).toBe(SELECT_EMPTY_OPTION_VALUE);
  });

  it('없으면 전체 항목을 렌더하지 않는다', () => {
    render(<Select options={options} />);

    expect(screen.queryByRole('option', { name: SELECT_EMPTY_OPTION_LABEL })).toBeNull();
    expect(screen.getAllByRole('option')).toHaveLength(options.length);
  });
});

describe('Select > groupCd', () => {
  const setCodes = () =>
    session.set(CONFIG.SESSION.CODE, {
      USE_YN: [
        { codeField: 'Y', labelField: '사용', label: '사용' },
        { codeField: 'N', labelField: '미사용', label: '미사용' },
      ],
    });

  it('세션의 코드 그룹을 options로 렌더한다', () => {
    setCodes();
    render(<Select groupCd="USE_YN" />);

    expect(getOption('사용').value).toBe('Y');
    expect(getOption('미사용').value).toBe('N');
  });

  it('emptyOption과 함께 쓸 수 있다', () => {
    setCodes();
    render(<Select groupCd="USE_YN" emptyOption />);

    expect(getOption(SELECT_EMPTY_OPTION_LABEL).value).toBe(SELECT_EMPTY_OPTION_VALUE);
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('options를 함께 주면 options가 우선한다', () => {
    setCodes();
    render(<Select groupCd="USE_YN" options={[{ value: 'X', label: '직접' }]} />);

    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(getOption('직접').value).toBe('X');
  });

  it('세션에 없는 그룹이면 빈 목록이 된다', () => {
    render(<Select groupCd="UNKNOWN" />);

    expect(screen.queryAllByRole('option')).toHaveLength(0);
  });
});
