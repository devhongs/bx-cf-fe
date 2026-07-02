import { useEffect, useLayoutEffect, useRef } from 'react';
import type { Path } from 'react-hook-form';

import { useFormContextValue } from './form-context';
import type { FormFieldConfig, FormValues } from './form.types';

export const useFieldRegistration = <TValues extends FormValues>(
  config: FormFieldConfig<TValues>,
) => {
  const { form, registerField, unregisterField } = useFormContextValue<TValues>();
  const previousHidden = useRef(false);

  useLayoutEffect(() => {
    registerField(config);
  }, [
    config.name,
    config.rules,
    config.hidden,
    config.disabled,
    config.readOnly,
    config.clearOnHidden,
    config.includeHiddenValue,
    config.excludeDisabledValue,
    config.validateDisabled,
    registerField,
  ]);

  useEffect(() => {
    if (config.hidden && !previousHidden.current && config.clearOnHidden) {
      form.setValue(config.name as Path<TValues>, '' as any, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: false,
      });
    }
    previousHidden.current = Boolean(config.hidden);
  }, [config.clearOnHidden, config.hidden, config.name, form]);

  useLayoutEffect(
    () => () => {
      unregisterField(config.name);
    },
    [config.name, unregisterField],
  );
};
