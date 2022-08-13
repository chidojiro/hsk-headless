import { AssertUtils } from '@/utils';
import React from 'react';

export type UseControllableStateProps<TValue, TOnChangeValue> = {
  value?: TValue;
  defaultValue: TValue;
  onChange?: (value: TOnChangeValue) => void;
};

export type SetControllableStateVerboseParams<TInternalValue, TOnChangeValue> = {
  internal: TInternalValue | ((value: TInternalValue) => TInternalValue);
  external: TOnChangeValue;
};

export type SetControllableState<TValue, TOnChangeValue = TValue> = (
  value:
    | (TValue & TOnChangeValue)
    | ((value: TValue) => TValue & TOnChangeValue)
    | SetControllableStateVerboseParams<TValue, TOnChangeValue>
) => void;

const isVerboseParams = <TValue, TOnChangeValue>(
  params: any
): params is SetControllableStateVerboseParams<TValue, TOnChangeValue> =>
  Object.prototype.hasOwnProperty.call(params, 'internal') && Object.prototype.hasOwnProperty.call(params, 'external');

export const useControllableState = <TValue, TOnChangeValue = TValue>({
  value: valueProp,
  onChange,
  defaultValue,
}: UseControllableStateProps<TValue, TOnChangeValue>): [TValue, SetControllableState<TValue, TOnChangeValue>] => {
  const isControlled = !AssertUtils.isNullOrUndefined(valueProp);
  const prevValueRef = React.useRef(valueProp ?? defaultValue);

  const [internalState, setInternalState] = React.useState(defaultValue);

  const state = React.useMemo(
    () => (isControlled ? valueProp : internalState),
    [internalState, isControlled, valueProp]
  );

  const setState: SetControllableState<TValue, TOnChangeValue> = React.useCallback(
    newState => {
      if (isControlled) {
        let computedExternal: TOnChangeValue;

        if (isVerboseParams<TValue, TOnChangeValue>(newState)) {
          const { external } = newState;
          computedExternal = external;
        } else {
          computedExternal = AssertUtils.isFunction(newState) ? newState(valueProp) : newState;
        }

        onChange?.(computedExternal);
      } else {
        let computedInternal: TValue;
        let computedExternal: TOnChangeValue;

        if (isVerboseParams<TValue, TOnChangeValue>(newState)) {
          const { internal, external } = newState;
          computedInternal = AssertUtils.isFunction(internal) ? internal(prevValueRef.current) : internal;
          computedExternal = external;
        } else {
          computedInternal = computedExternal = AssertUtils.isFunction(newState)
            ? newState(prevValueRef.current)
            : newState;
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
