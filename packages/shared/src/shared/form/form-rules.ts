import { toNestErrors } from '@hookform/resolvers';
import { get, set } from 'lodash-es';
import type { Resolver, ResolverResult } from 'react-hook-form';
import { z } from 'zod';

import type {
  FormFieldConfig,
  FormFieldRules,
  FormTransform,
  FormValidate,
  FormValues,
} from './form.types';

const REQUIRED_MESSAGE = '필수 입력 항목입니다.';
const EMAIL_MESSAGE = '올바른 이메일 형식으로 입력해주세요.';
const NUMERIC_MESSAGE = '숫자만 입력해주세요.';
const NUMBER_MESSAGE = '숫자를 입력해주세요.';

type ErrorMap = Record<string, string>;

const isEmptyValue = (value: unknown) =>
  value === undefined || value === null || (typeof value === 'string' && value.trim() === '');

const getRuleValue = <TValue>(
  rule: TValue | { value: TValue; message?: string } | undefined,
): TValue | undefined =>
  rule && typeof rule === 'object' && 'value' in rule ? rule.value : rule;

const getRuleMessage = <TValue>(
  rule: TValue | { value: TValue; message?: string } | undefined,
  fallback: string,
): string => (rule && typeof rule === 'object' && 'message' in rule && rule.message) || fallback;

const getBooleanRuleMessage = (rule: boolean | string | undefined, fallback: string) =>
  typeof rule === 'string' ? rule : fallback;

const shouldValidateField = <TValues extends FormValues>(config: FormFieldConfig<TValues>) => {
  if (config.hidden) return false;
  if (!config.disabled) return true;
  return Boolean(config.validateDisabled || config.rules?.required);
};

const shouldValidateRule = <TValues extends FormValues>(
  config: FormFieldConfig<TValues>,
  ruleName: keyof FormFieldRules,
) => {
  if (!config.disabled || config.validateDisabled) return true;
  return ruleName === 'required';
};

const addIssue = (ctx: z.RefinementCtx, message: string) => {
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message,
  });
};

const validateFieldValue = async <TValues extends FormValues>(
  value: unknown,
  values: TValues,
  config: FormFieldConfig<TValues>,
): Promise<string | null> => {
  if (!shouldValidateField(config)) return null;

  const rules = config.rules ?? {};
  const schema = z.any().superRefine((fieldValue, ctx) => {
    if (shouldValidateRule(config, 'required') && rules.required && isEmptyValue(fieldValue)) {
      addIssue(ctx, getBooleanRuleMessage(rules.required, REQUIRED_MESSAGE));
      return;
    }

    if (isEmptyValue(fieldValue)) return;

    const textValue = String(fieldValue);

    if (shouldValidateRule(config, 'email') && rules.email) {
      const emailResult = z.email().safeParse(textValue);
      if (!emailResult.success) {
        addIssue(ctx, getBooleanRuleMessage(rules.email, EMAIL_MESSAGE));
        return;
      }
    }

    if (shouldValidateRule(config, 'numeric') && rules.numeric && !/^[0-9]+$/.test(textValue)) {
      addIssue(ctx, getBooleanRuleMessage(rules.numeric, NUMERIC_MESSAGE));
      return;
    }

    if (shouldValidateRule(config, 'number') && rules.number && Number.isNaN(Number(fieldValue))) {
      addIssue(ctx, getBooleanRuleMessage(rules.number, NUMBER_MESSAGE));
      return;
    }

    const minLength = getRuleValue(rules.minLength);
    if (
      shouldValidateRule(config, 'minLength') &&
      minLength !== undefined &&
      textValue.length < minLength
    ) {
      addIssue(ctx, getRuleMessage(rules.minLength, `${minLength}자 이상 입력해주세요.`));
      return;
    }

    const maxLength = getRuleValue(rules.maxLength);
    if (
      shouldValidateRule(config, 'maxLength') &&
      maxLength !== undefined &&
      textValue.length > maxLength
    ) {
      addIssue(ctx, getRuleMessage(rules.maxLength, `${maxLength}자 이하로 입력해주세요.`));
      return;
    }

    const numberValue = Number(fieldValue);
    const min = getRuleValue(rules.min);
    if (
      shouldValidateRule(config, 'min') &&
      min !== undefined &&
      !Number.isNaN(numberValue) &&
      numberValue < min
    ) {
      addIssue(ctx, getRuleMessage(rules.min, `${min} 이상 입력해주세요.`));
      return;
    }

    const max = getRuleValue(rules.max);
    if (
      shouldValidateRule(config, 'max') &&
      max !== undefined &&
      !Number.isNaN(numberValue) &&
      numberValue > max
    ) {
      addIssue(ctx, getRuleMessage(rules.max, `${max} 이하로 입력해주세요.`));
      return;
    }

    const pattern = getRuleValue(rules.pattern);
    if (shouldValidateRule(config, 'pattern') && pattern && !pattern.test(textValue)) {
      addIssue(ctx, getRuleMessage(rules.pattern, '형식에 맞게 입력해주세요.'));
    }
  });

  const result = schema.safeParse(value);
  if (!result.success) return result.error.issues[0]?.message ?? null;

  if (shouldValidateRule(config, 'validate') && rules.validate) {
    const customResult = await rules.validate(value, values);
    if (customResult !== true) return customResult;
  }

  return null;
};

export const validateFormValues = async <TValues extends FormValues>(
  values: TValues,
  fields: Array<FormFieldConfig<TValues>>,
  validate?: FormValidate<TValues>,
) => {
  const errors: ErrorMap = {};

  for (const field of fields) {
    const message = await validateFieldValue(get(values, field.name), values, field);
    if (message) {
      errors[field.name] = message;
    }
  }

  const formResult = validate ? await validate(values) : true;
  if (formResult !== true) {
    for (const [name, message] of Object.entries(formResult as Record<string, string | undefined>)) {
      if (typeof message === 'string' && message && !errors[name]) {
        errors[name] = message;
      }
    }
  }

  return {
    success: Object.keys(errors).length === 0,
    errors,
  };
};

export const buildSubmitPayload = <TValues extends FormValues, TPayload = Partial<TValues>>(
  values: TValues,
  fields: Array<FormFieldConfig<TValues>>,
  transform?: FormTransform<TValues, TPayload>,
): TPayload | Partial<TValues> => {
  const payload: Partial<TValues> = {};

  for (const field of fields) {
    if (field.hidden && !field.includeHiddenValue) continue;
    if (field.disabled && field.excludeDisabledValue) continue;

    set(payload, field.name, get(values, field.name));
  }

  return transform ? transform(payload, values) : payload;
};

export const createFormResolver =
  <TValues extends FormValues>(
    getFields: () => Array<FormFieldConfig<TValues>>,
    validate?: FormValidate<TValues>,
  ): Resolver<TValues> =>
  async (values, _context, options): Promise<ResolverResult<TValues>> => {
    const result = await validateFormValues(values as TValues, getFields(), validate);

    if (result.success) {
      return {
        values,
        errors: {},
      };
    }

    const flatErrors = Object.entries(result.errors).reduce<Record<string, any>>(
      (acc, [name, message]) => {
        acc[name] = {
          type: 'custom',
          message,
        };
        return acc;
      },
      {},
    );

    return {
      values: {},
      errors: toNestErrors(flatErrors, options),
    };
  };
