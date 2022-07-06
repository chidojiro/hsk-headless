import { isFunction } from 'lodash-es';
import React from 'react';
import { Fn } from 'types';

export type UseControllableProps<T = any> = {
  value?: T;
  defaultValue?: T;
  onChange?: (e: any) => void;
};

export const useControllable = <T>({ value: valueProp, onChange, defaultValue }: UseControllableProps<T>): any => {
  const isControlled = valueProp !== undefined && valueProp !== null;
  const prevValueRef = React.useRef(valueProp);

  const [value, setValue] = React.useState(defaultValue);

  const _setValue = React.useCallback(
    (event: T | React.ChangeEvent<any> | Fn) => {
      const _value = (event as React.ChangeEvent<any>).target?.value ?? event;

      if (isFunction(event)) {
        setValue(event(value));
      } else {
        setValue(_value);
      }

      onChange?.(event);
    },
    [onChange, value]
  );

  const UncontrolledState = React.useMemo(() => [value, _setValue], [_setValue, value]);

  if (isControlled) {
    const _setValue = (e: any) => {
      let _newValue = e;

      if (isFunction(e)) _newValue = e(prevValueRef.current);

      onChange?.(_newValue);
      prevValueRef.current = _newValue;
    };

    return [valueProp, _setValue];
  }

  return UncontrolledState;
};
