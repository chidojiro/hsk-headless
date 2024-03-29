import { useCallback, useEffect, useMemo } from 'react';
import { useControllableState } from '../useControllableState';

export type UsePaginationItem = {
  type: 'page' | 'next' | 'previous' | 'ellipsis';
  onClick?: () => void;
  page?: number;
  selected: boolean;
  disabled: boolean;
};

export type UsePaginationProps = {
  page?: number;
  totalRecord: number;
  perPage?: number;
  onChange?: (page: number) => void;
  centerItemsCount?: number;
  sideItemsCount?: number;
};

export type UsePaginationShowingRange = {
  from: number;
  to: number;
  total: number;
};

export type UsePaginationReturn = {
  items: UsePaginationItem[];
  showingRange: UsePaginationShowingRange;
};

export const usePagination = ({
  page: pageProp,
  totalRecord = 0,
  perPage = 10,
  onChange,
  centerItemsCount = 3,
  sideItemsCount: sideItemsCountProp = 5,
}: UsePaginationProps): UsePaginationReturn => {
  if (perPage === 0) throw new Error('invalid prop "perPage"');
  if (sideItemsCountProp === 0) throw new Error('invalid prop "sideItemsCount"');
  if (centerItemsCount === 0) throw new Error('invalid prop "centerItemsCount"');

  const sideItemsCount = Math.max(sideItemsCountProp, centerItemsCount);

  const totalPage = Math.ceil(totalRecord / perPage) || 1;

  const [page, setPage] = useControllableState({ value: pageProp, onChange, defaultValue: 1 });

  const validatePage = useCallback(() => {
    if (page < 0) setPage(0);
    if (page > totalPage) setPage(totalPage);
  }, [page, setPage, totalPage]);

  useEffect(() => {
    validatePage();
  }, [validatePage]);

  const resolveShowingPages = () => {
    const numberToRange = (num: number, offset = 0) => {
      return new Array(num).fill(null).map((_, idx) => idx + 1 + offset);
    };

    if (totalPage <= sideItemsCount + 1) return numberToRange(totalPage);

    if (page >= sideItemsCount && page <= totalPage - sideItemsCount + 1)
      return numberToRange(centerItemsCount, page - Math.floor(centerItemsCount / 2) - 1);

    if (page < sideItemsCount) return numberToRange(sideItemsCount);

    if (page > totalPage - sideItemsCount + 1) return numberToRange(sideItemsCount, totalPage - sideItemsCount);

    return numberToRange(totalPage);
  };

  const showingPages = resolveShowingPages();

  const isNextDisabled = page >= totalPage;

  const next = useCallback(() => {
    if (isNextDisabled) return;

    setPage(prev => Math.min(prev + 1, totalPage));
  }, [isNextDisabled, setPage, totalPage]);

  const isPrevDisabled = page === 1;

  const prev = useCallback(() => {
    if (isPrevDisabled) return;

    setPage(prev => Math.max(prev - 1, 1));
  }, [isPrevDisabled, setPage]);

  const clickPage = useCallback(
    (page: number) => {
      setPage(page);
    },
    [setPage]
  );

  const nextItem = useMemo<UsePaginationItem>(
    () => ({
      type: 'next',
      onClick: next,
      disabled: isNextDisabled,
      selected: false,
    }),
    [isNextDisabled, next]
  );

  const prevItem = useMemo<UsePaginationItem>(
    () => ({
      type: 'previous',
      onClick: prev,
      disabled: isPrevDisabled,
      selected: false,
    }),
    [isPrevDisabled, prev]
  );

  const ellipsisItem = useMemo<UsePaginationItem>(
    () => ({
      type: 'ellipsis',
      disabled: false,
      selected: false,
    }),
    []
  );

  const firstPageItem = useMemo<UsePaginationItem>(
    () => ({
      type: 'page',
      page: 1,
      onClick: () => clickPage(1),
      disabled: false,
      selected: false,
    }),
    [clickPage]
  );

  const lastPageItem = useMemo<UsePaginationItem>(
    () => ({
      type: 'page',
      page: totalPage,
      onClick: () => clickPage(totalPage),
      disabled: false,
      selected: false,
    }),
    [clickPage, totalPage]
  );

  const showingPageItems = useMemo<UsePaginationItem[]>(
    () =>
      showingPages.map(showingPage => ({
        type: 'page',
        page: showingPage,
        selected: showingPage === page,
        onClick: () => clickPage(showingPage),
        disabled: false,
      })),
    [clickPage, page, showingPages]
  );

  const items = useMemo(
    () =>
      [
        prevItem,
        showingPages[0] > 1 && firstPageItem,
        showingPages[0] > 2 && ellipsisItem,
        ...showingPageItems,
        showingPages[showingPages.length - 1] < totalPage - 1 && ellipsisItem,
        showingPages[showingPages.length - 1] < totalPage && lastPageItem,
        nextItem,
      ].filter((item): item is UsePaginationItem => !!item),
    [ellipsisItem, firstPageItem, lastPageItem, nextItem, prevItem, showingPages, showingPageItems, totalPage]
  );

  const showingRange = useMemo(
    () => ({
      from: totalRecord === 0 ? 0 : (page - 1) * perPage + 1,
      to: Math.min(totalRecord, page * perPage),
      total: totalRecord,
    }),
    [page, perPage, totalRecord]
  );

  const returnValue = useMemo<UsePaginationReturn>(
    () => ({
      items,
      showingRange,
    }),
    [items, showingRange]
  );

  return returnValue;
};
