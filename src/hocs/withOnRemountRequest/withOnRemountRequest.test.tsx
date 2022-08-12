import React from 'react';
import { render } from '@testing-library/react';
import { withOnRemountRequest, WithOnRemountRequestProps } from './withOnRemountRequest';
import { useMountEffect } from 'hooks';
import userEvent from '@testing-library/user-event';

const mountEffect = jest.fn();

const WrappedComponent = ({ onRemountRequest }: WithOnRemountRequestProps) => {
  useMountEffect(mountEffect);

  return <button onClick={onRemountRequest}>Remount</button>;
};

const renderComponent = () => {
  const Component = withOnRemountRequest(WrappedComponent);

  return render(<Component />);
};

it('should call remount effect after clicking on remount', () => {
  const { getByText } = renderComponent();

  expect(mountEffect).toBeCalledTimes(1);

  userEvent.click(getByText('Remount'));

  expect(mountEffect).toBeCalledTimes(2);
});
