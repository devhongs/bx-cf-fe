import { type FieldPath, type FieldValues, useController } from 'react-hook-form';

import { Input } from '../ui/input/Input';
import { FormField } from './FormField';
import type { FormInputProps } from './FormInput';

export const normalizeAccountNo = (value: string) => value.replace(/[^0-9]/g, '');

export type FormAccountInputProps<TValues extends FieldValues = FieldValues> = Omit<
  FormInputProps<TValues>,
  'inputMode' | 'type'
> & {
  name: FieldPath<TValues>;
};

export function FormAccountInput<TValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required,
  onChange,
  onBlur,
  ...props
}: FormAccountInputProps<TValues>) {
  const { field } = useController({ name });

  return (
    <FormField<TValues> name={name} label={label} description={description} required={required}>
      {(fieldProps) => (
        <Input
          {...props}
          {...fieldProps}
          inputMode="numeric"
          name={field.name}
          ref={field.ref}
          value={field.value ?? ''}
          onBlur={(event) => {
            field.onBlur();
            onBlur?.(event);
          }}
          onChange={(event) => {
            field.onChange(normalizeAccountNo(event.target.value));
            onChange?.(event);
          }}
        />
      )}
    </FormField>
  );
}
