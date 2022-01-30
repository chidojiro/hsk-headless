import { useControllable } from '../../hooks';
import React from 'react';

export interface Item {
  type: 'page' | 'next' | 'previous' | 'ellipsis';
  onClick?: () => void;
  page?: number;
  selected: boolean;
  disabled: boolean;
}

export type Props = {
  page?: number;
  totalRecord: number;
  perPage?: number;
  onChange?: (page: number) => void;
  centerItemsCount?: number;
  sideItemsCount?: number;
};

export type Return = {
  items: Item[];
};

export const usePagination = ({
  page: pageProp,
  totalRecord = 0,
  perPage = 10,
  onChange,
  centerItemsCount = 3,
  sideItemsCount: sideItemsCountProp = 5,
}: Props): Return => {
  const [page, setPage] = useControllable({ value: pageProp, onChange, defaultValue: 1 });

  const sideItemsCount = Math.max(sideItemsCountProp, centerItemsCount) || 1;

  const totalPage = Math.ceil(totalRecord / perPage) || 1;

  const resolveShowingRange = () => {
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

  const showingRange = resolveShowingRange();

  const isNextDisabled = page >= totalPage;

  const next = React.useCallback(() => {
    if (isNextDisabled) return;

    setPage((p: number) => Math.min(p + 1, totalPage));
  }, [isNextDisabled, setPage, totalPage]);

  const isPrevDisabled = page === 1;

  const prev = React.useCallback(() => {
    if (isPrevDisabled) return;

    setPage((p: number) => Math.max(p - 1, 1));
  }, [isPrevDisabled, setPage]);

  const clickPage = React.useCallback(
    (page: number) => {
      setPage(page);
    },
    [setPage]
  );

  const nextItem = React.useMemo<Item>(
    () => ({
      type: 'next',
      onClick: next,
      disabled: isNextDisabled,
      selected: false,
    }),
    [isNextDisabled, next]
  );

  const prevItem = React.useMemo<Item>(
    () => ({
      type: 'previous',
      onClick: prev,
      disabled: isPrevDisabled,
      selected: false,
    }),
    [isPrevDisabled, prev]
  );

  const ellipsisItem = React.useMemo<Item>(
    () => ({
      type: 'ellipsis',
      disabled: false,
      selected: false,
    }),
    []
  );

  const firstPageItem = React.useMemo<Item>(
    () => ({
      type: 'page',
      page: 1,
      onClick: () => clickPage(1),
      disabled: false,
      selected: false,
    }),
    [clickPage]
  );

  const lastPageItem = React.useMemo<Item>(
    () => ({
      type: 'page',
      page: totalPage,
      onClick: () => clickPage(totalPage),
      disabled: false,
      selected: false,
    }),
    [clickPage, totalPage]
  );

  const showingRangeItems = React.useMemo<Item[]>(
    () =>
      showingRange.map(showingPage => ({
        type: 'page',
        page: showingPage,
        selected: showingPage === page,
        onClick: () => clickPage(showingPage),
        disabled: false,
      })),
    [clickPage, page, showingRange]
  );

  const returnValue = React.useMemo<Return>(
    () => ({
      items: [
        prevItem,
        showingRange[0] > 1 && firstPageItem,
        showingRange[0] > 2 && ellipsisItem,
        ...showingRangeItems,
        showingRange[showingRange.length - 1] < totalPage - 1 && ellipsisItem,
        showingRange[showingRange.length - 1] < totalPage && lastPageItem,
        nextItem,
      ].filter((item): item is Item => !!item),
      showingRange: {
        from: totalRecord === 0 ? 0 : (page - 1) * perPage + 1,
        to: Math.min(totalRecord, page * perPage),
        total: totalRecord,
      },
    }),
    [
      ellipsisItem,
      firstPageItem,
      lastPageItem,
      nextItem,
      page,
      perPage,
      prevItem,
      showingRange,
      showingRangeItems,
      totalPage,
      totalRecord,
    ]
  );

  return returnValue;
};
