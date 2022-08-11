import React from 'react';
import { render, act } from '@testing-library/react';

import { withUmountAfter } from './withUmountAfter';

const Component = () => {
  return <div>hello world</div>;
};

const renderComponent = (unmountAfter: number) => {
  const ComponentWrapper = withUmountAfter(unmountAfter)(Component);

  return render(<ComponentWrapper />);
};

it('should unmount after 1000ms', () => {
  const { queryByText } = renderComponent(1000);

  expect(queryByText('hello world')).toBeInTheDocument();
  act(() => {
    jest.advanceTimersByTime(999);
  });
  expect(queryByText('hello world')).toBeInTheDocument();
  act(() => {
    jest.advanceTimersByTime(1);
  });
  expect(queryByText('hello world')).not.toBeInTheDocument();
});
