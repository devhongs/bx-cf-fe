import type * as React from 'react';
import { type FieldPath, type FieldValues, useController } from 'react-hook-form';

import { Input, type InputProps } from '../ui/input/Input';
import { FormField } from './FormField';
import { type FieldRuleProps, buildFieldRules } from './rules';

export type FormInputProps<TValues extends FieldValues = FieldValues> = Omit<
  InputProps,
  'name' | 'defaultValue' | 'required' | 'minLength' | 'maxLength' | 'min' | 'max' | 'pattern'
> &
  FieldRuleProps<TValues> & {
    name: FieldPath<TValues>;
    label?: React.ReactNode;
    description?: React.ReactNode;
  };

export function FormInput<TValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required,
  minLength,
  maxLength,
  min,
  max,
  pattern,
  validate,
  deps,
  rules,
  onChange,
  onBlur,
  ...props
}: FormInputProps<TValues>) {
  const { field } = useController<TValues>({
    name,
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

  return (
    <FormField<TValues>
      name={name}
      label={label}
      description={description}
      required={Boolean(required)}
    >
      {(fieldProps) => (
        <Input
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
