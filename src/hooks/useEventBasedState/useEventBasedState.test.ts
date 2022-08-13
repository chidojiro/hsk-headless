import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useEventBasedState } from './useEventBasedState';

const key = 'key';
const eventKey = `useEventBasedState_${key}`;
const defaultState = 'defaultState';
const storageState = 'storageState';
const newState = 'newState';

const originalDispatchEvent = window.dispatchEvent;

const mockStorage = {
  data: {} as Record<string, string | undefined>,
  get: function (key: string) {
    return this.data[key];
  },
  set: function (key: string, value: string | undefined) {
    return (this.data[key] = value);
  },
};

const getStorageState = () => mockStorage.get(key);

beforeEach(() => {
  jest.spyOn(window, 'dispatchEvent');
});

afterEach(() => {
  mockStorage.set(key, undefined);
});

it('should accept default state', () => {
  const { result } = renderHook(() => useEventBasedState({ key, defaultState, storage: mockStorage }));

  expect(result.current[0]).toBe(defaultState);
});

it('should take corresponding window value as default state', () => {
  mockStorage.set(key, storageState);

  const { result } = renderHook(() => useEventBasedState({ key, defaultState, storage: mockStorage }));

  expect(result.current[0]).toBe(storageState);
});

it('should set internal state, save to window and dispatch new state when call setState with newState', () => {
  const { result } = renderHook(() => useEventBasedState({ key, defaultState, storage: mockStorage }));

  act(() => {
    result.current[1](newState);
  });

  expect(result.current[0]).toBe(newState);
  expect(getStorageState()).toBe(newState);
  expect(window.dispatchEvent).toBeCalledWith(expect.objectContaining({ type: eventKey }));
});

it('should set internal state, save to window and dispatch new state when call setState with a callback returning newState', () => {
  const { result } = renderHook(() => useEventBasedState({ key, defaultState, storage: mockStorage }));

  act(() => {
    result.current[1](prev => {
      expect(prev).toBe(defaultState);

      return newState;
    });
  });

  expect(result.current[0]).toBe(newState);
  expect(getStorageState()).toBe(newState);
  expect(window.dispatchEvent).toBeCalledWith(expect.objectContaining({ type: eventKey }));
});

it('should update state when receive event', () => {
  const { result } = renderHook(() => useEventBasedState({ key, defaultState, storage: mockStorage }));

  act(() => {
    originalDispatchEvent(new CustomEvent(eventKey, { detail: { state: newState, source: 123 } }));
  });

  expect(result.current[0]).toBe(newState);
});

it('should unregister event listener after unmount', () => {
  const { result, unmount } = renderHook(() => useEventBasedState({ key, defaultState, storage: mockStorage }));

  unmount();

  act(() => {
    originalDispatchEvent(new CustomEvent(`useEventBasedState-${key}`, { detail: { state: newState, source: 123 } }));
  });

  expect(result.current[0]).toBe(defaultState);
});
