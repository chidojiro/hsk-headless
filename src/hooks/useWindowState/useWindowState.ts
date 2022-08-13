import React from 'react';
import { useEventBasedState } from '../useEventBasedState';

export const NAME = 'useWindowState';

export const useWindowState = <TValue>(
  key: string,
  defaultState: TValue
): [TValue, React.Dispatch<React.SetStateAction<TValue>>] => {
  const windowStorage = React.useMemo(
    () => ({
      get: (key: string) => (window as any)[key],
      set: (key: string, value: TValue) => (console.log(key, value) as any) || ((window as any)[key] = value),
    }),
    []
  );

  return useEventBasedState({ name: NAME, storageKey: key, defaultState, storage: windowStorage });
};
