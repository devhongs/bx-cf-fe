import * as React from 'react';
import { FormProvider } from 'react-hook-form';

import { cn } from '../ui/lib/cn';
import { FormContext } from './form-context';
import { buildSubmitPayload } from './form-rules';
import type { FormFieldConfig, FormProps, FormValues } from './form.types';
import { useZodForm } from './useZodForm';

const DEFAULT_CONTROL_CLASS_NAME =
  'border-[#3c4043] bg-[#202124] text-[#e3e3e3] placeholder:text-[#80868b]';

export function Form<TValues extends FormValues, TPayload = Partial<TValues>>({
  defaultValues,
  validate,
  transform,
  onSubmit,
  children,
  className,
  controlClassName,
  errorDisplay: _errorDisplay = 'inline',
  ...props
}: FormProps<TValues, TPayload>) {
  const fieldsRef = React.useRef(new Map<string, FormFieldConfig<TValues>>());
  const getFields = React.useCallback(() => Array.from(fieldsRef.current.values()), []);

  const form = useZodForm<TValues>({
    defaultValues,
    getFields,
    validate,
  });

  const registerField = React.useCallback((config: FormFieldConfig<TValues>) => {
    fieldsRef.current.set(config.name, config);
  }, []);

  const unregisterField = React.useCallback((name: keyof TValues | string) => {
    fieldsRef.current.delete(String(name));
  }, []);

  const getFieldConfig = React.useCallback(
    (name: keyof TValues | string) => fieldsRef.current.get(String(name)),
    [],
  );

  const resolvedControlClassName = React.useMemo(
    () => cn(DEFAULT_CONTROL_CLASS_NAME, controlClassName),
    [controlClassName],
  );

  const contextValue = React.useMemo(
    () => ({
      form,
      controlClassName: resolvedControlClassName,
      registerField,
      unregisterField,
      getFieldConfig,
    }),
    [resolvedControlClassName, form, getFieldConfig, registerField, unregisterField],
  );

  const handleValidSubmit = React.useCallback(
    async (values: TValues) => {
      const payload = buildSubmitPayload(values, getFields(), transform) as TPayload;
      await onSubmit(payload, values);
    },
    [getFields, onSubmit, transform],
  );

  return (
    <FormContext.Provider value={contextValue as any}>
      <FormProvider {...form}>
        <form
          className={cn('space-y-4', className)}
          noValidate
          onSubmit={form.handleSubmit(handleValidSubmit)}
          {...props}
        >
          {children}
        </form>
      </FormProvider>
    </FormContext.Provider>
  );
}
