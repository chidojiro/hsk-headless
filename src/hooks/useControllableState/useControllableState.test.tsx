import { renderHook, act } from '@testing-library/react-hooks';
import { useControllableState } from './useControllableState';

const mockOnChange = jest.fn();
const defaultValue = 'defaultValue';
const value = 'value';

it('should be uncontrolled', () => {
  const { result } = renderHook(() =>
    useControllableState<string, string>({ value: undefined, onChange: mockOnChange })
  );

  expect(result.current[0]).toBeUndefined();

  const newValue = 'newValue';

  act(() => result.current[1](newValue));

  expect(result.current[0]).toBe(newValue);
  expect(mockOnChange).toBeCalledWith(newValue);
});

it('should be controlled', () => {
  const { result } = renderHook(() => useControllableState({ value, defaultValue, onChange: mockOnChange }));

  expect(result.current[0]).toBe(value);

  const newValue = 'newValue';

  act(() => result.current[1](newValue));

  expect(result.current[0]).toBe(value);
  expect(mockOnChange).toBeCalledWith(newValue);
});

it('should accept default value', () => {
  const { result } = renderHook(() => useControllableState({ value: undefined, defaultValue, onChange: mockOnChange }));

  expect(result.current[0]).toBe(defaultValue);

  const newValue = 'newValue';

  act(() => result.current[1](newValue));

  expect(result.current[0]).toBe(newValue);
  expect(mockOnChange).toBeCalledWith(newValue);
});

it('should be able to set callback state when uncontrolled', () => {
  const { result } = renderHook(() => useControllableState({ value: undefined, defaultValue, onChange: mockOnChange }));

  expect(result.current[0]).toBe(defaultValue);

  const newValue = 'world';

  act(() =>
    result.current[1]('hello', prev => {
      expect(prev).toBe(defaultValue);
      return newValue;
    })
  );

  expect(result.current[0]).toBe(newValue);
  expect(mockOnChange).toBeCalledWith(newValue);
});

it('should ignore set callback state when controlled', () => {
  const controlledValue = 'controlledValue';

  const { result } = renderHook(() =>
    useControllableState({ value: controlledValue, defaultValue, onChange: mockOnChange })
  );

  const mockSetStateCallback = jest.fn();

  expect(result.current[0]).toBe(controlledValue);

  const newValue = 'hello';

  act(() => result.current[1](newValue, mockSetStateCallback));

  expect(mockSetStateCallback).not.toBeCalled();
  expect(result.current[0]).toBe(controlledValue);
  expect(mockOnChange).toBeCalledWith(newValue);
});
