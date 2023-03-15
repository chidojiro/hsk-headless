import { Cookies } from '@/utils';
import { useMemo } from 'react';
import { useEventBasedState } from '../useEventBasedState';

export const NAME = 'useCookieState';

export const useCookieState = (key: string, defaultState: string) => {
  const cookieStorage = useMemo(
    () => ({
      get: Cookies.get,
      set: Cookies.set,
    }),
    []
  );

  return useEventBasedState({
    name: NAME,
    storageKey: key,
    defaultState: (value: string | undefined) => value || defaultState || '',
    storage: cookieStorage,
  });
};
