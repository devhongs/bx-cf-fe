import type * as React from 'react';
import { useFormState } from 'react-hook-form';

import { Button, type ButtonProps } from '../ui/button/Button';

export interface FormSubmitButtonProps extends Omit<ButtonProps, 'type'> {
  loadingLabel?: React.ReactNode;
}

export function FormSubmitButton({
  children,
  disabled,
  loadingLabel,
  ...props
}: FormSubmitButtonProps) {
  const { isSubmitting } = useFormState();

  return (
    <Button {...props} disabled={disabled || isSubmitting} type="submit">
      {isSubmitting && loadingLabel ? loadingLabel : children}
    </Button>
  );
}
