import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useWindowState } from './useWindowState';

const key = 'key';
const eventKey = `useWindowState-${key}`;
const defaultState = 'defaultState';
const windowState = 'windowState';
const newState = 'newState';

const getWindowState = () => (window as any)[key];

const originalDispatchEvent = window.dispatchEvent;

beforeEach(() => {
  jest.spyOn(window, 'dispatchEvent');
});

afterEach(() => {
  (window as any)[key] = undefined;
});

it('should accept default state', () => {
  const { result } = renderHook(() => useWindowState(key, defaultState));

  expect(result.current[0]).toBe(defaultState);
});

it('should take corresponding window value as default state', () => {
  (window as any)[key] = windowState;

  const { result } = renderHook(() => useWindowState(key, defaultState));

  expect(result.current[0]).toBe(windowState);
});

it('should set internal state, save to window and dispatch new state when call setState with newState', () => {
  const { result } = renderHook(() => useWindowState(key, defaultState));

  act(() => {
    result.current[1](newState);
  });

  expect(result.current[0]).toBe(newState);
  expect(getWindowState()).toBe(newState);
  expect(window.dispatchEvent).toBeCalledWith(expect.objectContaining({ type: `useWindowState-${key}` }));
});

it('should set internal state, save to window and dispatch new state when call setState with a callback returning newState', () => {
  const { result } = renderHook(() => useWindowState(key, defaultState));

  act(() => {
    result.current[1](prev => {
      expect(prev).toBe(defaultState);

      return newState;
    });
  });

  expect(result.current[0]).toBe(newState);
  expect(getWindowState()).toBe(newState);
  expect(window.dispatchEvent).toBeCalledWith(expect.objectContaining({ type: eventKey }));
});

it('should update state when receive event', () => {
  const { result } = renderHook(() => useWindowState(key, defaultState));

  act(() => {
    originalDispatchEvent(new CustomEvent(eventKey, { detail: { state: newState, source: 123 } }));
  });

  expect(result.current[0]).toBe(newState);
});

it('should unregister event listener after unmount', () => {
  const { result, unmount } = renderHook(() => useWindowState(key, defaultState));

  unmount();

  act(() => {
    originalDispatchEvent(new CustomEvent(`useWindowState-${key}`, { detail: { state: newState, source: 123 } }));
  });

  expect(result.current[0]).toBe(defaultState);
});
