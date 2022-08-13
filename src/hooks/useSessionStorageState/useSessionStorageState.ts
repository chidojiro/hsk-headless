import React from 'react';
import { SessionStorageUtils } from 'utils';
import { useEventBasedState } from '../useEventBasedState';

export const NAME = 'useSessionStorageState';

export const useSessionStorageState = <TValue>(
  key: string,
  defaultState: TValue
): [TValue, React.Dispatch<React.SetStateAction<TValue>>] => {
  const localStorage = React.useMemo(
    () => ({
      get: (key: string) => SessionStorageUtils.get<TValue>(key, defaultState)!,
      set: (key: string, value: TValue) => SessionStorageUtils.set(key, value),
    }),
    [defaultState]
  );

  return useEventBasedState({ name: NAME, storageKey: key, defaultState, storage: localStorage });
};
