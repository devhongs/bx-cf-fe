import type * as React from 'react';
import { type FieldPath, type FieldValues, useController } from 'react-hook-form';

import { Select, type SelectProps } from '../ui/select/Select';
import { FormField } from './FormField';
import { type FieldRuleProps, buildFieldRules } from './rules';

export type FormSelectProps<TValues extends FieldValues = FieldValues> = Omit<
  SelectProps,
  'name' | 'defaultValue' | 'value' | 'required'
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

export function FormSelect<TValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  fieldClassName,
  labelClassName,
  descriptionClassName,
  errorClassName,
  required,
  validate,
  deps,
  rules,
  onChange,
  onBlur,
  ...props
}: FormSelectProps<TValues>) {
  const { field } = useController<TValues>({
    name,
    rules: buildFieldRules({ required, validate, deps, rules }),
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
        <Select
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
