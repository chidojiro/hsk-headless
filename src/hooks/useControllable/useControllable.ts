import isFunction from 'lodash/isFunction';
import { Fn } from './../../types';
import React from 'react';

export type UseControllableProps<T = any> = {
  value?: T;
  defaultValue?: T;
  onChange?: (e: any) => void;
  valueAs?: (value: T) => any;
  changeAs?: (value: any) => T;
};

function useControllable<T>({
  value: valueProp,
  onChange,
  defaultValue,
  valueAs,
  changeAs,
}: UseControllableProps<T>): any {
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
    const _value = valueAs ? valueAs(valueProp as any) : valueProp;

    const _setValue = (e: any) => {
      let _newValue = e;

      if (isFunction(e)) _newValue = e(prevValueRef.current);

      onChange?.(changeAs ? changeAs(_newValue) : _newValue);
      prevValueRef.current = _newValue;
    };

    return [_value, _setValue];
  }

  return UncontrolledState;
}

export default useControllable;
