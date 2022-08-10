import React from 'react';

export type UseDelayableStateProps<TState> = {
  delayBy: number;
  defaultState: TState;
};

type SetDelayableState<TState> = (params: { state: TState | ((prev: TState) => TState); shouldDelay: boolean }) => void;

export const useDelayableState = <TState>({
  delayBy,
  defaultState,
}: UseDelayableStateProps<TState>): [TState, SetDelayableState<TState>] => {
  const [state, setState] = React.useState<TState>(defaultState);

  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const setDelayableState = React.useCallback<SetDelayableState<TState>>(
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

  React.useEffect(
    () => () => {
      clearTimeout(timeoutRef.current);
    },
    []
  );

  return React.useMemo(() => [state, setDelayableState], [setDelayableState, state]);
};
