// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { CONFIG } from '../../constants/siteConfig';
import { session } from '../../lib/utils/storage-util';

import { Select } from './Select';

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

describe('Select > emptyOption', () => {
  it('설정을 생략하면 ALL 프리셋을 사용한다', () => {
    render(<Select options={options} />);

    expect(getOption('전체').value).toBe('');
  });

  it('SELECT 프리셋은 required와 관계없이 선택 가능한 빈 값을 렌더한다', () => {
    render(<Select options={options} emptyOption="SELECT" required />);

    const selectOption = getOption('선택');
    expect(selectOption.value).toBe('');
    expect(selectOption.disabled).toBe(false);
  });

  it('NONE 프리셋은 empty option을 렌더하지 않는다', () => {
    render(<Select options={options} emptyOption="NONE" />);

    expect(screen.queryByRole('option', { name: '전체' })).toBeNull();
    expect(screen.getAllByRole('option')).toHaveLength(options.length);
  });

  it('화면에서 지정한 value와 label을 사용한다', () => {
    render(<Select options={options} emptyOption={{ value: 'ALL_BRANCH', label: '전체 지점' }} />);

    expect(getOption('전체 지점').value).toBe('ALL_BRANCH');
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

  it('세션에 그룹이 없으면 로컬 코드 그룹을 options로 렌더한다', () => {
    render(<Select groupCd="SIGNUP_USER_TYPE" />);

    expect(getOption('개인').value).toBe('personal');
    expect(getOption('사업자').value).toBe('business');
  });

  it('emptyOption과 함께 쓸 수 있다', () => {
    setCodes();
    render(<Select groupCd="USE_YN" />);

    expect(getOption('전체').value).toBe('');
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('options를 함께 주면 options가 우선한다', () => {
    setCodes();
    render(
      <Select groupCd="USE_YN" options={[{ value: 'X', label: '직접' }]} emptyOption="NONE" />,
    );

    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(getOption('직접').value).toBe('X');
  });

  it('세션에 없는 그룹이면 빈 목록이 된다', () => {
    render(<Select groupCd="UNKNOWN" emptyOption="NONE" />);

    expect(screen.queryAllByRole('option')).toHaveLength(0);
  });
});

describe('Select > container', () => {
  it('컨테이너 className을 전달할 수 있다', () => {
    render(<Select options={options} emptyOption="NONE" containerClassName="w-auto" />);

    expect(screen.getByRole('combobox').parentElement?.className).toContain('w-auto');
  });
});
