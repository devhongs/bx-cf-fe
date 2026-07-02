import type { UseFormReturn } from 'react-hook-form';

import { useFormContextValue } from './form-context';
import type { FormValues } from './form.types';

export const useFormInstance = <TValues extends FormValues>(): UseFormReturn<TValues> =>
  useFormContextValue<TValues>().form;
