import type * as React from 'react';
import { type FieldPath, type FieldValues, useController } from 'react-hook-form';

import { Select, type SelectProps } from '../ui/select/Select';
import { FormField } from './FormField';

export type FormSelectProps<TValues extends FieldValues = FieldValues> = Omit<
  SelectProps,
  'name' | 'defaultValue' | 'value'
> & {
  name: FieldPath<TValues>;
  label?: React.ReactNode;
  description?: React.ReactNode;
};

export function FormSelect<TValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required,
  onChange,
  onBlur,
  ...props
}: FormSelectProps<TValues>) {
  const { field } = useController({ name });

  return (
    <FormField<TValues> name={name} label={label} description={description} required={required}>
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
