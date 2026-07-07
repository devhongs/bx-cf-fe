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
}

export interface UseAppFormReturn<TValues extends FieldValues> {
  form: UseFormReturn<TValues, unknown, TValues>;
  resetToDefaultValues: () => void;
}

export function useAppForm<TValues extends FieldValues>({
  defaultValues,
  ...props
}: UseAppFormProps<TValues>): UseAppFormReturn<TValues> {
  const form = useForm<TValues, unknown, TValues>({
    ...props,
    defaultValues,
  });

  const resetToDefaultValues = () => {
    form.reset(defaultValues);
  };

  return {
    form,
    resetToDefaultValues,
  };
}
