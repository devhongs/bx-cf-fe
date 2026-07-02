import * as React from 'react';
import { get } from 'lodash-es';
import { useFormState, type FieldValues, type Path } from 'react-hook-form';

import { cn } from '../ui/lib/cn';
import { useFormInstance } from './useFormInstance';

interface FormFieldProps<TValues extends FieldValues> {
  name: Path<TValues>;
  label?: React.ReactNode;
  description?: React.ReactNode;
  required?: boolean;
  hidden?: boolean;
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
  hidden,
  children,
}: FormFieldProps<TValues>) {
  const id = React.useId();
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;
  const form = useFormInstance<TValues & Record<string, any>>();
  const { errors } = useFormState({
    control: form.control,
    name,
  });
  const error = get(errors, name);
  const message = typeof error?.message === 'string' ? error.message : '';

  if (hidden) return null;

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
        'aria-describedby': [description ? descriptionId : '', message ? errorId : '']
          .filter(Boolean)
          .join(' ') || undefined,
      })}
      {description && (
        <p className="text-xs text-[#9aa0a6]" id={descriptionId}>
          {description}
        </p>
      )}
      {message && (
        <p className={cn('text-xs text-red-500')} id={errorId}>
          {message}
        </p>
      )}
    </div>
  );
}
