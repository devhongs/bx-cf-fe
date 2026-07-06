import type * as React from 'react';
import { useFormState } from 'react-hook-form';

import { Button, type ButtonProps } from '../ui/button/Button';

export interface FormSubmitButtonProps extends Omit<ButtonProps, 'type'> {
  loadingLabel?: React.ReactNode;
}

export function FormSubmitButton({
  children,
  disabled,
  variant = 'submit',
  loadingLabel,
  ...props
}: FormSubmitButtonProps) {
  const { isSubmitting } = useFormState();

  return (
    <Button {...props} variant={variant} disabled={disabled || isSubmitting} type="submit">
      {isSubmitting && loadingLabel ? loadingLabel : children}
    </Button>
  );
}
