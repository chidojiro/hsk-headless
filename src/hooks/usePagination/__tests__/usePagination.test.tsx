import { usePagination, UsePaginationProps } from '..';
import { act, renderHook, RenderResult } from '@testing-library/react-hooks';
import { PaginationItem, UsePaginationReturn } from '..';

const getItemPrevious = (result: RenderResult<UsePaginationReturn>) =>
  result.current.items[0] as Required<PaginationItem>;

const getItemNext = (result: RenderResult<UsePaginationReturn>) =>
  result.current.items[result.current.items.length - 1] as Required<PaginationItem>;

const getItemPage = (result: RenderResult<UsePaginationReturn>, page: number) =>
  result.current.items.find(item => page === item.page) as Required<PaginationItem>;

const getSelectedPage = (result: RenderResult<UsePaginationReturn>) =>
  result.current.items.find(({ selected }) => selected) as Required<PaginationItem>;

const getItemFirstPage = (result: RenderResult<UsePaginationReturn>) =>
  result.current.items[1] as Required<PaginationItem>;

const getItemLastPage = (result: RenderResult<UsePaginationReturn>) =>
  result.current.items[result.current.items.length - 2] as Required<PaginationItem>;

const getEllipsisItem = (result: RenderResult<UsePaginationReturn>) =>
  result.current.items.find(({ type }) => type === 'ellipsis') as Required<PaginationItem>;

const defaultTotalRecord = 100;
const defaultPerPage = 10;
const defaultCenterItemsCount = 3;
const defaultSideItemsCount = 5;

const renderDefault = (props?: Partial<UsePaginationProps>) =>
  renderHook(() =>
    usePagination({
      totalRecord: defaultTotalRecord,
      perPage: defaultPerPage,
      centerItemsCount: defaultCenterItemsCount,
      sideItemsCount: defaultSideItemsCount,
      ...props,
    })
  );

it('should render only one page item', () => {
  const { result } = renderHook(() => usePagination({ totalRecord: 0, centerItemsCount: 10, sideItemsCount: 10 }));

  const items = result.current.items;

  expect(items).toHaveLength(3);
  expect(items[0]).toEqual(expect.objectContaining({ disabled: true, type: 'previous', selected: false }));
  expect(items[1]).toEqual(expect.objectContaining({ disabled: false, type: 'page', page: 1, selected: true }));
  expect(items[2]).toEqual(expect.objectContaining({ disabled: true, type: 'next', selected: false }));
});

it('should show correct number of items on each end', () => {
  const { result } = renderHook(() =>
    usePagination({ totalRecord: 100, perPage: 10, centerItemsCount: 3, sideItemsCount: 5 })
  );

  let items = result.current.items;

  expect(items).toHaveLength(9);
  expect(items[0]).toEqual(expect.objectContaining({ disabled: true, type: 'previous', selected: false }));
  expect(items[1]).toEqual(expect.objectContaining({ disabled: false, type: 'page', page: 1, selected: true }));
  expect(items[2]).toEqual(expect.objectContaining({ disabled: false, type: 'page', page: 2, selected: false }));
  expect(items[3]).toEqual(expect.objectContaining({ disabled: false, type: 'page', page: 3, selected: false }));
  expect(items[4]).toEqual(expect.objectContaining({ disabled: false, type: 'page', page: 4, selected: false }));
  expect(items[5]).toEqual(expect.objectContaining({ disabled: false, type: 'page', page: 5, selected: false }));
  expect(items[6]).toEqual(expect.objectContaining({ disabled: false, type: 'ellipsis', selected: false }));
  expect(items[7]).toEqual(expect.objectContaining({ disabled: false, type: 'page', page: 10, selected: false }));
  expect(items[8]).toEqual(expect.objectContaining({ disabled: false, type: 'next', selected: false }));

  act(() => {
    result.current.items[items.length - 2].onClick?.();
  });

  items = result.current.items;

  expect(items).toHaveLength(9);
  expect(items[0]).toEqual(expect.objectContaining({ disabled: false, type: 'previous', selected: false }));
  expect(items[1]).toEqual(expect.objectContaining({ disabled: false, type: 'page', page: 1, selected: false }));
  expect(items[2]).toEqual(expect.objectContaining({ disabled: false, type: 'ellipsis', selected: false }));
  expect(items[3]).toEqual(expect.objectContaining({ disabled: false, type: 'page', page: 6, selected: false }));
  expect(items[4]).toEqual(expect.objectContaining({ disabled: false, type: 'page', page: 7, selected: false }));
  expect(items[5]).toEqual(expect.objectContaining({ disabled: false, type: 'page', page: 8, selected: false }));
  expect(items[6]).toEqual(expect.objectContaining({ disabled: false, type: 'page', page: 9, selected: false }));
  expect(items[7]).toEqual(expect.objectContaining({ disabled: false, type: 'page', page: 10, selected: true }));
  expect(items[8]).toEqual(expect.objectContaining({ disabled: true, type: 'next', selected: false }));
});

