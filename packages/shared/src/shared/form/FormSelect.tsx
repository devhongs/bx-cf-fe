import type * as React from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { Select, type SelectProps } from '../ui/select/Select';
import { FormItem } from './FormItem';
import { useFormFieldStyle } from './form-style-context';
import type { FieldRuleProps } from './rules';

export type FormSelectProps<TValues extends FieldValues = FieldValues> = Omit<
  SelectProps,
  'name' | 'defaultValue' | 'value' | 'required'
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

export function FormSelect<TValues extends FieldValues = FieldValues>({
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
  validate,
  deps,
  rules,
  onChange,
  onBlur,
  ...props
}: FormSelectProps<TValues>) {
  const style = useFormFieldStyle();

  return (
    <FormItem<TValues>
      name={name}
      control={control}
      label={label}
      description={description}
      required={required}
      validate={validate}
      deps={deps}
      rules={rules}
      className={fieldClassName}
      labelClassName={labelClassName}
      descriptionClassName={descriptionClassName}
      errorClassName={errorClassName}
    >
      {(field) => (
        <Select
          {...props}
          aria-describedby={field['aria-describedby']}
          aria-invalid={field['aria-invalid']}
          className={className ?? style.controlClassName}
          id={field.id}
          name={field.name}
          ref={field.ref}
          // 검증은 RHF가 하고, Select는 placeholder를 잠글지 판단하는 데만 쓴다.
          required={Boolean(required)}
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
