import React from 'react';
import { render } from '@testing-library/react';
import { AspectRatio } from './AspectRatio';

it.each(['1-1-1', '1-0', '1', 'asd-vc'])(`should throw error for ratio of %s`, ratio => {
  expect(() => render(<AspectRatio ratio={ratio as any}>Hello World</AspectRatio>)).toThrowError('Invalid ratio!');
});
