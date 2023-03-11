import { isNullOrUndefined } from '@/utils';
import { isFunction } from 'lodash';
import React from 'react';

export type UseControllableStateProps<TValue, TOnChangeValue> = {
  value?: TValue;
  defaultValue: TValue;
  onChange?: (value: TOnChangeValue | TValue) => void;
};

export type SetControllableStateVerboseParams<TInternalValue, TOnChangeValue> = {
  internal: TInternalValue | ((value: TInternalValue) => TInternalValue);
  external: TOnChangeValue;
};

export type SetControllableState<TValue, TOnChangeValue = TValue> = (
  value: TValue | ((value: TValue) => TValue) | SetControllableStateVerboseParams<TValue, TOnChangeValue>
) => void;

const isVerboseParams = <TValue, TOnChangeValue>(
  params: any
): params is SetControllableStateVerboseParams<TValue, TOnChangeValue> =>
  !isNullOrUndefined(params) &&
  Object.prototype.hasOwnProperty.call(params, 'internal') &&
  Object.prototype.hasOwnProperty.call(params, 'external');

export const useControllableState = <TValue, TOnChangeValue = TValue>({
  value: valueProp,
  onChange,
  defaultValue,
}: UseControllableStateProps<TValue, TOnChangeValue>): [TValue, SetControllableState<TValue, TOnChangeValue>] => {
  const isControlled = !isNullOrUndefined(valueProp);
  const prevValueRef = React.useRef(valueProp ?? defaultValue);

  const [internalState, setInternalState] = React.useState(defaultValue);

  const state = React.useMemo(
    () => (isControlled ? valueProp : internalState),
    [internalState, isControlled, valueProp]
  );

  const setState: SetControllableState<TValue, TOnChangeValue> = React.useCallback(
    newState => {
      if (isControlled) {
        let computedExternal: TOnChangeValue | TValue;

        if (isVerboseParams<TValue, TOnChangeValue>(newState)) {
          const { external } = newState;
          computedExternal = external;
        } else {
          computedExternal = isFunction(newState) ? newState(valueProp) : newState;
        }

        onChange?.(computedExternal);
      } else {
        let computedInternal: TValue;
        let computedExternal: TOnChangeValue | TValue;

        if (isVerboseParams<TValue, TOnChangeValue>(newState)) {
          const { internal, external } = newState;
          computedInternal = isFunction(internal) ? internal(prevValueRef.current) : internal;
          computedExternal = external;
        } else {
          computedInternal = computedExternal = isFunction(newState) ? newState(prevValueRef.current) : newState;
        }

        prevValueRef.current = computedInternal;
        setInternalState(computedInternal);
        onChange?.(computedExternal);
      }
    },
    [isControlled, onChange, valueProp]
  );

  return React.useMemo(() => [state, setState], [state, setState]);
};
