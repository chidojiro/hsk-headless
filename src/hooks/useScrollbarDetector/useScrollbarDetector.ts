import { HTMLElementOrHTMLElementRef } from '@/types';
import { isRef } from '@/utils';
import { useEffect, useMemo, useState } from 'react';

export const useScrollbarDetector = (elementOrElementRef: HTMLElementOrHTMLElementRef, deps: unknown[]) => {
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  useEffect(() => {
    const element = isRef<HTMLElement>(elementOrElementRef) ? elementOrElementRef.current : elementOrElementRef;

    setScrollbarWidth((element?.offsetWidth ?? 0) - (element?.clientWidth ?? 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, elementOrElementRef]);

  return useMemo(() => ({ scrollbarWidth }), [scrollbarWidth]);
};
