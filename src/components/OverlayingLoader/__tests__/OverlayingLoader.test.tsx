import { render, screen } from '@testing-library/react';
import React from 'react';
import { OverlayingLoader } from '..';

it('should show overlaying loader', () => {
  render(
    <OverlayingLoader active={true} component={<div data-testid='overloading-loader'></div>}>
      <div></div>
    </OverlayingLoader>
  );

  expect(screen.queryByTestId('overloading-loader')).toBeInTheDocument();
});

it('should not show overlaying loader', () => {
  render(
    <OverlayingLoader active={false} component={<div data-testid='overloading-loader'></div>}>
      <div></div>
    </OverlayingLoader>
  );

  expect(screen.queryByTestId('overloading-loader')).not.toBeInTheDocument();
});
