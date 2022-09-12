import { CookiesUtils } from '@/common/utils';
import React from 'react';
import { useEventBasedState } from '../useEventBasedState';

export const NAME = 'useCookieState';

export const useCookieState = (key: string, defaultState: string) => {
  const cookieStorage = React.useMemo(
    () => ({
      get: CookiesUtils.get,
      set: CookiesUtils.set,
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
