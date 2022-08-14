import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { useNumberInput, UseNumberInputProps } from './useNumberInput';
import userEvent from '@testing-library/user-event';

const mockOnChange = jest.fn();

const Component = ({ onChange = mockOnChange, ...restProps }: UseNumberInputProps) => {
  const numberInputProps = useNumberInput({ onChange, ...restProps });

  return <input type='text' {...numberInputProps} placeholder='Enter number' />;
};

const getInput = () => screen.getByPlaceholderText('Enter number');

const getExpectEventValue = (value: string) =>
  expect.objectContaining({
    target: expect.objectContaining({ value }),
  });

describe('Basic', () => {
  it('should accepts number input', () => {
    render(<Component />);

    userEvent.type(getInput(), '123456789');

    expect(getInput()).toHaveValue('123456789');
    expect(mockOnChange).toBeCalledWith(getExpectEventValue('123456789'));
  });

  it('should trim left zeroes', () => {
    render(<Component />);

    userEvent.type(getInput(), '000123456789');

    expect(getInput()).toHaveValue('123456789');
    expect(mockOnChange).toBeCalledWith(getExpectEventValue('123456789'));
  });

  it('should accepts default value', () => {
    render(<Component defaultValue='9999' />);

    expect(getInput()).toHaveValue('9999');
  });

  it('should accepts decimal number input', () => {
    render(<Component />);

    userEvent.type(getInput(), '123.456789');

    expect(getInput()).toHaveValue('123.456789');
    expect(mockOnChange).toBeCalledWith(getExpectEventValue('123.456789'));
  });

  it('should not accepts none-number input', () => {
    render(<Component />);

    userEvent.type(getInput(), '1abc23.456def789');

    expect(getInput()).toHaveValue('123.456789');
    expect(mockOnChange).toBeCalledWith(getExpectEventValue('123.456789'));
  });

  it('should not accept more than one decimal point', () => {
    render(<Component />);

    userEvent.type(getInput(), '123.4.5.6.7.8.9');

    expect(getInput()).toHaveValue('123.456789');
    expect(mockOnChange).toBeCalledWith(getExpectEventValue('123.456789'));
  });

  it('should be controlled when value prop exists', () => {
    render(<Component value='1123' />);

    userEvent.type(getInput(), '123456789');

    expect(getInput()).toHaveValue('1123');
  });

  it('should call onChange with min value when value prop is less than min', () => {
    render(<Component value='9' min={10} max={100} />);

    fireEvent.focus(getInput());
    fireEvent.blur(getInput());

    expect(mockOnChange).toBeCalledWith(getExpectEventValue('10'));
  });

  it('should call onChange with max value when value prop is more than max', () => {
    render(<Component value='999' min={10} max={100} />);

    fireEvent.focus(getInput());
    fireEvent.blur(getInput());

    expect(mockOnChange).toBeCalledWith(getExpectEventValue('100'));
  });

  it('should not accept number less than min', () => {
    render(<Component min={10} max={100} />);

    userEvent.type(getInput(), '9');
    fireEvent.blur(getInput());

    expect(getInput()).toHaveValue('10');
    expect(mockOnChange).not.toBeCalledWith(getExpectEventValue('9'));
    expect(mockOnChange).toHaveBeenLastCalledWith(getExpectEventValue('10'));
  });

  it('should not accept number more than max', () => {
    render(<Component min={10} max={100} />);

    userEvent.type(getInput(), '999');
    fireEvent.blur(getInput());

    expect(getInput()).toHaveValue('100');
    expect(mockOnChange).not.toBeCalledWith(getExpectEventValue('999'));
    expect(mockOnChange).toHaveBeenLastCalledWith(getExpectEventValue('100'));
  });

  it('should pad input with left zeros', () => {
    render(<Component pad={2} />);

    userEvent.type(getInput(), '1');

    expect(mockOnChange).toHaveBeenLastCalledWith(getExpectEventValue('01'));
  });
});

