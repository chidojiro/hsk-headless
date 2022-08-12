import { AssertUtils } from 'utils';
import React from 'react';
import { isEqual } from 'lodash-es';

export const useWindowState = <T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const idRef = React.useRef(Math.random());
  const [state, _setState] = React.useState<T>(((window as any)[key] ?? defaultValue) as T);

  const eventKey = `useWindowState-${key}`;

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
      (window as any)[key] = state;
      window.dispatchEvent(new CustomEvent(eventKey, { detail: { state, source: idRef.current } }));
    },
    [eventKey, key]
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
