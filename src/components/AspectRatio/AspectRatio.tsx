import clsx from 'clsx';
import React from 'react';
import { WithAsProps } from 'types';

type AspectRatioBaseProps = {
  ratio: `${number}/${number}`;
};

export type AspectRatioProps = WithAsProps<AspectRatioBaseProps, 'div'>;

export const AspectRatio = ({ ratio, className, style, ...restProps }: AspectRatioProps) => {
  const [x, y] = (ratio?.split('/') || []).map(v => +v);

  if (!/^\d+\/\d+$/.test(ratio) || y <= 0) throw new Error('Invalid ratio!');

  let As: keyof JSX.IntrinsicElements = 'div';

  if ('as' in restProps) {
    As = restProps.as;
  }

  return (
    <As className={clsx('aspect-ratio', className)} {...(restProps as any)} style={{ ...style, aspectRatio: ratio }} />
  );
};
