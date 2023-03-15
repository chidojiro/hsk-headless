import { act, render, screen } from '@testing-library/react';
import { Tab } from './Tab';
import { TabContent } from './TabContent';
import { Tabs, TabsProps } from './Tabs';

const renderDefault = (props?: Partial<TabsProps>) => {
  return render(
    <Tabs {...props}>
      <Tab content='Tab 1 Content'>
        {({ isActive, onClick }) => (
          <div data-active={isActive} onClick={onClick}>
            Tab 1
          </div>
        )}
      </Tab>
      <Tab content='Tab 2 Content'>
        {({ isActive, onClick }) => (
          <div data-active={isActive} onClick={onClick}>
            Tab 2
          </div>
        )}
      </Tab>
      <Tab content='Tab 3 Content'>
        {({ isActive, onClick }) => (
          <div data-active={isActive} onClick={onClick}>
            Tab 3
          </div>
        )}
      </Tab>
      <TabContent />
    </Tabs>
  );
};

it('should render all items', () => {
  renderDefault();

  ['Tab 1', 'Tab 2', 'Tab 3'].forEach(tab => {
    expect(screen.queryByText(tab)).toBeInTheDocument();
  });
});

it('should select item index 0 by default', () => {
  renderDefault();
  expect(screen.queryByText('Tab 1')?.getAttribute('data-active')).toBe('true');
  expect(screen.queryByText('Tab 2')?.getAttribute('data-active')).toBe('false');
  expect(screen.queryByText('Tab 3')?.getAttribute('data-active')).toBe('false');
  expect(screen.queryByText('Tab 1 Content')).toBeInTheDocument();
});

it('should be controlled', () => {
  renderDefault({ value: 2 });
  expect(screen.queryByText('Tab 1')?.getAttribute('data-active')).toBe('false');
  expect(screen.queryByText('Tab 2')?.getAttribute('data-active')).toBe('false');
  expect(screen.queryByText('Tab 3')?.getAttribute('data-active')).toBe('true');
  expect(screen.queryByText('Tab 3 Content')).toBeInTheDocument();
});

it('should navigate correctly', () => {
  renderDefault();

  act(() => {
    screen.queryByText('Tab 2')?.click();
  });
  expect(screen.queryByText('Tab 2 Content')).toBeInTheDocument();

  act(() => {
    screen.queryByText('Tab 3')?.click();
  });
  expect(screen.queryByText('Tab 3 Content')).toBeInTheDocument();
});
