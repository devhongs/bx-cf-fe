import { get } from 'lodash-es';
import * as React from 'react';
import { type FieldPath, type FieldValues, useFormState } from 'react-hook-form';

interface FormFieldProps<TValues extends FieldValues> {
  name: FieldPath<TValues>;
  label?: React.ReactNode;
  description?: React.ReactNode;
  required?: boolean;
  children: (fieldProps: {
    id: string;
    'aria-invalid': boolean;
    'aria-describedby'?: string;
  }) => React.ReactNode;
}

export function FormField<TValues extends FieldValues>({
  name,
  label,
  description,
  required,
  children,
}: FormFieldProps<TValues>) {
  const id = React.useId();
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;
  const { errors } = useFormState({ name });
  const error = get(errors, name);
  const message = typeof error?.message === 'string' ? error.message : '';

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-current" htmlFor={id}>
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      {children({
        id,
        'aria-invalid': Boolean(message),
        'aria-describedby':
          [description ? descriptionId : '', message ? errorId : ''].filter(Boolean).join(' ') ||
          undefined,
      })}
      {description && (
        <p className="text-xs text-muted-foreground" id={descriptionId}>
          {description}
        </p>
      )}
      {message && (
        <p className="text-xs text-red-500" id={errorId}>
          {message}
        </p>
      )}
    </div>
  );
}
