import { act, render, waitFor } from '@testing-library/react';
import React from 'react';
import { useInfiniteLoader, UseInfiniteLoaderProps } from './useInfiniteLoader';
import * as mockUseIntersection from '../useIntersection';
import userEvent from '@testing-library/user-event';
import { PromiseUtils } from '@/utils';

const mockOnLoad = jest.fn().mockReturnValue([]);

type HookHostProps = Pick<UseInfiniteLoaderProps<any>, 'mode' | 'defaultPage'> & {
  onLoad?: () => any;
  until?: () => boolean;
};

const HookHost = (props: HookHostProps) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const { isExhausted, isLoading, loadMore } = useInfiniteLoader({
    until: () => true,
    onLoad: mockOnLoad,
    anchor: ref,
    ...props,
  });

  return (
    <div>
      {isLoading && <div>loading</div>}
      {isExhausted && <div>exhausted</div>}
      {props.mode === 'ON_SIGHT' ? <div ref={ref} /> : <button onClick={loadMore}>load more</button>}
    </div>
  );
};

const renderComponent = (props: HookHostProps) => {
  return render(<HookHost {...props} />);
};

describe('ON_SIGHT', () => {
  beforeEach(() => {
    jest.spyOn(mockUseIntersection, 'useIntersection').mockReturnValue(true);
  });

  it('Should load when intersected', async () => {
    const { queryByText } = renderComponent({ mode: 'ON_SIGHT' });

    expect(mockOnLoad).toBeCalledWith(1);
    await waitFor(() => expect(queryByText('loading')).not.toBeInTheDocument());
  });

  it('Should load with default page when intersected', async () => {
    const { queryByText } = renderComponent({ mode: 'ON_SIGHT', defaultPage: 2 });

    expect(mockOnLoad).toBeCalledWith(2);
    await waitFor(() => expect(queryByText('loading')).not.toBeInTheDocument());
  });

  it('Should not load when not intersected', async () => {
    jest.spyOn(mockUseIntersection, 'useIntersection').mockReturnValue(false);
    const { queryByText } = renderComponent({ mode: 'ON_SIGHT' });

    expect(mockOnLoad).not.toBeCalled();
    await waitFor(() => expect(queryByText('loading')).not.toBeInTheDocument());
  });

  it('Should render loading and exhaust indicators', async () => {
    jest.spyOn(mockUseIntersection, 'useIntersection').mockReturnValue(true);
    const mockOnLoad = jest.fn().mockImplementation(async () => {
      await PromiseUtils.sleep(500);
      return [];
    });
    const { queryByText } = renderComponent({ mode: 'ON_SIGHT', onLoad: mockOnLoad, until: () => true });

    expect(mockOnLoad).toBeCalled();
    expect(queryByText('loading')).toBeInTheDocument();
    expect(queryByText('exhausted')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(queryByText('loading')).not.toBeInTheDocument();
      expect(queryByText('exhausted')).toBeInTheDocument();
    });
  });
});

describe('ON_DEMAND', () => {
  it('Should load when click on load more button', async () => {
    jest.spyOn(mockUseIntersection, 'useIntersection').mockReturnValue(true);
    const { getByText, queryByText } = renderComponent({ mode: 'ON_DEMAND' });

    act(() => {
      userEvent.click(getByText('load more'));
    });

    expect(mockOnLoad).toBeCalledWith(1);
    await waitFor(() => expect(queryByText('loading')).not.toBeInTheDocument());
  });

  it('Should load with default page when click on load more button', async () => {
    const { getByText, queryByText } = renderComponent({ mode: 'ON_DEMAND', defaultPage: 2 });

    act(() => {
      userEvent.click(getByText('load more'));
    });

    expect(mockOnLoad).toBeCalledWith(2);
    await waitFor(() => expect(queryByText('loading')).not.toBeInTheDocument());
  });

  it('Should not load when not click on load more button', async () => {
    renderComponent({ mode: 'ON_DEMAND' });

    expect(mockOnLoad).not.toBeCalled();
  });

  it('Should render loading and exhaust indicators', async () => {
    const mockOnLoad = jest.fn().mockImplementation(async () => {
      await PromiseUtils.sleep(500);
      return [];
    });
    const { queryByText, getByText } = renderComponent({ mode: 'ON_DEMAND', onLoad: mockOnLoad, until: () => true });

    expect(queryByText('loading')).not.toBeInTheDocument();
    expect(queryByText('exhausted')).not.toBeInTheDocument();

    act(() => {
      userEvent.click(getByText('load more'));
    });

    expect(queryByText('loading')).toBeInTheDocument();
    expect(queryByText('exhausted')).not.toBeInTheDocument();

    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(queryByText('loading')).not.toBeInTheDocument();
      expect(queryByText('exhausted')).toBeInTheDocument();
    });
  });
});
