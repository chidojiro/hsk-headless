import { isEqual, isFunction } from 'lodash-es';
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
}: UseEventBasedStateProps<TState, TStorage>): [TState, Dispatch<SetStateAction<TState>>] => {
  const idRef = useRef(Math.random());
  const [state, _setState] = useState(
    isFunction(defaultState) ? defaultState(storage.get(storageKey)) : storage.get(storageKey) ?? defaultState
  );

  const eventKey = getUseEventBasedStateEventKey(name, storageKey);
  useEffect(() => {
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

  const dispatchState = useCallback(
    (state: TState) => {
      storage.set(storageKey, state);
      window.dispatchEvent(new CustomEvent(eventKey, { detail: { state, source: idRef.current } }));
    },
    [storage, storageKey, eventKey]
  );

  const setState = useCallback<Dispatch<SetStateAction<TState>>>(
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

  return useMemo(() => [state, setState], [setState, state]);
};
