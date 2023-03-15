import { SessionStorage } from '@/utils';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { useEventBasedState } from '../useEventBasedState';

export const NAME = 'useSessionStorageState';

export const useSessionStorageState = <TValue>(
  key: string,
  defaultState: TValue
): [TValue, Dispatch<SetStateAction<TValue>>] => {
  const localStorage = useMemo(
    () => ({
      get: (key: string) => SessionStorage.get<TValue>(key, defaultState)!,
      set: (key: string, value: TValue) => SessionStorage.set(key, value),
    }),
    [defaultState]
  );

  return useEventBasedState({ name: NAME, storageKey: key, defaultState, storage: localStorage });
};
