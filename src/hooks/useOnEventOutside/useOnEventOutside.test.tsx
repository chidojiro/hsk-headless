import { withUmountAfter } from '@/hocs';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef } from 'react';
import { useOnEventOutside } from './useOnEventOutside';

const mockListener = jest.fn();

type HookHostProps = {
  emptyElement?: boolean;
  emptyHandler?: boolean;
};

const HookHost = ({ emptyElement, emptyHandler }: HookHostProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useOnEventOutside('click', !emptyElement && [ref], !emptyHandler ? mockListener : undefined);

  return <div ref={ref} data-testid='test-trigger'></div>;
};

const UNMOUNT_AFTER = 1000;

const renderComponent = (props?: HookHostProps) => {
  const Component = withUmountAfter(UNMOUNT_AFTER)(HookHost);

  return render(<Component {...props} />);
};

it('should call listener when clicking on body', () => {
  renderComponent();

  userEvent.click(document.querySelector('body')!);

  expect(mockListener).toBeCalled();
});

it('should not call listener', () => {
  renderComponent();

  userEvent.click(screen.getByTestId('test-trigger'));

  expect(mockListener).not.toBeCalled();
});

it('should unregister listener', () => {
  renderComponent();

  act(() => {
    jest.advanceTimersByTime(UNMOUNT_AFTER);
  });

  userEvent.click(document.querySelector('body')!);

  expect(mockListener).not.toBeCalled();
});

it('should register listeners when both elements and event handler are passed', () => {
  jest.spyOn(document, 'addEventListener');

  renderComponent();

  userEvent.click(screen.getByTestId('test-trigger'));

  expect(document.addEventListener).toBeCalledWith('click', expect.anything());
});

it('should not register listeners when no event handler is passed', () => {
  jest.spyOn(document, 'addEventListener');

  renderComponent({ emptyHandler: true });

  userEvent.click(screen.getByTestId('test-trigger'));

  expect(document.addEventListener).not.toBeCalled();
});

it('should not register listeners when elements or refs are falsy', () => {
  jest.spyOn(document, 'addEventListener');

  renderComponent({ emptyElement: true });

  userEvent.click(screen.getByTestId('test-trigger'));

  expect(document.addEventListener).not.toBeCalled();
});
