import React from 'react';
import { LocalStorage } from '@/utils';
import { useEventBasedState } from '../useEventBasedState';

export const NAME = 'useLocalStorageState';

export const useLocalStorageState = <TValue>(
  key: string,
  defaultState: TValue
): [TValue, React.Dispatch<React.SetStateAction<TValue>>] => {
  const localStorage = React.useMemo(
    () => ({
      get: (key: string) => LocalStorage.get<TValue>(key, defaultState)!,
      set: (key: string, value: TValue) => LocalStorage.set(key, value),
    }),
    [defaultState]
  );

  return useEventBasedState({ name: NAME, storageKey: key, defaultState, storage: localStorage });
};
