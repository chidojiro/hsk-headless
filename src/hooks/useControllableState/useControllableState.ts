import { AssertUtils } from 'utils';
import { isFunction } from 'lodash-es';
import React from 'react';

type UseControllablePropsWithoutDefaultValue<TValue, TOnChangeValueOrEvent> = {
  value?: TValue;
  onChange?: (valueOrEvent: TOnChangeValueOrEvent) => void;
};
type UseControllablePropsWithDefaultValue<TValue, TOnChangeValueOrEvent> = {
  value?: TValue;
  defaultValue: TValue;
  onChange?: (valueOrEvent: TOnChangeValueOrEvent) => void;
};
export type UseControllableProps<TValue, TOnChangeValueOrEvent> =
  | UseControllablePropsWithoutDefaultValue<TValue, TOnChangeValueOrEvent>
  | UseControllablePropsWithDefaultValue<TValue, TOnChangeValueOrEvent>;

type SetCallbackState<TValue, TOnChangeValueOrEvent> = (
  onChangeValueOrEvent: TOnChangeValueOrEvent,
  callback?: (state: TValue) => TValue
) => void;
type SetNormalState<TValue, TOnChangeValueOrEvent> = (state: TValue | TOnChangeValueOrEvent) => void;
type SetState<TValue, TOnChangeValueOrEvent> =
  | SetCallbackState<TValue, TOnChangeValueOrEvent>
  | SetNormalState<TValue, TOnChangeValueOrEvent>;

export function useControllableState<TValue, TOnChangeValueOrEvent extends TValue | React.ChangeEvent<any>>(
  props: UseControllablePropsWithoutDefaultValue<TValue, TOnChangeValueOrEvent>
): [TValue | undefined, SetState<TValue, TOnChangeValueOrEvent>];
export function useControllableState<TValue, TOnChangeValueOrEvent extends TValue | React.ChangeEvent<any>>(
  props: UseControllablePropsWithDefaultValue<TValue, TOnChangeValueOrEvent>
): [TValue, SetState<TValue, TOnChangeValueOrEvent>];
export function useControllableState<TValue, TOnChangeValueOrEvent extends TValue | React.ChangeEvent<any>>(
  props: UseControllableProps<TValue, TOnChangeValueOrEvent>
) {
  const {
    value: valueProp,
    onChange,
    defaultValue,
  } = props as UseControllablePropsWithDefaultValue<TValue, TOnChangeValueOrEvent>;
  const isControlled = !AssertUtils.isNullOrUndefined(valueProp);
  const prevValueRef = React.useRef(defaultValue);

  const [internalState, setInternalState] = React.useState(defaultValue);

  const state = React.useMemo(
    () => (isControlled ? valueProp : internalState),
    [internalState, isControlled, valueProp]
  );

  const setState = React.useCallback<SetState<TValue, TOnChangeValueOrEvent>>(
    (state, callback) => {
      if (isControlled) {
        onChange?.(state);
        return;
      }

      const newState = callback
        ? callback?.(prevValueRef.current!)
        : (state as React.ChangeEvent<any>).target?.value ?? state;

      setInternalState(newState);
      onChange?.(newState);

      prevValueRef.current = newState;
    },
    [isControlled, onChange]
  );

  return React.useMemo(() => [state, setState] as [typeof state, typeof setState], [state, setState]);
}
