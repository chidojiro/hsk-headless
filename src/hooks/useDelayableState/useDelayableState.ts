import { useState, useEffect, useMemo, useCallback, ReactNode, RefObject, useRef } from 'react';

export type UseDelayableStateProps<TState> = {
  delayBy: number;
  defaultState: TState;
};

type SetDelayableState<TState> = (params: { state: TState | ((prev: TState) => TState); shouldDelay: boolean }) => void;

export const useDelayableState = <TState>({
  delayBy,
  defaultState,
}: UseDelayableStateProps<TState>): [TState, SetDelayableState<TState>] => {
  const [state, setState] = useState<TState>(defaultState);

  const timeoutRef = useRef<NodeJS.Timeout>();

  const setDelayableState = useCallback<SetDelayableState<TState>>(
    ({ state, shouldDelay }) => {
      clearTimeout(timeoutRef.current);

      if (shouldDelay) {
        timeoutRef.current = setTimeout(() => {
          setState(state);
        }, delayBy);

        return;
      }

      setState(state);
    },
    [delayBy]
  );

  useEffect(
    () => () => {
      clearTimeout(timeoutRef.current);
    },
    []
  );

  return useMemo(() => [state, setDelayableState], [setDelayableState, state]);
};
