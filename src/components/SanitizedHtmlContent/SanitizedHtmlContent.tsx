import React from 'react';
import DOMpurify from 'dompurify';
import { WithAsProps } from '@/types';

type BaseSanitizedHtmlContentProps = {
  children?: string;
};

export type SanitizedHtmlContentProps = WithAsProps<BaseSanitizedHtmlContentProps, 'p'>;

export const SanitizedHtmlContent = ({ children = '', ...restProps }: SanitizedHtmlContentProps) => {
  let As: keyof JSX.IntrinsicElements = 'p';
  if ('as' in restProps) {
    As = restProps.as;
  }

  return (
    <As
      {...(restProps as any)}
      dangerouslySetInnerHTML={{
        __html: DOMpurify.sanitize(children),
      }}
    />
  );
};
