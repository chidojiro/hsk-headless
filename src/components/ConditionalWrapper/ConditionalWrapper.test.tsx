import React from 'react';
import { render, screen } from '@testing-library/react';
import { ConditionalWrapper } from './ConditionalWrapper';

const testId = 'wrapper';

it('should render conditional component', () => {
  render(
    <ConditionalWrapper conditions={[{ if: true, component: 'div' }]} data-testid={testId}>
      <div>Hello World</div>
    </ConditionalWrapper>
  );

  expect(screen.queryByTestId(testId)).toBeInTheDocument();
});

it('should not render conditional component', () => {
  render(
    <ConditionalWrapper conditions={[{ if: false, component: 'div' }]} data-testid={testId}>
      <div>Hello World</div>
    </ConditionalWrapper>
  );

  expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
});

it('should render second condition', () => {
  render(
    <ConditionalWrapper
      conditions={[
        { if: false, component: 'div', props: { 'data-testid': 'first-component' } },
        { if: true, component: 'div', props: { 'data-testid': 'second-component' } },
        { component: 'div', props: { 'data-testid': 'else-component' } },
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
        { if: false, component: 'div', props: { 'data-testid': 'first-component' } },
        { if: false, component: 'div', props: { 'data-testid': 'second-component' } },
        { component: 'div', props: { 'data-testid': 'else-component' } },
      ]}>
      <div>Hello World</div>
    </ConditionalWrapper>
  );

  expect(screen.queryByTestId('first-component')).not.toBeInTheDocument();
  expect(screen.queryByTestId('second-component')).not.toBeInTheDocument();
  expect(screen.queryByTestId('else-component')).toBeInTheDocument();
});

it('should render children when there is no conditions', () => {
  const { getByText } = render(
    <ConditionalWrapper conditions={[]}>
      <div>Hello World</div>
    </ConditionalWrapper>
  );

  expect(getByText('Hello World')).toBeInTheDocument();
});
