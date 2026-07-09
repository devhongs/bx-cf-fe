import { get } from 'lodash-es';
import * as React from 'react';
import { type FieldPath, type FieldValues, useFormState } from 'react-hook-form';

import { cn } from '../ui/lib/cn';

export interface FormFieldProps<TValues extends FieldValues> {
  name: FieldPath<TValues>;
  label?: React.ReactNode;
  description?: React.ReactNode;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
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
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
  children,
}: FormFieldProps<TValues>) {
  const id = React.useId();
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;
  const { errors } = useFormState({ name });
  const error = get(errors, name);
  const message = typeof error?.message === 'string' ? error.message : '';

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label
          className={cn('block text-sm font-medium text-current', labelClassName)}
          htmlFor={id}
        >
          {label}
          {required && (
            <span aria-hidden="true" className="ml-1 text-red-500">
              *
            </span>
          )}
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
        <p className={cn('text-xs text-muted-foreground', descriptionClassName)} id={descriptionId}>
          {description}
        </p>
      )}
      {message && (
        <p className={cn('text-xs text-red-500', errorClassName)} id={errorId}>
          {message}
        </p>
      )}
    </div>
  );
}
