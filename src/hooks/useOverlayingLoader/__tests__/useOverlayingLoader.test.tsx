import { screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { useOverlayingLoader } from '..';

it('should show overlaying loader', () => {
  renderHook(() =>
    useOverlayingLoader({ active: true, host: document.body, component: <div data-testid='overloading-loader'></div> })
  );

  expect(screen.queryByTestId('overloading-loader')).toBeInTheDocument();
});

it('should not show overlaying loader', () => {
  renderHook(() =>
    useOverlayingLoader({ active: false, host: document.body, component: <div data-testid='overloading-loader'></div> })
  );

  expect(screen.queryByTestId('overloading-loader')).not.toBeInTheDocument();
});
