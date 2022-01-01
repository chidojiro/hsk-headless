import React from 'react';
import { AssertUtils } from '../../utils';

export const useOnClickOutside = (
  refsOrElements: Element | React.RefObject<Element> | null | (Element | React.RefObject<Element> | null)[],
  handler: (event: MouseEvent) => void
) => {
  const handleClick = (e: MouseEvent) => {
    const isEveryOutside = [refsOrElements].flat().every(eleOrRef => {
      if (AssertUtils.isRef(eleOrRef)) {
        return !eleOrRef?.current?.contains(e.target as Node);
      }

      return !eleOrRef?.contains(e.target as Node);
    });

    if (isEveryOutside) {
      handler(e);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
};
