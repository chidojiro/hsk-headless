import { useControllableState } from '../useControllableState';
import React from 'react';

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

  const validatePage = React.useCallback(() => {
    if (page < 0) setPage(0);
    if (page > totalPage) setPage(totalPage);
  }, [page, setPage, totalPage]);

  React.useEffect(() => {
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

  const next = React.useCallback(() => {
    if (isNextDisabled) return;

    setPage(page + 1, (p: number) => Math.min(p + 1, totalPage));
  }, [isNextDisabled, page, setPage, totalPage]);

  const isPrevDisabled = page === 1;

  const prev = React.useCallback(() => {
    if (isPrevDisabled) return;

    setPage(page + 1, (p: number) => Math.max(p - 1, 1));
  }, [isPrevDisabled, page, setPage]);

  const clickPage = React.useCallback(
    (page: number) => {
      setPage(page);
    },
    [setPage]
  );

  const nextItem = React.useMemo<UsePaginationItem>(
    () => ({
      type: 'next',
      onClick: next,
      disabled: isNextDisabled,
      selected: false,
    }),
    [isNextDisabled, next]
  );

  const prevItem = React.useMemo<UsePaginationItem>(
    () => ({
      type: 'previous',
      onClick: prev,
      disabled: isPrevDisabled,
      selected: false,
    }),
    [isPrevDisabled, prev]
  );

  const ellipsisItem = React.useMemo<UsePaginationItem>(
    () => ({
      type: 'ellipsis',
      disabled: false,
      selected: false,
    }),
    []
  );

  const firstPageItem = React.useMemo<UsePaginationItem>(
    () => ({
      type: 'page',
      page: 1,
      onClick: () => clickPage(1),
      disabled: false,
      selected: false,
    }),
    [clickPage]
  );

  const lastPageItem = React.useMemo<UsePaginationItem>(
    () => ({
      type: 'page',
      page: totalPage,
      onClick: () => clickPage(totalPage),
      disabled: false,
      selected: false,
    }),
    [clickPage, totalPage]
  );

  const showingPageItems = React.useMemo<UsePaginationItem[]>(
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

  const items = React.useMemo(
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

  const showingRange = React.useMemo(
    () => ({
      from: totalRecord === 0 ? 0 : (page - 1) * perPage + 1,
      to: Math.min(totalRecord, page * perPage),
      total: totalRecord,
    }),
    [page, perPage, totalRecord]
  );

  const returnValue = React.useMemo<UsePaginationReturn>(
    () => ({
      items,
      showingRange,
    }),
    [items, showingRange]
  );

  return returnValue;
};
