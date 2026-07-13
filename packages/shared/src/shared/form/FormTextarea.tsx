import type * as React from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { Textarea, type TextareaProps } from '../ui/textarea/Textarea';
import { FormItem } from './FormItem';
import { useFormFieldStyle } from './form-style-context';
import type { FieldRuleProps } from './rules';

export type FormTextareaProps<TValues extends FieldValues = FieldValues> = Omit<
  TextareaProps,
  'name' | 'defaultValue' | 'required' | 'minLength' | 'maxLength'
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

export function FormTextarea<TValues extends FieldValues = FieldValues>({
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
  validate,
  deps,
  rules,
  onChange,
  onBlur,
  ...props
}: FormTextareaProps<TValues>) {
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
      validate={validate}
      deps={deps}
      rules={rules}
      className={fieldClassName}
      labelClassName={labelClassName}
      descriptionClassName={descriptionClassName}
      errorClassName={errorClassName}
    >
      {(field) => (
        <Textarea
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
