import { useDisclosure, useMountEffect } from '@/hooks';
import React from 'react';
import { useFetcher } from '../useFetcher';
import { useIntersection } from '../useIntersection';

export type UseOnSightInfiniteLoaderProps<T = unknown> = {
  onLoad: (page: number) => Promise<T>;
  onError?: (error: any) => void;
  defaultPage?: number;
  anchor: React.RefObject<HTMLElement> | HTMLElement | null;
  enabled: boolean;
};

export type UseOnSightInfiniteLoaderReturn = {
  isLoading: boolean;
};

export const useOnSightInfiniteLoader = <T = unknown>({
  onLoad,
  onError,
  anchor,
  defaultPage,
  enabled,
}: UseOnSightInfiniteLoaderProps<T>): UseOnSightInfiniteLoaderReturn => {
  const randomKey = React.useRef(Math.random());

  const [page, setPage] = React.useState(defaultPage ?? 1);

  const isIntersected = useIntersection(anchor);

  // Force rerender to make sure anchor is not null initially
  const disclosure = useDisclosure();
  useMountEffect(() => {
    disclosure.toggle();
  });

  const { isInitializing } = useFetcher(
    isIntersected && enabled && !!page && ['useOnSightInfiniteLoader', page, randomKey.current],
    () => onLoad(page),
    {
      onError,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const increasePage = React.useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

  const increasePageOnIntersection = React.useCallback(() => {
    if (isIntersected && enabled && !isInitializing) {
      increasePage();
    }
  }, [enabled, increasePage, isInitializing, isIntersected]);

  React.useEffect(() => {
    if (enabled) {
      increasePageOnIntersection();
    }
  }, [enabled, increasePageOnIntersection]);

  return React.useMemo(
    () => ({
      isLoading: isInitializing,
    }),
    [isInitializing]
  );
};
