import React, { ReactNode } from 'react';
import { HTMLDivProps } from 'types';

type Props<T> = {
  active: boolean;
  children: ReactNode;
} & (({ component: 'div' } & HTMLDivProps) | ({ component: (props: T) => JSX.Element } & T));

export const ConditionalWrapper = <T,>({ active, component, children, ...componentProps }: Props<T>) => {
  if (!active) return <>{children}</>;

  const Component = component as any;

  return <Component {...componentProps}>{children}</Component>;
};
