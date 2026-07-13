import type * as React from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { Input, type InputProps } from '../ui/input/Input';
import { FormItem } from './FormItem';
import { useFormFieldStyle } from './form-style-context';
import type { FieldRuleProps } from './rules';

export type FormInputProps<TValues extends FieldValues = FieldValues> = Omit<
  InputProps,
  'name' | 'defaultValue' | 'required' | 'minLength' | 'maxLength' | 'min' | 'max' | 'pattern'
> &
  FieldRuleProps<TValues> & {
    name: FieldPath<TValues>;
    control?: Control<TValues>;
    label?: React.ReactNode;
    description?: React.ReactNode;
    fieldClassName?: string;
    labelClassName?: string;
    descriptionClassName?: string;
    errorClassName?: string;
  };

export function FormInput<TValues extends FieldValues = FieldValues>({
  name,
  control,
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
}: FormInputProps<TValues>) {
  const style = useFormFieldStyle();

  return (
    <FormItem<TValues>
      name={name}
      control={control}
      label={label}
      description={description}
      required={required}
      minLength={minLength}
      maxLength={maxLength}
      min={min}
      max={max}
      pattern={pattern}
      validate={validate}
      deps={deps}
      rules={rules}
      className={fieldClassName}
      labelClassName={labelClassName}
      descriptionClassName={descriptionClassName}
      errorClassName={errorClassName}
    >
      {(field) => (
        <Input
          {...props}
          aria-describedby={field['aria-describedby']}
          aria-invalid={field['aria-invalid']}
          className={className ?? style.controlClassName}
          id={field.id}
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
    </FormItem>
  );
}
