import React from 'react';
import { render, screen } from '@testing-library/react';

import { ConditionalWrapper } from '..';

const testId = 'wrapper';

it('should render conditional component', () => {
  render(
    <ConditionalWrapper conditions={[{ condition: true, component: props => <div {...props} /> }]} data-testid={testId}>
      <div>Hello World</div>
    </ConditionalWrapper>
  );

  expect(screen.queryByTestId(testId)).toBeInTheDocument();
});

it('should not render conditional component', () => {
  render(
    <ConditionalWrapper
      conditions={[{ condition: false, component: props => <div {...props} /> }]}
      data-testid={testId}>
      <div>Hello World</div>
    </ConditionalWrapper>
  );

  expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
});

it('should render second condition', () => {
  render(
    <ConditionalWrapper
      conditions={[
        { condition: false, component: props => <div {...props} data-testid='first-component' /> },
        { condition: true, component: props => <div {...props} data-testid='second-component' /> },
        { component: props => <div {...props} data-testid='else-component' /> },
      ]}>
      <div>Hello World</div>
    </ConditionalWrapper>
  );

  expect(screen.queryByTestId('first-component')).not.toBeInTheDocument();
  expect(screen.queryByTestId('second-component')).toBeInTheDocument();
  expect(screen.queryByTestId('else-component')).not.toBeInTheDocument();
});

it('should render else condition', () => {
  render(
    <ConditionalWrapper
      conditions={[
        { condition: false, component: props => <div {...props} data-testid='first-component' /> },
        { condition: false, component: props => <div {...props} data-testid='second-component' /> },
        { component: props => <div {...props} data-testid='else-component' /> },
      ]}>
      <div>Hello World</div>
    </ConditionalWrapper>
  );

  expect(screen.queryByTestId('first-component')).not.toBeInTheDocument();
  expect(screen.queryByTestId('second-component')).not.toBeInTheDocument();
  expect(screen.queryByTestId('else-component')).toBeInTheDocument();
});
