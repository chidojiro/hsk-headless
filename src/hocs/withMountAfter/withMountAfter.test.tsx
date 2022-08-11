import React from 'react';
import { render, act } from '@testing-library/react';

import { withMountAfter } from './withMountAfter';

const UnmountEffectHost = () => {
  return <div>hello world</div>;
};

const renderComponent = (mountAfter: number) => {
  const Component = withMountAfter(mountAfter)(UnmountEffectHost);

  return render(<Component />);
};

it('should call mount callback after 1000ms', () => {
  const { queryByText } = renderComponent(1000);

  expect(queryByText('hello world')).not.toBeInTheDocument();
  act(() => {
    jest.advanceTimersByTime(999);
  });
  expect(queryByText('hello world')).not.toBeInTheDocument();
  act(() => {
    jest.advanceTimersByTime(1);
  });
  expect(queryByText('hello world')).toBeInTheDocument();
});
