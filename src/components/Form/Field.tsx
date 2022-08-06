import { get } from 'lodash-es';
import React from 'react';
import { RegisterOptions, useController, useFormContext } from 'react-hook-form';

type FieldOwnProps<TComponentProps, TValue> = {
  component: React.ComponentType<TComponentProps>;
  name: string;
  rules?: RegisterOptions;
  emptyValue?: TValue;
  valueAs?: (value: any) => any;
  changeAs?: (value: any) => any;
  className?: string;
  onBlur?: (e: any) => void;
  onChange?: (e: any) => void;
};

export type FieldProps<TComponentProps, TValue> = FieldOwnProps<TComponentProps, TValue> &
  Omit<TComponentProps, keyof FieldOwnProps<TComponentProps, TValue>>;

const ForwardedField = <TComponentProps, TValue>(
  {
    component,
    name,
    rules,
    onBlur: onBlurProp,
    className,
    emptyValue = '' as any,
    onChange: onChangeProp,
    valueAs = (value: TValue) => value,
    changeAs = (value: TValue) => value,
    ...restProps
  }: FieldProps<TComponentProps, TValue>,
  ref: any
) => {
  const Component = component as any;

  const {
    formState: { errors },
    setValue,
  } = useFormContext();

  const {
    field: { onChange, onBlur, value, ref: fieldRef, ...restField },
  } = useController({ name, rules });

  React.useEffect(() => {
    if (emptyValue && !value) {
      setValue(name, emptyValue, { shouldDirty: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const error = get(errors, name);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const _value = (e.target?.value as any) ?? (e as any) ?? emptyValue;
    onChange(changeAs(_value));
    onChangeProp?.(e);
  };

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = e => {
    onBlur();
    onBlurProp?.(e);
  };

  const resolveValue = React.useCallback(
    () => {
      if ([null, undefined].includes(value)) return emptyValue;

      if (valueAs) return valueAs(value);

      return value;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(emptyValue), JSON.stringify(value), valueAs]
    /* eslint-enable react-hooks/exhaustive-deps */
  );

  const hasError = !!error || undefined;

  return (
    <Component
      onChange={handleChange}
      onBlur={handleBlur}
      error={hasError}
      className={className}
      value={resolveValue()}
      ref={ref ?? fieldRef}
      placeholderInputRef={fieldRef}
      {...restField}
      {...(restProps as any)}
    />
  );
};

export const Field: typeof ForwardedField = React.forwardRef(ForwardedField) as any;
