import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CheckboxGroup, CheckboxGroupProps } from './CheckboxGroup';
import { CheckboxGroupOption } from './CheckboxGroupOption';

const renderCheckboxGroup = (props?: Partial<CheckboxGroupProps>) =>
  render(
    <CheckboxGroup {...props}>
      <div className='flex flex-col'>
        <CheckboxGroupOption value='1'>
          {({ handleChange, isChecked, value }) => (
            <label>
              <input data-testid='option 1' type='checkbox' value={value} checked={isChecked} onChange={handleChange} />
              Option 1
            </label>
          )}
        </CheckboxGroupOption>
        <CheckboxGroupOption value='2'>
          {({ handleChange, isChecked, value }) => (
            <label>
              <input data-testid='option 2' type='checkbox' checked={isChecked} value={value} onChange={handleChange} />
              Option 2
            </label>
          )}
        </CheckboxGroupOption>
        <CheckboxGroupOption value='3'>
          {({ handleChange, isChecked, value }) => (
            <label>
              <input data-testid='option 3' type='checkbox' checked={isChecked} value={value} onChange={handleChange} />
              Option 3
            </label>
          )}
        </CheckboxGroupOption>
      </div>
    </CheckboxGroup>
  );

it('should check as defaultValue', () => {
  renderCheckboxGroup({ defaultValue: ['1', '2'] });

  expect(screen.getByTestId('option 1')).toBeChecked();
  expect(screen.getByTestId('option 2')).toBeChecked();
  expect(screen.getByTestId('option 3')).not.toBeChecked();
});

it('should check and uncheck correctly', async () => {
  renderCheckboxGroup();

  await act(async () => {
    await userEvent.click(screen.getByText('Option 1'));
    await userEvent.click(screen.getByText('Option 2'));
  });

  await waitFor(() => {
    expect(screen.getByTestId('option 1')).toBeChecked();
    expect(screen.getByTestId('option 2')).toBeChecked();
    expect(screen.getByTestId('option 3')).not.toBeChecked();
  });
});

it('should be controlled', () => {
  renderCheckboxGroup({ value: ['1', '2'] });

  expect(screen.getByTestId('option 1')).toBeChecked();
  expect(screen.getByTestId('option 2')).toBeChecked();
  expect(screen.getByTestId('option 3')).not.toBeChecked();
});
