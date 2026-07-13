import type { FieldPath, FieldValues } from 'react-hook-form';

import { Input } from '../ui/input/Input';
import type { FormInputProps } from './FormInput';
import { FormItem } from './FormItem';
import { useFormFieldStyle } from './form-style-context';

export const normalizeAccountNo = (value: string) => value.replace(/[^0-9]/g, '');

export type FormAccountInputProps<TValues extends FieldValues = FieldValues> = Omit<
  FormInputProps<TValues>,
  'inputMode' | 'type'
> & {
  name: FieldPath<TValues>;
};

export function FormAccountInput<TValues extends FieldValues = FieldValues>({
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
}: FormAccountInputProps<TValues>) {
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
    </FormItem>
  );
}
