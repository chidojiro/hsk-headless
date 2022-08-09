import { AssertUtils } from 'utils';
import React from 'react';

type UseControllableProps<TValue, TOnChangeValue> = {
  value?: TValue;
  defaultValue: TValue;
  onChange?: (valueOrEvent: TOnChangeValue) => void;
};

type SetControllableStateParams<TInternalValue, TOnChangeValue> = {
  internal: TInternalValue | ((value: TInternalValue) => TInternalValue);
  external: TOnChangeValue;
};

export type SetControllableState<TValue, TOnChangeValue = TValue> = (
  value:
    | (TValue & TOnChangeValue)
    | ((value: TValue) => TValue & TOnChangeValue)
    | SetControllableStateParams<TValue, TOnChangeValue>
) => void;

const isCustomParams = <TValue, TOnChangeValue>(
  params: any
): params is SetControllableStateParams<TValue, TOnChangeValue> =>
  Object.prototype.hasOwnProperty.call(params, 'internal') && Object.prototype.hasOwnProperty.call(params, 'external');

export const useControllableState = <TValue, TOnChangeValue = TValue>({
  value: valueProp,
  onChange,
  defaultValue,
}: UseControllableProps<TValue, TOnChangeValue>): [TValue, SetControllableState<TValue, TOnChangeValue>] => {
  const isControlled = !AssertUtils.isNullOrUndefined(valueProp);
  const prevValueRef = React.useRef(defaultValue);

  const [internalState, setInternalState] = React.useState(defaultValue);

  const state = React.useMemo(
    () => (isControlled ? valueProp : internalState),
    [internalState, isControlled, valueProp]
  );

  const setState: SetControllableState<TValue, TOnChangeValue> = React.useCallback(
    newState => {
      let computedInternal: TValue;
      let computedExternal: TOnChangeValue;

      if (isCustomParams<TValue, TOnChangeValue>(newState)) {
        const { external, internal } = newState;
        computedInternal = AssertUtils.isFunction(internal) ? internal(prevValueRef.current) : internal;
        computedExternal = external;
      } else {
        const computedState = AssertUtils.isFunction(newState) ? newState(prevValueRef.current) : newState;
        computedExternal = computedState;
        computedInternal = computedState;
      }

      if (!isControlled) {
        setInternalState(computedInternal);
      }
      onChange?.(computedExternal);

      prevValueRef.current = internalState;
    },
    [internalState, isControlled, onChange]
  );

  return React.useMemo(() => [state, setState], [state, setState]);
};
