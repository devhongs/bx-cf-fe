import { useController, type FieldValues } from 'react-hook-form';

import { Input, type InputProps } from '../ui/input/Input';
import { cn } from '../ui/lib/cn';
import { FormField } from './FormField';
import { useFormContextValue } from './form-context';
import type { FormFieldBaseProps, FormValues } from './form.types';
import { useFieldRegistration } from './useFieldRegistration';

export type FormInputProps<TValues extends FieldValues> = Omit<
  InputProps,
  'name' | 'defaultValue' | 'disabled' | 'readOnly'
> &
  FormFieldBaseProps<TValues>;

export function FormInput<TValues extends FieldValues>({
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
}: FormInputProps<TValues>) {
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
          name={field.name}
          readOnly={readOnly}
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
