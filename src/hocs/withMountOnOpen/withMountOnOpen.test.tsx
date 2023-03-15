import { act, render } from '@testing-library/react';

import { OpenClose } from '@/types';
import { withMountOnOpen } from './withMountOnOpen';

const Component = ({ name }: Record<string, any>) => {
  return <div>{name ? `hello ${name}` : 'hello world'}</div>;
};

const renderComponent = (props: OpenClose & { delayCloseBy: number }, customProps?: Record<string, any>) => {
  const { delayCloseBy, ...restProps } = props;

  const ComponentWrapper = withMountOnOpen(delayCloseBy)(Component);

  const { rerender, ...restRenderReturn } = render(<ComponentWrapper {...restProps} {...customProps} />);

  return {
    rerender: (props: OpenClose) => rerender(<ComponentWrapper {...props} {...customProps} />),
    ...restRenderReturn,
  };
};

it('should not mount component when open is false', () => {
  const { queryByText } = renderComponent({ open: false, delayCloseBy: 1000 });

  expect(queryByText('hello world')).not.toBeInTheDocument();
});

it('should mount component when open is true', () => {
  const { queryByText } = renderComponent({ open: true, delayCloseBy: 1000 });

  expect(queryByText('hello world')).toBeInTheDocument();
});

it('should not delay unmount when delayCloseBy is 0', () => {
  const { queryByText, rerender } = renderComponent({ open: true, delayCloseBy: 0 });

  expect(queryByText('hello world')).toBeInTheDocument();

  rerender({ open: false });

  expect(queryByText('hello world')).not.toBeInTheDocument();
});

it('should delay unmount by 1000 and retain props while closing', () => {
  const customProps = { name: 'Nick' };
  const { queryByText, rerender } = renderComponent({ open: true, delayCloseBy: 1000 }, customProps);

  expect(queryByText('hello Nick')).toBeInTheDocument();

  rerender({ open: false });

  expect(queryByText('hello Nick')).toBeInTheDocument();
  act(() => {
    jest.advanceTimersByTime(999);
  });
  expect(queryByText('hello Nick')).toBeInTheDocument();
  act(() => {
    jest.advanceTimersByTime(1);
  });
  expect(queryByText('hello Nick')).not.toBeInTheDocument();
});
