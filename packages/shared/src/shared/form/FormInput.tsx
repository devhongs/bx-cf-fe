import type * as React from 'react';
import { type FieldPath, type FieldValues, useController } from 'react-hook-form';

import { Input, type InputProps } from '../ui/input/Input';
import { FormField } from './FormField';

export type FormInputProps<TValues extends FieldValues = FieldValues> = Omit<
  InputProps,
  'name' | 'defaultValue'
> & {
  name: FieldPath<TValues>;
  label?: React.ReactNode;
  description?: React.ReactNode;
};

export function FormInput<TValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required,
  onChange,
  onBlur,
  ...props
}: FormInputProps<TValues>) {
  const { field } = useController({ name });

  return (
    <FormField<TValues> name={name} label={label} description={description} required={required}>
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