describe('Separate Thousands', () => {
  it('should accepts number input', () => {
    let value = '';
    const mockOnChange = jest.fn().mockImplementation(e => {
      value = e.target.value;
    });
    render(<Component separateThousands onChange={mockOnChange} />);

    userEvent.type(getInput(), '12345.6789');

    expect(getInput()).toHaveValue('12,345.6789');
    expect(value).toBe('12345.6789');
  });

  it('should trim left zeroes', () => {
    let value = '';
    const mockOnChange = jest.fn().mockImplementation(e => {
      value = e.target.value;
    });
    render(<Component separateThousands onChange={mockOnChange} />);

    userEvent.type(getInput(), '-00012,345.6789');

    expect(getInput()).toHaveValue('-12,345.6789');
    expect(value).toBe('-12345.6789');
  });

  it('should accepts default value', () => {
    render(<Component separateThousands defaultValue='9999.999' />);

    expect(getInput()).toHaveValue('9,999.999');
  });

  it('should accepts negative number input', () => {
    let value = '';
    const mockOnChange = jest.fn().mockImplementation(e => {
      value = e.target.value;
    });
    render(<Component separateThousands onChange={mockOnChange} />);

    userEvent.type(getInput(), '-12345.6789');

    expect(getInput()).toHaveValue('-12,345.6789');
    expect(value).toBe('-12345.6789');
  });

  it('should not accepts none-number input', () => {
    let value = '';
    const mockOnChange = jest.fn().mockImplementation(e => {
      value = e.target.value;
    });
    render(<Component separateThousands onChange={mockOnChange} />);

    userEvent.type(getInput(), '1abc2345.6def789');

    expect(getInput()).toHaveValue('12,345.6789');
    expect(value).toBe('12345.6789');
  });

  it('should not accept more than one decimal point', () => {
    let value = '';
    const mockOnChange = jest.fn().mockImplementation(e => {
      value = e.target.value;
    });
    render(<Component separateThousands onChange={mockOnChange} />);

    userEvent.type(getInput(), '12345.6.7.8.9');

    expect(getInput()).toHaveValue('12,345.6789');
    expect(value).toBe('12345.6789');
  });

  it('should be controlled when value prop exists', () => {
    render(<Component separateThousands value='1123' />);

    userEvent.type(getInput(), '123456789');

    expect(getInput()).toHaveValue('1,123');
  });

  it('should call onChange with min value when value prop is less than min', () => {
    render(<Component separateThousands value='9' min={1000} max={100000} />);

    fireEvent.focus(getInput());
    fireEvent.blur(getInput());

    expect(mockOnChange).toBeCalledWith(getExpectEventValue('1000'));
  });

  it('should call onChange with max value when value prop is more than max', () => {
    render(<Component separateThousands value='999999' min={1000} max={100000} />);

    fireEvent.focus(getInput());
    fireEvent.blur(getInput());

    expect(mockOnChange).toBeCalledWith(getExpectEventValue('100000'));
  });

  it('should not accept number less than min', () => {
    let value = '';
    const mockOnChange = jest.fn().mockImplementation(e => {
      value = e.target.value;
    });
    render(<Component separateThousands min={1000} max={100000} onChange={mockOnChange} />);

    userEvent.type(getInput(), '999');
    fireEvent.blur(getInput());

    expect(getInput()).toHaveValue('1,000');
    expect(mockOnChange).not.toBeCalledWith(getExpectEventValue('999'));
    expect(value).toBe('1000');
  });

  it('should not accept number more than max', () => {
    let value = '';
    const mockOnChange = jest.fn().mockImplementation(e => {
      value = e.target.value;
    });
    render(<Component min={1000} max={100000} onChange={mockOnChange} />);

    userEvent.type(getInput(), '999999');
    fireEvent.blur(getInput());

    expect(getInput()).toHaveValue('100000');
    expect(mockOnChange).not.toBeCalledWith(getExpectEventValue('999999'));
    expect(value).toBe('100000');
  });

  it('should pad input with left zeros', () => {
    render(<Component separateThousands pad={2} />);

    userEvent.type(getInput(), '1');

    expect(mockOnChange).toHaveBeenLastCalledWith(getExpectEventValue('01'));
  });
});

describe('Allow Negative', () => {
  it('should transform to "-0" when only "-" is enter', () => {
    render(<Component />);

    userEvent.type(getInput(), '-');

    expect(getInput()).toHaveValue('-0');
    expect(mockOnChange).toBeCalledWith(getExpectEventValue('-0'));
  });

  it('should accepts negative decimal number input', () => {
    render(<Component />);

    userEvent.type(getInput(), '-12345.6789');

    expect(getInput()).toHaveValue('-12345.6789');
    expect(mockOnChange).toBeCalledWith(getExpectEventValue('-12345.6789'));
  });

  it('should toggle negative when "-" is typed', () => {
    render(<Component />);

    userEvent.type(getInput(), '-12345.6789');

    expect(getInput()).toHaveValue('-12345.6789');
    expect(mockOnChange).toBeCalledWith(getExpectEventValue('-12345.6789'));

    userEvent.type(getInput(), '-');

    expect(getInput()).toHaveValue('12345.6789');
    expect(mockOnChange).toBeCalledWith(getExpectEventValue('12345.6789'));
  });

  it('should not allow negative', () => {
    render(<Component allowNegative={false} />);

    userEvent.type(getInput(), '-12345.6789');

    expect(getInput()).toHaveValue('12345.6789');
    expect(mockOnChange).toBeCalledWith(getExpectEventValue('12345.6789'));

    userEvent.type(getInput(), '-');
    expect(getInput()).toHaveValue('12345.6789');
    expect(mockOnChange).toBeCalledWith(getExpectEventValue('12345.6789'));
  });

  it('should call onChange with min value when value prop is less than min', () => {
    render(<Component value='-101' min={-100} max={-10} />);

    fireEvent.focus(getInput());
    fireEvent.blur(getInput());

    expect(mockOnChange).toBeCalledWith(getExpectEventValue('-100'));
  });

  it('should call onChange with max value when value prop is more than max', () => {
    render(<Component value='-9' min={-100} max={-10} />);

    fireEvent.focus(getInput());
    fireEvent.blur(getInput());

    expect(mockOnChange).toBeCalledWith(getExpectEventValue('-10'));
  });

  it('should not accept number less than min', () => {
    render(<Component min={-100} max={-10} />);

    userEvent.type(getInput(), '-101');
    fireEvent.blur(getInput());

    expect(getInput()).toHaveValue('-100');
    expect(mockOnChange).not.toBeCalledWith(getExpectEventValue('-101'));
    expect(mockOnChange).toHaveBeenLastCalledWith(getExpectEventValue('-100'));
  });

  it('should not accept number more than max', () => {
    render(<Component min={-100} max={-10} />);

    userEvent.type(getInput(), '-9');
    fireEvent.blur(getInput());

    expect(getInput()).toHaveValue('-10');
    expect(mockOnChange).not.toBeCalledWith(getExpectEventValue('-9'));
    expect(mockOnChange).toHaveBeenLastCalledWith(getExpectEventValue('-10'));
  });

  it('should pad input with left zeros', () => {
    render(<Component pad={2} />);

    userEvent.type(getInput(), '-1');

    expect(mockOnChange).toHaveBeenLastCalledWith(getExpectEventValue('-01'));
  });
});
