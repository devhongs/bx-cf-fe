import type * as React from 'react';
import type {
  DefaultValues,
  FieldValues,
  Path,
  UseFormReturn,
} from 'react-hook-form';

export type FormValues = Record<string, any>;

export type FormValidateResult<TValues extends FormValues = FormValues> =
  | true
  | Partial<Record<Path<TValues>, string>>;

export type FieldValidate<TValues extends FormValues = FormValues> = (
  value: any,
  values: TValues,
) => true | string | Promise<true | string>;

export interface FormFieldRules<TValues extends FormValues = FormValues> {
  required?: boolean | string;
  email?: boolean | string;
  numeric?: boolean | string;
  number?: boolean | string;
  minLength?: number | { value: number; message?: string };
  maxLength?: number | { value: number; message?: string };
  min?: number | { value: number; message?: string };
  max?: number | { value: number; message?: string };
  pattern?: RegExp | { value: RegExp; message?: string };
  validate?: FieldValidate<TValues>;
}

export interface FormFieldConfig<TValues extends FormValues = FormValues> {
  name: Path<TValues>;
  rules?: FormFieldRules<TValues>;
  hidden?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  clearOnHidden?: boolean;
  includeHiddenValue?: boolean;
  excludeDisabledValue?: boolean;
  validateDisabled?: boolean;
}

export type FormValidate<TValues extends FormValues = FormValues> = (
  values: TValues,
) => FormValidateResult<TValues> | Promise<FormValidateResult<TValues>>;

export type FormTransform<TValues extends FormValues, TPayload> = (
  values: Partial<TValues>,
  originalValues: TValues,
) => TPayload;

export interface FormProps<TValues extends FormValues, TPayload = Partial<TValues>>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  defaultValues: DefaultValues<TValues>;
  validate?: FormValidate<TValues>;
  transform?: FormTransform<TValues, TPayload>;
  onSubmit: (payload: TPayload, values: TValues) => void | Promise<void>;
  errorDisplay?: 'inline' | 'summary' | 'modal' | 'none';
  controlClassName?: string;
}

export interface FormContextValue<TValues extends FormValues = FormValues> {
  form: UseFormReturn<TValues>;
  controlClassName?: string;
  registerField: (config: FormFieldConfig<TValues>) => void;
  unregisterField: (name: Path<TValues>) => void;
  getFieldConfig: (name: Path<TValues>) => FormFieldConfig<TValues> | undefined;
}

export interface FormFieldBaseProps<TValues extends FieldValues = FieldValues> {
  name: Path<TValues>;
  label?: React.ReactNode;
  description?: React.ReactNode;
  rules?: FormFieldRules<TValues & FormValues>;
  hidden?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  clearOnHidden?: boolean;
  includeHiddenValue?: boolean;
  excludeDisabledValue?: boolean;
  validateDisabled?: boolean;
  required?: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}
