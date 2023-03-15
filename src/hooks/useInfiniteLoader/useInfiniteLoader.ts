import { RefObject, useMemo } from 'react';
import { useDisclosure } from '../useDisclosure';
import {
  useOnDemandInfiniteLoader,
  UseOnDemandInfiniteLoaderProps as BaseUseOnDemandInfiniteLoaderProps,
  UseOnDemandInfiniteLoaderReturn as BaseUseOnDemandInfiniteLoaderReturn,
} from './useOnDemandInfiniteLoader';
import {
  useOnSightInfiniteLoader,
  UseOnSightInfiniteLoaderProps as BaseUseOnSightInfiniteLoaderProps,
  UseOnSightInfiniteLoaderReturn as BaseUseOnSightInfiniteLoaderReturn,
} from './useOnSightInfiniteLoader';

type BaseUseInfiniteLoaderProps<T> = { until: (data: T) => boolean };
type UseOnSightInfiniteLoaderProps<T> = {
  mode: 'ON_SIGHT';
  anchor: RefObject<HTMLElement> | HTMLElement | null;
} & BaseUseInfiniteLoaderProps<T> &
  Omit<BaseUseOnSightInfiniteLoaderProps<T>, 'enabled'>;
type UseOnDemandInfiniteLoaderProps<T> = { mode: 'ON_DEMAND' } & BaseUseInfiniteLoaderProps<T> &
  BaseUseOnDemandInfiniteLoaderProps<T>;
export type UseInfiniteLoaderProps<T> = UseOnDemandInfiniteLoaderProps<T> | UseOnSightInfiniteLoaderProps<T>;

type BaseUseInfiniteLoaderReturn = { isExhausted: boolean };
type UseOnDemandInfiniteLoaderReturn = BaseUseInfiniteLoaderReturn & BaseUseOnDemandInfiniteLoaderReturn;
type UseOnSightInfiniteLoaderReturn = BaseUseInfiniteLoaderReturn & BaseUseOnSightInfiniteLoaderReturn;
export type UseInfiniteLoaderReturn = UseOnDemandInfiniteLoaderReturn & UseOnSightInfiniteLoaderReturn;

export function useInfiniteLoader<TData>(props: UseInfiniteLoaderProps<TData>): UseInfiniteLoaderReturn {
  const { onLoad, until, onError, mode = 'ON_SIGHT', defaultPage } = props;

  const exhaustedDisclosure = useDisclosure();

  const handleLoad: typeof onLoad = async page => {
    const data = await onLoad(page);

    if (until(data)) {
      exhaustedDisclosure.open();
    } else {
      exhaustedDisclosure.close();
    }

    return data;
  };

  const commonConfig = { onLoad: handleLoad, defaultPage, onError };

  const { isLoading: isLoadingOnSight } = useOnSightInfiniteLoader({
    anchor: (props as UseOnSightInfiniteLoaderProps<TData>).anchor,
    enabled: mode === 'ON_SIGHT' && !exhaustedDisclosure.isOpen,
    ...commonConfig,
  });

  const { isLoading: isLoadingOnDemand, loadMore } = useOnDemandInfiniteLoader({
    ...commonConfig,
    enabled: mode === 'ON_DEMAND' && !exhaustedDisclosure.isOpen,
  });

  return useMemo(
    () => ({
      isLoading: isLoadingOnSight || isLoadingOnDemand,
      isExhausted: exhaustedDisclosure.isOpen,
      loadMore,
    }),
    [isLoadingOnSight, isLoadingOnDemand, exhaustedDisclosure.isOpen, loadMore]
  );
}
