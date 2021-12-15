import { render, act } from '@testing-library/react';
import React from 'react';
import { Mounter } from '../../../tests';
import useScrollDisable from '../useScrollDisable';

const HookHost = ({ isDisabled }: any) => {
  useScrollDisable(isDisabled);

  return null;
};

const UNMOUNT_AFTER = 1000;

const renderComponent = (isDisabled: boolean, unmountAfter?: number) => {
  return render(
    <Mounter unmountAfter={unmountAfter}>
      <HookHost isDisabled={isDisabled} />
    </Mounter>
  );
};

it('should disable scroll', () => {
  renderComponent(true);

  expect(document.querySelector('body')).toHaveStyle('overflow: hidden');
});

it('should not disable scroll', () => {
  renderComponent(false);

  expect(document.querySelector('body')).not.toHaveStyle('overflow: hidden');
});

it('should unsubscribe scroll listener', () => {
  renderComponent(true, UNMOUNT_AFTER);

  act(() => {
    jest.advanceTimersByTime(UNMOUNT_AFTER);
  });

  expect(document.querySelector('body')).not.toHaveStyle('overflow: hidden');
});
