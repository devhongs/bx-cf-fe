import type * as React from 'react';
import { type FieldPath, type FieldValues, useController } from 'react-hook-form';

import { Textarea, type TextareaProps } from '../ui/textarea/Textarea';
import { FormField } from './FormField';
import { type FieldRuleProps, buildFieldRules } from './rules';

export type FormTextareaProps<TValues extends FieldValues = FieldValues> = Omit<
  TextareaProps,
  'name' | 'defaultValue' | 'required' | 'minLength' | 'maxLength'
> &
  FieldRuleProps<TValues> & {
    name: FieldPath<TValues>;
    label?: React.ReactNode;
    description?: React.ReactNode;
    fieldClassName?: string;
    labelClassName?: string;
    descriptionClassName?: string;
    errorClassName?: string;
  };

export function FormTextarea<TValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  fieldClassName,
  labelClassName,
  descriptionClassName,
  errorClassName,
  required,
  minLength,
  maxLength,
  validate,
  deps,
  rules,
  onChange,
  onBlur,
  ...props
}: FormTextareaProps<TValues>) {
  const { field } = useController<TValues>({
    name,
    rules: buildFieldRules({
      required,
      minLength,
      maxLength,
      validate,
      deps,
      rules,
    }),
  });

  return (
    <FormField<TValues>
      name={name}
      label={label}
      description={description}
      required={Boolean(required)}
      className={fieldClassName}
      labelClassName={labelClassName}
      descriptionClassName={descriptionClassName}
      errorClassName={errorClassName}
    >
      {(fieldProps) => (
        <Textarea
          {...props}
          {...fieldProps}
          name={field.name}
          ref={field.ref}
          value={field.value ?? ''}
          onBlur={(event) => {
            field.onBlur();
            onBlur?.(event);
          }}
          onChange={(event) => {
            field.onChange(event);
            onChange?.(event);
          }}
        />
      )}
    </FormField>
  );
}
