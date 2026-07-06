import type { FieldPath, FieldValues, RegisterOptions, Validate } from 'react-hook-form';

import { VALIDATION_MESSAGES } from './messages';

type RuleWithMessage<TValue> = TValue | { value: TValue; message: string };

/**
 * useController가 받는 rules 타입 그대로. valueAs*·disabled는 controlled 컴포넌트에
 * 적용되지 않으므로 RHF와 동일하게 제외한다.
 */
export type FieldRules<TValues extends FieldValues = FieldValues> = Omit<
  RegisterOptions<TValues, FieldPath<TValues>>,
  'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
>;

export interface FieldRuleProps<TValues extends FieldValues = FieldValues> {
  /** true면 기본 메시지, 문자열이면 해당 문구를 에러 메시지로 사용 */
  required?: boolean | string;
  minLength?: RuleWithMessage<number>;
  maxLength?: RuleWithMessage<number>;
  min?: RuleWithMessage<number>;
  max?: RuleWithMessage<number>;
  pattern?: RuleWithMessage<RegExp>;
  validate?: Validate<any, TValues> | Record<string, Validate<any, TValues>>;
  /** 이 필드 값이 바뀔 때 지정한 필드들을 재검증 (cross-field 검증용, RHF deps 그대로) */
  deps?: FieldPath<TValues> | Array<FieldPath<TValues>>;
  /** RHF rules를 직접 넘기는 escape hatch. 위 편의 prop보다 우선한다. */
  rules?: FieldRules<TValues>;
}

const withMessage = <TValue>(
  rule: RuleWithMessage<TValue> | undefined,
  buildMessage: (value: TValue) => string,
) => {
  if (rule === undefined) return undefined;
  if (typeof rule === 'object' && rule !== null && 'value' in rule) return rule;
  return { value: rule, message: buildMessage(rule) };
};

/** 편의 prop을 RHF RegisterOptions로 변환한다. 검증 실행은 전부 RHF가 담당한다. */
export const buildFieldRules = <TValues extends FieldValues>({
  required,
  minLength,
  maxLength,
  min,
  max,
  pattern,
  validate,
  deps,
  rules,
}: FieldRuleProps<TValues>): FieldRules<TValues> => ({
  ...(required ? { required: required === true ? VALIDATION_MESSAGES.required : required } : {}),
  ...(minLength !== undefined
    ? { minLength: withMessage(minLength, VALIDATION_MESSAGES.minLength) }
    : {}),
  ...(maxLength !== undefined
    ? { maxLength: withMessage(maxLength, VALIDATION_MESSAGES.maxLength) }
    : {}),
  ...(min !== undefined ? { min: withMessage(min, VALIDATION_MESSAGES.min) } : {}),
  ...(max !== undefined ? { max: withMessage(max, VALIDATION_MESSAGES.max) } : {}),
  ...(pattern !== undefined
    ? { pattern: withMessage(pattern, () => VALIDATION_MESSAGES.pattern) }
    : {}),
  ...(validate ? { validate } : {}),
  ...(deps ? { deps } : {}),
  ...rules,
});

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 공용 validate 함수 모음. 빈 값은 통과시킨다 — 필수 여부는 required가 담당. */
export const validators = {
  email: (value: unknown) =>
    value === undefined ||
    value === null ||
    value === '' ||
    EMAIL_PATTERN.test(String(value)) ||
    VALIDATION_MESSAGES.email,
};
