import * as React from 'react';

import type { CodeGroupCd } from '../../constants/local-codes';
import { $codeUtils } from '../../lib/utils/common.code';
import { cn } from '../lib/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export const SELECT_EMPTY_OPTION_PRESETS = {
  ALL: { value: '', label: '전체' },
  SELECT: { value: '', label: '선택' },
} as const satisfies Record<'ALL' | 'SELECT', SelectOption>;

export type SelectEmptyOption = keyof typeof SELECT_EMPTY_OPTION_PRESETS | 'NONE' | SelectOption;

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** select 바깥 컨테이너의 크기나 배치를 조정할 때 사용한다. */
  containerClassName?: string;
  /** 정적 옵션. `groupCd`와 함께 주면 이쪽이 우선한다. */
  options?: Array<SelectOption>;
  /**
   * 공통코드 그룹 코드. 세션의 서버 코드가 우선이며 그룹이 없으면 로컬 코드로 대체한다.
   * 서버 그룹이 빈 배열로 존재하면 서버 데이터를 그대로 사용한다.
   *
   * `LOCAL_CODE_MAP`에 있는 그룹은 자동완성되고, 서버에만 있는 그룹도 그대로 쓸 수 있다.
   */
  groupCd?: CodeGroupCd;
  /**
   * 첫 번째 보조 option. 기본값은 `ALL`이며 `SELECT`, `NONE` 또는 사용자 정의 option을 받는다.
   */
  emptyOption?: SelectEmptyOption;
}

const codeOptions = (groupCd: string): Array<SelectOption> =>
  $codeUtils.getCodes(groupCd).map((item) => ({
    value: item.codeField,
    label: item.label ?? item.labelField,
  }));

const resolveEmptyOption = (emptyOption: SelectEmptyOption): SelectOption | undefined => {
  if (emptyOption === 'NONE') return undefined;
  if (typeof emptyOption === 'string') return SELECT_EMPTY_OPTION_PRESETS[emptyOption];
  return emptyOption;
};

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, containerClassName, options, groupCd, emptyOption = 'ALL', required, ...props },
    ref,
  ) => {
    const resolvedOptions = options ?? (groupCd ? codeOptions(groupCd) : []);
    const empty = resolveEmptyOption(emptyOption);

    return (
      <div className={cn('relative w-full', containerClassName)}>
        <select
          className={cn(
            'flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-8 cursor-pointer text-foreground',
            className,
          )}
          ref={ref}
          required={required}
          {...props}
        >
          {empty && (
            <option value={empty.value} disabled={empty.disabled}>
              {empty.label}
            </option>
          )}
          {resolvedOptions.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-faint">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    );
  },
);
Select.displayName = 'Select';

export { Select };
