import type * as React from 'react';
import {
  type FieldValues,
  FormProvider,
  type SubmitHandler,
  type UseFormReturn,
} from 'react-hook-form';

import { cn } from '../ui/lib/cn';

export interface FormProps<TValues extends FieldValues, TPayload = TValues>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  form: UseFormReturn<TValues, unknown, TPayload>;
  onSubmit: SubmitHandler<TPayload>;
}

export function Form<TValues extends FieldValues, TPayload = TValues>({
  form,
  onSubmit,
  className,
  children,
  ...props
}: FormProps<TValues, TPayload>) {
  return (
    <FormProvider {...form}>
      <form
        className={cn('space-y-4', className)}
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
}
