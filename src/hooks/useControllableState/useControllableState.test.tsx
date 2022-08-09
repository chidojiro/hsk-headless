import { renderHook, act } from '@testing-library/react-hooks';
import { useControllableState } from './useControllableState';

const mockOnChange = jest.fn();
const defaultValue = 'defaultValue';
const value = 'value';
const newValue = 'newValue';
const newInternalValue = 'newInternalValue';
const newExternalValue = 'newExternalValue';

describe('Shorthand syntax', () => {
  it('should be uncontrolled', () => {
    const { result } = renderHook(() =>
      useControllableState<string, string>({ value: undefined, onChange: mockOnChange, defaultValue: '' })
    );

    expect(result.current[0]).toBe('');

    act(() => result.current[1](newValue));

    expect(result.current[0]).toBe(newValue);
    expect(mockOnChange).toBeCalledWith(newValue);
  });

  it('should be controlled', () => {
    const { result } = renderHook(() => useControllableState({ value, defaultValue, onChange: mockOnChange }));

    expect(result.current[0]).toBe(value);

    act(() => result.current[1](newValue));

    expect(result.current[0]).toBe(value);
    expect(mockOnChange).toBeCalledWith(newValue);
  });

  it('should accept default value', () => {
    const { result } = renderHook(() =>
      useControllableState({ value: undefined, defaultValue, onChange: mockOnChange })
    );

    expect(result.current[0]).toBe(defaultValue);

    act(() => result.current[1](newValue));

    expect(result.current[0]).toBe(newValue);
    expect(mockOnChange).toBeCalledWith(newValue);
  });

  it('should be able to set callback state when uncontrolled', () => {
    const { result } = renderHook(() =>
      useControllableState<string>({ value: undefined, defaultValue, onChange: mockOnChange })
    );

    expect(result.current[0]).toBe(defaultValue);

    act(() =>
      result.current[1](prev => {
        expect(prev).toBe(defaultValue);
        return newValue;
      })
    );

    expect(result.current[0]).toBe(newValue);
    expect(mockOnChange).toBeCalledWith(newValue);
  });

  it('should be able to set callback state when controlled', () => {
    const { result } = renderHook(() => useControllableState<string>({ value, defaultValue, onChange: mockOnChange }));

    expect(result.current[0]).toBe(value);

    act(() =>
      result.current[1](prev => {
        expect(prev).toBe(value);
        return newValue;
      })
    );

    expect(result.current[0]).toBe(value);
    expect(mockOnChange).toBeCalledWith(newValue);
  });
});

describe('Verbose syntax', () => {
  it('should be uncontrolled', () => {
    const { result } = renderHook(() =>
      useControllableState<string, string>({ value: undefined, onChange: mockOnChange, defaultValue: '' })
    );

    expect(result.current[0]).toBe('');

    act(() => result.current[1]({ internal: newInternalValue, external: newExternalValue }));

    expect(result.current[0]).toBe(newInternalValue);
    expect(mockOnChange).toBeCalledWith(newExternalValue);
  });

  it('should be controlled', () => {
    const { result } = renderHook(() => useControllableState({ value, defaultValue, onChange: mockOnChange }));

    expect(result.current[0]).toBe(value);

    act(() => result.current[1]({ internal: newInternalValue, external: newExternalValue }));

    expect(result.current[0]).toBe(value);
    expect(mockOnChange).toBeCalledWith(newExternalValue);
  });

  it('should accept default value', () => {
    const { result } = renderHook(() =>
      useControllableState({ value: undefined, defaultValue, onChange: mockOnChange })
    );

    expect(result.current[0]).toBe(defaultValue);

    act(() => result.current[1]({ internal: newInternalValue, external: newExternalValue }));

    expect(result.current[0]).toBe(newInternalValue);
    expect(mockOnChange).toBeCalledWith(newExternalValue);
  });

  it('should be able to set callback state when uncontrolled', () => {
    const { result } = renderHook(() =>
      useControllableState<string>({ value: undefined, defaultValue, onChange: mockOnChange })
    );

    expect(result.current[0]).toBe(defaultValue);

    act(() =>
      result.current[1]({
        internal: prev => {
          expect(prev).toBe(defaultValue);
          return newInternalValue;
        },
        external: newExternalValue,
      })
    );

    expect(result.current[0]).toBe(newInternalValue);
    expect(mockOnChange).toBeCalledWith(newExternalValue);
  });

  it('should not call set callback state when controlled', () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() => useControllableState<string>({ value, defaultValue, onChange: mockOnChange }));

    expect(result.current[0]).toBe(value);

    act(() =>
      result.current[1]({
        internal: mockCallback,
        external: newExternalValue,
      })
    );

    expect(result.current[0]).toBe(value);
    expect(mockCallback).not.toBeCalled();
    expect(mockOnChange).toBeCalledWith(newExternalValue);
  });
});
