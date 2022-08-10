import React from 'react';

export type HTMLDivProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export type HTMLElementOrHTMLElementRef = HTMLElement | React.RefObject<HTMLElement>;

export type WithAsProps<
  TProps,
  TDefaultElement extends keyof JSX.IntrinsicElements,
  TCustomElement extends keyof JSX.IntrinsicElements
> =
  | (TProps & JSX.IntrinsicElements[TDefaultElement])
  | (TProps & { as: TCustomElement } & JSX.IntrinsicElements[TCustomElement]);
