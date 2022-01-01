import React from 'react';
import { render, screen } from '@testing-library/react';

import { ConditionalWrapper } from '..';

const testId = 'wrapper';

it('should render conditional component', () => {
  render(
    <ConditionalWrapper active={true} component='div' data-testid={testId}>
      <div>Hello World</div>
    </ConditionalWrapper>
  );

  expect(screen.queryByTestId(testId)).toBeInTheDocument();
});

it('should not render conditional component', () => {
  render(
    <ConditionalWrapper active={false} component='div' data-testid={testId}>
      <div>Hello World</div>
    </ConditionalWrapper>
  );

  expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
});
