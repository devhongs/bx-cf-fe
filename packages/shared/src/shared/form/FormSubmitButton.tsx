import * as React from 'react';
import { useFormState } from 'react-hook-form';

import { Button, type ButtonProps } from '../ui/button/Button';
import { useFormInstance } from './useFormInstance';

export interface FormSubmitButtonProps extends Omit<ButtonProps, 'type'> {
  disableWhenInvalid?: boolean;
  loadingLabel?: React.ReactNode;
}

export function FormSubmitButton({
  children,
  disabled,
  disableWhenInvalid,
  loadingLabel,
  ...props
}: FormSubmitButtonProps) {
  const form = useFormInstance<Record<string, any>>();
  const { isSubmitting, isValid } = useFormState({
    control: form.control,
  });
  const isDisabled = Boolean(disabled || isSubmitting || (disableWhenInvalid && !isValid));

  return (
    <Button {...props} disabled={isDisabled} type="submit">
      {isSubmitting && loadingLabel ? loadingLabel : children}
    </Button>
  );
}
