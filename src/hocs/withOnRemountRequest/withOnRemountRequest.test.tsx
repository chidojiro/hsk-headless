import { useMountEffect } from '@/hooks';
import { fireEvent, render } from '@testing-library/react';
import { withOnRemountRequest, WithOnRemountRequestProps } from './withOnRemountRequest';

const mountEffect = jest.fn();

const WrappedComponent = ({ onRemountRequest }: WithOnRemountRequestProps) => {
  useMountEffect(mountEffect);

  return <button onClick={onRemountRequest}>Remount</button>;
};

const renderComponent = () => {
  const Component = withOnRemountRequest(WrappedComponent);

  return render(<Component />);
};

it('should call remount effect after clicking on remount', async () => {
  const { getByText } = renderComponent();

  expect(mountEffect).toBeCalledTimes(1);

  fireEvent.click(getByText('Remount'));

  expect(mountEffect).toBeCalledTimes(2);
});
