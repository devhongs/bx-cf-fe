import type * as React from 'react';
import {
  type FieldValues,
  FormProvider,
  type SubmitHandler,
  type UseFormReturn,
} from 'react-hook-form';

import { cn } from '../ui/lib/cn';
import styles from './Form.module.css';
import { type FormFieldStyle, FormFieldStyleProvider } from './form-style-context';

export interface FormProps<TValues extends FieldValues, TPayload = TValues>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>,
    FormFieldStyle {
  form: UseFormReturn<TValues, unknown, TPayload>;
  onSubmit: SubmitHandler<TPayload>;
}

export function Form<TValues extends FieldValues, TPayload = TValues>({
  form,
  onSubmit,
  className,
  children,
  controlClassName,
  fieldClassName,
  labelClassName,
  descriptionClassName,
  errorClassName,
  ...props
}: FormProps<TValues, TPayload>) {
  const fieldStyle: FormFieldStyle = {
    controlClassName,
    fieldClassName,
    labelClassName,
    descriptionClassName,
    errorClassName,
  };

  return (
    <FormFieldStyleProvider value={fieldStyle}>
      <FormProvider {...form}>
        <form
          className={cn(styles.form, className)}
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          {...props}
        >
          {children}
        </form>
      </FormProvider>
    </FormFieldStyleProvider>
  );
}
