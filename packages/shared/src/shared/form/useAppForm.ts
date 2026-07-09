import { useEffect, useRef } from 'react';
import {
  type DefaultValues,
  type FieldValues,
  type UseFormProps,
  type UseFormReturn,
  useForm,
} from 'react-hook-form';

export interface UseAppFormProps<TValues extends FieldValues>
  extends Omit<UseFormProps<TValues, unknown, TValues>, 'defaultValues'> {
  defaultValues: DefaultValues<TValues>;
  resetOnDefaultValuesChange?: boolean;
}

export interface UseAppFormReturn<TValues extends FieldValues> {
  form: UseFormReturn<TValues, unknown, TValues>;
  resetToDefaultValues: () => void;
}

export function useAppForm<TValues extends FieldValues>({
  defaultValues,
  resetOnDefaultValuesChange = false,
  ...props
}: UseAppFormProps<TValues>): UseAppFormReturn<TValues> {
  const form = useForm<TValues, unknown, TValues>({
    ...props,
    defaultValues,
  });
  const { reset } = form;
  const previousDefaultValuesRef = useRef(defaultValues);

  const resetToDefaultValues = () => {
    reset(defaultValues);
  };

  useEffect(() => {
    if (!resetOnDefaultValuesChange) {
      previousDefaultValuesRef.current = defaultValues;
      return;
    }

    if (previousDefaultValuesRef.current === defaultValues) return;

    previousDefaultValuesRef.current = defaultValues;
    reset(defaultValues);
  }, [defaultValues, reset, resetOnDefaultValuesChange]);

  return {
    form,
    resetToDefaultValues,
  };
}
