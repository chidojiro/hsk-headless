import { act, render } from '@testing-library/react';
import { useState } from 'react';
import { useMountEffect } from '../useMountEffect';
import { useUpdateEffect } from './useUpdateEffect';

const mockListener = jest.fn();

const UPDATE_AFTER = 1000;

const HookHost = ({ updateAfter }: any) => {
  const [state, setState] = useState(false);

  useMountEffect(() => {
    if (updateAfter) {
      setTimeout(() => {
        setState(p => !p);
      }, updateAfter);
    }
  });

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
