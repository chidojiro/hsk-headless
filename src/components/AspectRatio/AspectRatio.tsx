import classNames from 'classnames';
import React from 'react';
import { WithAsProps } from 'types';

type AspectRatioBaseProps = {
  children?: React.ReactNode;
  ratio: `${number}/${number}`;
  className?: string;
};

export type AspectRatioProps<TAsElement extends keyof JSX.IntrinsicElements> = WithAsProps<
  AspectRatioBaseProps,
  'div',
  TAsElement
>;

export const AspectRatio = <TAsElement extends keyof JSX.IntrinsicElements>({
  ratio,
  children,
  className,
  style,
  ...restProps
}: AspectRatioProps<TAsElement>) => {
  const [x, y] = (ratio?.split('/') || []).map(v => +v);

  if (!/^\d+\/\d+$/.test(ratio) || y <= 0) throw new Error('Invalid ratio!');

  let As: keyof JSX.IntrinsicElements = 'div';

  if ('as' in restProps) {
    As = restProps.as;
  }

  return (
    <As
      className={classNames('aspect-ratio', className)}
      {...(restProps as any)}
      style={{ ...style, aspectRatio: ratio }}
    />
  );
};