it('should navigate correctly', () => {
  const { result } = renderHook(() =>
    usePagination({ totalRecord: 30, perPage: 10, centerItemsCount: 3, sideItemsCount: 3 })
  );

  expect(getSelectedPage(result).page).toBe(1);
  act(() => {
    getItemNext(result).onClick();
  });
  expect(getSelectedPage(result).page).toBe(2);
  act(() => {
    getItemNext(result).onClick();
  });
  expect(getSelectedPage(result).page).toBe(3);

  act(() => {
    getItemPrevious(result).onClick();
  });
  expect(getSelectedPage(result).page).toBe(2);
  act(() => {
    getItemPrevious(result).onClick();
  });
  expect(getSelectedPage(result).page).toBe(1);

  act(() => {
    getItemPage(result, 3).onClick();
  });
  expect(getSelectedPage(result).page).toBe(3);
  act(() => {
    getItemPage(result, 2).onClick();
  });
  expect(getSelectedPage(result).page).toBe(2);
});

it('should be able to go to first/last page', () => {
  const { result } = renderDefault();

  expect(getSelectedPage(result).page).toBe(1);
  act(() => {
    getItemLastPage(result).onClick();
  });
  expect(getSelectedPage(result).page).toBe(10);
  act(() => {
    getItemFirstPage(result).onClick();
  });
  expect(getSelectedPage(result).page).toBe(1);
});

it('should show items correctly when page is center', () => {
  const { result } = renderDefault({ page: 5 });

  const items = result.current.items;

  expect(items).toHaveLength(9);
  expect(items[0]).toEqual(expect.objectContaining({ disabled: false, type: 'previous', selected: false }));
  expect(items[1]).toEqual(expect.objectContaining({ disabled: false, type: 'page', page: 1, selected: false }));
  expect(items[2]).toEqual(expect.objectContaining({ disabled: false, type: 'ellipsis', selected: false }));
  expect(items[3]).toEqual(expect.objectContaining({ disabled: false, type: 'page', page: 4, selected: false }));
  expect(items[4]).toEqual(expect.objectContaining({ disabled: false, type: 'page', page: 5, selected: true }));
  expect(items[5]).toEqual(expect.objectContaining({ disabled: false, type: 'page', page: 6, selected: false }));
  expect(items[6]).toEqual(expect.objectContaining({ disabled: false, type: 'ellipsis', selected: false }));
  expect(items[7]).toEqual(expect.objectContaining({ disabled: false, type: 'page', page: 10, selected: false }));
  expect(items[8]).toEqual(expect.objectContaining({ disabled: false, type: 'next', selected: false }));
});

it.each([
  { totalRecord: 3, perPage: 1, centerItemsCount: 3, page: 1 },
  { totalRecord: 4, perPage: 1, centerItemsCount: 3, page: 1 },
  { totalRecord: 4, perPage: 1, centerItemsCount: 3, page: 1 },
  { totalRecord: 5, perPage: 1, centerItemsCount: 3, page: 3 },
])(
  `should not show ellipsis on page $page of $totalRecord with centerItemsCount of $centerItemsCount`,
  (props: Partial<UsePaginationProps>) => {
    const { result } = renderDefault(props);

    expect(getEllipsisItem(result)).toBeUndefined();
  }
);

it('should disable item previous', () => {
  const { result } = renderDefault();

  expect(getItemPrevious(result).disabled).toBe(true);
});

it('should disable item next', () => {
  const { result } = renderDefault();

  act(() => {
    getItemLastPage(result).onClick();
  });

  expect(getItemNext(result).disabled).toBe(true);
});
