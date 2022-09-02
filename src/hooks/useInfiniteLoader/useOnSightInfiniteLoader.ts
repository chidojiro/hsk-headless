import { useDisclosure, useMountEffect } from '@/hooks';
import React from 'react';
import { useFetcher } from '../useFetcher';
import { useIntersection } from '../useIntersection';

const WAIT_FOR_NEXT_LOAD = 300;

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
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const [page, setPage] = React.useState(defaultPage ?? 1);

  const readyForNextLoadDisclosure = useDisclosure({ defaultOpen: true });

  const isIntersected = useIntersection(anchor);

  useMountEffect(() => () => clearTimeout(timeoutRef.current));

  // Force rerender to make sure anchor is not null initially
  const disclosure = useDisclosure();
  useMountEffect(() => {
    disclosure.toggle();
  });

  const handleLoad: typeof onLoad = async (page) => {
    readyForNextLoadDisclosure.close();

    const data = await onLoad(page);

    timeoutRef.current = setTimeout(readyForNextLoadDisclosure.open, WAIT_FOR_NEXT_LOAD);

    return data;
  };

  const { isInitializing } = useFetcher(
    isIntersected && enabled && !!page && ['useOnSightInfiniteLoader', page, randomKey.current],
    () => handleLoad(page),
    {
      onError,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const increasePage = React.useCallback(() => {
    if (!readyForNextLoadDisclosure.isOpen) return;
    setPage((prev) => prev + 1);
  }, [readyForNextLoadDisclosure.isOpen]);

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
    [isInitializing],
  );
};
