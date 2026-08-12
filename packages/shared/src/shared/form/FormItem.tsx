import * as React from 'react';
import {
  type Control,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
  useController,
} from 'react-hook-form';

import { cn } from '../lib/utils/cn';
import styles from './FormItem.module.css';
import { useFormFieldStyle } from './form-style-context';
import { buildFieldRules, type FieldRuleProps } from './rules';

export type FormItemControl<TValues extends FieldValues> = ControllerRenderProps<
  TValues,
  FieldPath<TValues>
> & {
  id: string;
  'aria-invalid': boolean;
  'aria-describedby'?: string;
};

export interface FormItemProps<TValues extends FieldValues> extends FieldRuleProps<TValues> {
  name: FieldPath<TValues>;
  control?: Control<TValues>;
  label?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  children: (control: FormItemControl<TValues>) => React.ReactNode;
}

export function FormItem<TValues extends FieldValues>({
  name,
  control,
  label,
  description,
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
  required,
  minLength,
  maxLength,
  min,
  max,
  pattern,
  validate,
  deps,
  rules,
  children,
}: FormItemProps<TValues>) {
  const style = useFormFieldStyle();
  const id = React.useId();
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;
  const { field, fieldState } = useController<TValues>({
    name,
    control,
    rules: buildFieldRules({
      required,
      minLength,
      maxLength,
      min,
      max,
      pattern,
      validate,
      deps,
      rules,
    }),
  });
  const message = typeof fieldState.error?.message === 'string' ? fieldState.error.message : '';
  const describedBy =
    [description ? descriptionId : '', message ? errorId : ''].filter(Boolean).join(' ') ||
    undefined;

  return (
    <div className={cn(styles.item, className ?? style.fieldClassName)}>
      {label && (
        <label className={cn(styles.label, labelClassName ?? style.labelClassName)} htmlFor={id}>
          {label}
          {required && (
            <span aria-hidden="true" className={styles.required}>
              *
            </span>
          )}
        </label>
      )}
      {children({
        ...field,
        id,
        'aria-invalid': Boolean(message),
        'aria-describedby': describedBy,
      })}
      {description && (
        <p
          className={cn(styles.description, descriptionClassName ?? style.descriptionClassName)}
          id={descriptionId}
        >
          {description}
        </p>
      )}
      {message && (
        <p className={cn(styles.error, errorClassName ?? style.errorClassName)} id={errorId}>
          {message}
        </p>
      )}
    </div>
  );
}
