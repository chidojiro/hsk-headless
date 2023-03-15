import { useMemo, useRef } from 'react';
import useSwr, { SWRConfiguration } from 'swr';

export type UseFetcherConfiguration<T> = SWRConfiguration<T> & {
  laggy?: boolean;
};

export const useFetcher = <T = unknown>(
  key: string | unknown[] | null | undefined | false,
  callback: (...args: unknown[]) => Promise<T>,
  config?: UseFetcherConfiguration<T>
) => {
  const { laggy, ...restConfig } = config ?? {};
  const laggyDataRef = useRef<T>();
  const swrReturn = useSwr<T>(
    key,
    async () => {
      const data = await callback();
      laggyDataRef.current = data;
      return data;
    },
    restConfig
  );

  return useMemo(
    () => ({
      ...swrReturn,
      data: swrReturn.data ?? (laggy ? laggyDataRef.current : undefined),
      isLagging: swrReturn.data === undefined && laggyDataRef.current !== undefined,
      isInitializing: !swrReturn.error && !swrReturn.data && swrReturn.isValidating,
    }),
    [laggy, swrReturn]
  );
};
