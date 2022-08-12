import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useDelayableState } from './useDelayableState';

const defaultState = 'defaultState';
const newState = 'newState';

it('should accept default state', () => {
  const { result } = renderHook(() => useDelayableState({ defaultState, delayBy: 0 }));

  expect(result.current[0]).toBe(defaultState);
});

it('should set state as normal setState', () => {
  const { result } = renderHook(() => useDelayableState({ defaultState, delayBy: 0 }));

  act(() => {
    result.current[1]({ state: newState, shouldDelay: false });
  });

  expect(result.current[0]).toBe(newState);
});

it('should set state after 500ms', () => {
  const { result } = renderHook(() => useDelayableState({ defaultState, delayBy: 500 }));

  act(() => {
    result.current[1]({ state: newState, shouldDelay: true });
  });

  expect(result.current[0]).toBe(defaultState);
  act(() => {
    jest.advanceTimersByTime(499);
  });
  expect(result.current[0]).toBe(defaultState);
  act(() => {
    jest.advanceTimersByTime(1);
  });
  expect(result.current[0]).toBe(newState);
});

it('should set state without delay', () => {
  const { result } = renderHook(() => useDelayableState({ defaultState, delayBy: 500 }));

  act(() => {
    result.current[1]({ state: newState, shouldDelay: false });
  });

  expect(result.current[0]).toBe(newState);
});
