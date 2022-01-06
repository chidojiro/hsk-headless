import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';

import { RadioGroup, RadioGroupProps } from '..';
import userEvent from '@testing-library/user-event';

const renderRadioGroup = (props?: Partial<RadioGroupProps>) =>
  render(
    <RadioGroup {...props}>
      <div className='flex flex-col'>
        <RadioGroup.Option value='1'>
          {({ handleChange, isChecked, value }) => (
            <label>
              <input data-testid='option 1' type='radio' value={value} checked={isChecked} onChange={handleChange} />
              Option 1
            </label>
          )}
        </RadioGroup.Option>
        <RadioGroup.Option value='2'>
          {({ handleChange, isChecked, value }) => (
            <label>
              <input data-testid='option 2' type='radio' checked={isChecked} value={value} onChange={handleChange} />
              Option 2
            </label>
          )}
        </RadioGroup.Option>
        <RadioGroup.Option value='3'>
          {({ handleChange, isChecked, value }) => (
            <label>
              <input data-testid='option 3' type='radio' checked={isChecked} value={value} onChange={handleChange} />
              Option 3
            </label>
          )}
        </RadioGroup.Option>
      </div>
    </RadioGroup>
  );

it('should check as defaultValue', () => {
  renderRadioGroup({ defaultValue: '2' });

  expect(screen.getByTestId('option 1')).not.toBeChecked();
  expect(screen.getByTestId('option 2')).toBeChecked();
  expect(screen.getByTestId('option 3')).not.toBeChecked();
});

it('should check and uncheck correctly', async () => {
  renderRadioGroup();

  await act(async () => {
    await userEvent.click(screen.getByText('Option 1'));
    await userEvent.click(screen.getByText('Option 2'));
  });

  await waitFor(() => {
    expect(screen.getByTestId('option 1')).not.toBeChecked();
    expect(screen.getByTestId('option 2')).toBeChecked();
    expect(screen.getByTestId('option 3')).not.toBeChecked();
  });
});

it('should be controlled', () => {
  renderRadioGroup({ value: '2' });

  expect(screen.getByTestId('option 1')).not.toBeChecked();
  expect(screen.getByTestId('option 2')).toBeChecked();
  expect(screen.getByTestId('option 3')).not.toBeChecked();
});
