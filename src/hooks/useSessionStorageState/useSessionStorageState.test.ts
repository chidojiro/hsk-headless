import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { SessionStorageUtils } from '@/utils';
import { getUseEventBasedStateEventKey } from '../useEventBasedState';
import { NAME, useSessionStorageState } from './useSessionStorageState';

const key = 'key';
const eventKey = getUseEventBasedStateEventKey(NAME, key);
const defaultState = 'defaultState';
const sessionStorageState = 'sessionStorageState';
const newState = 'newState';

const getSessionStorageState = () => SessionStorageUtils.get(key);

const originalDispatchEvent = window.dispatchEvent;

beforeEach(() => {
  jest.spyOn(window, 'dispatchEvent');
});

afterEach(() => {
  SessionStorageUtils.set(key, undefined);
});

it('should accept default state', () => {
  const { result } = renderHook(() => useSessionStorageState(key, defaultState));

  expect(result.current[0]).toBe(defaultState);
});

it('should take corresponding window value as default state', () => {
  SessionStorageUtils.set(key, sessionStorageState);

  const { result } = renderHook(() => useSessionStorageState(key, defaultState));

  expect(result.current[0]).toBe(sessionStorageState);
});

it('should set internal state, save to window and dispatch new state when call setState with newState', () => {
  const { result } = renderHook(() => useSessionStorageState(key, defaultState));

  act(() => {
    result.current[1](newState);
  });

  expect(result.current[0]).toBe(newState);
  expect(getSessionStorageState()).toBe(newState);
  expect(window.dispatchEvent).toBeCalledWith(expect.objectContaining({ type: eventKey }));
});

it('should set internal state, save to window and dispatch new state when call setState with a callback returning newState', () => {
  const { result } = renderHook(() => useSessionStorageState(key, defaultState));

  act(() => {
    result.current[1](prev => {
      expect(prev).toBe(defaultState);

      return newState;
    });
  });

  expect(result.current[0]).toBe(newState);
  expect(getSessionStorageState()).toBe(newState);
  expect(window.dispatchEvent).toBeCalledWith(expect.objectContaining({ type: eventKey }));
});

it('should update state when receive event', () => {
  const { result } = renderHook(() => useSessionStorageState(key, defaultState));

  act(() => {
    originalDispatchEvent(new CustomEvent(eventKey, { detail: { state: newState, source: 123 } }));
  });

  expect(result.current[0]).toBe(newState);
});

it('should unregister event listener after unmount', () => {
  const { result, unmount } = renderHook(() => useSessionStorageState(key, defaultState));

  unmount();

  act(() => {
    originalDispatchEvent(new CustomEvent(eventKey, { detail: { state: newState, source: 123 } }));
  });

  expect(result.current[0]).toBe(defaultState);
});
