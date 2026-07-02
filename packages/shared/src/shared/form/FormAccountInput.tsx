import { useController, type FieldValues } from 'react-hook-form';

import { Input, type InputProps } from '../ui/input/Input';
import { cn } from '../ui/lib/cn';
import { FormField } from './FormField';
import { useFormContextValue } from './form-context';
import type { FormFieldBaseProps, FormValues } from './form.types';
import { useFieldRegistration } from './useFieldRegistration';

export const normalizeAccountNo = (value: string) => value.replace(/[^0-9]/g, '');

export type FormAccountInputProps<TValues extends FieldValues> = Omit<
  InputProps,
  'name' | 'defaultValue' | 'disabled' | 'readOnly' | 'inputMode'
> &
  FormFieldBaseProps<TValues>;

export function FormAccountInput<TValues extends FieldValues>({
  name,
  label,
  description,
  rules,
  hidden,
  disabled,
  readOnly,
  clearOnHidden,
  includeHiddenValue,
  excludeDisabledValue,
  validateDisabled,
  required,
  className,
  onChange,
  onBlur,
  ...props
}: FormAccountInputProps<TValues>) {
  const { form, controlClassName } = useFormContextValue<TValues & FormValues>();
  const { field } = useController({
    name: name as any,
    control: form.control,
  });

  useFieldRegistration<TValues & FormValues>({
    name: name as any,
    rules: rules as any,
    hidden,
    disabled,
    readOnly,
    clearOnHidden,
    includeHiddenValue,
    excludeDisabledValue,
    validateDisabled,
  });

  return (
    <FormField<TValues>
      name={name}
      label={label}
      description={description}
      hidden={hidden}
      required={required ?? Boolean(rules?.required)}
    >
      {(fieldProps) => (
        <Input
          {...props}
          {...fieldProps}
          className={cn(controlClassName, className)}
          disabled={disabled}
          inputMode="numeric"
          name={field.name}
          readOnly={readOnly}
          ref={field.ref}
          value={field.value ?? ''}
          onBlur={(event) => {
            field.onBlur();
            onBlur?.(event);
          }}
          onChange={(event) => {
            const normalizedValue = normalizeAccountNo(event.target.value);
            field.onChange(normalizedValue);
            event.target.value = normalizedValue;
            onChange?.(event);
          }}
        />
      )}
    </FormField>
  );
}
