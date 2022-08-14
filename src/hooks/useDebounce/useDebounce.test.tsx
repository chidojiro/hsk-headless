import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { useDebounce } from './useDebounce';

const getInput = () => screen.getByPlaceholderText('Enter text');
const getDebouncedValueContainer = () => screen.getByTestId('debounced-value-container');

const Component = () => {
  const [value, setValue] = React.useState('');

  const debouncedValue = useDebounce(value, 500);

  return (
    <div>
      <input value={value} onChange={e => setValue(e.target.value)} placeholder='Enter text' />
      <div data-testid='debounced-value-container'>{debouncedValue}</div>
    </div>
  );
};

it('should debounce value by 500ms', () => {
  render(<Component />);

  userEvent.type(getInput(), 'hel');
  act(() => {
    jest.advanceTimersByTime(499);
  });

  expect(getDebouncedValueContainer()).toContainHTML('');

  userEvent.type(getInput(), 'lo');
  act(() => {
    jest.advanceTimersByTime(499);
  });

  expect(getDebouncedValueContainer()).toContainHTML('');

  userEvent.type(getInput(), ' world');
  act(() => {
    jest.advanceTimersByTime(499);
  });

  expect(getDebouncedValueContainer()).toContainHTML('');

  act(() => {
    jest.advanceTimersByTime(1);
  });

  expect(getDebouncedValueContainer()).toContainHTML('hello world');
});
