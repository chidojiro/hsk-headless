import { AssertUtils } from 'utils';
import React from 'react';
import { isEqual } from 'lodash-es';

export type UseEventBasedStateStorage<TValue> = {
  get: (key: string) => TValue;
  set: (key: string, value: TValue) => void;
};

export type UseEventBasedStateProps<T> = {
  key: string;
  defaultState: T;
  storage: UseEventBasedStateStorage<T>;
};

export const useEventBasedState = <T>({
  key,
  defaultState,
  storage,
}: UseEventBasedStateProps<T>): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const idRef = React.useRef(Math.random());
  const [state, _setState] = React.useState(storage.get(key) ?? defaultState);

  const eventKey = `useEventBasedState_${key}`;

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
  }, [eventKey, key]);

  const dispatchState = React.useCallback(
    (state: T) => {
      storage.set(key, state);
      window.dispatchEvent(new CustomEvent(eventKey, { detail: { state, source: idRef.current } }));
    },
    [eventKey, key, storage]
  );

  const setState = React.useCallback(
    stateOrCallback => {
      if (AssertUtils.isFunction(stateOrCallback)) {
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
