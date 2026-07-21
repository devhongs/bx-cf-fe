import * as React from 'react';

import { $codeUtils } from '../../lib/utils/common.code';
import { cn } from '../lib/cn';

/** `emptyOption`을 켜기만 했을 때 쓰이는 기본값. 사이트별로 다르면 여기만 고친다. */
export const SELECT_EMPTY_OPTION_VALUE = '';
export const SELECT_EMPTY_OPTION_LABEL = '전체';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** 정적 옵션. `groupCd`와 함께 주면 이쪽이 우선한다. */
  options?: Array<SelectOption>;
  /**
   * 공통코드 그룹 코드. 부트스트랩이 세션에 적재한 코드맵에서 옵션을 채운다.
   * 세션에 코드가 없으면(부트스트랩 실패 등) 빈 목록이 되고, 세션을 구독하지 않으므로
   * 이후 채워져도 다시 그리지 않는다. README "기준정보 부트스트랩 > 실패 시 동작" 참고.
   */
  groupCd?: string;
  /**
   * 입력 폼의 "선택". `required`면 고른 뒤 되돌아갈 수 없도록 disabled로 렌더한다.
   * (필수가 아니면 다시 고를 수 있어야 하므로 disabled를 붙이지 않는다.)
   */
  placeholder?: string;
  /**
   * 조회 조건의 "전체". placeholder와 달리 선택 가능한 실제 값이다.
   * `true`면 기본값(`''` / `'전체'`)을 쓰고, 객체로 value·label을 덮어쓸 수 있다.
   */
  emptyOption?: boolean | { value?: string; label?: string };
}

const codeOptions = (groupCd: string): Array<SelectOption> =>
  $codeUtils.getCodes(groupCd).map((item) => ({
    value: item.codeField,
    label: item.label ?? item.labelField,
  }));

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, groupCd, placeholder, emptyOption, required, ...props }, ref) => {
    const resolvedOptions = options ?? (groupCd ? codeOptions(groupCd) : []);
    const empty = emptyOption ? (emptyOption === true ? {} : emptyOption) : undefined;

    return (
      <div className="relative w-full">
        <select
          className={cn(
            'flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-8 cursor-pointer text-foreground',
            className,
          )}
          ref={ref}
          required={required}
          {...props}
        >
          {placeholder && (
            <option value="" disabled={Boolean(required)}>
              {placeholder}
            </option>
          )}
          {empty && (
            <option value={empty.value ?? SELECT_EMPTY_OPTION_VALUE}>
              {empty.label ?? SELECT_EMPTY_OPTION_LABEL}
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
