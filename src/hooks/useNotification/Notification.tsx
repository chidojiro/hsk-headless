import React from 'react';
import { Children } from 'types';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = Children & {};

// eslint-disable-next-line no-empty-pattern
export const Notification = ({ children }: Props) => {
  return <div className='pointer-events-auto'>{children}</div>;
};
