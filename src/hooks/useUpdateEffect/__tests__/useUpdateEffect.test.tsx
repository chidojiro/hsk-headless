import { render, act } from '@testing-library/react';
import React from 'react';
import { useUpdateEffect } from '..';

const mockListener = jest.fn();

const UPDATE_AFTER = 1000;

const HookHost = ({ updateAfter }: any) => {
  const [state, setState] = React.useState(false);

  React.useEffect(() => {
    if (updateAfter) {
      setTimeout(() => {
        setState(p => !p);
      }, updateAfter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useUpdateEffect(() => {
    mockListener();
  }, [state]);

  return null;
};

const renderComponent = (updateAfter?: number) => {
  return render(<HookHost updateAfter={updateAfter} />);
};

it('should call listener', () => {
  renderComponent();

  expect(mockListener).not.toBeCalled();
});

it('should not call listener', () => {
  renderComponent(UPDATE_AFTER);

  act(() => {
    jest.advanceTimersByTime(UPDATE_AFTER);
  });

  expect(mockListener).toBeCalled();
});
