import { get } from 'lodash';
import React from 'react';
import { RegisterOptions, useController, useFormContext } from 'react-hook-form';

export type Props<T = any> = {
  rules?: RegisterOptions;
  name: string;
  noErrorMessage?: boolean;
  errorGroup?: string[];
  className?: string;
  onChange?: (e: any) => void;
  onBlur?: (e: any) => void;
  defaultValue?: any;
  value?: any;
  emptyValue?: any;
  defaultChecked?: boolean;
  type?: 'checkbox' | 'radio' | 'common';
  component: React.ComponentType<T>;
};

export const Field = <T,>({
  component,
  name,
  rules,
  onChange: onChangeProp,
  onBlur: onBlurProp,
  defaultValue,
  className,
  noErrorMessage,
  value: valueProp,
  errorGroup = [],
  emptyValue = '',
  defaultChecked,
  type = 'common',
  ...restProps
}: Props<T>) => {
  const Component = component;

  const {
    formState: { errors },
    setValue,
    getValues,
    clearErrors,
    setError,
  } = useFormContext();

  const {
    field: { onChange, onBlur, value, ...restField },
  } = useController({ name, rules });

  React.useEffect(() => {
    if ((defaultValue || emptyValue) && !value) {
      setValue(name, defaultValue || emptyValue, { shouldDirty: false });
    }

    if (defaultChecked) {
      setValue(name, true, { shouldDirty: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const errorMessage = get(errors, name)?.message;

  const hasGroupError = errorGroup.reduce((acc, cur) => acc && get(errors, cur)?.message, false);

  const values = errorGroup.map(name => getValues(name));

  React.useEffect(() => {
    if (hasGroupError) {
      errorGroup.forEach(name => clearErrors(name));
    } else {
      errorGroup.forEach(name => setError(name, { message: errorMessage }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearErrors, errorMessage, setError, ...errorGroup, ...values]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    onChange(e);
    onChangeProp?.(e);
  };

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = e => {
    onBlur();
    onBlurProp?.(e);
  };

  const isCheckboxOrRadio = ['checkbox', 'radio'].includes(type);

  const resolveValue = React.useCallback(
    () => {
      if (isCheckboxOrRadio) return valueProp;

      if ([null, undefined].includes(value)) return emptyValue;

      if (rules?.valueAsNumber) {
        return +value;
      }

      if (rules?.valueAsDate) {
        return new Date(value);
      }

      return value;
    },
    /* eslint-disable react-hooks/exhaustive-deps */
    [
      JSON.stringify(emptyValue),
      JSON.stringify(value),
      JSON.stringify(valueProp),
      rules?.valueAsDate,
      rules?.valueAsNumber,
      type,
    ]
    /* eslint-enable react-hooks/exhaustive-deps */
  );

  const hasError = !!errorMessage || hasGroupError;

  return (
    <Component
      onChange={handleChange}
      onBlur={handleBlur}
      error={hasError || (undefined as any)}
      className={className}
      value={resolveValue()}
      checked={isCheckboxOrRadio ? !!value : false}
      {...restField}
      {...(restProps as any)}
    />
  );
};

export default Field;
