import React from 'react';
import { isEqual, isFunction } from 'lodash-es';

export type UseEventBasedStateStorage<TValue> = {
  get: (key: string) => TValue;
  set: (key: string, value: TValue) => void;
};

export type UseEventBasedStateProps<TState, TStorage> = {
  name: string;
  storageKey: string;
  defaultState: TState | ((value: TState | undefined) => TState);
  storage: TStorage;
};

export const getUseEventBasedStateEventKey = (name: string, storageKey: string) => `${name}_${storageKey}`;

export const useEventBasedState = <
  TState,
  TStorage extends UseEventBasedStateStorage<TState> = UseEventBasedStateStorage<TState>
>({
  name,
  storageKey,
  defaultState,
  storage,
}: UseEventBasedStateProps<TState, TStorage>): [TState, React.Dispatch<React.SetStateAction<TState>>] => {
  const idRef = React.useRef(Math.random());
  const [state, _setState] = React.useState(
    isFunction(defaultState) ? defaultState(storage.get(storageKey)) : storage.get(storageKey) ?? defaultState
  );

  const eventKey = getUseEventBasedStateEventKey(name, storageKey);
  React.useEffect(() => {
    const eventListener = (event: Event) => {
      const { state: newState, source } = (event as any).detail ?? {};

      _setState(prev => {
        if (isEqual(prev, newState) || source === idRef.current) return prev;

        return newState;
      });
    };

    window.addEventListener(eventKey, eventListener);

    return () => {
      window.removeEventListener(eventKey, eventListener);
    };
  }, [eventKey]);

  const dispatchState = React.useCallback(
    (state: TState) => {
      storage.set(storageKey, state);
      window.dispatchEvent(new CustomEvent(eventKey, { detail: { state, source: idRef.current } }));
    },
    [storage, storageKey, eventKey]
  );

  const setState = React.useCallback<React.Dispatch<React.SetStateAction<TState>>>(
    stateOrCallback => {
      if (isFunction(stateOrCallback)) {
        const callback = stateOrCallback;
        _setState(prev => {
          const newState = callback(prev);

          dispatchState(newState);

          return newState;
        });
        return;
      }

      const newState = stateOrCallback;
      _setState(newState);
      dispatchState(newState);
    },
    [dispatchState]
  );

  return React.useMemo(() => [state, setState], [setState, state]);
};
