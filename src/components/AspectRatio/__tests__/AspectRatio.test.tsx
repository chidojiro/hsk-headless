import React from 'react';

import { render, screen } from '@testing-library/react';
import { AspectRatio } from '..';

it('should render correct padding', () => {
  render(<AspectRatio ratio='16-9'>Hello World</AspectRatio>);

  expect(screen.getByTestId('space-holder')).toHaveStyle({ paddingTop: (9 * 100) / 16 + '%' });
});

it.each(['1-1-1', '1-0', '1', 'asd-vc'])(`should throw error for ratio of %s`, ratio => {
  expect(() => render(<AspectRatio ratio={ratio as any}>Hello World</AspectRatio>)).toThrowError('Invalid ratio!');
});
