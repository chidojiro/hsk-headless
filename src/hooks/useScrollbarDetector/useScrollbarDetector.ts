import React from 'react';
import { HTMLElementOrHTMLElementRef } from '@/types';
import { AssertUtils } from '@/utils';

export const useScrollbarDetector = (elementOrElementRef: HTMLElementOrHTMLElementRef, deps: unknown[]) => {
  const [scrollbarWidth, setScrollbarWidth] = React.useState(0);

  React.useEffect(() => {
    const element = AssertUtils.isRef<HTMLElement>(elementOrElementRef)
      ? elementOrElementRef.current
      : elementOrElementRef;

    setScrollbarWidth((element?.offsetWidth ?? 0) - (element?.clientWidth ?? 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, elementOrElementRef]);

  return React.useMemo(() => ({ scrollbarWidth }), [scrollbarWidth]);
};
