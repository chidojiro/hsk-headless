import { isRef } from '@/utils';
import React from 'react';

type ElementOrRef = HTMLElement | React.RefObject<HTMLElement>;

export const useOnEventOutside = <TEvent extends keyof GlobalEventHandlersEventMap>(
  event: TEvent,
  refsOrElements?: ElementOrRef | ElementOrRef[] | false,
  handler?: (event: GlobalEventHandlersEventMap[TEvent]) => void
) => {
  const isEnabled = !!refsOrElements && !!handler;
  const handleEvent = React.useCallback(
    (event: GlobalEventHandlersEventMap[TEvent]) => {
      if (!isEnabled) return;

      const isEveryOutside = [refsOrElements].flat().every(eleOrRef => {
        if (isRef(eleOrRef)) {
          return !eleOrRef?.current?.contains(event.target as Node);
        }

        return !eleOrRef?.contains(event.target as Node);
      });

      if (isEveryOutside) {
        handler?.(event);
      }
    },
    [handler, isEnabled, refsOrElements]
  );

  React.useEffect(() => {
    if (!isEnabled) return;

    document.addEventListener(event, handleEvent);
    return () => {
      document.removeEventListener(event, handleEvent);
    };
  }, [event, handleEvent, isEnabled]);
};
