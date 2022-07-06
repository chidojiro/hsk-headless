import React from 'react';
import { useFetcher } from '../useFetcher';
import { useIntersection } from '../useIntersection';
import { useVisibilityControl } from '../useVisibilityControl';

const WAIT_FOR_NEXT_LOAD_TIMEOUT = 500;

export type UseInfiniteLoaderProps<T = unknown> = {
  onLoad: (page: number) => Promise<T>;
  until: (data: T) => boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  anchor: React.RefObject<HTMLElement> | HTMLElement | null;
};

export type UseInfiniteLoaderReturn = {
  isExhausted: boolean;
  isLoading: boolean;
};

export const useInfiniteLoader = <T = unknown>({
  onLoad,
  until,
  onError,
  onSuccess,
  anchor,
}: UseInfiniteLoaderProps<T>): UseInfiniteLoaderReturn => {
  const [page, setPage] = React.useState(1);
  const readyForNextLoadTimeout = React.useRef<NodeJS.Timeout>();

  const isIntersected = useIntersection(anchor);

  const exhaustedControl = useVisibilityControl();
  const readyForNextLoadControl = useVisibilityControl({ defaultVisible: true });

  const handleLoad: typeof onLoad = page => {
    readyForNextLoadControl.close();

    return onLoad(page);
  };

  const { isInitializing: isLoading } = useFetcher(['infiniteLoader', page], () => handleLoad(page), {
    onSuccess: data => {
      onSuccess?.(data);

      if (until(data)) {
        exhaustedControl.open();
      } else {
        exhaustedControl.close();
      }

      readyForNextLoadTimeout.current = setTimeout(() => {
        readyForNextLoadControl.open();
      }, WAIT_FOR_NEXT_LOAD_TIMEOUT);
    },
    onError,
  });

  const increasePageOnIntersection = React.useCallback(() => {
    if (isIntersected && readyForNextLoadControl.visible) {
      setPage(prev => prev + 1);
    }
  }, [isIntersected, readyForNextLoadControl.visible]);

  React.useEffect(() => {
    increasePageOnIntersection();
  }, [increasePageOnIntersection]);

  return React.useMemo(
    () => ({ isLoading, isExhausted: exhaustedControl.visible }),
    [exhaustedControl.visible, isLoading]
  );
};
