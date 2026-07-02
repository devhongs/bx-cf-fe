import { useController, type FieldValues } from 'react-hook-form';

import { cn } from '../ui/lib/cn';
import { Select, type SelectProps } from '../ui/select/Select';
import { FormField } from './FormField';
import { useFormContextValue } from './form-context';
import type { FormFieldBaseProps, FormValues } from './form.types';
import { useFieldRegistration } from './useFieldRegistration';

export type FormSelectProps<TValues extends FieldValues> = Omit<
  SelectProps,
  'name' | 'defaultValue' | 'disabled' | 'value'
> &
  FormFieldBaseProps<TValues>;

export function FormSelect<TValues extends FieldValues>({
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
}: FormSelectProps<TValues>) {
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
        <Select
          {...props}
          {...fieldProps}
          className={cn(controlClassName, className)}
          disabled={disabled}
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
