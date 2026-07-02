import { createContext, useContext } from 'react';

import type { FormContextValue, FormValues } from './form.types';

export const FormContext = createContext<FormContextValue<FormValues> | null>(null);

export const useFormContextValue = <TValues extends FormValues>() => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error('Form components must be used within <Form>.');
  }

  return context as FormContextValue<TValues>;
};
