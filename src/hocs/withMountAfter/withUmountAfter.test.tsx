import React from 'react';
import { render, act } from '@testing-library/react';

import { useMountEffect } from 'hooks';
import { withUmountAfter } from './withUmountAfter';

const mockUnmountCallback = jest.fn();

const UnmountEffectHost = () => {
  useMountEffect(() => () => mockUnmountCallback());

  return null;
};

const UNMOUNT_AFTER = 1000;

const renderComponent = (unmountAfter = UNMOUNT_AFTER) => {
  const Component = withUmountAfter(unmountAfter)(UnmountEffectHost);

  render(<Component />);
};

it('should call unmount callback after 1000ms', () => {
  renderComponent();

  expect(mockUnmountCallback).not.toBeCalled();
  act(() => {
    jest.advanceTimersByTime(999);
  });
  expect(mockUnmountCallback).not.toBeCalled();
  act(() => {
    jest.advanceTimersByTime(1);
  });
  expect(mockUnmountCallback).toBeCalled();
});
