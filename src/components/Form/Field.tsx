import { ChangeEventHandler, ComponentType, FocusEventHandler, forwardRef, useCallback } from 'react';
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form';

type FieldOwnProps<TComponentProps, TValue> = {
  component: ComponentType<TComponentProps>;
  name: string;
  rules?: RegisterOptions;
  value?: any;
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
    value: valueProp,
    ...restProps
  }: FieldProps<TComponentProps, TValue>,
  ref: any
) => {
  const Component = component as any;

  const { control } = useFormContext();

  const resolveValue = useCallback(
    (value: any) => {
      if ([null, undefined].includes(value)) {
        return emptyValue;
      }

      if (valueAs) {
        return valueAs(value);
      }

      return value;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(emptyValue), valueAs]
    /* eslint-enable react-hooks/exhaustive-deps */
  );

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { name, onBlur, onChange, ref: fieldRef, value }, fieldState: { error } }) => {
        const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
          const _value = changeAs ? changeAs(e) : e ?? emptyValue;
          onChange(_value);
          onChangeProp?.(e);
        };

        const handleBlur: FocusEventHandler<HTMLInputElement> = e => {
          onBlur();
          onBlurProp?.(e);
        };

        if (emptyValue && !value) {
          onChange(name, emptyValue, { shouldDirty: false });
        }

        return (
          <Component
            onChange={handleChange}
            onBlur={handleBlur}
            error={error}
            className={className}
            value={resolveValue(value)}
            ref={ref ?? fieldRef}
            checked={resolveValue(value) === valueProp}
            name={name}
            {...(restProps as any)}
          />
        );
      }}
    />
  );
};

export const Field: typeof ForwardedField = forwardRef(ForwardedField) as any;
