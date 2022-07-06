import React from 'react';
import useSwr, { SWRConfiguration } from 'swr';

export type UseFetcherOptions<T> = SWRConfiguration<T>;

export const useFetcher = <T = unknown>(
  key: string | unknown[] | null | undefined | false,
  callback: (...args: unknown[]) => Promise<T>,
  options?: UseFetcherOptions<T>
) => {
  const swrReturn = useSwr<T>(key, callback, options);

  return React.useMemo(
    () => ({
      ...swrReturn,
      isInitializing: !swrReturn.error && !swrReturn.data && swrReturn.isValidating,
    }),
    [swrReturn]
  );
};
