import React from 'react';
import { useHandler } from '../useHandler';

export type UseOnDemandInfiniteLoaderProps<T = unknown> = {
  onLoad: (page: number) => Promise<T>;
  onError?: (error: any) => void;
  defaultPage?: number;
  enabled?: boolean;
};

export type UseOnDemandInfiniteLoaderReturn = {
  isLoading: boolean;
  loadMore: () => void;
};

export const useOnDemandInfiniteLoader = <T = unknown>({
  onLoad,
  onError,
  defaultPage,
  enabled,
}: UseOnDemandInfiniteLoaderProps<T>): UseOnDemandInfiniteLoaderReturn => {
  const [page, setPage] = React.useState(defaultPage ?? 1);

  const { handle: loadMore, isLoading } = useHandler(
    async () => {
      setPage(prev => prev + 1);
      return onLoad(page);
    },
    {
      onError,
    }
  );

  const handleLoadMore = React.useCallback(() => {
    if (!enabled) return;
    loadMore();
  }, [enabled, loadMore]);

  return React.useMemo(
    () => ({
      isLoading,
      loadMore: handleLoadMore,
    }),
    [handleLoadMore, isLoading]
  );
};
