import { zodResolver } from '@hookform/resolvers/zod';
import { type FieldValues, type UseFormProps, type UseFormReturn, useForm } from 'react-hook-form';
import type { z } from 'zod';

export const useZodForm = <TInput extends FieldValues, TOutput>(
  schema: z.ZodType<TOutput, TInput>,
  options?: Omit<UseFormProps<TInput, unknown, TOutput>, 'resolver'>,
): UseFormReturn<TInput, unknown, TOutput> =>
  useForm<TInput, unknown, TOutput>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    ...options,
    resolver: zodResolver(schema),
  });
