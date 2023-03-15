import { Dispatch, SetStateAction, useMemo } from 'react';
import { useEventBasedState } from '../useEventBasedState';

export const NAME = 'useWindowState';

export const useWindowState = <TValue>(
  key: string,
  defaultState: TValue
): [TValue, Dispatch<SetStateAction<TValue>>] => {
  const windowStorage = useMemo(
    () => ({
      get: (key: string) => (window as any)[key],
      set: (key: string, value: TValue) => ((window as any)[key] = value),
    }),
    []
  );

  return useEventBasedState({ name: NAME, storageKey: key, defaultState, storage: windowStorage });
};
