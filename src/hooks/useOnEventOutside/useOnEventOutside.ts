import React from 'react';
import { ElementOrHTMLElementRef } from 'types';
import { AssertUtils } from 'utils';

type OptionalElementOrHTMLElementRef = ElementOrHTMLElementRef | null | undefined;

export const useOnEventOutside = <TEvent extends keyof GlobalEventHandlersEventMap>(
  event: TEvent,
  refsOrElements?: OptionalElementOrHTMLElementRef | OptionalElementOrHTMLElementRef[],
  handler?: (event: GlobalEventHandlersEventMap[TEvent]) => void
) => {
  const handleEvent = (event: GlobalEventHandlersEventMap[TEvent]) => {
    if (!refsOrElements) return;

    const isEveryOutside = [refsOrElements].flat().every(eleOrRef => {
      if (AssertUtils.isRef(eleOrRef)) {
        return !eleOrRef?.current?.contains(event.target as Node);
      }

      return !eleOrRef?.contains(event.target as Node);
    });

    if (isEveryOutside) {
      handler?.(event);
    }
  };

  React.useEffect(() => {
    document.addEventListener(event, handleEvent);
    return () => {
      document.removeEventListener(event, handleEvent);
    };
  });
};
