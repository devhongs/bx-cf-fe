import { type FieldPath, type FieldValues, useController } from 'react-hook-form';

import { Input } from '../ui/input/Input';
import { FormField } from './FormField';
import type { FormInputProps } from './FormInput';
import { useFormFieldStyle } from './form-style-context';
import { buildFieldRules } from './rules';

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
  className,
  fieldClassName,
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
  onChange,
  onBlur,
  ...props
}: FormAccountInputProps<TValues>) {
  const style = useFormFieldStyle();
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
      className={fieldClassName ?? style.fieldClassName}
      labelClassName={labelClassName ?? style.labelClassName}
      descriptionClassName={descriptionClassName ?? style.descriptionClassName}
      errorClassName={errorClassName ?? style.errorClassName}
    >
      {(fieldProps) => (
        <Input
          {...props}
          {...fieldProps}
          className={className ?? style.controlClassName}
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
