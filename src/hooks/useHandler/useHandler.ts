import React from 'react';
import useSwr from 'swr';

export type HandlerOptions<T = unknown> = {
  onError?: (error: unknown) => void;
  onSuccess?: (data: T) => void;
};

export const useHandler = <T = void>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: (...args: any[]) => Promise<T>,
  options?: HandlerOptions<T>
) => {
  const [refreshToken, setRefreshToken] = React.useState<number>();
  const dataPromiseRef = React.useRef<Promise<T>>();
  const dataResolveRef = React.useRef<(data: T) => void>();
  const argsRef = React.useRef<unknown[]>();

  const handle = React.useCallback((...params: unknown[]) => {
    setRefreshToken(Math.random());
    argsRef.current = params;

    dataPromiseRef.current = new Promise(res => {
      dataResolveRef.current = res;
    });

    return dataPromiseRef.current;
  }, []);

  const args = argsRef.current;

  const { data, error, isValidating } = useSwr(
    args && [args, refreshToken],
    async args => {
      const res = await callback(...(args as unknown[]));

      dataResolveRef.current?.(res);

      return res;
    },
    options
  );

  return React.useMemo(() => ({ data, error, isLoading: isValidating, handle }), [data, error, isValidating, handle]);
};
